const { Client } = require('pg');
const fs = require('fs');

const connectionString = 'postgresql://postgres:Fenixvit%40261104@db.gjbdypynujubadtlhpbq.supabase.co:5432/postgres';

async function executeSql() {
  const client = new Client({ connectionString });
  
  try {
    await client.connect();
    console.log('Connected to database.');
    
    const sql = fs.readFileSync('../supabase_agent_configs.sql', 'utf8');
    await client.query(sql);
    console.log('SQL executed successfully!');
    
  } catch (err) {
    console.error('Error executing SQL:', err);
  } finally {
    await client.end();
  }
}

executeSql();
