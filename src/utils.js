import { connect, Contract, keyStores, WalletConnection } from "near-api-js";
import getConfig from "./config";

const nearConfig = getConfig(process.env.NODE_ENV || "development");

// Initialize contract & set global variables
export async function initContract() {
  // Initialize connection to the NEAR testnet
  const near = await connect(
    Object.assign(
      { deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() } },
      nearConfig
    )
  );

  // Initializing Wallet based Account. It can work with NEAR testnet wallet that
  // is hosted at https://wallet.testnet.near.org
  window.walletConnection = new WalletConnection(near);

  // Getting the Account ID. If still unauthorized, it's just empty string
  window.accountId = window.walletConnection.getAccountId();

  // Initializing our contract APIs by contract name and configuration
  window.contract = new Contract(
    window.walletConnection.account(),
    nearConfig.contractName,
    {
      viewMethods: [
        "getGreeting",
        "didParticipate",
        "getAllPrompts",
        "getVotes",
        "getUrl",
        "getCandidatePair",
        "getDateOfPoll"
      ],
      changeMethods: [
        "addUrl",
        "addCandidatePair",
        "addToPromptArray",
        "addVote",
        "recordUser",
        "clearPromptArray",
        "removeFromPromptArray",
        "addDate"
      ],
    }
  );
}

export function logout() {
  window.walletConnection.signOut();
  // reload page
  login();
  
}

export function login() {
  // Allow the current app to make calls to the specified contract on the
  // user's behalf.
  // This works by creating a new access key for the user's account and storing
  // the private key in localStorage.
  window.walletConnection.requestSignIn(nearConfig.contractName);
}
export function isAdmin(){
  return window.accountId === localStorage.getItem("admin");
}
export async function didUserVote(prompt) {
  return await window.contract.didParticipate({
    prompt: prompt,
    user: window.accountId,
  });
}