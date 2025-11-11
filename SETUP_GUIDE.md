# 🚀 Setup Guide - Advanced ERC-20 Platform

Complete guide to set up and run the Advanced ERC-20 platform locally.

## 📋 Prerequisites

- **Node.js** v18+ and npm
- **PostgreSQL** v14+ (for backend)
- **Redis** v6+ (for backend caching)
- **Git**
- **MetaMask** or another Web3 wallet

## 🔧 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/leaderofARS/Advanced-ERC-20.git
cd Advanced-ERC-20
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install --legacy-peer-deps
cd ..

# Install backend dependencies
cd backend
npm install --legacy-peer-deps
cd ..
```

### 3. Set Up Environment Variables

#### Frontend Environment

```bash
cd frontend
cp .env.example .env.local
```

Edit `frontend/.env.local` and add:

```env
# Required for wallet connection
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=get_from_walletconnect_cloud
NEXT_PUBLIC_ALCHEMY_API_KEY=get_from_alchemy_dashboard

# Optional but recommended
NEXT_PUBLIC_INFURA_API_KEY=get_from_infura_dashboard

# Will be set after contract deployment
NEXT_PUBLIC_TOKEN_ADDRESS=0x...

# Backend API (for local development)
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:3001
```

#### Backend Environment

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` and add:

```env
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/advanced_erc20

# Redis
REDIS_URL=redis://localhost:6379

# JWT Secret (generate a random string)
JWT_SECRET=your_super_secret_key_here

# Blockchain RPC
MAINNET_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY

# Contract address (after deployment)
TOKEN_CONTRACT_ADDRESS=0x...
```

### 4. Set Up Database (Backend)

```bash
cd backend

# Create database
createdb advanced_erc20

# Run migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate
```

### 5. Compile Smart Contracts

```bash
# From root directory
npx hardhat compile
```

### 6. Deploy Smart Contract (Local)

```bash
# Start local Hardhat node (in one terminal)
npx hardhat node

# Deploy contract (in another terminal)
npx hardhat ignition deploy ignition/modules/AdvancedERC20.ts --network localhost
```

Copy the deployed contract address and update:
- `frontend/.env.local` → `NEXT_PUBLIC_TOKEN_ADDRESS`
- `backend/.env` → `TOKEN_CONTRACT_ADDRESS`

### 7. Start Development Servers

```bash
# Option 1: Start all services together (from root)
npm run dev

# Option 2: Start services individually

# Terminal 1: Frontend
cd frontend
npm run dev

# Terminal 2: Backend
cd backend
npm run dev

# Terminal 3: Hardhat node (if testing locally)
npx hardhat node
```

## 🌐 Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Hardhat Network**: http://localhost:8545

## 🔑 Getting API Keys

### WalletConnect Project ID
1. Go to https://cloud.walletconnect.com/
2. Sign up / Log in
3. Create a new project
4. Copy the Project ID

### Alchemy API Key
1. Go to https://www.alchemy.com/
2. Sign up / Log in
3. Create a new app
4. Select network (Ethereum Mainnet, Sepolia, etc.)
5. Copy the API key

### Infura API Key (Optional)
1. Go to https://infura.io/
2. Sign up / Log in
3. Create a new project
4. Copy the Project ID

## 🧪 Testing

```bash
# Test smart contracts
npx hardhat test

# Test with coverage
npx hardhat coverage

# Test with gas reporting
REPORT_GAS=true npx hardhat test
```

## 📦 Building for Production

### Frontend

```bash
cd frontend
npm run build
npm start
```

### Backend

```bash
cd backend
npm run build
npm start
```

## 🚀 Deployment

### Frontend (Vercel)

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

### Backend (Render/Railway)

1. Push code to GitHub
2. Connect repository to Render/Railway
3. Set environment variables
4. Deploy

### Smart Contracts (Testnet/Mainnet)

```bash
# Deploy to Sepolia testnet
npx hardhat ignition deploy ignition/modules/AdvancedERC20.ts --network sepolia

# Verify on Etherscan
npx hardhat verify --network sepolia DEPLOYED_CONTRACT_ADDRESS
```

## 🔧 Troubleshooting

### Port Already in Use

```bash
# Kill process on port 3000
npx kill-port 3000

# Kill process on port 3001
npx kill-port 3001
```

### Database Connection Error

```bash
# Check PostgreSQL is running
pg_isready

# Restart PostgreSQL
# Windows: Services → PostgreSQL → Restart
# Mac: brew services restart postgresql
# Linux: sudo systemctl restart postgresql
```

### Redis Connection Error

```bash
# Check Redis is running
redis-cli ping

# Start Redis
# Windows: redis-server
# Mac: brew services start redis
# Linux: sudo systemctl start redis
```

### Chunk Loading Error (Next.js)

```bash
cd frontend
rm -rf .next
npm run dev
```

### Node Modules Issues

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

## 📚 Additional Resources

- [Hardhat Documentation](https://hardhat.org/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Wagmi Documentation](https://wagmi.sh/)
- [RainbowKit Documentation](https://www.rainbowkit.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)

## 🆘 Need Help?

- Check the [README.md](./README.md) for project overview
- Review [SECURITY.md](./SECURITY.md) for security guidelines
- Check [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) for codebase structure

---

**Happy Building! 🚀**
