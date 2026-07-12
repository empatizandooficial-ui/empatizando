-- Create Products Table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  cost_price NUMERIC(10, 2) NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Affiliates Table
CREATE TABLE affiliates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  referral_code TEXT UNIQUE NOT NULL,
  balance NUMERIC(10, 2) DEFAULT 0.00,
  pix_key TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Orders Table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE RESTRICT,
  affiliate_id UUID REFERENCES affiliates(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'shipped', 'cancelled')),
  amount_total NUMERIC(10, 2) NOT NULL,
  commission_amount NUMERIC(10, 2) DEFAULT 0.00,
  metadata JSONB DEFAULT '{}'::jsonb, -- Store size preference (e.g., Ultra Compacto)
  asaas_payment_id TEXT, -- To link with Asaas Webhook
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Affiliate Clicks / Views (Optional, for tracking)
CREATE TABLE affiliate_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID REFERENCES affiliates(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- RPC to process commission on paid order
CREATE OR REPLACE FUNCTION process_affiliate_commission(order_id UUID)
RETURNS void AS $$
DECLARE
  v_affiliate_id UUID;
  v_commission NUMERIC;
BEGIN
  -- Get the order details
  SELECT affiliate_id, commission_amount INTO v_affiliate_id, v_commission
  FROM orders WHERE id = order_id AND status = 'paid';
  
  -- If affiliate exists, add balance
  IF v_affiliate_id IS NOT NULL AND v_commission > 0 THEN
    UPDATE affiliates
    SET balance = balance + v_commission
    WHERE id = v_affiliate_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS Policies
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Products are viewable by everyone" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage products" ON products FOR ALL USING (auth.role() = 'service_role');

ALTER TABLE affiliates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own affiliate profile" ON affiliates FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own affiliate pix key" ON affiliates FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can insert own affiliate profile" ON affiliates FOR INSERT WITH CHECK (auth.uid() = user_id);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Affiliates can view own orders" ON orders FOR SELECT USING (
  affiliate_id IN (SELECT id FROM affiliates WHERE user_id = auth.uid())
);
-- Allow public insert for checkout form (unauthenticated users buying)
CREATE POLICY "Anyone can create orders" ON orders FOR INSERT WITH CHECK (true);
