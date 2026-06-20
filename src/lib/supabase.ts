import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gjbdypynujubadtlhpbq.supabase.co';
const supabaseAnonKey = 'sb_publishable_4w6lGq3EzUrUmIEYe43fUw_bfr0q5lz';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
