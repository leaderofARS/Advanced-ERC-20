// @ts-nocheck
import { ethers } from 'ethers';
import { createPublicClient, createWalletClient, http, parseEther, formatEther } from 'viem';
import { mainnet, sepolia, hardhat } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';
import { logger } from '@/utils/logger';
import { prisma } from '@/config/database';
import { EventEmitter } from 'events';

// Advanced ERC-20 ABI (comprehensive)
const ADVANCED_ERC20_ABI = [
  // Standard ERC-20
  'function name() view returns (string)',
  'function symbol() view returns (string)',
  'function decimals() view returns (uint8)',
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address) view returns (uint256)',
  'function transfer(address to, uint256 amount) returns (bool)',
  'function transferFrom(address from, address to, uint256 amount) returns (bool)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  
  // Advanced features
  'function mint(address to, uint256 amount) returns (bool)',
  'function burn(uint256 amount) returns (bool)',
  'function burnFrom(address from, uint256 amount) returns (bool)',
  'function pause()',
  'function unpause()',
  'function paused() view returns (bool)',
  
  // Role management
  'function hasRole(bytes32 role, address account) view returns (bool)',
  'function grantRole(bytes32 role, address account)',
  'function revokeRole(bytes32 role, address account)',
  'function getRoleAdmin(bytes32 role) view returns (bytes32)',
  
  // Governance
  'function propose(string description, address[] targets, uint256[] values, bytes[] calldatas) returns (uint256)',
  'function vote(uint256 proposalId, bool support, string reason)',
  'function execute(uint256 proposalId)',
  'function getProposal(uint256 proposalId) view returns (tuple)',
  
  // Fee mechanism
  'function setTransferFee(uint256 fee)',
  'function getTransferFee() view returns (uint256)',
  'function setFeeRecipient(address recipient)',
  'function getFeeRecipient() view returns (address)',
  
  // Events
  'event Transfer(address indexed from, address indexed to, uint256 value)',
  'event Approval(address indexed owner, address indexed spender, uint256 value)',
  'event Mint(address indexed to, uint256 amount)',
  'event Burn(address indexed from, uint256 amount)',
  'event Paused(address account)',
  'event Unpaused(address account)',
  'event RoleGranted(bytes32 indexed role, address indexed account, address indexed sender)',
  'event RoleRevoked(bytes32 indexed role, address indexed account, address indexed sender)',
  'event ProposalCreated(uint256 indexed proposalId, address indexed proposer, string description)',
  'event VoteCast(uint256 indexed proposalId, address indexed voter, bool support, uint256 weight)',
  'event ProposalExecuted(uint256 indexed proposalId)',
  'event FeeUpdated(uint256 oldFee, uint256 newFee)',
];

class BlockchainService extends EventEmitter {
  private provider: ethers.Provider;
  private publicClient: any;
  private walletClient: any;
  private contract: ethers.Contract;
  private contractAddress: string;
  private isInitialized = false;

  constructor() {
    super();
    this.contractAddress = process.env.CONTRACT_ADDRESS || '';
  }

