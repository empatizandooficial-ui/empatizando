-- 09_add_product_dimensions.sql
-- Adds dimensions and weight to products for real shipping calculation

ALTER TABLE products 
  ADD COLUMN weight_kg NUMERIC(10, 3) DEFAULT 0.300,
  ADD COLUMN width_cm NUMERIC(10, 2) DEFAULT 15.00,
  ADD COLUMN height_cm NUMERIC(10, 2) DEFAULT 10.00,
  ADD COLUMN length_cm NUMERIC(10, 2) DEFAULT 20.00,
  ADD COLUMN box_format TEXT DEFAULT 'caixa' CHECK (box_format IN ('caixa', 'rolo', 'envelope'));
