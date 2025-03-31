import { useCart, CartItem } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { formatPrice } from "@/lib/api";
import { toast } from "sonner";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();
  
  return (
    <div className="container-wide py-8 md:py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">Shopping Cart</h1>
        
        {cart.length > 0 && (
          <Button 
            variant="outline" 
            onClick={clearCart}
            className="flex items-center gap-2"
          >
            <Trash2 size={16} />
            Clear Cart
          </Button>
        )}
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-16 bg-accent/50 rounded-lg">
          <h2 className="text-xl font-medium mb-4">Your cart is empty</h2>
          <p className="text-muted mb-8 max-w-md mx-auto">
            Looks like you haven't added any products to your cart yet.
          </p>
          <Link to="/">
            <Button>
              Start Shopping
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100">
              <ul className="divide-y divide-gray-100">
                {cart.map((item) => (
                  <CartItemRow 
                    key={item.id} 
                    item={item}
                    onRemove={() => removeFromCart(item.id)}
                    onUpdateQuantity={(qty) => updateQuantity(item.id, qty)}
                  />
                ))}
              </ul>
            </div>
          </div>
          
          <div className="col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-muted">Subtotal</span>
                  <span>{formatPrice(getCartTotal().toString())}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Tax</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>
              
              <div className="border-t border-gray-100 pt-4 mb-6">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(getCartTotal().toString())}</span>
                </div>
              </div>
              
              <Link to="/checkout">
                <Button 
                  className="w-full mb-4 flex items-center justify-center gap-2"
                >
                  Proceed to Checkout <ArrowRight size={16} />
                </Button>
              </Link>
              
              <Link to="/">
                <Button variant="outline" className="w-full">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CartItemRow({ 
  item, 
  onRemove, 
  onUpdateQuantity 
}: { 
  item: CartItem; 
  onRemove: () => void; 
  onUpdateQuantity: (quantity: number) => void; 
}) {
  return (
    <li className="p-4 sm:p-6 flex flex-col sm:flex-row items-start gap-4">
      <div className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 bg-accent rounded overflow-hidden">
        <Link to={`/products/${item.product.handle}`}>
          <img 
            src={item.product.images?.[0]?.src || '/placeholder.svg'} 
            alt={item.product.title}
            className="w-full h-full object-cover"
          />
        </Link>
      </div>
      
      <div className="flex-grow">
        <div className="flex flex-col sm:flex-row sm:justify-between mb-2">
          <div>
            <Link to={`/products/${item.product.handle}`} className="font-medium hover:text-primary">
              {item.product.title}
            </Link>
            <p className="text-sm text-muted">{item.variant.title}</p>
          </div>
          <div className="font-semibold mt-1 sm:mt-0">
            {formatPrice(item.variant.price)}
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center border border-gray-200 rounded">
            <button 
              onClick={() => onUpdateQuantity(item.quantity - 1)}
              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-primary"
              aria-label="Decrease quantity"
            >
              <Minus size={16} />
            </button>
            <span className="w-10 text-center">{item.quantity}</span>
            <button 
              onClick={() => onUpdateQuantity(item.quantity + 1)}
              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-primary"
              aria-label="Increase quantity"
            >
              <Plus size={16} />
            </button>
          </div>
          
          <button 
            onClick={onRemove}
            className="text-gray-500 hover:text-red-600 focus:outline-none"
            aria-label="Remove item"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </li>
  );
}
