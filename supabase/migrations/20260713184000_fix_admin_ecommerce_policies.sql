-- Fix RLS policies that incorrectly restricted admin operations to service_role

-- Products
DROP POLICY IF EXISTS "Admins can manage products" ON public.products;
CREATE POLICY "Admins can manage products" 
  ON public.products FOR ALL TO authenticated 
  USING (public.has_role(auth.uid(), 'admin')) 
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Categories
DROP POLICY IF EXISTS "Admin manage categories" ON public.categories;
CREATE POLICY "Admins can manage categories" 
  ON public.categories FOR ALL TO authenticated 
  USING (public.has_role(auth.uid(), 'admin')) 
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Product Categories
DROP POLICY IF EXISTS "Admin manage product_categories" ON public.product_categories;
CREATE POLICY "Admins can manage product_categories" 
  ON public.product_categories FOR ALL TO authenticated 
  USING (public.has_role(auth.uid(), 'admin')) 
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Tags
DROP POLICY IF EXISTS "Admin manage tags" ON public.tags;
CREATE POLICY "Admins can manage tags" 
  ON public.tags FOR ALL TO authenticated 
  USING (public.has_role(auth.uid(), 'admin')) 
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Product Tags
DROP POLICY IF EXISTS "Admin manage product_tags" ON public.product_tags;
CREATE POLICY "Admins can manage product_tags" 
  ON public.product_tags FOR ALL TO authenticated 
  USING (public.has_role(auth.uid(), 'admin')) 
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Attributes
DROP POLICY IF EXISTS "Admin manage attributes" ON public.attributes;
CREATE POLICY "Admins can manage attributes" 
  ON public.attributes FOR ALL TO authenticated 
  USING (public.has_role(auth.uid(), 'admin')) 
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Attribute Values
DROP POLICY IF EXISTS "Admin manage attribute_values" ON public.attribute_values;
CREATE POLICY "Admins can manage attribute_values" 
  ON public.attribute_values FOR ALL TO authenticated 
  USING (public.has_role(auth.uid(), 'admin')) 
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Product Variants
DROP POLICY IF EXISTS "Admin manage product_variants" ON public.product_variants;
CREATE POLICY "Admins can manage product_variants" 
  ON public.product_variants FOR ALL TO authenticated 
  USING (public.has_role(auth.uid(), 'admin')) 
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Variant Attribute Values
DROP POLICY IF EXISTS "Admin manage variant_attribute_values" ON public.variant_attribute_values;
CREATE POLICY "Admins can manage variant_attribute_values" 
  ON public.variant_attribute_values FOR ALL TO authenticated 
  USING (public.has_role(auth.uid(), 'admin')) 
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Inventory
DROP POLICY IF EXISTS "Admin manage inventory" ON public.inventory;
CREATE POLICY "Admins can manage inventory" 
  ON public.inventory FOR ALL TO authenticated 
  USING (public.has_role(auth.uid(), 'admin')) 
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
