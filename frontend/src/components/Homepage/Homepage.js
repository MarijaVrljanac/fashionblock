import "../../App.css";
import { PeraWalletConnect } from "@perawallet/connect";
import algosdk, { waitForConfirmation } from "algosdk";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Homepage.css";
import logo from "../../assets/logo.png";

//const crypto = require("crypto");

const peraWallet = new PeraWalletConnect();

// The app ID on testnet
// RPS app
const appIndex = 204090117;
const appAddress = "IB5VDIGEE7BDN4N64W3O65CADOI5LTLCC75NSBDXMXFFPHCFK36LZKKJUM";

// connect to the algorand node
// token, address(server), port
const algod = new algosdk.Algodv2(
  "",
  "https://testnet-api.algonode.cloud",
  443
);

function Homepage() {
  const [accountAddress, setAccountAddress] = useState(null);
  const [owner, setOwner] = useState(null);
  const [realmaterial, setRealMaterial] = useState(null);
  const isConnectedToPeraWallet = !!accountAddress; //convert string to boolean
  const { customer } = useParams();

  useEffect(() => {
    // Reconnect to the session when the component is mounted
    peraWallet
      .reconnectSession()
      .then((accounts) => {
        peraWallet.connector.on("disconnect", handleDisconnectWalletClick);
        console.log(accounts);
        if (accounts.length) {
          setAccountAddress(accounts[0]);
        }
      })
      .catch((e) => console.log(e));
  }, []);

  return (
    <Container>
      <meta name="name" content="Testing frontend for makawe" />
      <img className="logo" src={logo}></img>
      <h1>fashionblock</h1>
      <br/>
      <Row>
        <Col>
          <Button
            onClick={
              isConnectedToPeraWallet
                ? handleDisconnectWalletClick
                : handleConnectWalletClick
            }
          >
            {isConnectedToPeraWallet ? "Disconnect" : "Connect to Pera Wallet"}
          </Button>
        </Col>
      </Row>
      <br />
      <Row>
        <Col>
          <Button onClick={() => optInRpsApp()}>OptIn</Button>
        </Col>
      </Row>
      <br />
      <Row>
        {customer ? (
          <>
            <Col>
              <Button onClick={() => setOwner(false)}>Join Game</Button>
            </Col>
            <Col>
              <Button onClick={() => resolveRpsApplication()}>
                Resolve Game
              </Button>
            </Col>
          </>
        ) : (
          <Col>
            <Button onClick={() => setOwner(true)}>Start Game</Button>
          </Col>
        )}
      </Row>
      <br />
      <Row className="circle-wrap">
        <Col>
          <Button className="item"
            onClick={
              !!owner === true
                ? () =>
                    startRpsApplication(
                      "UCJHKygxxmpjv5mnJhh0tVsIjt+JkTAJy2ToicycfSE=",
                      "leather"
                    )
                : () => joinRpsApplication("leather")
            }
          >
            Leather
          </Button>
        </Col>
        <Col>
          <Button className="item"
            onClick={
              !!owner === true
                ? () =>
                    startRpsApplication(
                      "8sgZtnkN4waEf7ImZMN65DIXfY73JyHtI8ka79Ecz98=",
                      "silk"
                    )
                : () => joinRpsApplication("silk")
            }
          >
            Silk
          </Button>
        </Col>
        <Col>
        <Button className="item"
            onClick={
              !!owner === true
                ? () =>
                    startRpsApplication(
                      "GtRNFDKuDoSwzXJ+TOeqc9LbkzocX8ZHTCklX+pvspE=",
                      "polyester"
                    )
                : () => joinRpsApplication("polyester")
            }
          >
            Polyester
          </Button>
        </Col>
        <Col>
          <Button className="item"
            onClick={
              !!owner === true
                ? () =>
                    startRpsApplication(
                      "aeOZhRyEGZk9RnVwJf1R5BXgJ36N74yyg9++eGchLoo=",
                      "cotton"
                    )
                : () => joinRpsApplication("cotton")
            }
          >
            Cotton
          </Button>
        </Col>
        <Col>
          <Button className="item"
            onClick={
              !!owner === true
                ? () =>
                    startRpsApplication(
                      "B60u8WB9KDg5rxtOgujGH/IR3iadRkg5ApXUB8AWL3o=",
                      "linen"
                    )
                : () => joinRpsApplication("linen")
            }
          >
            Linen
          </Button>
        </Col>
        <Col>
          <Button className="item"
            onClick={
              !!owner === true
                ? () =>
                    startRpsApplication(
                      "/rZyoubqKZ2PHxsbvtdyFMkJw6iaMhTqomvuvkrM63w=",
                      "wool"
                    )
                : () => joinRpsApplication("wool")
            }
          >
            Wool
          </Button>
        </Col>
        <Col>
        <Button className="item"
            onClick={
              !!owner === true
                ? () =>
                    startRpsApplication(
                      "8srChfPzOXbEN0nFxKqZrF21s2t0REruRWYanYjrSKQ=",
                      "scuba"
                    )
                : () => joinRpsApplication("scuba")
            }
          >
            Scuba
          </Button>
        </Col>
        <Col>
          <Button className="item"
            onClick={
              !!owner === true
                ? () =>
                    startRpsApplication(
                      "uazgThGkuWeiLLiTebMMEx0T74G+qI3LEZL7ld67SeQ=",
                      "cashmere"
                    )
                : () => joinRpsApplication("cashmere")
            }
          >
            Cashmere
          </Button>
        </Col>
        <Col>
          <Button className="item"
            onClick={
              !!owner === true
                ? () =>
                    startRpsApplication(
                      "9MRCZqLfrZhHkwYVIY8oEcXuMkjG3z05IabSuOZ8i/Y=",
                      "velvet"
                    )
                : () => joinRpsApplication("velvet")
            }
          >
            Velvet
          </Button>
        </Col>
        <Col>
          <Button className="item"
            onClick={
              !!owner === true
                ? () =>
                    startRpsApplication(
                      "Jwn7j9G8aTukC2hiI0cTs5f7QZkTDoK8LhUqKqv6Vmw=",
                      "satin"
                    )
                : () => joinRpsApplication("satin")
            }
          >
            Satin
          </Button>
        </Col>
        <Col>
          <Button className="item"
            onClick={
              !!owner === true
                ? () =>
                    startRpsApplication(
                      "Bm16fmcv990fA1mDaEMxvjyplCKoy4Rj559coBVkkfQ=",
                      "chiffon"
                    )
                : () => joinRpsApplication("chiffon")
            }
          >
            Chiffon
          </Button>
        </Col>
        <Col>
          <Button className="item"
            onClick={
              !!owner === true
                ? () =>
                    startRpsApplication(
                      "zcvWxOBVngFR75Oa9X43qa0coMrupJ4fa23JYMvioBQ=",
                      "lycra"
                    )
                : () => joinRpsApplication("lycra")
            }
          >
            Lycra
          </Button>
        </Col>
        <Col>
          <Button className="item"
            onClick={
              !!owner === true
                ? () =>
                    startRpsApplication(
                      "UYShzbGaO8PWRXMALDZyCVvENCVMLlPM+6CkgBuzqII=",
                      "jersey"
                    )
                : () => joinRpsApplication("jersey")
            }
          >
            Jersey
          </Button>
        </Col>
      </Row>
    </Container>
  );

  function handleConnectWalletClick() {
    peraWallet
      .connect()
      .then((newAccounts) => {
        peraWallet.connector.on("disconnect", handleDisconnectWalletClick);
        setAccountAddress(newAccounts[0]);
      })
      .catch((error) => {
        if (error?.data?.type !== "CONNECT_MODAL_CLOSED") {
          console.log(error);
        }
      });
  }

  function handleDisconnectWalletClick() {
    peraWallet.disconnect();
    setAccountAddress(null);
  }

  async function optInRpsApp() {
    try {
      // get suggested params
      const suggestedParams = await algod.getTransactionParams().do();

      const actionTx = algosdk.makeApplicationOptInTxn(
        accountAddress,
        suggestedParams,
        appIndex
      );

      const actionTxGroup = [{ txn: actionTx, signers: [accountAddress] }];

      const signedTx = await peraWallet.signTransaction([actionTxGroup]);
      console.log(signedTx);
      const { txId } = await algod.sendRawTransaction(signedTx).do();
      const result = await waitForConfirmation(algod, txId, 2);
    } catch (e) {
      console.error(`There was an error calling the rps app: ${e}`);
    }
  }

  async function startRpsApplication(
    hashedmaterial = "UCJHKygxxmpjv5mnJhh0tVsIjt+JkTAJy2ToicycfSE=",
    material = "leather"
  ) {
    try {
      setRealMaterial(material);
      // get suggested params
      const suggestedParams = await algod.getTransactionParams().do();
      const appArgs = [
        new Uint8Array(Buffer.from("start")),
        new Uint8Array(Buffer.from(hashedmaterial, "base64")),
      ];

      // player 2 account
      const accounts = [
        "WZRVALJVGSVMUOUBMPGB6ZWSE4RRHUPC2QRP66V4T72XZ5XGT3FU2J4F7M",
      ];

      let actionTx = algosdk.makeApplicationNoOpTxn(
        accountAddress,
        suggestedParams,
        appIndex,
        appArgs,
        accounts
      );

      let payTx = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: accountAddress,
        to: appAddress,
        amount: 100000,
        suggestedParams: suggestedParams,
      });

      let txns = [actionTx, payTx];
      algosdk.assignGroupID(txns);

      const actionTxGroup = [
        { txn: actionTx, signers: [accountAddress] },
        { txn: payTx, signers: [accountAddress] },
      ];

      const signedTxns = await peraWallet.signTransaction([actionTxGroup]);

      console.log(signedTxns);
      const { txId } = await algod.sendRawTransaction(signedTxns).do();
      const result = await waitForConfirmation(algod, txId, 4);
      // checkCounterState();
    } catch (e) {
      console.error(`There was an error calling the rps app: ${e}`);
    }
  }

  async function joinRpsApplication(material) {
    try {
      // get suggested params
      const suggestedParams = await algod.getTransactionParams().do();
      const appArgs = [
        new Uint8Array(Buffer.from("accept")),
        new Uint8Array(Buffer.from(material)),
      ];

      // sending opponents account (player 1)
      const accounts = [
        "TADSUM7VUM4JG5DJETDQQSBXU3ATMZ4C3NJCJURH3MYCHWZYBXDWZZSJZI",
      ];

      let actionTx = algosdk.makeApplicationNoOpTxn(
        accountAddress,
        suggestedParams,
        appIndex,
        appArgs,
        accounts
      );

      let payTx = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: accountAddress,
        to: appAddress,
        amount: 100000,
        suggestedParams: suggestedParams,
      });

      let txns = [actionTx, payTx];
      algosdk.assignGroupID(txns);

      const actionTxGroup = [
        { txn: actionTx, signers: [accountAddress] },
        { txn: payTx, signers: [accountAddress] },
      ];

      const signedTxns = await peraWallet.signTransaction([actionTxGroup]);

      console.log(signedTxns);
      const { txId } = await algod.sendRawTransaction(signedTxns).do();
      const result = await waitForConfirmation(algod, txId, 4);
      // checkCounterState();
    } catch (e) {
      console.error(`There was an error calling the rps app: ${e}`);
    }
  }

  // RESOLVE RPS WINNER
  async function resolveRpsApplication() {
    try {
      // get suggested params
      const suggestedParams = await algod.getTransactionParams().do();
      const appArgs = [
        new Uint8Array(Buffer.from("resolve")),
        new Uint8Array(Buffer.from(realmaterial)),
      ];

      const accounts = [
        "WZRVALJVGSVMUOUBMPGB6ZWSE4RRHUPC2QRP66V4T72XZ5XGT3FU2J4F7M",
      ];

      let actionTx = algosdk.makeApplicationNoOpTxn(
        accountAddress,
        suggestedParams,
        appIndex,
        appArgs,
        accounts
      );

      const actionTxGroup = [{ txn: actionTx, signers: [accountAddress] }];

      const signedTxns = await peraWallet.signTransaction([actionTxGroup]);
      const txns = [signedTxns];

      console.log(signedTxns);

      //const dr = algosdk.createDryrun(algod, txns);

      //test debugging
      //const dryRunResult = await algod.dryrun(dr).do();
      //console.log(dryRunResult);

      const { txId } = await algod.sendRawTransaction(signedTxns).do();
      const result = await waitForConfirmation(algod, txId, 4);
      console.log(result);
    } catch (e) {
      console.error(`There was an error calling the rps app: ${e}`);
    }
  }

  // Clear state
  // {
  //   "txn": {
  //     "apan": 3,
  //     "apid": 51,
  //     "fee": 1000,
  //     "fv": 13231,
  //     "gh": "ALXYc8IX90hlq7olIdloOUZjWfbnA3Ix1N5vLn81zI8=",
  //     "lv": 14231,
  //     "note": "U93ZQy24zJ0=",
  //     "snd": "LNTMAFSF43V7RQ7FBBRAWPXYZPVEBGKPNUELHHRFMCAWSARPFUYD2A623I",
  //     "type": "appl"
  //   }
  // }
}

export default Homepage;
