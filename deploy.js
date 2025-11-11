const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Create Vercel project
execSync('npm install -g vercel', { stdio: 'inherit' });
execSync('vercel login', { stdio: 'inherit' }); // Just press Enter if already logged in

// Deploy
console.log("🚀 Deploying Driverwanda to the world...");
execSync('vercel --prod', { stdio: 'inherit' });

console.log("🎉 DRIVERWANDA IS NOW LIVE WORLDWIDE!");