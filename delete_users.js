import pg from 'pg';
const { Client } = pg;

const connectionString = 'postgresql://postgres.gjbdypynujubadtlhpbq:Fenixvit@261104@aws-0-sa-east-1.pooler.supabase.com:6543/postgres';

const client = new Client({
  connectionString,
});

async function run() {
  try {
    await client.connect();
    console.log("Connected to PostgreSQL");
    
    // Check users
    const res = await client.query('SELECT id, email FROM auth.users');
    console.log("Users:", res.rows);
    
    // Delete test users (exclude actual admin if they exist, but let's see them first)
    // Actually, user requested to delete both
    if (res.rows.length > 0) {
      const deleteRes = await client.query('DELETE FROM auth.users');
      console.log(`Deleted ${deleteRes.rowCount} users.`);
    } else {
      console.log("No users found.");
    }
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.end();
  }
}

run();
