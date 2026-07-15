import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCart } from "@/contexts/CartContext";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, cartTotal } = useCart();

  const handleCheckout = () => {
    // Navigate to checkout or open Asaas payment directly
    // This will be implemented in the checkout flow
    window.location.href = "/checkout"; // Placeholder for now, later we integrate with Asaas
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className="w-full sm:max-w-md flex flex-col h-full bg-background/95 backdrop-blur-xl border-l-border">
        <SheetHeader className="pb-4">
          <SheetTitle className="flex items-center gap-2 font-heading text-2xl">
            <ShoppingBag className="w-6 h-6 text-primary" />
            Seu Carrinho
          </SheetTitle>
          <SheetDescription>
            {cart.length === 0 
              ? "Seu carrinho está vazio no momento." 
              : "Revise seus itens e prossiga para o checkout."}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-hidden">
          {cart.length > 0 ? (
            <ScrollArea className="h-full pr-4">
              <div className="space-y-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center bg-card p-3 rounded-lg border border-border shadow-sm">
                    {item.image_url ? (
                      <div className="w-20 h-20 rounded-md bg-muted overflow-hidden flex-shrink-0">
                        <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-20 h-20 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
                        <ShoppingBag className="w-8 h-8 text-muted-foreground opacity-20" />
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm line-clamp-2">{item.title} {item.variant_sku && <span className="text-xs text-muted-foreground font-normal ml-1">({item.variant_sku})</span>}</h4>
                      {item.custom_text && <p className="text-xs text-indigo-600 mt-1 italic">Detalhes: {item.custom_text}</p>}
                      <p className="font-bold text-primary mt-1">
                        R$ {item.price.toFixed(2).replace('.', ',')}
                      </p>
                      
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center border rounded-md bg-background">
                          <button 
                            className="p-1 hover:bg-muted transition-colors rounded-l-md"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <button 
                            className="p-1 hover:bg-muted transition-colors rounded-r-md"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-destructive hover:bg-destructive/10 p-1.5 rounded-md transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground space-y-4 opacity-50">
              <ShoppingBag className="w-16 h-16" />
              <p>Comece a explorar nossos produtos</p>
              <Button variant="outline" onClick={() => setIsCartOpen(false)}>
                Voltar à Loja
              </Button>
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="pt-6 border-t mt-auto">
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Frete</span>
                <span className="text-muted-foreground italic">Calculado no checkout</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center font-bold text-lg">
                <span>Total</span>
                <span className="text-primary">R$ {cartTotal.toFixed(2).replace('.', ',')}</span>
              </div>
            </div>
            
            <Button className="w-full font-bold text-lg py-6 shadow-xl" onClick={handleCheckout}>
              Finalizar Compra
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
