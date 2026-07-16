ALTER TABLE product_variants DROP CONSTRAINT IF EXISTS product_variants_sku_key;
ALTER TABLE product_variants ADD CONSTRAINT product_variants_product_id_sku_key UNIQUE (product_id, sku);
