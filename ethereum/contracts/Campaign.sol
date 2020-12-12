// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.8.0;

contract CampaignFactory {
    address[] public deployedCampaigns;
    
    function createCampaign(uint minimumContribution) public {
        Campaign newCampaign = new Campaign(minimumContribution, msg.sender);
        deployedCampaigns.push(address(newCampaign));
    }
    
    function getDeployedCampaigns() public view returns(address[] memory) {
        return deployedCampaigns;
    }
}

contract Campaign {
    struct SpendingRequest {
        string description;
        uint value;
        address payable recipient;
        bool isCompleted;
        uint approvalCount;
        mapping(address => bool) approvals;
    }
    
    address public manager;
    uint public minimumContribution;
    mapping(address => bool) public approvers;
    uint public approversCount;
    mapping(uint => SpendingRequest) public spendingRequests;
    uint public numRequests;
    
    constructor(uint _minimumContribution, address creator){
        manager = creator;
        minimumContribution = _minimumContribution;
    }
    
    function contribute() public payable {
        require(msg.value > minimumContribution);
        
        approvers[msg.sender] = true;
        approversCount++;
    }
    
    function createSpendingRequest(string memory _description, uint _value, address payable _recipient) public restrictedToManager {
        SpendingRequest storage newRequest = spendingRequests[numRequests++];
        newRequest.description = _description;
        newRequest.value = _value;
        newRequest.recipient = _recipient;
        newRequest.isCompleted = false;
        newRequest.approvalCount = 0;
    }
    
    function approveRequest(uint idx) public {
        SpendingRequest storage req = spendingRequests[idx];
        
        require(approvers[msg.sender]);
        require(!req.approvals[msg.sender]);
        
        req.approvals[msg.sender] = true;
        req.approvalCount++;
    }
    
    function finalizeRequest(uint idx) public restrictedToManager {
        SpendingRequest storage req = spendingRequests[idx];
        require(req.approvalCount > (approversCount/2));
        require(!spendingRequests[idx].isCompleted);
        req.recipient.transfer(req.value);
        req.isCompleted = true;
    }
    
    modifier restrictedToManager() {
        require(msg.sender == manager, "Only manager can call this function");
        _;
    }
}