import pg from 'pg';
const { Client } = pg;

const connectionString = 'postgresql://postgres:Fenixvit@261104@db.gjbdypynujubadtlhpbq.supabase.co:5432/postgres';

const client = new Client({
  connectionString,
});

async function run() {
  try {
    await client.connect();
    
    // Check if columns exist, if not, add them
    const res = await client.query(`
      ALTER TABLE public.affiliates 
      ADD COLUMN IF NOT EXISTS full_name text,
      ADD COLUMN IF NOT EXISTS email text;
    `);
    
    console.log("Migration applied to affiliates table.");
    
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.end();
  }
}

run();
