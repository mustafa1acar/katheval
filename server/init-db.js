const db = require('./db');

async function testConnection() {
  console.log('Testing MySQL Database Initialization...');
  await db.initDatabaseConnection();
  console.log('Status connected:', db.getIsConnected());
  process.exit(0);
}

testConnection();
