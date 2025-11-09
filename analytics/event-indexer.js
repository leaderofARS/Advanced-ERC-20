const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');

class EventIndexer {
  constructor(provider, contractAddress, contractABI) {
    this.provider = provider;
    this.contract = new ethers.Contract(contractAddress, contractABI, provider);
    this.events = [];
    this.isRunning = false;
  }

  async startIndexing(fromBlock = 'latest') {
    console.log('Starting event indexing from block:', fromBlock);
    this.isRunning = true;

    // Index historical events if fromBlock is not 'latest'
    if (fromBlock !== 'latest') {
      await this.indexHistoricalEvents(fromBlock);
    }

    // Listen for new events
    this.setupEventListeners();
  }

  async indexHistoricalEvents(fromBlock) {
    console.log('Indexing historical events...');
    
    const filter = {
      address: this.contract.address,
      fromBlock: fromBlock,
      toBlock: 'latest'
    };

    try {
      const logs = await this.provider.getLogs(filter);
      
      for (const log of logs) {
        const parsedLog = this.contract.interface.parseLog(log);
        if (parsedLog) {
          await this.processEvent(parsedLog, log);
        }
      }
      
      console.log(`Indexed ${logs.length} historical events`);
    } catch (error) {
      console.error('Error indexing historical events:', error);
    }
  }

  setupEventListeners() {
    // Transfer events
    this.contract.on('Transfer', async (from, to, value, event) => {
      await this.processTransferEvent(from, to, value, event);
    });

    // Analytics events
    this.contract.on('TransferAnalytics', async (from, to, amount, timestamp, category, event) => {
      await this.processAnalyticsEvent(from, to, amount, timestamp, category, event);
    });

    // User activity events
    this.contract.on('UserActivity', async (user, action, value, timestamp, event) => {
      await this.processUserActivityEvent(user, action, value, timestamp, event);
    });

    // Fee events
    this.contract.on('FeeCollected', async (from, to, amount, fee, event) => {
      await this.processFeeEvent(from, to, amount, fee, event);
    });

    // Governance events
    this.contract.on('ProposalCreated', async (proposalId, proposer, description, event) => {
      await this.processGovernanceEvent('ProposalCreated', { proposalId, proposer, description }, event);
    });

    console.log('Event listeners set up successfully');
  }

  async processEvent(parsedLog, rawLog) {
    const eventData = {
      eventName: parsedLog.name,
      args: parsedLog.args,
      blockNumber: rawLog.blockNumber,
      transactionHash: rawLog.transactionHash,
      timestamp: await this.getBlockTimestamp(rawLog.blockNumber)
    };

    this.events.push(eventData);
    await this.saveEvent(eventData);
  }

  async processTransferEvent(from, to, value, event) {
    const eventData = {
      type: 'Transfer',
      from,
      to,
      value: value.toString(),
      blockNumber: event.log.blockNumber,
      transactionHash: event.log.transactionHash,
      timestamp: await this.getBlockTimestamp(event.log.blockNumber)
    };

    console.log('Transfer event:', eventData);
    await this.saveEvent(eventData);
  }

  async processAnalyticsEvent(from, to, amount, timestamp, category, event) {
    const eventData = {
      type: 'TransferAnalytics',
      from,
      to,
      amount: amount.toString(),
      timestamp: timestamp.toString(),
      category,
      blockNumber: event.log.blockNumber,
      transactionHash: event.log.transactionHash
    };

    console.log('Analytics event:', eventData);
    await this.saveEvent(eventData);
  }

  async processUserActivityEvent(user, action, value, timestamp, event) {
    const eventData = {
      type: 'UserActivity',
      user,
      action,
      value: value.toString(),
      timestamp: timestamp.toString(),
      blockNumber: event.log.blockNumber,
      transactionHash: event.log.transactionHash
    };

    console.log('User activity event:', eventData);
    await this.saveEvent(eventData);
  }

  async processFeeEvent(from, to, amount, fee, event) {
    const eventData = {
      type: 'FeeCollected',
      from,
      to,
      amount: amount.toString(),
      fee: fee.toString(),
      blockNumber: event.log.blockNumber,
      transactionHash: event.log.transactionHash,
      timestamp: await this.getBlockTimestamp(event.log.blockNumber)
    };

    console.log('Fee event:', eventData);
    await this.saveEvent(eventData);
  }

  async processGovernanceEvent(eventType, data, event) {
    const eventData = {
      type: eventType,
      ...data,
      blockNumber: event.log.blockNumber,
      transactionHash: event.log.transactionHash,
      timestamp: await this.getBlockTimestamp(event.log.blockNumber)
    };

    console.log('Governance event:', eventData);
    await this.saveEvent(eventData);
  }

  async getBlockTimestamp(blockNumber) {
    try {
      const block = await this.provider.getBlock(blockNumber);
      return block.timestamp;
    } catch (error) {
      console.error('Error getting block timestamp:', error);
      return Math.floor(Date.now() / 1000);
    }
  }

  async saveEvent(eventData) {
    const filename = `events_${new Date().toISOString().split('T')[0]}.json`;
    const filepath = path.join(__dirname, 'data', filename);
    
    // Ensure directory exists
    const dir = path.dirname(filepath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Append event to file
    let existingData = [];
    if (fs.existsSync(filepath)) {
      try {
        const fileContent = fs.readFileSync(filepath, 'utf8');
        existingData = JSON.parse(fileContent);
      } catch (error) {
        console.error('Error reading existing events file:', error);
      }
    }

    existingData.push(eventData);
    fs.writeFileSync(filepath, JSON.stringify(existingData, null, 2));
  }

  stop() {
    console.log('Stopping event indexer...');
    this.isRunning = false;
    this.contract.removeAllListeners();
  }

  getEvents(filter = {}) {
    let filteredEvents = this.events;

    if (filter.type) {
      filteredEvents = filteredEvents.filter(event => event.type === filter.type);
    }

    if (filter.from) {
      filteredEvents = filteredEvents.filter(event => 
        event.from && event.from.toLowerCase() === filter.from.toLowerCase()
      );
    }

    if (filter.to) {
      filteredEvents = filteredEvents.filter(event => 
        event.to && event.to.toLowerCase() === filter.to.toLowerCase()
      );
    }

    if (filter.startTime && filter.endTime) {
      filteredEvents = filteredEvents.filter(event => 
        event.timestamp >= filter.startTime && event.timestamp <= filter.endTime
      );
    }

    return filteredEvents;
  }
}

module.exports = { EventIndexer };