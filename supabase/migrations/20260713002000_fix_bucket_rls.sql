-- Drop the strictly authenticated policies
DROP POLICY IF EXISTS "Authenticated users can insert into product-images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update product-images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete from product-images" ON storage.objects;

-- Create more permissive policies for the Lovable preview environment
CREATE POLICY "Public users can insert into product-images" ON storage.objects FOR INSERT TO public WITH CHECK (bucket_id = 'product-images');
CREATE POLICY "Public users can update product-images" ON storage.objects FOR UPDATE TO public USING (bucket_id = 'product-images');
CREATE POLICY "Public users can delete from product-images" ON storage.objects FOR DELETE TO public USING (bucket_id = 'product-images');
