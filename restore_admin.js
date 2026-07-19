import pg from 'pg';
const { Client } = pg;

const connectionString = 'postgresql://postgres:Fenixvit@261104@db.gjbdypynujubadtlhpbq.supabase.co:5432/postgres';

const client = new Client({
  connectionString,
});

async function run() {
  try {
    await client.connect();
    console.log("Connected to PostgreSQL");
    
    // Get user id
    const res = await client.query("SELECT id FROM auth.users WHERE email = 'empatizandooficial@gmail.com'");
    if (res.rows.length === 0) {
      console.log("User not found.");
      return;
    }
    const userId = res.rows[0].id;
    console.log("User ID:", userId);
    
    // Insert into user_roles
    try {
      await client.query("INSERT INTO public.user_roles (user_id, role) VALUES ($1, 'admin') ON CONFLICT DO NOTHING", [userId]);
      console.log("Inserted admin role successfully.");
    } catch (e) {
      console.error("Failed to insert into user_roles, trying fallback or checking schema.", e.message);
    }
    
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.end();
  }
}

run();
