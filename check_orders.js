import pg from 'pg';
const { Client } = pg;
const client = new Client('postgresql://postgres:Fenixvit@261104@db.gjbdypynujubadtlhpbq.supabase.co:5432/postgres');
async function run() {
  await client.connect();
  const res = await client.query(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'orders'
  `);
  console.table(res.rows);
  await client.end();
}
run();
