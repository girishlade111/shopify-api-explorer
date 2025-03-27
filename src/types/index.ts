
export interface Product {
  id: number;
  title: string;
  handle: string;
  body_html: string;
  vendor: string;
  product_category?: string;
  images: ProductImage[];
  variants: ProductVariant[];
  options: ProductOption[];
}

export interface ProductImage {
  id: number;
  product_id: number;
  position: number;
  src: string;
  alt?: string;
  width?: number;
  height?: number;
}

export interface ProductVariant {
  id: number;
  product_id: number;
  title: string;
  price: string;
  sku: string;
  position: number;
  compare_at_price: string | null;
  option1: string | null;
  option2: string | null;
  option3: string | null;
  available: boolean;
}

export interface ProductOption {
  id: number;
  product_id: number;
  name: string;
  position: number;
  values: string[];
}

export interface Category {
  name: string;
  full_path: string;
  count: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  pages: number;
  page: number;
  size: number;
}

export interface SearchSuggestion {
  text: string;
  type: string;
  count: number;
}

export interface SearchSuggestionsResponse {
  suggestions: SearchSuggestion[];
}

export interface ApiErrorResponse {
  detail: string;
}
