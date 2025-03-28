
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatPrice } from "@/lib/api";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Check } from "lucide-react";

export default function CheckoutPage() {
  const { cart, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderDetails, setOrderDetails] = useState({
    orderNumber: "",
    total: 0,
  });

  // Pre-filled mock data
  const [formData, setFormData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    mobileNumber: "+44 7911 123456", // Added mobile number with UK format
    address: "123 Main Street",
    city: "New York",
    zipCode: "10001",
    cardNumber: "4242 4242 4242 4242",
    cardExpiry: "12/25",
    cardCvv: "123"
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const sendOrderConfirmationSMS = async (phoneNumber: string, orderNumber: string) => {
    try {
      // Only send SMS if the phone number has been changed from the mock data
      if (phoneNumber !== "+44 7911 123456") {
        const response = await fetch("https://voice-conversation-engine.dev.appellatech.net/twilio/send_sms", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to_number: phoneNumber,
            message_body: `Thank you for your order! Your order #${orderNumber} has been confirmed. - Appella`
          }),
        });
        
        const data = await response.json();
        
        if (data.error) {
          console.error("SMS sending failed:", data.error);
        } else {
          console.log("SMS sent successfully:", data);
        }
      }
    } catch (error) {
      console.error("Error sending SMS:", error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.address || 
        !formData.city || !formData.zipCode || !formData.cardNumber || !formData.mobileNumber) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate processing payment
    setTimeout(() => {
      setIsSubmitting(false);
      
      // Generate random order number
      const orderNumber = `ORD-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
      
      setOrderDetails({
        orderNumber,
        total: getCartTotal()
      });
      
      setOrderComplete(true);
      
      // Send SMS confirmation if the user provided a real mobile number
      sendOrderConfirmationSMS(formData.mobileNumber, orderNumber);
      
      // Clear the cart
      clearCart();
      
      window.scrollTo(0, 0);
    }, 1000);
  };

  // If cart is empty and order not complete, redirect to cart
  if (cart.length === 0 && !orderComplete) {
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
      <div className="container-wide max-w-4xl mx-auto py-8 md:py-12">
        {orderComplete ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 md:p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check size={32} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Thank You for Your Purchase!</h2>
            <p className="text-muted-foreground mb-6">
              Your order #{orderDetails.orderNumber} has been confirmed.
            </p>
            
            <div className="mb-8 max-w-md mx-auto">
              <div className="border border-gray-100 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-lg mb-2">Order Summary</h3>
                <div className="flex justify-between mb-2">
                  <span>Total:</span>
                  <span className="font-medium">{formatPrice(orderDetails.total.toString())}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Shipping:</span>
                  <span className="font-medium">Free</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Grand Total:</span>
                    <span className="font-medium">{formatPrice(orderDetails.total.toString())}</span>
                  </div>
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground mb-6">
                A confirmation email has been sent to {formData.email}
                {formData.mobileNumber !== "+44 7911 123456" && (
                  <div className="mt-1">
                    A confirmation SMS has been sent to {formData.mobileNumber}
                  </div>
                )}
              </div>
            </div>
            
            <Button onClick={() => navigate("/")} className="mx-auto">
              Continue Shopping
            </Button>
          </div>
        ) : (
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-8 text-center">Express Checkout</h1>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-6 mb-6">
                  {/* Customer Information */}
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
                    <div className="grid grid-cols-1 gap-4 mb-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input 
                          id="name" 
                          name="name" 
                          value={formData.name} 
                          onChange={handleChange} 
                          required 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="mobileNumber">Mobile Number *</Label>
                        <Input 
                          id="mobileNumber" 
                          name="mobileNumber" 
                          type="tel" 
                          value={formData.mobileNumber} 
                          onChange={handleChange} 
                          required 
                          placeholder="+1 (234) 567-8901"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input 
                          id="email" 
                          name="email" 
                          type="email" 
                          value={formData.email} 
                          onChange={handleChange} 
                          required 
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Shipping Information */}
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="address">Address *</Label>
                        <Input 
                          id="address" 
                          name="address" 
                          value={formData.address} 
                          onChange={handleChange} 
                          required 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="city">City *</Label>
                        <Input 
                          id="city" 
                          name="city" 
                          value={formData.city} 
                          onChange={handleChange} 
                          required 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="zipCode">Zip Code *</Label>
                        <Input 
                          id="zipCode" 
                          name="zipCode" 
                          value={formData.zipCode} 
                          onChange={handleChange} 
                          required 
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Payment Information */}
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number *</Label>
                        <Input 
                          id="cardNumber" 
                          name="cardNumber"
                          value={formData.cardNumber} 
                          onChange={handleChange} 
                          required 
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="cardExpiry">Expiry Date *</Label>
                          <Input 
                            id="cardExpiry" 
                            name="cardExpiry" 
                            value={formData.cardExpiry} 
                            onChange={handleChange} 
                            placeholder="MM/YY" 
                            required 
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="cardCvv">CVV *</Label>
                          <Input 
                            id="cardCvv" 
                            name="cardCvv" 
                            value={formData.cardCvv} 
                            onChange={handleChange} 
                            placeholder="123" 
                            required 
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Order Summary */}
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                    <div className="border-t border-b py-4 space-y-3 mb-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal ({cart.length} items)</span>
                        <span>{formatPrice(getCartTotal().toString())}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Shipping</span>
                        <span>Free</span>
                      </div>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>{formatPrice(getCartTotal().toString())}</span>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full mt-4"
                  >
                    {isSubmitting ? "Processing..." : "Complete Purchase"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
