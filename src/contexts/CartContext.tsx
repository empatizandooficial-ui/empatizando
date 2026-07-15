import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export interface CartItem {
  id: string; // Used as unique key in the cart (can be product_id or product_id-variant_id)
  product_id?: string; // The actual product UUID
  title: string;
  price: number;
  image_url: string;
  quantity: number;
  variant_id?: string;
  variant_sku?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [authLoaded, setAuthLoaded] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Initial fetch
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id || null);
      setAuthLoaded(true);
    });

    // Listen to changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load from local storage when auth is loaded or user changes
  useEffect(() => {
    if (!authLoaded) return;
    const storageKey = userId ? `empatizando_cart_${userId}` : "empatizando_cart_guest";
    const savedCart = localStorage.getItem(storageKey);
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Error parsing cart data", e);
      }
    } else {
      setCart([]); // clear cart if changing user and they have no cart
    }
  }, [userId, authLoaded]);

  // Save to local storage whenever cart changes
  useEffect(() => {
    if (!authLoaded) return;
    const storageKey = userId ? `empatizando_cart_${userId}` : "empatizando_cart_guest";
    localStorage.setItem(storageKey, JSON.stringify(cart));
  }, [cart, userId, authLoaded]);

  const addToCart = (item: Omit<CartItem, "quantity">) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.id === item.id);
      if (existing) {
        toast({
          title: "Produto atualizado no carrinho",
          description: "Quantidade adicionada com sucesso.",
        });
        return prev.map((p) =>
          p.id === item.id ? { ...p, quantity: p.quantity + 1 } : p
        );
      }
      toast({
        title: "Produto adicionado",
        description: `${item.title} foi adicionado ao seu carrinho.`,
      });
      return [...prev, { ...item, quantity: 1 }];
    });
    setIsCartOpen(true); // Open drawer automatically
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((p) => p.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    setCart((prev) =>
      prev.map((p) => (p.id === id ? { ...p, quantity } : p))
    );
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
