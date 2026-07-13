ALTER TABLE products ADD COLUMN images TEXT[] DEFAULT '{}';
UPDATE products SET images = ARRAY[image_url] WHERE image_url IS NOT NULL;
ALTER TABLE products DROP COLUMN image_url;