  async initialize() {
    try {
      // Initialize provider
      const rpcUrl = process.env.RPC_URL || 'http://localhost:8545';
      this.provider = new ethers.JsonRpcProvider(rpcUrl);

      // Initialize viem clients
      const chain = this.getChain();
      this.publicClient = createPublicClient({
        chain,
        transport: http(rpcUrl)
      });

      if (process.env.PRIVATE_KEY) {
        const account = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`);
        this.walletClient = createWalletClient({
          account,
          chain,
          transport: http(rpcUrl)
        });
      }

      // Initialize contract
      this.contract = new ethers.Contract(
        this.contractAddress,
        ADVANCED_ERC20_ABI,
        this.provider
      );

      // Start event listeners
      this.startEventListeners();

      // Start metrics collection
      this.startMetricsCollection();

      this.isInitialized = true;
      logger.info('Blockchain service initialized successfully');

    } catch (error) {
      logger.error('Failed to initialize blockchain service:', error);
      throw error;
    }
  }

  private getChain() {
    const chainId = parseInt(process.env.CHAIN_ID || '31337');
    switch (chainId) {
      case 1: return mainnet;
      case 11155111: return sepolia;
      case 31337: return hardhat;
      default: return hardhat;
    }
  }

  private startEventListeners() {
    // Transfer events
    this.contract.on('Transfer', async (from, to, value, event) => {
      try {
        await this.handleTransferEvent(from, to, value, event);
      } catch (error) {
        logger.error('Error handling Transfer event:', error);
      }
    });

    // Mint events
    this.contract.on('Mint', async (to, amount, event) => {
      try {
        await this.handleMintEvent(to, amount, event);
      } catch (error) {
        logger.error('Error handling Mint event:', error);
      }
    });

    // Burn events
    this.contract.on('Burn', async (from, amount, event) => {
      try {
        await this.handleBurnEvent(from, amount, event);
      } catch (error) {
        logger.error('Error handling Burn event:', error);
      }
    });

    // Governance events
    this.contract.on('ProposalCreated', async (proposalId, proposer, description, event) => {
      try {
        await this.handleProposalCreatedEvent(proposalId, proposer, description, event);
      } catch (error) {
        logger.error('Error handling ProposalCreated event:', error);
      }
    });

    this.contract.on('VoteCast', async (proposalId, voter, support, weight, event) => {
      try {
        await this.handleVoteCastEvent(proposalId, voter, support, weight, event);
      } catch (error) {
        logger.error('Error handling VoteCast event:', error);
      }
    });

    logger.info('Blockchain event listeners started');
  }

  private async handleTransferEvent(from: string, to: string, value: bigint, event: any) {
    const transaction = await prisma.transaction.create({
      data: {
        hash: event.transactionHash,
        from,
        to,
        amount: formatEther(value),
        type: 'TRANSFER',
        status: 'CONFIRMED',
        blockNumber: BigInt(event.blockNumber),
        gasUsed: event.gasUsed?.toString(),
        gasPrice: event.gasPrice?.toString(),
        metadata: {
          logIndex: event.logIndex,
          transactionIndex: event.transactionIndex
        }
      }
    });

    // Emit real-time update
    this.emit('transaction', {
      type: 'TRANSFER',
      transaction,
      from,
      to,
      amount: formatEther(value)
    });

    // Update user analytics
    await this.updateUserAnalytics(from, to, formatEther(value));
  }

  private async handleMintEvent(to: string, amount: bigint, event: any) {
    const transaction = await prisma.transaction.create({
      data: {
        hash: event.transactionHash,
        from: '0x0000000000000000000000000000000000000000',
        to,
        amount: formatEther(amount),
        type: 'MINT',
        status: 'CONFIRMED',
        blockNumber: BigInt(event.blockNumber),
        metadata: {
          logIndex: event.logIndex,
          transactionIndex: event.transactionIndex
        }
      }
    });

    this.emit('transaction', {
      type: 'MINT',
      transaction,
      to,
      amount: formatEther(amount)
    });
  }

  private async handleBurnEvent(from: string, amount: bigint, event: any) {
    const transaction = await prisma.transaction.create({
      data: {
        hash: event.transactionHash,
        from,
        to: '0x0000000000000000000000000000000000000000',
        amount: formatEther(amount),
        type: 'BURN',
        status: 'CONFIRMED',
        blockNumber: BigInt(event.blockNumber),
        metadata: {
          logIndex: event.logIndex,
          transactionIndex: event.transactionIndex
        }
      }
    });

    this.emit('transaction', {
      type: 'BURN',
      transaction,
      from,
      amount: formatEther(amount)
    });
  }

  private async handleProposalCreatedEvent(proposalId: bigint, proposer: string, description: string, event: any) {
    // Get proposal details from contract
    const proposalData = await this.contract.getProposal(proposalId);
    
    const proposal = await prisma.proposal.create({
      data: {
        id: proposalId.toString(),
        title: description.split('\n')[0] || 'Untitled Proposal',
        description,
        proposer,
        status: 'ACTIVE',
        startTime: new Date(Number(proposalData.startTime) * 1000),
        endTime: new Date(Number(proposalData.endTime) * 1000),
        metadata: {
          blockNumber: event.blockNumber,
          transactionHash: event.transactionHash
        }
      }
    });

    this.emit('proposal', {
      type: 'CREATED',
      proposal
    });
  }

  private async handleVoteCastEvent(proposalId: bigint, voter: string, support: boolean, weight: bigint, event: any) {
    const vote = await prisma.vote.create({
      data: {
        proposalId: proposalId.toString(),
        voter,
        support,
        weight: formatEther(weight)
      }
    });

    // Update proposal vote counts
    const proposal = await prisma.proposal.findUnique({
      where: { id: proposalId.toString() }
    });

    if (proposal) {
      const votesFor = support 
        ? (BigInt(proposal.votesFor) + weight).toString()
        : proposal.votesFor;
      const votesAgainst = !support 
        ? (BigInt(proposal.votesAgainst) + weight).toString()
        : proposal.votesAgainst;

      await prisma.proposal.update({
        where: { id: proposalId.toString() },
        data: {
          votesFor,
          votesAgainst,
          totalVotes: (BigInt(votesFor) + BigInt(votesAgainst)).toString()
        }
      });
    }

    this.emit('vote', {
      type: 'CAST',
      vote,
      proposalId: proposalId.toString(),
      voter,
      support,
      weight: formatEther(weight)
    });
  }

  private async updateUserAnalytics(from: string, to: string, amount: string) {
    // Update sender analytics
    if (from !== '0x0000000000000000000000000000000000000000') {
      await prisma.userAnalytics.upsert({
        where: { userId: from },
        update: {
          totalTransactions: { increment: 1 },
          totalVolume: { increment: parseFloat(amount) },
          lastTransaction: new Date()
        },
        create: {
          userId: from,
          totalTransactions: 1,
          totalVolume: amount,
          firstTransaction: new Date(),
          lastTransaction: new Date()
        }
      });
    }

    // Update receiver analytics
    if (to !== '0x0000000000000000000000000000000000000000') {
      await prisma.userAnalytics.upsert({
        where: { userId: to },
        update: {
          totalTransactions: { increment: 1 },
          lastTransaction: new Date()
        },
        create: {
          userId: to,
          totalTransactions: 1,
          totalVolume: '0',
          firstTransaction: new Date(),
          lastTransaction: new Date()
        }
      });
    }
  }

  private async startMetricsCollection() {
    // Collect metrics every 30 seconds
    setInterval(async () => {
      try {
        await this.collectTokenMetrics();
      } catch (error) {
        logger.error('Error collecting token metrics:', error);
      }
    }, 30000);

    // Initial collection
    await this.collectTokenMetrics();
  }

  private async collectTokenMetrics() {
    try {
      const [totalSupply, holders, transfers24h] = await Promise.all([
        this.contract.totalSupply(),
        this.getHoldersCount(),
        this.getTransfers24h()
      ]);

      const burnedTokens = await this.getBurnedTokens();
      const volume24h = await this.getVolume24h();

      await prisma.tokenMetrics.create({
        data: {
          totalSupply: formatEther(totalSupply),
          circulatingSupply: formatEther(totalSupply - burnedTokens),
          burnedTokens: formatEther(burnedTokens),
          holders,
          transfers24h,
          volume24h
        }
      });

      this.emit('metrics', {
        totalSupply: formatEther(totalSupply),
        holders,
        transfers24h,
        volume24h
      });

    } catch (error) {
      logger.error('Error collecting token metrics:', error);
    }
  }

  private async getHoldersCount(): Promise<number> {
    // This would typically query an indexer or scan events
    // For now, return a mock value
    return 1000;
  }

  private async getTransfers24h(): Promise<number> {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const count = await prisma.transaction.count({
      where: {
        type: 'TRANSFER',
        createdAt: { gte: yesterday }
      }
    });
    return count;
  }

  private async getVolume24h(): Promise<string> {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const result = await prisma.transaction.aggregate({
      where: {
        type: 'TRANSFER',
        createdAt: { gte: yesterday }
      },
      _sum: { amount: true }
    });
    return result._sum.amount || '0';
  }

  private async getBurnedTokens(): Promise<bigint> {
    const result = await prisma.transaction.aggregate({
      where: { type: 'BURN' },
      _sum: { amount: true }
    });
    return parseEther(result._sum.amount || '0');
  }

  // Public API methods
  async getTokenInfo() {
    const [name, symbol, decimals, totalSupply] = await Promise.all([
      this.contract.name(),
      this.contract.symbol(),
      this.contract.decimals(),
      this.contract.totalSupply()
    ]);

    return {
      name,
      symbol,
      decimals,
      totalSupply: formatEther(totalSupply),
      address: this.contractAddress
    };
  }

  async getBalance(address: string): Promise<string> {
    const balance = await this.contract.balanceOf(address);
    return formatEther(balance);
  }

  async isContract(): Promise<boolean> {
    const code = await this.provider.getCode(this.contractAddress);
    return code !== '0x';
  }

  getContract() {
    return this.contract;
  }

  getProvider() {
    return this.provider;
  }

  isReady(): boolean {
    return this.isInitialized;
  }
}

export const blockchainService = new BlockchainService();

export async function initializeBlockchainService() {
  await blockchainService.initialize();
}