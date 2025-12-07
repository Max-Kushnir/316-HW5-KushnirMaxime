const fs = require('fs');
const path = require('path');
const { pool } = require('./db');

async function initializeDatabase() {
  try {
    console.log('Reading schema file...');
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    console.log('Connecting to database...');
    const client = await pool.connect();

    try {
      console.log('Executing schema...');
      await client.query(schema);
      console.log('Database schema initialized successfully!');
    } finally {
      client.release();
    }

    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

initializeDatabase();
