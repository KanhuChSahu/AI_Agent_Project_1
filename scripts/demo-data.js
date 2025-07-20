/**
 * Script to generate demo data for testing the application without Google Sheets API credentials
 * 
 * Run with: node scripts/demo-data.js
 */

const fs = require('fs');
const path = require('path');

// Sample text content for video generation
const sampleData = [
  {
    row: 1,
    text: 'Welcome to our channel! Today we will explore the fascinating world of artificial intelligence and how it is transforming our daily lives.'
  },
  {
    row: 2,
    text: 'In this video, we will show you 5 simple exercises you can do at home to improve your posture and reduce back pain.'
  },
  {
    row: 3,
    text: 'Learn how to make a delicious chocolate cake with just 3 ingredients. Perfect for beginners and ready in under 30 minutes!'
  },
  {
    row: 4,
    text: 'Discover the top 10 most beautiful travel destinations that won\'t break your bank. Budget-friendly paradise locations you must visit!'
  },
  {
    row: 5,
    text: 'How to grow your YouTube channel in 2023: proven strategies that helped me gain 100,000 subscribers in just 6 months.'
  }
];

// Create demo data directory if it doesn't exist
const demoDir = path.join(__dirname, '../demo');
if (!fs.existsSync(demoDir)) {
  fs.mkdirSync(demoDir, { recursive: true });
  console.log('Created demo directory');
}

// Write sample data to JSON file
const outputFile = path.join(demoDir, 'sample-sheet-data.json');
fs.writeFileSync(outputFile, JSON.stringify(sampleData, null, 2));

console.log(`Demo data written to ${outputFile}`);
console.log('You can use this data for testing the application without Google Sheets API credentials.');
console.log('\nTo use demo mode:');
console.log('1. Add DEMO_MODE=true to your .env file');
console.log('2. Restart the server');
console.log('3. Use any Google Sheets URL in the application (it will use the demo data instead)');