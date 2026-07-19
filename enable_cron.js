import pg from 'pg';
const { Client } = pg;
const client = new Client('postgresql://postgres:Fenixvit@261104@db.gjbdypynujubadtlhpbq.supabase.co:5432/postgres');
async function run() {
  await client.connect();
  try {
    await client.query("CREATE EXTENSION IF NOT EXISTS pg_cron;");
    console.log("pg_cron extension enabled.");
  } catch(e) {
    console.error("Failed to enable pg_cron:", e);
  }
  await client.end();
}
run();
