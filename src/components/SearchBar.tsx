
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getSearchSuggestions } from "@/lib/api";
import { SearchSuggestion } from "@/types";
import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  className?: string;
  placeholder?: string;
  autoFocus?: boolean;
}

export function SearchBar({ 
  className, 
  placeholder = "Search products...",
  autoFocus = false
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Fetch suggestions when debounced query changes
  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      setIsLoading(true);
      
      const fetchSuggestions = async () => {
        try {
          const data = await getSearchSuggestions(debouncedQuery);
          setSuggestions(data.suggestions);
        } catch (error) {
          console.error("Failed to fetch search suggestions:", error);
          setSuggestions([]);
        } finally {
          setIsLoading(false);
        }
      };

      fetchSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [debouncedQuery]);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current && 
        inputRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle search submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?query=${encodeURIComponent(query.trim())}`);
      setIsFocused(false);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    if (suggestion.type === "category") {
      navigate(`/categories/${suggestion.text.toLowerCase().replace(/\s+/g, "-")}`);
    } else {
      navigate(`/search?query=${encodeURIComponent(suggestion.text)}`);
    }
    setIsFocused(false);
    setQuery("");
  };

  // Clear search input
  const clearSearch = () => {
    setQuery("");
    inputRef.current?.focus();
  };

  return (
    <div className={cn("relative", className)}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder={placeholder}
            className="w-full bg-accent rounded-md py-2 pl-10 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
            autoFocus={autoFocus}
          />
          
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-muted" />
          </div>
          
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 flex items-center pr-3"
            >
              <X className="h-4 w-4 text-muted hover:text-dark transition-colors" />
            </button>
          )}
        </div>
      </form>
      
      {/* Suggestions dropdown */}
      {isFocused && debouncedQuery.length >= 2 && (
        <div
          ref={suggestionsRef}
          className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-medium border border-gray-100 py-2 max-h-60 overflow-auto animate-scale-up origin-top"
        >
          {isLoading ? (
            <div className="px-4 py-2 text-center">
              <div className="inline-block h-4 w-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin mr-2" />
              <span className="text-sm text-muted">Searching...</span>
            </div>
          ) : suggestions.length > 0 ? (
            suggestions.map((suggestion, index) => (
              <button
                key={`${suggestion.type}-${index}`}
                className="w-full text-left px-4 py-2 hover:bg-accent flex items-center justify-between transition-colors"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <span className="font-medium">{suggestion.text}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-accent text-muted">
                  {suggestion.type === "category" ? "Category" : "Product"}
                </span>
              </button>
            ))
          ) : (
            <div className="px-4 py-2 text-sm text-muted">
              No results found for "{debouncedQuery}"
            </div>
          )}
          
          <div className="border-t border-gray-100 mt-2 pt-2 px-4">
            <button
              onClick={handleSubmit}
              className="w-full text-center text-sm text-primary hover:underline py-1"
            >
              Search for "{debouncedQuery}"
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
