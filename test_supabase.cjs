const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = 'https://gjbdypynujubadtlhpbq.supabase.co';
const supabaseKey = 'sb_publishable_4w6lGq3EzUrUmIEYe43fUw_bfr0q5lz'; // anon key from .env
const supabase = createClient(supabaseUrl, supabaseKey);

supabase.from('product_variants_public').select('*, inventory(*)').then(res => {
  console.log(JSON.stringify(res.data, null, 2));
  if (res.error) console.error(res.error);
});
