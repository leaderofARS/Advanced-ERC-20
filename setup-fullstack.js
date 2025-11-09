#!/usr/bin/env node

import { spawn, exec } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { promisify } from 'util';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🚀 Setting up Advanced ERC-20 Full-Stack Platform...\n');

// Function to run a command with live output
function runCommand(command, args, cwd = __dirname, label = '') {
  return new Promise((resolve, reject) => {
    console.log(`📦 ${label}: ${command} ${args.join(' ')}`);
    
    const child = spawn(command, args, {
      cwd,
      stdio: 'inherit',
      shell: true
    });

    child.on('close', (code) => {
      if (code === 0) {
        console.log(`✅ ${label} completed successfully\n`);
        resolve();
      } else {
        console.log(`❌ ${label} failed with code ${code}\n`);
        reject(new Error(`${label} failed`));
      }
    });

    child.on('error', (error) => {
      console.error(`❌ ${label} error:`, error);
      reject(error);
    });
  });
}

// Function to create environment files
function createEnvironmentFiles() {
  console.log('📝 Creating environment files...');

  // Backend .env
  const backendEnv = `# Database
DATABASE_URL="postgresql://username:password@localhost:5432/advanced_erc20"

# Redis
REDIS_URL="redis://localhost:6379"

# Blockchain
RPC_URL="http://localhost:8545"
CONTRACT_ADDRESS="0x1234567890123456789012345678901234567890"
PRIVATE_KEY="0x1234567890123456789012345678901234567890123456789012345678901234"
CHAIN_ID="31337"

# API
PORT="3001"
NODE_ENV="development"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# CORS
FRONTEND_URL="http://localhost:3000"

# External APIs
ALCHEMY_API_KEY="your-alchemy-api-key"
INFURA_API_KEY="your-infura-api-key"

# Monitoring
LOG_LEVEL="info"
`;

  // Frontend .env.local (update existing)
  const frontendEnv = `# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:3001

# Contract Configuration
NEXT_PUBLIC_TOKEN_ADDRESS=0x1234567890123456789012345678901234567890
NEXT_PUBLIC_CHAIN_ID=31337

# Network Providers
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_api_key_here
NEXT_PUBLIC_INFURA_API_KEY=your_infura_api_key_here

# WalletConnect
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id_here

# Block Explorer
NEXT_PUBLIC_BLOCK_EXPLORER=http://localhost:8545

# Feature Flags
NEXT_PUBLIC_ENABLE_GOVERNANCE=true
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_ROLE_MANAGEMENT=true
NEXT_PUBLIC_ENABLE_REAL_TIME=true

# Development
NEXT_PUBLIC_DEBUG=true
`;

  // Create backend .env
  if (!existsSync(join(__dirname, 'backend'))) {
    mkdirSync(join(__dirname, 'backend'), { recursive: true });
  }
  writeFileSync(join(__dirname, 'backend', '.env'), backendEnv);

  // Update frontend .env.local
  writeFileSync(join(__dirname, 'frontend', '.env.local'), frontendEnv);

  console.log('✅ Environment files created\n');
}

// Function to setup database
async function setupDatabase() {
  console.log('🗄️  Setting up database...');
  
  try {
    // Check if PostgreSQL is running
    await execAsync('pg_isready');
    console.log('✅ PostgreSQL is running');
  } catch (error) {
    console.log('⚠️  PostgreSQL not detected. Please install and start PostgreSQL:');
    console.log('   - macOS: brew install postgresql && brew services start postgresql');
    console.log('   - Ubuntu: sudo apt install postgresql && sudo systemctl start postgresql');
    console.log('   - Windows: Download from https://www.postgresql.org/download/windows/');
    console.log('');
  }

  try {
    // Check if Redis is running
    await execAsync('redis-cli ping');
    console.log('✅ Redis is running');
  } catch (error) {
    console.log('⚠️  Redis not detected. Please install and start Redis:');
    console.log('   - macOS: brew install redis && brew services start redis');
    console.log('   - Ubuntu: sudo apt install redis-server && sudo systemctl start redis');
    console.log('   - Windows: Download from https://redis.io/download');
    console.log('');
  }
}

