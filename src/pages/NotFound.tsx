
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 py-12">
      <h1 className="text-6xl md:text-8xl font-serif mb-4">404</h1>
      <h2 className="text-2xl font-medium mb-8">Page Not Found</h2>
      <p className="text-muted text-center max-w-md mb-10">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <div className="space-y-4 w-full max-w-xs">
        <Link 
          to="/" 
          className="block w-full bg-primary text-white text-center py-3 uppercase text-sm tracking-wider hover:bg-primary/90 transition-colors"
        >
          Return to Home
        </Link>
        <Link 
          to="/all-products" 
          className="block w-full border border-primary text-primary text-center py-3 uppercase text-sm tracking-wider hover:bg-primary hover:text-white transition-colors"
        >
          Browse Collections
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
