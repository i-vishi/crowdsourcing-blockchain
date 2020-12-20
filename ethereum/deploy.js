const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const compiledFactory = require("./build/CampaignFactory.json");
const config = require("../config.json"); // config.json stores the address, mnemonic and infura API

const provider = new HDWalletProvider(config.mnemonic, config.infuraAPI);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  console.log("attempting to connect to ", accounts[0]);

  const result = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({ data: `0x${compiledFactory.evm.bytecode.object}` }) // add bytecode
    .send({ from: accounts[0] }); // remove gas

  console.log("contract deployed to", result.options.address);
};
deploy();
