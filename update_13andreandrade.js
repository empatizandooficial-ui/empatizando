import pg from 'pg';
const { Client } = pg;

const connectionString = 'postgresql://postgres:Fenixvit@261104@db.gjbdypynujubadtlhpbq.supabase.co:5432/postgres';

const client = new Client({
  connectionString,
});

async function run() {
  try {
    await client.connect();
    await client.query(`
      UPDATE auth.users
      SET raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || '{"is_affiliate": true}'::jsonb
      WHERE email = '13andreandrade@gmail.com';
    `);
    console.log("Updated metadata for 13andreandrade");
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.end();
  }
}

run();
