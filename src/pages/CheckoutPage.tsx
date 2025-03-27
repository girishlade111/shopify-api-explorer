
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { formatPrice } from "@/lib/api";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft, CreditCard, Truck, Check } from "lucide-react";

export default function CheckoutPage() {
  const { cart, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<"shipping" | "payment" | "confirmation">("shipping");

  // Form state
  const [shippingInfo, setShippingInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    phone: ""
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: ""
  });

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate shipping info
    if (!shippingInfo.firstName || !shippingInfo.lastName || !shippingInfo.email || 
        !shippingInfo.address || !shippingInfo.city || !shippingInfo.zipCode) {
      toast.error("Please fill in all required fields");
      return;
    }
    setStep("payment");
    window.scrollTo(0, 0);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate payment info
    if (!paymentInfo.cardNumber || !paymentInfo.cardName || !paymentInfo.expiryDate || !paymentInfo.cvv) {
      toast.error("Please fill in all payment details");
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsSubmitting(false);
      setStep("confirmation");
      clearCart();
      window.scrollTo(0, 0);
    }, 1500);
  };

  // If cart is empty and not on confirmation, redirect to cart
  if (cart.length === 0 && step !== "confirmation") {
    return (
      <Layout>
        <div className="container-wide py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <p className="mb-8">Add some items to your cart before proceeding to checkout.</p>
          <Link to="/cart">
            <Button>Go to Cart</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container-wide py-8 md:py-12">
        {/* Checkout header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl md:text-3xl font-bold">Checkout</h1>
            {step !== "confirmation" && (
              <Link to="/cart" className="flex items-center text-sm text-primary">
                <ArrowLeft size={16} className="mr-1" /> Back to cart
              </Link>
            )}
          </div>
          
          {/* Checkout progress */}
          <div className="flex items-center justify-center mb-8 mt-12">
            <div className="flex items-center">
              <div className={`rounded-full h-10 w-10 flex items-center justify-center ${step === "shipping" || step === "payment" || step === "confirmation" ? "bg-primary text-white" : "bg-accent text-muted-foreground"}`}>
                <Truck size={20} />
              </div>
              <div className={`h-1 w-16 md:w-28 ${step === "payment" || step === "confirmation" ? "bg-primary" : "bg-accent"}`}></div>
            </div>
            
            <div className="flex items-center">
              <div className={`rounded-full h-10 w-10 flex items-center justify-center ${step === "payment" || step === "confirmation" ? "bg-primary text-white" : "bg-accent text-muted-foreground"}`}>
                <CreditCard size={20} />
              </div>
              <div className={`h-1 w-16 md:w-28 ${step === "confirmation" ? "bg-primary" : "bg-accent"}`}></div>
            </div>
            
            <div className="flex items-center">
              <div className={`rounded-full h-10 w-10 flex items-center justify-center ${step === "confirmation" ? "bg-primary text-white" : "bg-accent text-muted-foreground"}`}>
                <Check size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* Content based on current step */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {step === "shipping" && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-semibold mb-6">Shipping Information</h2>
                <form onSubmit={handleShippingSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input 
                        id="firstName" 
                        name="firstName" 
                        value={shippingInfo.firstName} 
                        onChange={handleShippingChange} 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input 
                        id="lastName" 
                        name="lastName" 
                        value={shippingInfo.lastName} 
                        onChange={handleShippingChange} 
                        required 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      value={shippingInfo.email} 
                      onChange={handleShippingChange} 
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <Label htmlFor="address">Address *</Label>
                    <Textarea 
                      id="address" 
                      name="address" 
                      value={shippingInfo.address} 
                      onChange={handleShippingChange} 
                      required 
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input 
                        id="city" 
                        name="city" 
                        value={shippingInfo.city} 
                        onChange={handleShippingChange} 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State/Province</Label>
                      <Input 
                        id="state" 
                        name="state" 
                        value={shippingInfo.state} 
                        onChange={handleShippingChange} 
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">Zip/Postal Code *</Label>
                      <Input 
                        id="zipCode" 
                        name="zipCode" 
                        value={shippingInfo.zipCode} 
                        onChange={handleShippingChange} 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country *</Label>
                      <Input 
                        id="country" 
                        name="country" 
                        value={shippingInfo.country} 
                        onChange={handleShippingChange} 
                        required 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-6">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone" 
                      name="phone" 
                      type="tel" 
                      value={shippingInfo.phone} 
                      onChange={handleShippingChange} 
                    />
                  </div>
                  
                  <Button type="submit" className="w-full md:w-auto">
                    Continue to Payment
                  </Button>
                </form>
              </div>
            )}
            
            {step === "payment" && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-semibold mb-6">Payment Information</h2>
                <form onSubmit={handlePaymentSubmit}>
                  <div className="space-y-2 mb-4">
                    <Label htmlFor="cardNumber">Card Number *</Label>
                    <Input 
                      id="cardNumber" 
                      name="cardNumber" 
                      placeholder="0000 0000 0000 0000" 
                      value={paymentInfo.cardNumber} 
                      onChange={handlePaymentChange} 
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <Label htmlFor="cardName">Name on Card *</Label>
                    <Input 
                      id="cardName" 
                      name="cardName" 
                      value={paymentInfo.cardName} 
                      onChange={handlePaymentChange} 
                      required 
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="space-y-2">
                      <Label htmlFor="expiryDate">Expiry Date (MM/YY) *</Label>
                      <Input 
                        id="expiryDate" 
                        name="expiryDate" 
                        placeholder="MM/YY" 
                        value={paymentInfo.expiryDate} 
                        onChange={handlePaymentChange} 
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV *</Label>
                      <Input 
                        id="cvv" 
                        name="cvv" 
                        placeholder="123" 
                        value={paymentInfo.cvv} 
                        onChange={handlePaymentChange} 
                        required 
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setStep("shipping")}
                    >
                      Back
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Processing..." : "Place Order"}
                    </Button>
                  </div>
                </form>
              </div>
            )}
            
            {step === "confirmation" && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check size={32} className="text-green-600" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Order Confirmed!</h2>
                <p className="text-muted-foreground mb-6">
                  Thank you for your purchase. We've sent a confirmation email to {shippingInfo.email}.
                </p>
                <p className="mb-6">
                  Your order will be shipped to {shippingInfo.address}, {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}, {shippingInfo.country}.
                </p>
                <Button onClick={() => navigate("/")} className="mx-auto">
                  Continue Shopping
                </Button>
              </div>
            )}
          </div>
          
          <div className="col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 sticky top-24">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              
              {step !== "confirmation" && (
                <div className="mb-4 max-h-[300px] overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.id} className="flex py-2 border-b border-gray-100 last:border-0">
                      <div className="w-16 h-16 bg-accent rounded overflow-hidden mr-3 flex-shrink-0">
                        <img 
                          src={item.product.images?.[0]?.src || '/placeholder.svg'} 
                          alt={item.product.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-grow">
                        <div className="font-medium line-clamp-1">{item.product.title}</div>
                        <div className="text-sm text-muted-foreground">{item.variant.title}</div>
                        <div className="text-sm">
                          {item.quantity} × {formatPrice(item.variant.price)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(getCartTotal().toString())}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{step === "confirmation" ? formatPrice("5.99") : "Calculated at next step"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span>{step === "confirmation" ? formatPrice((getCartTotal() * 0.0825).toString()) : "Calculated at next step"}</span>
                </div>
              </div>
              
              <div className="border-t border-gray-100 pt-4">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  {step === "confirmation" 
                    ? <span>{formatPrice((getCartTotal() + 5.99 + (getCartTotal() * 0.0825)).toString())}</span>
                    : <span>{formatPrice(getCartTotal().toString())}</span>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
