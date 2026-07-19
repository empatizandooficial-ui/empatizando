import pg from 'pg';
const { Client } = pg;
const connectionString = 'postgresql://postgres:Fenixvit@261104@db.gjbdypynujubadtlhpbq.supabase.co:5432/postgres';
const client = new Client({ connectionString });
async function run() {
  await client.connect();
  const policies = await client.query("select policyname, permissive, roles, cmd, qual, with_check from pg_policies where tablename = 'chat_sessions'");
  console.table(policies.rows);
  await client.end();
}
run();
