const { Client } = require('pg');
const client = new Client({
  connectionString: 'postgres://postgres:Fenixvit%40261104@db.gjbdypynujubadtlhpbq.supabase.co:5432/postgres'
});
client.connect()
  .then(() => client.query("SELECT p.title, v.sku, i.quantity_available FROM products p JOIN product_variants v ON v.product_id = p.id LEFT JOIN inventory i ON i.variant_id = v.id WHERE p.title ILIKE '%Recém-Habilitado%'"))
  .then(res => { console.log(res.rows); client.end(); })
  .catch(console.error);
