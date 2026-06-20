-- Tornar o bucket privado para silenciar o alerta "Public Bucket Allows Listing" do Lovable
UPDATE storage.buckets SET public = false WHERE id = 'social_media_assets';
