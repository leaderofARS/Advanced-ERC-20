import { Router } from 'express';
import { prisma } from '@/config/database';
import { blockchainService } from '@/services/blockchain';
import { logger } from '@/utils/logger';
import { authenticateToken } from '@/middleware/auth';
import { validateRequest } from '@/middleware/validation';
import Joi from 'joi';

const router = Router();

// Get real-time token metrics
router.get('/metrics', async (req, res) => {
  try {
    // Get latest metrics from database
    const latestMetrics = await prisma.tokenMetrics.findFirst({
      orderBy: { timestamp: 'desc' }
    });

    // Get live data from blockchain
    const tokenInfo = await blockchainService.getTokenInfo();
    
    // Calculate additional metrics
    const [holders, volume24h, transactions24h] = await Promise.all([
      getHoldersCount(),
      getVolume24h(),
      getTransactions24h()
    ]);

    const metrics = {
      ...latestMetrics,
      ...tokenInfo,
      holders,
      volume24h,
      transactions24h,
      lastUpdated: new Date().toISOString()
    };

    res.json({
      success: true,
      data: metrics
    });

  } catch (error) {
    logger.error('Error fetching metrics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch metrics'
    });
  }
});

// Get historical metrics
router.get('/metrics/history', validateRequest({
  query: Joi.object({
    timeframe: Joi.string().valid('1h', '24h', '7d', '30d', '1y').default('24h'),
    interval: Joi.string().valid('1m', '5m', '15m', '1h', '1d').optional()
  })
}), async (req, res) => {
  try {
    const { timeframe, interval } = req.query;
    
    const timeframeMs = {
      '1h': 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000,
      '1y': 365 * 24 * 60 * 60 * 1000
    }[timeframe as string];

    const startTime = new Date(Date.now() - timeframeMs);

    const metrics = await prisma.tokenMetrics.findMany({
      where: {
        timestamp: { gte: startTime }
      },
      orderBy: { timestamp: 'asc' }
    });

    res.json({
      success: true,
      data: metrics
    });

  } catch (error) {
    logger.error('Error fetching historical metrics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch historical metrics'
    });
  }
});

// Get user analytics
router.get('/user/:address', authenticateToken, async (req, res) => {
  try {
    const { address } = req.params;

    const userAnalytics = await prisma.userAnalytics.findUnique({
      where: { userId: address.toLowerCase() },
      include: {
        user: {
          select: {
            address: true,
            username: true,
            createdAt: true
          }
        }
      }
    });

    if (!userAnalytics) {
      return res.status(404).json({
        success: false,
        error: 'User analytics not found'
      });
    }

    // Get recent transactions
    const recentTransactions = await prisma.transaction.findMany({
      where: {
        OR: [
          { from: address.toLowerCase() },
          { to: address.toLowerCase() }
        ]
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    res.json({
      success: true,
      data: {
        ...userAnalytics,
        recentTransactions
      }
    });

  } catch (error) {
    logger.error('Error fetching user analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user analytics'
    });
  }
});

// Get top holders
router.get('/holders', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;

    // This would typically come from an indexer or cached data
    const topHolders = await getTopHolders(limit);

    res.json({
      success: true,
      data: topHolders
    });

  } catch (error) {
    logger.error('Error fetching top holders:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch top holders'
    });
  }
});

// Get transaction analytics
router.get('/transactions', validateRequest({
  query: Joi.object({
    timeframe: Joi.string().valid('1h', '24h', '7d', '30d').default('24h'),
    type: Joi.string().valid('TRANSFER', 'MINT', 'BURN', 'APPROVE').optional()
  })
}), async (req, res) => {
  try {
    const { timeframe, type } = req.query;
    
    const timeframeMs = {
      '1h': 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000
    }[timeframe as string];

    const startTime = new Date(Date.now() - timeframeMs);

    const whereClause: any = {
      createdAt: { gte: startTime }
    };

    if (type) {
      whereClause.type = type;
    }

    const [transactions, totalVolume, uniqueUsers] = await Promise.all([
      prisma.transaction.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        take: 100
      }),
      prisma.transaction.aggregate({
        where: whereClause,
        _sum: { amount: true }
      }),
      prisma.transaction.groupBy({
        by: ['from'],
        where: whereClause
      })
    ]);

    res.json({
      success: true,
      data: {
        transactions,
        totalVolume: totalVolume._sum.amount || '0',
        uniqueUsers: uniqueUsers.length,
        timeframe
      }
    });

  } catch (error) {
    logger.error('Error fetching transaction analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch transaction analytics'
    });
  }
});

// Helper functions
async function getHoldersCount(): Promise<number> {
  // This would typically come from an indexer
  // For now, return a mock value based on unique transaction participants
  const uniqueAddresses = await prisma.transaction.groupBy({
    by: ['from', 'to']
  });
  return uniqueAddresses.length;
}

async function getVolume24h(): Promise<string> {
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

async function getTransactions24h(): Promise<number> {
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
  return await prisma.transaction.count({
    where: {
      createdAt: { gte: yesterday }
    }
  });
}

async function getTopHolders(limit: number) {
  // This would typically come from an indexer or cached balance data
  // For now, return mock data
  const mockHolders = [];
  for (let i = 0; i < limit; i++) {
    mockHolders.push({
      address: `0x${Math.random().toString(16).substring(2, 42)}`,
      balance: (Math.random() * 100000).toFixed(2),
      percentage: (Math.random() * 10).toFixed(2)
    });
  }
  return mockHolders;
}

export default router;