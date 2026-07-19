import pg from 'pg';
const { Client } = pg;
const connectionString = 'postgresql://postgres:Fenixvit@261104@db.gjbdypynujubadtlhpbq.supabase.co:5432/postgres';
const client = new Client({ connectionString });
async function run() {
  await client.connect();
  try {
    // 1. Add columns
    await client.query(`
      ALTER TABLE public.orders 
      ADD COLUMN IF NOT EXISTS delivered_at timestamp with time zone,
      ADD COLUMN IF NOT EXISTS finished_at timestamp with time zone;
      
      ALTER TABLE public.affiliates 
      ADD COLUMN IF NOT EXISTS pending_balance numeric DEFAULT 0;
    `);
    console.log("Columns added.");

    // 2. Create the Trigger Function
    await client.query(`
      CREATE OR REPLACE FUNCTION handle_order_status_change()
      RETURNS TRIGGER AS $$
      BEGIN
        -- When an order becomes PAID
        IF NEW.status = 'paid' AND OLD.status != 'paid' AND NEW.affiliate_id IS NOT NULL THEN
          UPDATE public.affiliates 
          SET status = 'active_seller',
              pending_balance = COALESCE(pending_balance, 0) + COALESCE(NEW.commission_amount, 0)
          WHERE id = NEW.affiliate_id;
        END IF;

        -- When an order becomes FINISHED (after 8 days of delivery)
        IF NEW.status = 'finished' AND OLD.status != 'finished' AND NEW.affiliate_id IS NOT NULL THEN
          UPDATE public.affiliates 
          SET pending_balance = GREATEST(COALESCE(pending_balance, 0) - COALESCE(NEW.commission_amount, 0), 0),
              balance = COALESCE(balance, 0) + COALESCE(NEW.commission_amount, 0)
          WHERE id = NEW.affiliate_id;
        END IF;

        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);
    console.log("Trigger function created.");

    // 3. Attach Trigger
    await client.query(`
      DROP TRIGGER IF EXISTS tr_order_status_change ON public.orders;
      CREATE TRIGGER tr_order_status_change
      AFTER UPDATE OF status ON public.orders
      FOR EACH ROW
      EXECUTE FUNCTION handle_order_status_change();
    `);
    console.log("Trigger attached.");

    // 4. Create the Daily Cron Function
    await client.query(`
      CREATE OR REPLACE FUNCTION daily_b2b_routine()
      RETURNS void AS $$
      BEGIN
        -- 4.1 Advance delivered orders to finished after 8 days
        UPDATE public.orders 
        SET status = 'finished',
            finished_at = NOW()
        WHERE status = 'delivered' 
          AND delivered_at <= NOW() - INTERVAL '8 days';

        -- 4.2 Mark inactive affiliates (no orders in 30 days and account older than 30 days)
        UPDATE public.affiliates 
        SET status = 'inactive' 
        WHERE (status = 'active_seller' OR status = 'approved') 
          AND created_at <= NOW() - INTERVAL '30 days' 
          AND id NOT IN (
            SELECT affiliate_id 
            FROM public.orders 
            WHERE created_at >= NOW() - INTERVAL '30 days' 
              AND affiliate_id IS NOT NULL
          );
      END;
      $$ LANGUAGE plpgsql;
    `);
    console.log("Cron routine created.");

    // 5. Schedule with pg_cron
    // Wait, pg_cron schema needs to be enabled. We will try to schedule it.
    await client.query(`
      -- Remove if exists to recreate
      SELECT cron.unschedule('daily-b2b-routine') 
      WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'daily-b2b-routine');
      
      -- Schedule daily at midnight
      SELECT cron.schedule('daily-b2b-routine', '0 0 * * *', 'SELECT daily_b2b_routine()');
    `);
    console.log("Cron job scheduled.");

  } catch(e) {
    console.error("Error setting up Epic 1:", e);
  } finally {
    await client.end();
  }
}
run();