// Function to create docker-compose for easy setup
function createDockerCompose() {
  console.log('🐳 Creating Docker Compose configuration...');

  const dockerCompose = `version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: advanced_erc20
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 30s
      timeout: 10s
      retries: 3

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 30s
      timeout: 10s
      retries: 3

  hardhat:
    build:
      context: .
      dockerfile: Dockerfile.hardhat
    ports:
      - "8545:8545"
    volumes:
      - ./contracts:/app/contracts
      - ./scripts:/app/scripts
    command: npx hardhat node --hostname 0.0.0.0

volumes:
  postgres_data:
  redis_data:
`;

  const dockerfile = `FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8545

CMD ["npx", "hardhat", "node", "--hostname", "0.0.0.0"]
`;

  writeFileSync(join(__dirname, 'docker-compose.yml'), dockerCompose);
  writeFileSync(join(__dirname, 'Dockerfile.hardhat'), dockerfile);

  console.log('✅ Docker Compose configuration created\n');
}

// Main setup function
async function main() {
  try {
    console.log('🎯 Advanced ERC-20 Full-Stack Setup');
    console.log('=====================================\n');

    // Create environment files
    createEnvironmentFiles();

    // Create Docker Compose
    createDockerCompose();

    // Install root dependencies
    console.log('📦 Installing root dependencies...');
    await runCommand('npm', ['install'], __dirname, 'Root dependencies');

    // Install frontend dependencies
    console.log('📦 Installing frontend dependencies...');
    await runCommand('npm', ['install'], join(__dirname, 'frontend'), 'Frontend dependencies');

    // Install backend dependencies
    console.log('📦 Installing backend dependencies...');
    await runCommand('npm', ['install'], join(__dirname, 'backend'), 'Backend dependencies');

    // Setup database
    await setupDatabase();

    // Generate Prisma client (if database is available)
    try {
      console.log('🔄 Generating Prisma client...');
      await runCommand('npx', ['prisma', 'generate'], join(__dirname, 'backend'), 'Prisma generate');
    } catch (error) {
      console.log('⚠️  Prisma generation skipped (database not available)');
    }

    // Compile smart contracts
    console.log('🔨 Compiling smart contracts...');
    await runCommand('npx', ['hardhat', 'compile'], __dirname, 'Smart contract compilation');

    // Build frontend
    console.log('🏗️  Building frontend...');
    await runCommand('npm', ['run', 'build'], join(__dirname, 'frontend'), 'Frontend build');

    console.log('🎉 Setup completed successfully!\n');
    console.log('📋 Next steps:');
    console.log('1. Start services: npm run dev:services (or docker-compose up -d)');
    console.log('2. Run database migrations: npm run db:migrate');
    console.log('3. Deploy contracts: npm run deploy:local');
    console.log('4. Start development: npm run dev\n');
    
    console.log('🌐 Access points:');
    console.log('- Frontend: http://localhost:3000');
    console.log('- Backend API: http://localhost:3001');
    console.log('- Hardhat Network: http://localhost:8545');
    console.log('- Database: postgresql://postgres:password@localhost:5432/advanced_erc20');
    console.log('- Redis: redis://localhost:6379\n');

    console.log('📚 Documentation: ./docs/');
    console.log('🔧 Configuration: .env files created');

  } catch (error) {
    console.error('❌ Setup failed:', error);
    console.log('\n🆘 Troubleshooting:');
    console.log('1. Ensure Node.js 18+ is installed');
    console.log('2. Check network connectivity');
    console.log('3. Verify permissions for file operations');
    console.log('4. Run with --verbose for detailed logs');
    process.exit(1);
  }
}

main();