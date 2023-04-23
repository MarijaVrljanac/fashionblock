import "../../App.css";
import { PeraWalletConnect } from "@perawallet/connect";
import algosdk, { waitForConfirmation } from "algosdk";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Homepage.css";
import logo from "../../assets/logo.png";
import leather from "../../assets/leather.avif";
import silk from "../../assets/silk.avif";
import scuba from "../../assets/scuba.jpg";
import cotton from "../../assets/cotton.jpg";
import linen from "../../assets/linen.jpg";
import wool from "../../assets/wool.jpg";
import polyester from "../../assets/polyester.jpg";
import cashmere from "../../assets/cashmere.jpg";
import velvet from "../../assets/velvet.jpg";
import satin from "../../assets/satin.jpg";
import chiffon from "../../assets/chiffon.jpg";
import lycra from "../../assets/lycra.jpg";
import jersey from "../../assets/jersey.jpg";
import designer from "../../assets/AdobeStock_300697818_1600-1024x576.jpg";
import customer from "../../assets/Wearable-NFTs.jpg";

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
  const { user } = useParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  const handlePrevious = () => {
    if (currentIndex === 0) {
      setCurrentIndex(0);
    } else {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex === 20) {
      setCurrentIndex(20);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

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

      const { txId } = await algod.sendRawTransaction(signedTxns).do();
      const result = await waitForConfirmation(algod, txId, 4);
      console.log(result);
    } catch (e) {
      console.error(`There was an error calling the rps app: ${e}`);
    }
  }

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
    <div className="wrapper">
      <div class="header">
        <div className="logo-cluster">
          <img className="logo" src={logo} width="110" alt="logo" />
          <h3>fashionblock</h3>
        </div>
        <a
          className="gradient-button"
          onClick={
            isConnectedToPeraWallet
              ? handleDisconnectWalletClick
              : handleConnectWalletClick
          }
        >
          {isConnectedToPeraWallet ? "Disconnect" : "Connect to Pera Wallet"}
        </a>
      </div>
      {role ? (
        <>
          <div className="main-content">
            {user ? (
              <a className="gradient-button" onClick={() => setOwner(false)}>
                Join
              </a>
            ) : (
              <a className="gradient-button" onClick={() => optInRpsApp()}>
                OptIn
              </a>
            )}
          </div>
          <div className="slider">
            <h3>Select material: </h3>
            <div
              className="slider-container"
              style={
                currentIndex == 20
                  ? { transform: `translateX(-${currentIndex * 99}px)` }
                  : { transform: `translateX(-${currentIndex * 100}px)` }
              }
            >
              <div class="slider-wrapper">
                <div className="card">
                  <img src={leather}></img>
                  <a
                    className="item"
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
                  </a>
                </div>
                <div className="card">
                  <img src={silk}></img>
                  <a
                    className="item"
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
                  </a>
                </div>
                <div className="card">
                  <img src={polyester}></img>
                  <a
                    className="item"
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
                  </a>
                </div>
                <div className="card">
                  <img src={cotton}></img>
                  <a
                    className="item"
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
                  </a>
                </div>
                <div className="card">
                  <img src={linen}></img>
                  <a
                    className="item"
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
                  </a>
                </div>
                <div className="card">
                  <img src={wool}></img>
                  <a
                    className="item"
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
                  </a>
                </div>
                <div className="card">
                  <img src={scuba}></img>
                  <a
                    className="item"
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
                  </a>
                </div>
                <div className="card">
                  <img src={cashmere}></img>
                  <a
                    className="item"
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
                  </a>
                </div>
                <div className="card">
                  <img src={velvet}></img>
                  <a
                    className="item"
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
                  </a>
                </div>
                <div className="card">
                  <img src={satin}></img>
                  <a
                    className="item"
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
                  </a>
                </div>
                <div className="card">
                  <img src={chiffon}></img>
                  <a
                    className="item"
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
                  </a>
                </div>
                <div className="card">
                  <img src={lycra}></img>
                  <a
                    className="item"
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
                  </a>
                </div>
                <div className="card">
                  <img src={jersey}></img>
                  <a
                    className="item"
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
                  </a>
                </div>
              </div>
            </div>
            <button
              className="slider-button slider-button--left"
              onClick={handlePrevious}
            >
              &#10094;
            </button>
            <button
              className="slider-button slider-button--right"
              onClick={handleNext}
            >
              &#10095;
            </button>
          </div>
          <div className="main-content" style={{ marginTop: 0 }}>
            {user ? (
              <a
                className="gradient-button"
                onClick={() => resolveRpsApplication()}
              >
                Resolve
              </a>
            ) : (
              <a className="gradient-button" onClick={() => setOwner(true)}>
                Start
              </a>
            )}
          </div>
        </>
      ) : (
        <div className="main-content" style={{ marginTop: "180px" }}>
          <h3>Pick a role:</h3>
          <div className="button-wrapper">
            <div className="card">
              <img
                src={designer}
                style={{ width: "300px", height: "300px" }}
              ></img>
              <a
                className="gradient-button"
                onClick={() => setRole("fashiondesigner")}
              >
                Fashion designer
              </a>
            </div>
            <div className="card">
              <img
                src={customer}
                style={{ width: "300px", height: "300px" }}
              ></img>
              <a
                className="gradient-button"
                onClick={() => {
                  setRole("customer");
                  navigate("/user");
                }}
              >
                Customer
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Homepage;
