const { Client } = require('pg');

const connectionString = 'postgresql://postgres:Fenixvit@261104@db.gjbdypynujubadtlhpbq.supabase.co:5432/postgres';

const client = new Client({
  connectionString,
});

async function run() {
  try {
    await client.connect();
    console.log('Connected to DB');

    // Add full_name column if it doesn't exist
    await client.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='affiliates' AND column_name='full_name') THEN
          ALTER TABLE public.affiliates ADD COLUMN full_name TEXT;
        END IF;
      END
      $$;
    `);
    console.log('full_name column ensured');

    // Add terms_accepted column if it doesn't exist
    await client.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='affiliates' AND column_name='terms_accepted') THEN
          ALTER TABLE public.affiliates ADD COLUMN terms_accepted BOOLEAN DEFAULT false;
        END IF;
      END
      $$;
    `);
    console.log('terms_accepted column ensured');

  } catch (err) {
    console.error('Error executing script', err);
  } finally {
    await client.end();
  }
}

run();
