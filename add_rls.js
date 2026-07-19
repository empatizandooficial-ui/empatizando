import pg from 'pg';
const { Client } = pg;
const connectionString = 'postgresql://postgres:Fenixvit@261104@db.gjbdypynujubadtlhpbq.supabase.co:5432/postgres';
const client = new Client({ connectionString });
async function run() {
  await client.connect();
  try {
    await client.query(`
      CREATE POLICY "Admins can manage affiliates" 
      ON affiliates
      FOR ALL 
      TO authenticated
      USING (has_role(auth.uid(), 'admin'::app_role))
      WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
    `);
    console.log("RLS policy for admins created on affiliates table.");
  } catch (err) {
    console.error(err);
  }
  await client.end();
}
run();
