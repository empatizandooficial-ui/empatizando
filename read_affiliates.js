import pg from 'pg';
const { Client } = pg;

const connectionString = 'postgresql://postgres:Fenixvit@261104@db.gjbdypynujubadtlhpbq.supabase.co:5432/postgres';

const client = new Client({
  connectionString,
});

async function run() {
  try {
    await client.connect();
    
    const res = await client.query('SELECT * FROM public.affiliates');
    console.log(res.rows);
    
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.end();
  }
}

run();
