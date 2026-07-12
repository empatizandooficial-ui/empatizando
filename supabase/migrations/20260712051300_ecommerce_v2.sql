-- =======================================================
-- MIGRATION: E-commerce Enterprise V2 (Categorias, SKUs e IA)
-- =======================================================

-- 1. Modificar a Tabela 'products' original (Base)
ALTER TABLE products ADD COLUMN IF NOT EXISTS base_price NUMERIC(10, 2);
ALTER TABLE products ADD COLUMN IF NOT EXISTS seo_title TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS seo_description TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS tags_json JSONB DEFAULT '[]'::jsonb;
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_ai_optimized BOOLEAN DEFAULT false;

-- Atualizar preços base para evitar nulos
UPDATE products SET base_price = price WHERE base_price IS NULL;

-- 2. Tabela Categories
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS product_categories (
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, category_id)
);

-- 3. Tabela Tags (Estruturadas, além do campo json)
CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS product_tags (
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, tag_id)
);

-- 4. Variantes e Atributos (SKUs)
CREATE TABLE IF NOT EXISTS attributes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE -- Ex: "Cor", "Tamanho"
);

CREATE TABLE IF NOT EXISTS attribute_values (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attribute_id UUID REFERENCES attributes(id) ON DELETE CASCADE,
  value TEXT NOT NULL, -- Ex: "Vermelho", "G"
  UNIQUE (attribute_id, value)
);

CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  sku TEXT UNIQUE NOT NULL,
  price_override NUMERIC(10, 2),
  cost_price_override NUMERIC(10, 2),
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS variant_attribute_values (
  variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
  attribute_value_id UUID REFERENCES attribute_values(id) ON DELETE CASCADE,
  PRIMARY KEY (variant_id, attribute_value_id)
);

-- 5. Controle de Estoque Isolado
CREATE TABLE IF NOT EXISTS inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  variant_id UUID UNIQUE REFERENCES product_variants(id) ON DELETE CASCADE,
  quantity_available INTEGER DEFAULT 0,
  quantity_reserved INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger de Updated At do Estoque
CREATE TRIGGER update_inventory_updated_at
BEFORE UPDATE ON inventory
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- =======================================================
-- 6. Configurar RLS (Row Level Security)
-- =======================================================
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE attributes ENABLE ROW LEVEL SECURITY;
ALTER TABLE attribute_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE variant_attribute_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

-- Políticas Públicas (LEITURA)
CREATE POLICY "Public read access for categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read access for product_categories" ON product_categories FOR SELECT USING (true);
CREATE POLICY "Public read access for tags" ON tags FOR SELECT USING (true);
CREATE POLICY "Public read access for product_tags" ON product_tags FOR SELECT USING (true);
CREATE POLICY "Public read access for attributes" ON attributes FOR SELECT USING (true);
CREATE POLICY "Public read access for attribute_values" ON attribute_values FOR SELECT USING (true);
CREATE POLICY "Public read access for product_variants" ON product_variants FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access for variant_attribute_values" ON variant_attribute_values FOR SELECT USING (true);
CREATE POLICY "Public read access for inventory" ON inventory FOR SELECT USING (true);

-- Políticas Admin (GERENCIAMENTO)
CREATE POLICY "Admin manage categories" ON categories FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Admin manage product_categories" ON product_categories FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Admin manage tags" ON tags FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Admin manage product_tags" ON product_tags FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Admin manage attributes" ON attributes FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Admin manage attribute_values" ON attribute_values FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Admin manage product_variants" ON product_variants FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Admin manage variant_attribute_values" ON variant_attribute_values FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Admin manage inventory" ON inventory FOR ALL USING (auth.role() = 'service_role');
