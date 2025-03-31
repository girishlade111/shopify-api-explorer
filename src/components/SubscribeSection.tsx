
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";

export function SubscribeSection() {
  const [email, setEmail] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address.",
        variant: "destructive"
      });
      return;
    }
    
    // Here you would typically send this to your API
    console.log("Subscribing email:", email);
    
    toast({
      title: "Thank you for subscribing!",
      description: "You'll receive our latest updates and exclusive offers.",
    });
    
    setEmail("");
  };
  
  return (
    <section className="py-24 bg-primary text-white">
      <div className="container-wide">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-serif mb-4">Join Our Community</h2>
          <p className="text-white/80 mb-10 text-lg">
            Subscribe to our newsletter and be the first to know about new collections, 
            exclusive events, and special offers.
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="bg-white/10 border border-white/20 text-white px-6 py-3 flex-grow focus:outline-none focus:ring-2 focus:ring-white/30"
              aria-label="Email address"
            />
            <button 
              type="submit"
              className="bg-white text-primary px-8 py-3 uppercase text-sm tracking-wider font-medium hover:bg-white/90 transition-colors"
            >
              Subscribe
            </button>
          </form>
          
          <p className="mt-4 text-white/60 text-sm">
            By subscribing, you agree to our privacy policy and consent to receive updates from our company.
          </p>
        </div>
      </div>
    </section>
  );
}
