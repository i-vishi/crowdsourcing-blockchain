/* eslint-disable import/no-mutable-exports */
import Web3 from "web3";

const config = require("../config.json");

let web3;

if (typeof window !== "undefined" && typeof window.web3 !== "undefined") {
  // assuming Metamask is installed OR we are on the browser
  web3 = new Web3(window.web3.currentProvider);
} else {
  // user does not have Metamask OR we are on the server
  const provider = new Web3.providers.HttpProvider(config.infuraAPI);
  web3 = new Web3(provider);
}
export default web3;
