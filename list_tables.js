import pg from 'pg';
const { Client } = pg;
const client = new Client('postgresql://postgres:Fenixvit@261104@db.gjbdypynujubadtlhpbq.supabase.co:5432/postgres');
async function run() {
  await client.connect();
  const res = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
  console.log(res.rows.map(r => r.table_name));
  await client.end();
}
run();
