-- Create the storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Policy for public read access
CREATE POLICY "Public read access for product-images" ON storage.objects
FOR SELECT USING (bucket_id = 'product-images');

-- Policy for authenticated users to insert
CREATE POLICY "Authenticated users can insert into product-images" ON storage.objects
FOR INSERT TO authenticated WITH CHECK (bucket_id = 'product-images');

-- Policy for authenticated users to update
CREATE POLICY "Authenticated users can update product-images" ON storage.objects
FOR UPDATE TO authenticated USING (bucket_id = 'product-images');

-- Policy for authenticated users to delete
CREATE POLICY "Authenticated users can delete from product-images" ON storage.objects
FOR DELETE TO authenticated USING (bucket_id = 'product-images');
