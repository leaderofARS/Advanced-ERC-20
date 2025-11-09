#!/usr/bin/env node

import { exec } from 'child_process';
import { platform } from 'os';

const url = 'http://localhost:3000';

// Determine the command based on the operating system
let command;
switch (platform()) {
  case 'darwin': // macOS
    command = `open ${url}`;
    break;
  case 'win32': // Windows
    command = `start ${url}`;
    break;
  default: // Linux and others
    command = `xdg-open ${url}`;
    break;
}

console.log(`🌐 Opening ${url} in your default browser...`);

exec(command, (error) => {
  if (error) {
    console.error(`❌ Failed to open browser: ${error.message}`);
    console.log(`📋 Please manually open: ${url}`);
  } else {
    console.log(`✅ Browser opened successfully!`);
  }
});