/* eslint-disable no-undef */
const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");

const web3 = new Web3(ganache.provider());

const compiledFactory = require("../ethereum/build/CampaignFactory.json");
const compiledCampaign = require("../ethereum/build/Campaign.json");

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  factory = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({ data: compiledFactory.evm.bytecode.object })
    .send({ from: accounts[0], gas: "1000000" });

  await factory.methods
    .createCampaign("100")
    .send({ from: accounts[0], gas: "1000000" });

  [campaignAddress] = await factory.methods.getDeployedCampaigns().call();

  campaign = await new web3.eth.Contract(compiledCampaign.abi, campaignAddress);
});

describe("Campaigns", () => {
  it("deploy a factory and a campaign", () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  it("make the caller of create as the manager", async () => {
    const manager = await campaign.methods.manager().call();
    assert.strictEqual(manager, accounts[0]);
  });

  it("allow users to contribute and makes them approvers", async () => {
    await campaign.methods
      .contribute()
      .send({ from: accounts[1], value: "120" });

    const isContributor = await campaign.methods.approvers(accounts[1]).call();
    assert(isContributor);
  });

  it("require a minimum contribution", async () => {
    try {
      await campaign.methods.contribute().send({
        from: accounts[1],
        value: "50",
      });

      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  it("allow the manager to create a request", async () => {
    await campaign.methods
      .createSpendingRequest("buying something", "100", accounts[2])
      .send({
        from: accounts[0],
        gas: "1000000",
      });

    const req = await campaign.methods.spendingRequests(0).call();

    assert.strictEqual(req.description, "buying something");
  });

  it("process requests", async () => {
    await campaign.methods.contribute().send({
      from: accounts[0],
      value: web3.utils.toWei("8", "ether"),
    });

    await campaign.methods
      .createSpendingRequest(
        "test request",
        web3.utils.toWei("5", "ether"),
        accounts[1],
      )
      .send({ from: accounts[0], gas: "1000000" });

    await campaign.methods
      .approveRequest(0)
      .send({ from: accounts[0], gas: "1000000" });

    await campaign.methods
      .finalizeRequest(0)
      .send({ from: accounts[0], gas: "1000000" });

    let balance = await web3.eth.getBalance(accounts[1]);
    balance = web3.utils.fromWei(balance, "ether");
    balance = parseFloat(balance);

    assert(balance > 104);
  });
});
