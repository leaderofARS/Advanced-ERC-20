#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🚀 Starting Advanced ERC-20 Development Environment...\n');

// Function to run a command
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
        console.log(`✅ ${label} completed successfully`);
        resolve();
      } else {
        console.log(`❌ ${label} failed with code ${code}`);
        reject(new Error(`${label} failed`));
      }
    });

    child.on('error', (error) => {
      console.error(`❌ ${label} error:`, error);
      reject(error);
    });
  });
}

// Function to run a command in background
function runBackground(command, args, cwd = __dirname, label = '') {
  console.log(`🔄 Starting ${label} in background: ${command} ${args.join(' ')}`);
  
  const child = spawn(command, args, {
    cwd,
    stdio: 'inherit',
    shell: true,
    detached: false
  });

  child.on('error', (error) => {
    console.error(`❌ ${label} error:`, error);
  });

  return child;
}

async function main() {
  try {
    // Check if frontend dependencies are installed
    console.log('🔍 Checking frontend dependencies...');
    
    try {
      await runCommand('npm', ['list'], join(__dirname, 'frontend'), 'Frontend dependency check');
    } catch (error) {
      console.log('📦 Installing frontend dependencies...');
      await runCommand('npm', ['install'], join(__dirname, 'frontend'), 'Frontend installation');
    }

    // Start the frontend development server
    console.log('\n🌐 Starting frontend development server...');
    const frontendProcess = runBackground('npm', ['run', 'dev'], join(__dirname, 'frontend'), 'Frontend Dev Server');

    // Start a simple HTTP server for the root index.html
    console.log('🌍 Starting root HTTP server...');
    const rootProcess = runBackground('npx', ['http-server', '.', '-p', '8080', '-o'], __dirname, 'Root HTTP Server');

    console.log('\n✨ Development environment started!');
    console.log('📍 Access points:');
    console.log('   • Root landing page: http://localhost:8080');
    console.log('   • Frontend app: http://localhost:3000');
    console.log('   • Smart contracts: Use Hardhat commands');
    console.log('\n🛑 Press Ctrl+C to stop all servers');

    // Handle graceful shutdown
    process.on('SIGINT', () => {
      console.log('\n🛑 Shutting down development environment...');
      frontendProcess.kill();
      rootProcess.kill();
      process.exit(0);
    });

    // Keep the process alive
    await new Promise(() => {});

  } catch (error) {
    console.error('❌ Failed to start development environment:', error);
    process.exit(1);
  }
}

main();