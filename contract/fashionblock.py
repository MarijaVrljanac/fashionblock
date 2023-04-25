from pyteal import *
import program

def approval():
    # variables
    global_owner = Bytes("owner")
    local_id = Bytes("id") # byteslice
    local_creator = Bytes("creator") # byteslice
    local_collection = Bytes("collection") # byteslice
    local_name = Bytes("name") # byteslice
    local_image = Bytes("image") # byteslice
    local_date = Bytes("date") # byteslice
    local_material = Bytes("material") # byteslice
    local_wager = Bytes("wager") # uint64
    
    # operations
    op_start = Bytes("start")
    op_accept = Bytes("accept")
    op_resolve = Bytes("resolve")
    
    @Subroutine(TealType.none)
    def get_ready(account: Expr):
        return Seq(
            App.localPut(account, local_id, Bytes("")),
            App.localPut(account, local_creator, Bytes("")),
            App.localPut(account, local_collection, Bytes("")),
            App.localPut(account, local_name, Bytes("")),
            App.localPut(account, local_image, Bytes("")),
            App.localPut(account, local_date, Bytes("")),
            App.localPut(account, local_material, Bytes("")),
            App.localPut(account, local_wager, Int(0))
        )
        
    @Subroutine(TealType.uint64)
    def check_if_empty(account: Expr):
        return Return(
            And(
                App.localGet(account, local_id) == Bytes(""),
                App.localGet(account, local_creator) == Bytes(""),
                App.localGet(account, local_collection) == Bytes(""),
                App.localGet(account, local_name) == Bytes(""),
                App.localGet(account, local_image) == Bytes(""),
                App.localGet(account, local_date) == Bytes(""),
                App.localGet(account, local_material) == Bytes(""),
                App.localGet(account, local_wager) == Int(0)
            )
        )
        
    perform_checks = Assert(
        And(
            Global.group_size() == Int(2),
                
            # check if the current transaction is the first one
            Txn.group_index() == Int(0), # <==> Gtxn[0]
            Gtxn[1].type_enum() == TxnType.Payment, 
            Gtxn[1].receiver() == Global.current_application_address(),
            Gtxn[0].rekey_to() == Global.zero_address(),
            Gtxn[1].rekey_to() == Global.zero_address(),
            App.optedIn(Txn.accounts[1], Global.current_application_id()),
            )
    )
    
    # In this case, sender is fashion designer
    @Subroutine(TealType.none)
    def create():
        return Seq(
            perform_checks,
            Assert(
                And(
                    # fashion designer
                    check_if_empty(Txn.sender()),
                    # buyer
                    check_if_empty(Txn.accounts[1])
                )
            ),
            App.localPut(Txn.sender(), local_creator, Txn.accounts[0]),
            App.localPut(Txn.sender(), local_id, Txn.application_args[1]),
            App.localPut(Txn.sender(), local_wager, Gtxn[1].amount()),
            App.localPut(Txn.sender(), local_material, Txn.application_args[2]),
            App.localPut(Txn.sender(), local_collection, Txn.application_args[3]),
            App.localPut(Txn.sender(), local_name, Txn.application_args[4]),
            App.localPut(Txn.sender(), local_image, Txn.application_args[5]), # url
            App.localPut(Txn.sender(), local_date, Txn.application_args[6]),
            Approve()
        )
        
    # In this case, sender is buyer
    @Subroutine(TealType.none)
    def accept():
        return Seq(
            perform_checks,
            Assert(
                And(
                    # buyer
                    check_if_empty(Txn.sender())
                )
            ),
            App.localPut(Txn.sender(), local_creator, Txn.accounts[1]),
            App.localPut(Txn.sender(), local_id, Txn.application_args[1]),
            App.localPut(Txn.sender(), local_wager, Gtxn[1].amount()),
            App.localPut(Txn.sender(), local_material, Txn.application_args[2]),
            
            Approve()
        )
        
    @Subroutine(TealType.uint64)
    def transform_material(material: Expr):
        return Return(
            Cond(
                [material == Bytes("leather"), Int(0)],
                [material == Bytes("silk"), Int(1)],
                [material == Bytes("scuba"), Int(2)],
                [material == Bytes("cotton"), Int(3)],
                [material == Bytes("linen"), Int(4)],
                [material == Bytes("wool"), Int(5)],
                [material == Bytes("polyester"), Int(6)],
                [material == Bytes("cashmere"), Int(7)],
                [material == Bytes("velvet"), Int(8)],
                [material == Bytes("satin"), Int(9)],
                [material == Bytes("chiffon"), Int(10)],
                [material == Bytes("lycra"), Int(11)],
                [material == Bytes("jersey"), Int(12)],
            )
        )
        
    @Subroutine(TealType.none)
    def transfer_wager(acc_index: Expr, wager: Expr):
        return Seq(
            InnerTxnBuilder.Begin(),
            
            InnerTxnBuilder.SetFields({
                TxnField.type_enum: TxnType.Payment,
                TxnField.receiver: Txn.accounts[acc_index],
                TxnField.amount: wager
            }),
            
            InnerTxnBuilder.Submit()
        )
        
    @Subroutine(TealType.none)
    def should_buyer_proceed(material_product: Expr, material_requested: Expr, wager: Expr):
        return Seq(
            If(
                material_product == material_requested
            )
            .Then(
                transfer_wager(Int(1), wager*Int(2)),
                
                # buyer's action 
                App.globalPut(global_owner, Txn.accounts[0])
            )
            .Else(
                transfer_wager(Int(0), wager)
            )
        )
    
    # This operation is executed by buyer
    @Subroutine(TealType.none)
    def pay():
        material_product = ScratchVar(TealType.uint64)
        material_requested = ScratchVar(TealType.uint64)
        wager = ScratchVar(TealType.uint64)
        
        return Seq(
            Assert(
                And(
                    Global.group_size() == Int(1),
                
                    # check if the current transaction is the first one
                    Txn.group_index() == Int(0), # <==> Gtxn[0]
                    
                    Gtxn[0].rekey_to() == Global.zero_address(),
                    
                    # check if wagers are the same
                    App.localGet(Txn.accounts[1], local_wager) <= App.localGet(Txn.accounts[0], local_wager),
                    
                    App.localGet(Txn.accounts[1], local_id) == App.localGet(Txn.accounts[0], local_id),
                    
                    # check if all the application arguments are there
                    Txn.application_args.length() == Int(2)
                )
            ),
            # transform strings to ints
            material_product.store(transform_material(App.localGet(Txn.accounts[1], local_material))),
            material_requested.store(transform_material(App.localGet(Txn.accounts[0], local_material))),
            wager.store(App.localGet(Txn.accounts[0], local_wager)),
            
            should_buyer_proceed(material_product.load(), material_requested.load(), wager.load()),
            
            Approve()
        )
    
    return program.event(
        init=Seq(
            App.globalPut(global_owner, Txn.accounts[0]),
            Approve()
            ),
        opt_in=Seq(
            get_ready(Txn.sender()),
            Approve()
        ),
        no_op=Seq(
            Cond(
                [Txn.application_args[0] == op_start, create()],
                [Txn.application_args[0] == op_accept, accept()],
                [Txn.application_args[0] == op_resolve, pay()],
            ),
            Reject()
        )  
    )
    
def clear():
    return Approve()