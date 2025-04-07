// socket-cli.js
import { io } from 'socket.io-client';
import readline from 'readline';

const KEVCHAT_ACCESS_TOKEN = process.env.KEVCHAT_ACCESS_TOKEN ?? null;

if (!KEVCHAT_ACCESS_TOKEN) {
  console.error('❌ Error: please set KEVCHAT_ACCESS_TOKEN to a valid access token from the Kevchat IDP.');
  process.exit(1);
}

// Create interface to read input from terminal
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const socket = io('https://local.api.kev.chat', {
  rejectUnauthorized: false,
  extraHeaders: {
    Cookie: `kevchat_access_token=${KEVCHAT_ACCESS_TOKEN}`,
  },
});

socket.on('connect', () => {
  console.log('✅ Connected:', socket.id);

  // Prompt user for input
  rl.setPrompt('Enter a message to send: ');
  rl.prompt();

  rl.on('line', (line) => {
    // Send message to server
    socket.emit('events', line.trim());

    rl.prompt();
  });
});

socket.on('connect_error', (error) => {
  console.error('❌ Connection error:', error);
});

socket.on('events', (message) => {
  console.log('\n📩 Message received:', message);
});
