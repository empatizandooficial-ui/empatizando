import pg from 'pg';
const { Client } = pg;
const client = new Client('postgresql://postgres:Fenixvit@261104@db.gjbdypynujubadtlhpbq.supabase.co:5432/postgres');
async function run() {
  await client.connect();
  const res = await client.query("SELECT * FROM pg_extension WHERE extname = 'pg_cron'");
  console.log(res.rows);
  await client.end();
}
run();
