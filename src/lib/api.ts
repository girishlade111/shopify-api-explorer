
import { Category, PaginatedResponse, Product, SearchSuggestionsResponse } from "@/types";

const API_BASE_URL = "https://shopifyproducts.ngrok.io";

// Utility to handle API errors
const handleApiResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "An error occurred");
  }
  return response.json() as Promise<T>;
};

// Product API
export const getProducts = async (
  page = 1, 
  size = 12, 
  sortBy?: string, 
  sortOrder?: string
): Promise<PaginatedResponse<Product>> => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });
  
  if (sortBy) params.append("sort_by", sortBy);
  if (sortOrder) params.append("sort_order", sortOrder);
  
  const response = await fetch(`${API_BASE_URL}/store/products?${params}`);
  return handleApiResponse<PaginatedResponse<Product>>(response);
};

export const getNewArrivals = async (
  page = 1,
  size = 12,
  sortBy?: string,
  sortOrder?: string
): Promise<PaginatedResponse<Product>> => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });
  
  if (sortBy) params.append("sort_by", sortBy);
  if (sortOrder) params.append("sort_order", sortOrder);
  
  const response = await fetch(`${API_BASE_URL}/store/new-arrivals?${params}`);
  return handleApiResponse<PaginatedResponse<Product>>(response);
};

export const getProductByHandle = async (handle: string): Promise<Product> => {
  const response = await fetch(`${API_BASE_URL}/store/products/${handle}`);
  return handleApiResponse<Product>(response);
};

// Category API
export const getCategories = async (limit = 10): Promise<Category[]> => {
  const params = new URLSearchParams({
    limit: limit.toString(),
  });
  
  const response = await fetch(`${API_BASE_URL}/store/categories?${params}`);
  return handleApiResponse<Category[]>(response);
};

export const getProductsByCategory = async (
  categoryName: string,
  page = 1,
  size = 12,
  sortBy?: string,
  sortOrder?: string
): Promise<PaginatedResponse<Product>> => {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });
  
  if (sortBy) params.append("sort_by", sortBy);
  if (sortOrder) params.append("sort_order", sortOrder);
  
  const response = await fetch(`${API_BASE_URL}/store/categories/${encodeURIComponent(categoryName)}/products?${params}`);
  return handleApiResponse<PaginatedResponse<Product>>(response);
};

// Search API
export const searchProducts = async (
  query: string,
  category?: string,
  minPrice?: number,
  maxPrice?: number,
  sortBy?: string,
  sortOrder?: string,
  page = 1,
  size = 12
): Promise<PaginatedResponse<Product>> => {
  const params = new URLSearchParams({
    query,
    page: page.toString(),
    size: size.toString(),
  });
  
  if (category) params.append("category", category);
  if (minPrice !== undefined) params.append("min_price", minPrice.toString());
  if (maxPrice !== undefined) params.append("max_price", maxPrice.toString());
  if (sortBy) params.append("sort_by", sortBy);
  if (sortOrder) params.append("sort_order", sortOrder);
  
  const response = await fetch(`${API_BASE_URL}/store/search?${params}`);
  return handleApiResponse<PaginatedResponse<Product>>(response);
};

export const getSearchSuggestions = async (
  query: string, 
  limit = 5
): Promise<SearchSuggestionsResponse> => {
  const params = new URLSearchParams({
    query,
    limit: limit.toString(),
  });
  
  const response = await fetch(`${API_BASE_URL}/store/search/suggestions?${params}`);
  return handleApiResponse<SearchSuggestionsResponse>(response);
};

// Helper function to get a formatted price
export const formatPrice = (price: string): string => {
  const numPrice = parseFloat(price);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(numPrice);
};

// Helper to extract first image from product
export const getProductThumbnail = (product: Product): string => {
  if (product.images && product.images.length > 0) {
    return product.images[0].src;
  }
  return 'https://placehold.co/600x800/f5f5f7/1d1d1f?text=No+Image';
};

// Helper to get the lowest price of product variants
export const getLowestPrice = (product: Product): string => {
  if (product.variants && product.variants.length > 0) {
    const prices = product.variants.map(variant => parseFloat(variant.price));
    const lowestPrice = Math.min(...prices);
    return formatPrice(lowestPrice.toString());
  }
  return 'Price unavailable';
};
