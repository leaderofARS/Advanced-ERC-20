// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./ComplianceLayer.sol";
import "../utils/Events.sol";

/**
 * @title Governance
 * @dev DAO or admin-controlled governance module
 */
contract Governance is ComplianceLayer {
    struct Proposal {
        uint256 id;
        address proposer;
        string description;
        uint256 votesFor;
        uint256 votesAgainst;
        uint256 startTime;
        uint256 endTime;
        bool executed;
        mapping(address => bool) hasVoted;
    }

    mapping(uint256 => Proposal) public proposals;
    uint256 public proposalCount;
    uint256 public votingPeriod = 7 days;
    uint256 public quorum = 1000; // Minimum tokens needed to create proposal

    bytes32 public constant GOVERNOR_ROLE = keccak256("GOVERNOR_ROLE");

    event ProposalCreated(uint256 indexed proposalId, address indexed proposer, string description);
    event VoteCast(uint256 indexed proposalId, address indexed voter, bool support, uint256 weight);
    event ProposalExecuted(uint256 indexed proposalId, bool success);

    constructor(
        string memory name_,
        string memory symbol_,
        uint8 decimals_,
        uint256 maxSupply_,
        uint256 transferFee_,
        address treasury_,
        uint256 burnRate_,
        uint256 transferLimit_
    ) ComplianceLayer(name_, symbol_, decimals_, maxSupply_, transferFee_, treasury_, burnRate_, transferLimit_) {
        _setupRole(GOVERNOR_ROLE, _msgSender());
    }

    function createProposal(string memory description) external returns (uint256) {
        require(balanceOf(_msgSender()) >= quorum, "Governance: insufficient tokens to propose");
        
        uint256 proposalId = ++proposalCount;
        Proposal storage proposal = proposals[proposalId];
        
        proposal.id = proposalId;
        proposal.proposer = _msgSender();
        proposal.description = description;
        proposal.startTime = block.timestamp;
        proposal.endTime = block.timestamp + votingPeriod;
        proposal.executed = false;

        emit ProposalCreated(proposalId, _msgSender(), description);
        Events.ProposalCreated(proposalId, _msgSender(), description);
        
        return proposalId;
    }

    function vote(uint256 proposalId, bool support) external {
        Proposal storage proposal = proposals[proposalId];
        require(proposal.id != 0, "Governance: proposal does not exist");
        require(block.timestamp >= proposal.startTime, "Governance: voting not started");
        require(block.timestamp <= proposal.endTime, "Governance: voting ended");
        require(!proposal.hasVoted[_msgSender()], "Governance: already voted");

        uint256 weight = balanceOf(_msgSender());
        require(weight > 0, "Governance: no voting power");

        proposal.hasVoted[_msgSender()] = true;
        
        if (support) {
            proposal.votesFor += weight;
        } else {
            proposal.votesAgainst += weight;
        }

        emit VoteCast(proposalId, _msgSender(), support, weight);
    }

    function executeProposal(uint256 proposalId) external onlyRole(GOVERNOR_ROLE) {
        Proposal storage proposal = proposals[proposalId];
        require(proposal.id != 0, "Governance: proposal does not exist");
        require(block.timestamp > proposal.endTime, "Governance: voting not ended");
        require(!proposal.executed, "Governance: already executed");

        bool success = proposal.votesFor > proposal.votesAgainst;
        proposal.executed = true;

        emit ProposalExecuted(proposalId, success);
        Events.ProposalExecuted(proposalId, success);
    }

    function getProposal(uint256 proposalId) external view returns (
        uint256 id,
        address proposer,
        string memory description,
        uint256 votesFor,
        uint256 votesAgainst,
        uint256 startTime,
        uint256 endTime,
        bool executed
    ) {
        Proposal storage proposal = proposals[proposalId];
        return (
            proposal.id,
            proposal.proposer,
            proposal.description,
            proposal.votesFor,
            proposal.votesAgainst,
            proposal.startTime,
            proposal.endTime,
            proposal.executed
        );
    }

    function setVotingPeriod(uint256 newPeriod) external onlyRole(GOVERNOR_ROLE) {
        require(newPeriod >= 1 days && newPeriod <= 30 days, "Governance: invalid voting period");
        votingPeriod = newPeriod;
    }

    function setQuorum(uint256 newQuorum) external onlyRole(GOVERNOR_ROLE) {
        quorum = newQuorum;
    }
}