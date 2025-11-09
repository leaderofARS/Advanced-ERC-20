#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, mkdirSync, cpSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🏗️  Building Advanced ERC-20 for Production...\n');

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

async function main() {
  try {
    // Install frontend dependencies
    console.log('📦 Installing frontend dependencies...');
    await runCommand('npm', ['install'], join(__dirname, 'frontend'), 'Frontend installation');

    // Build the frontend
    console.log('🏗️  Building frontend for production...');
    await runCommand('npm', ['run', 'build'], join(__dirname, 'frontend'), 'Frontend build');

    // Create dist directory if it doesn't exist
    const distDir = join(__dirname, 'dist');
    if (!existsSync(distDir)) {
      mkdirSync(distDir, { recursive: true });
    }

    // Copy frontend build to dist
    console.log('📁 Copying frontend build to dist...');
    const frontendOutDir = join(__dirname, 'frontend', 'out');
    const frontendDistDir = join(__dirname, 'frontend', '.next');
    
    if (existsSync(frontendOutDir)) {
      cpSync(frontendOutDir, join(distDir, 'frontend'), { recursive: true });
    } else if (existsSync(frontendDistDir)) {
      cpSync(frontendDistDir, join(distDir, 'frontend'), { recursive: true });
    }

    // Copy root index.html
    cpSync(join(__dirname, 'index.html'), join(distDir, 'index.html'));

    // Compile smart contracts
    console.log('🔨 Compiling smart contracts...');
    await runCommand('npx', ['hardhat', 'compile'], __dirname, 'Smart contract compilation');

    console.log('\n✅ Production build completed!');
    console.log('📁 Build output in: ./dist/');
    console.log('🚀 Deploy the dist folder to your web server');
    console.log('📋 Smart contract artifacts in: ./artifacts/');

  } catch (error) {
    console.error('❌ Production build failed:', error);
    process.exit(1);
  }
}

main();