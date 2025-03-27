
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FittingRoom } from "@/components/icons";

export default function FittingRoomPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleTryOn = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  return (
    <Layout>
      <div className="container-wide py-12">
        <div className="flex flex-col items-center text-center mb-12">
          <FittingRoom className="h-16 w-16 text-primary mb-4" />
          <h1 className="text-4xl font-bold mb-4">Virtual Fitting Room</h1>
          <p className="text-lg text-muted max-w-2xl">
            Try on clothes virtually before making a purchase. Upload your photo or choose from our models.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
              <CardDescription>Our virtual fitting room technology makes online shopping easier.</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="space-y-4">
                <li className="flex gap-4">
                  <div className="bg-primary/10 rounded-full h-8 w-8 flex items-center justify-center text-primary font-semibold shrink-0">1</div>
                  <div>
                    <h3 className="font-medium mb-1">Select Your Items</h3>
                    <p className="text-muted">Browse our collection and select the items you'd like to try on.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="bg-primary/10 rounded-full h-8 w-8 flex items-center justify-center text-primary font-semibold shrink-0">2</div>
                  <div>
                    <h3 className="font-medium mb-1">Upload Your Photo</h3>
                    <p className="text-muted">Upload a full-body photo or choose from our models.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="bg-primary/10 rounded-full h-8 w-8 flex items-center justify-center text-primary font-semibold shrink-0">3</div>
                  <div>
                    <h3 className="font-medium mb-1">See How It Fits</h3>
                    <p className="text-muted">Our AI will show you how the items would look on you.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="bg-primary/10 rounded-full h-8 w-8 flex items-center justify-center text-primary font-semibold shrink-0">4</div>
                  <div>
                    <h3 className="font-medium mb-1">Make Your Decision</h3>
                    <p className="text-muted">Purchase with confidence knowing how the items will fit.</p>
                  </div>
                </li>
              </ol>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden">
            <CardHeader>
              <CardTitle>Try It Now</CardTitle>
              <CardDescription>
                Our virtual fitting room is coming soon! Be among the first to experience it.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="relative bg-accent rounded-lg w-full h-64 mb-6 flex items-center justify-center">
                <div className="text-center">
                  <FittingRoom className="h-12 w-12 mx-auto mb-4 text-muted" />
                  <p className="text-muted">Preview will appear here</p>
                </div>
              </div>
              <Button 
                className="w-full" 
                onClick={handleTryOn}
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Try On (Coming Soon)"}
              </Button>
              <p className="text-xs text-muted mt-4">
                This feature is currently in development. Check back soon!
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 bg-accent rounded-lg p-8 text-center max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Join Our Beta Program</h2>
          <p className="mb-6">
            Be among the first to experience our virtual fitting room technology. Sign up for our beta program and get early access.
          </p>
          <div className="flex max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-2 rounded-l-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <Button className="rounded-l-none">Join Beta</Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
