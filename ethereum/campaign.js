import web3 from "./web3";
import Campaign from "./build/Campaign.json";

export default (address) => new web3.eth.Contract(Campaign.abi, address);
