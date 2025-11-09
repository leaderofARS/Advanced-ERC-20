# 🔧 Backend API Service
> **RESTful API & Real-Time Services** - High-performance backend service providing API endpoints, WebSocket connections, and blockchain integration for the Advanced ERC-20 platform.

## 🎯 Overview

The backend service is built with Node.js, Express, and TypeScript, providing a robust API layer between the frontend application and blockchain infrastructure. It handles authentication, data aggregation, real-time updates, and blockchain event processing.

### **🌟 Core Features**

- **RESTful API**: Comprehensive REST endpoints for all platform operations
- **WebSocket Server**: Real-time updates and live data streaming
- **Blockchain Integration**: Direct interaction with smart contracts
- **Event Processing**: Automated blockchain event indexing and processing
- **Authentication**: JWT-based secure authentication system
- **Database Layer**: PostgreSQL with Prisma ORM for data persistence
- **Caching**: Redis integration for performance optimization
- **Rate Limiting**: API protection and abuse prevention

## 📂 Project Structure

```
backend/
├── 📂 src/
│   ├── 📂 controllers/        # Request handlers
│   ├── 📂 services/           # Business logic
│   ├── 📂 routes/             # API route definitions
│   ├── 📂 middleware/         # Express middleware
│   ├── 📂 models/             # Data models
│   ├── 📂 utils/              # Utility functions
│   └── 📄 server.ts           # Application entry point
├── 📂 prisma/                 # Database schema and migrations
├── 📂 tests/                  # Test suites
├── 📄 package.json            # Dependencies
└── 📄 tsconfig.json           # TypeScript configuration
```

## 🚀 Quick Start

```bash
# Install dependencies
cd backend
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🔌 API Endpoints

### **Authentication**
```
POST   /api/auth/login          # User login
POST   /api/auth/register       # User registration
POST   /api/auth/refresh        # Refresh access token
POST   /api/auth/logout         # User logout
```

### **Token Operations**
```
GET    /api/token/balance/:address    # Get token balance
GET    /api/token/supply              # Get total supply
GET    /api/token/holders             # Get token holders
POST   /api/token/transfer            # Transfer tokens
```

### **Governance**
```
GET    /api/governance/proposals      # List all proposals
GET    /api/governance/proposals/:id  # Get proposal details
POST   /api/governance/propose        # Create proposal
POST   /api/governance/vote           # Vote on proposal
```

### **Analytics**
```
GET    /api/analytics/metrics         # Get platform metrics
GET    /api/analytics/transactions    # Transaction history
GET    /api/analytics/holders         # Holder analytics
GET    /api/analytics/governance      # Governance statistics
```

## 🔐 Authentication & Security

### **JWT Authentication**
```typescript
// JWT token structure
interface JWTPayload {
  userId: string;
  address: string;
  roles: string[];
  iat: number;
  exp: number;
}

// Authentication middleware
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
```

### **Rate Limiting**
```typescript
// Rate limiting configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});

app.use('/api/', limiter);
```

## 📡 WebSocket Integration

### **Real-Time Events**
```typescript
// WebSocket server setup
import { Server } from 'socket.io';

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST']
  }
});

// Event broadcasting
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  // Subscribe to blockchain events
  socket.on('subscribe:transfers', () => {
    socket.join('transfers');
  });
  
  socket.on('subscribe:governance', () => {
    socket.join('governance');
  });
});

// Broadcast blockchain events
export const broadcastTransfer = (transfer: Transfer) => {
  io.to('transfers').emit('transfer', transfer);
};
```

## 🗄️ Database Schema

### **Prisma Models**
```prisma
model User {
  id        String   @id @default(cuid())
  address   String   @unique
  email     String?  @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  transactions Transaction[]
  votes        Vote[]
}

model Transaction {
  id        String   @id @default(cuid())
  hash      String   @unique
  from      String
  to        String
  amount    String
  fee       String
  timestamp DateTime
  blockNumber Int
  
  user      User?    @relation(fields: [from], references: [address])
}

model Proposal {
  id          Int      @id @default(autoincrement())
  proposalId  Int      @unique
  proposer    String
  title       String
  description String
  startTime   DateTime
  endTime     DateTime
  votesFor    String
  votesAgainst String
  executed    Boolean  @default(false)
  
  votes       Vote[]
}

model Vote {
  id         String   @id @default(cuid())
  proposalId Int
  voter      String
  support    Boolean
  weight     String
  reason     String?
  timestamp  DateTime @default(now())
  
  proposal   Proposal @relation(fields: [proposalId], references: [proposalId])
  user       User     @relation(fields: [voter], references: [address])
  
  @@unique([proposalId, voter])
}
```

## ⚡ Performance Optimization

### **Caching Strategy**
```typescript
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

// Cache frequently accessed data
export const getCachedData = async <T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttl: number = 300
): Promise<T> => {
  const cached = await redis.get(key);
  
  if (cached) {
    return JSON.parse(cached);
  }
  
  const data = await fetchFn();
  await redis.setex(key, ttl, JSON.stringify(data));
  
  return data;
};

// Example usage
export const getTokenMetrics = async () => {
  return getCachedData(
    'token:metrics',
    async () => {
      const totalSupply = await contract.totalSupply();
      const holders = await prisma.user.count();
      return { totalSupply, holders };
    },
    60 // Cache for 60 seconds
  );
};
```

## 🔄 Blockchain Event Processing

### **Event Listener**
```typescript
import { ethers } from 'ethers';

// Set up event listeners
export const setupEventListeners = (contract: ethers.Contract) => {
  // Transfer events
  contract.on('Transfer', async (from, to, amount, event) => {
    await processTransferEvent({
      hash: event.transactionHash,
      from,
      to,
      amount: amount.toString(),
      blockNumber: event.blockNumber,
      timestamp: new Date()
    });
    
    // Broadcast to WebSocket clients
    broadcastTransfer({ from, to, amount: amount.toString() });
  });
  
  // Governance events
  contract.on('ProposalCreated', async (proposalId, proposer, title, event) => {
    await processProposalEvent({
      proposalId: proposalId.toNumber(),
      proposer,
      title,
      blockNumber: event.blockNumber
    });
    
    io.to('governance').emit('proposal:created', { proposalId, proposer, title });
  });
};
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run integration tests
npm run test:integration

# Run e2e tests
npm run test:e2e
```

## 📊 Monitoring & Logging

### **Logging Configuration**
```typescript
import winston from 'winston';

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});
```

## 🚀 Deployment

```bash
# Build production bundle
npm run build

# Run production server
npm start

# Using PM2 for process management
pm2 start dist/server.js --name advanced-erc20-api

# Docker deployment
docker build -t advanced-erc20-backend .
docker run -p 3001:3001 advanced-erc20-backend
```

---

**This backend service provides a robust, scalable, and secure API layer for the Advanced ERC-20 platform.**