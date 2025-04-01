import { useRef } from "react";
import { ServerEvent, SessionStatus } from "../types";
import { useTranscript } from "../contexts/TranscriptContext";
import { useEvent } from "../contexts/EventContext";
import { useFittingRoom } from "@/contexts/FittingRoomContext";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";

// Default values for environment variables
const DEFAULT_NGROK_URL = "https://voice-conversation-engine.dev.appellatech.net";
const DEFAULT_STORE_URL = "appella-test.myshopify.com";

// Use environment variables or fallback to defaults
const NGROK_URL = import.meta.env.VITE_NGROK_URL || DEFAULT_NGROK_URL;
const STORE_URL = import.meta.env.VITE_STORE_URL || DEFAULT_STORE_URL;

interface ProductVariant {
  title: string;
  price: number;
  image_url: string;
  link: string;
  product_id: number;
  variant_id: number;
}

interface GetVariantsResponse {
  context: string;
  artifact: {
    [key: string]: ProductVariant;
  };
}

interface CartItem {
  product: {
    product_id: number;
    size?: string | number | null;
    color?: string | null;
  };
  quantity: number;
}

export interface UseHandleServerEventParams {
  setSessionStatus: (status: SessionStatus) => void;
  sendClientEvent: (eventObj: any, eventNameSuffix?: string) => void;
  shouldForceResponse?: boolean;
}

export function useHandleServerEvent({
  setSessionStatus,
  sendClientEvent,
}: UseHandleServerEventParams) {
  const {
    transcriptItems,
    addTranscriptBreadcrumb,
    addTranscriptMessage,
    updateTranscriptMessage,
    updateTranscriptItemStatus,
  } = useTranscript();
  const { logServerEvent } = useEvent();
  const fittingRoom = useFittingRoom();
  const navigate = useNavigate();
  const cart = useCart();
  const wishlist = useWishlist();
  const currentSessionId = useRef<string | null>(null);

  const fns = {
    get_page_HTML: () => {
      return { success: true, html: document.documentElement.outerHTML };
    },
    navigate_to_product: async ({ product_id, color, size, sessionId }: { 
      product_id: number;
      color?: string | null;
      size?: string | number | null;
      sessionId: string;
    }) => {
      try {
        const response = await fetch(`${NGROK_URL}/api/${STORE_URL}/${sessionId}/get_variants`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            products_list: {
              products: [{
                product_id,
                color,
                size
              }]
            },
            max_variants: 1
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        const productInfo = data.artifact?.[product_id];
        if (!productInfo?.link) {
          throw new Error("No link found for the specified product variant");
        }

        const urlParts = productInfo.link.split('/products/');
        let productHandle = '';
        
        if (urlParts.length > 1) {
          productHandle = urlParts[1].split('?')[0];
        }
        
        if (!productHandle) {
          throw new Error("Could not extract product handle from link");
        }

        navigate(`/products/${productHandle}`);

        return {
          success: true,
          handle: productHandle,
          sessionId
        };
      } catch (error) {
        console.error("Error navigating to product:", error);
        return {
          success: false,
          error: error instanceof Error ? error.message : "Failed to navigate to product",
          sessionId
        };
      }
    },
    navigate_to_cart: () => {
      try {
        navigate('/cart');
        return { success: true };
      } catch (error) {
        console.error("Error navigating to cart:", error);
        return { 
          success: false, 
          error: error instanceof Error ? error.message : "Failed to navigate to cart" 
        };
      }
    },
    navigate_to_wishlist: () => {
      try {
        navigate('/wishlist');
        return { success: true };
      } catch (error) {
        console.error("Error navigating to wishlist:", error);
        return { 
          success: false, 
          error: error instanceof Error ? error.message : "Failed to navigate to wishlist" 
        };
      }
    },
    clear_cart: () => {
      try {
        cart.clearCart();
        return { 
          success: true,
          message: "Cart has been cleared successfully" 
        };
      } catch (error) {
        console.error("Error clearing cart:", error);
        return { 
          success: false, 
          error: error instanceof Error ? error.message : "Failed to clear cart" 
        };
      }
    },
    clear_wishlist: () => {
      try {
        wishlist.clearWishlist();
        return { 
          success: true,
          message: "Wishlist has been cleared successfully" 
        };
      } catch (error) {
        console.error("Error clearing wishlist:", error);
        return { 
          success: false, 
          error: error instanceof Error ? error.message : "Failed to clear wishlist" 
        };
      }
    },
    search_products: async ({ queries, sessionId, price_range }: { queries: string[], sessionId: string, price_range?: [number, number] }) => {
      try {
        console.log("sessionId", sessionId);
        const response = await fetch(`${NGROK_URL}/api/${STORE_URL}/${sessionId}/search_products`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            queries, 
            price_range: price_range ? [
              parseFloat(price_range[0].toString()),
              parseFloat(price_range[1].toString())
            ] : undefined 
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return {
          success: true,
          ...data,
          sessionId
        };
      } catch (error) {
        console.error("Error searching products:", error);
        return {
          success: false,
          error: error instanceof Error ? error.message : "Failed to search products",
          sessionId
        };
      }
    },
    display_products: async ({ products_list, sessionId, max_variants = 6 }: { 
      products_list: {
        products: Array<{
          product_id: number;
          size?: string | number | null;
          color?: string | null;
        }>;
      };
      sessionId: string;
      max_variants?: number;
    }) => {
      try {
        if (!products_list?.products || !Array.isArray(products_list.products) || products_list.products.length === 0) {
          return {
            success: false,
            error: "No products provided",
            sessionId
          };
        }

        const response = await fetch(`${NGROK_URL}/api/${STORE_URL}/${sessionId}/get_variants`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            products_list,
            max_variants 
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json() as GetVariantsResponse;
        
        const variants_info = Object.values(data.artifact || {}).map(product => ({
          title: product.title,
          price: product.price,
          image_url: product.image_url,
          link: product.link,
          product_id: product.product_id,
          variant_id: product.variant_id
        }));
        console.log("variants_info", variants_info);

        if (variants_info.length > 0) {
          fittingRoom.addProducts(variants_info);
          navigate('/fitting-room');
        }

        return {
          success: true,
          context: `Product cards displayed to the user`,
          sessionId
        };
      } catch (error) {
        console.error("Error displaying products:", error);
        return {
          success: false,
          error: error instanceof Error ? error.message : "Failed to display products",
          sessionId
        };
      }
    },
    get_similar_products: async ({ product_id, sessionId, num_similar = 5, price_range }: { product_id: number, sessionId: string, num_similar?: number, price_range?: [number, number] }) => {
      try {
        const response = await fetch(`${NGROK_URL}/api/${STORE_URL}/${sessionId}/get_similar_products`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            product_id,
            num_similar,
            price_range: price_range ? [
              parseFloat(price_range[0].toString()),
              parseFloat(price_range[1].toString())
            ] : undefined 
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return {
          success: true,
          ...data,
          sessionId
        };
      } catch (error) {
        console.error("Error getting similar products:", error);
        return {
          success: false,
          error: error instanceof Error ? error.message : "Failed to get similar products",
          sessionId
        };
      }
    },
    search_policy: async ({ query, sessionId }: { query: string, sessionId: string }) => {
      try {
        const response = await fetch(`${NGROK_URL}/api/${STORE_URL}/${sessionId}/search_policy`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return {
          success: true,
          ...data,
          sessionId
        };
      } catch (error) {
        console.error("Error searching policy:", error);
        return {
          success: false,
          error: error instanceof Error ? error.message : "Failed to search policy",
          sessionId
        };
      }
    },
    get_total_number_of_products: async ({ sessionId }: { sessionId: string }) => {
      try {
        const response = await fetch(`${NGROK_URL}/api/${STORE_URL}/${sessionId}/get_total_number_of_products`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return {
          success: true,
          ...data,
          sessionId
        };
      } catch (error) {
        console.error("Error getting total number of products:", error);
        return {
          success: false,
          error: error instanceof Error ? error.message : "Failed to get total number of products",
          sessionId
        };
      }
    },
    get_weather: async ({ location, sessionId }: { location: string, sessionId: string }) => {
      try {
        const response = await fetch(`${NGROK_URL}/api/${STORE_URL}/${sessionId}/get_weather`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ location }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return {
          success: true,
          ...data,
          sessionId
        };
      } catch (error) {
        console.error("Error getting weather:", error);
        return {
          success: false,
          error: error instanceof Error ? error.message : "Failed to get weather information",
          sessionId
        };
      }
    },
    add_to_cart: async ({ cart_items, sessionId }: { cart_items: CartItem[], sessionId: string }) => {
      try {
        if (!cart_items || !Array.isArray(cart_items) || cart_items.length === 0) {
          return {
            success: false,
            error: "No cart items provided",
            sessionId
          };
        }

        const products_list = {
          products: cart_items.map(item => ({
            product_id: item.product.product_id,
            color: item.product.color || null,
            size: item.product.size || null
          }))
        };

        const response = await fetch(`${NGROK_URL}/api/${STORE_URL}/${sessionId}/get_variants`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            products_list,
            max_variants: cart_items.length
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json() as GetVariantsResponse;
        
        const addedItems = [];
        for (const productId in data.artifact) {
          const product = data.artifact[productId];
          const cartItem = cart_items.find(item => item.product.product_id === product.product_id);
          
          if (product && cartItem) {
            const minimalProduct = {
              id: product.product_id,
              title: product.title,
              images: [{ src: product.image_url }],
              handle: product.link.split('/products/')[1]?.split('?')[0] || '',
            };

            const minimalVariant = {
              id: product.variant_id,
              product_id: product.product_id,
              title: product.title,
              price: product.price.toString(),
            };

            cart.addToCart(minimalProduct as any, minimalVariant as any, cartItem.quantity || 1);
            
            addedItems.push({
              title: product.title,
              price: product.price,
              image_url: product.image_url,
              link: product.link,
              product_id: product.product_id,
              variant_id: product.variant_id,
              quantity: cartItem.quantity || 1,
              operation: "add"
            });
          }
        }

        return {
          success: true,
          context: `Added ${addedItems.length} item(s) to cart`,
          artifact: addedItems,
          sessionId
        };
      } catch (error) {
        console.error("Error adding items to cart:", error);
        return {
          success: false,
          error: error instanceof Error ? error.message : "Failed to add items to cart",
          sessionId
        };
      }
    },
    remove_from_cart: async ({ cart_items, sessionId }: { cart_items: CartItem[], sessionId: string }) => {
      try {
        if (!cart_items || !Array.isArray(cart_items) || cart_items.length === 0) {
          return {
            success: false,
            error: "No cart items provided",
            sessionId
          };
        }

        const products_list = {
          products: cart_items.map(item => ({
            product_id: item.product.product_id,
            color: item.product.color || null,
            size: item.product.size || null
          }))
        };

        const response = await fetch(`${NGROK_URL}/api/${STORE_URL}/${sessionId}/get_variants`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            products_list,
            max_variants: cart_items.length
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json() as GetVariantsResponse;
        
        const removedItems = [];
        for (const productId in data.artifact) {
          const product = data.artifact[productId];
          
          if (product) {
            const cartItemId = `${product.product_id}-${product.variant_id}`;
            cart.removeFromCart(cartItemId);
            
            removedItems.push({
              title: product.title,
              price: product.price,
              image_url: product.image_url,
              link: product.link,
              product_id: product.product_id,
              variant_id: product.variant_id,
              quantity: 1,
              operation: "delete"
            });
          }
        }

        return {
          success: true,
          context: `Removed ${removedItems.length} item(s) from cart`,
          artifact: removedItems,
          sessionId
        };
      } catch (error) {
        console.error("Error removing items from cart:", error);
        return {
          success: false,
          error: error instanceof Error ? error.message : "Failed to remove items from cart",
          sessionId
        };
      }
    },
    add_to_wishlist: async ({ cart_items, sessionId }: { cart_items: CartItem[], sessionId: string }) => {
      try {
        if (!cart_items || !Array.isArray(cart_items) || cart_items.length === 0) {
          return {
            success: false,
            error: "No items provided",
            sessionId
          };
        }

        const products_list = {
          products: cart_items.map(item => ({
            product_id: item.product.product_id,
            color: item.product.color || null,
            size: item.product.size || null
          }))
        };

        const response = await fetch(`${NGROK_URL}/api/${STORE_URL}/${sessionId}/get_variants`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            products_list,
            max_variants: cart_items.length
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json() as GetVariantsResponse;
        
        const addedItems = [];
        for (const productId in data.artifact) {
          const product = data.artifact[productId];
          
          if (product) {
            const minimalProduct = {
              id: product.product_id,
              title: product.title,
              images: [{ src: product.image_url }],
              handle: product.link.split('/products/')[1]?.split('?')[0] || '',
              variants: [{
                id: product.variant_id,
                product_id: product.product_id,
                title: product.title,
                price: product.price.toString(),
              }]
            };

            wishlist.addToWishlist(minimalProduct as any);
            
            addedItems.push({
              title: product.title,
              price: product.price,
              image_url: product.image_url,
              link: product.link,
              product_id: product.product_id,
              variant_id: product.variant_id,
              operation: "add"
            });
          }
        }

        return {
          success: true,
          context: `Added ${addedItems.length} item(s) to wishlist`,
          artifact: addedItems,
          sessionId
        };
      } catch (error) {
        console.error("Error adding items to wishlist:", error);
        return {
          success: false,
          error: error instanceof Error ? error.message : "Failed to add items to wishlist",
          sessionId
        };
      }
    },
    remove_from_wishlist: async ({ cart_items, sessionId }: { cart_items: CartItem[], sessionId: string }) => {
      try {
        if (!cart_items || !Array.isArray(cart_items) || cart_items.length === 0) {
          return {
            success: false,
            error: "No items provided",
            sessionId
          };
        }

        const products_list = {
          products: cart_items.map(item => ({
            product_id: item.product.product_id,
            color: item.product.color || null,
            size: item.product.size || null
          }))
        };

        const response = await fetch(`${NGROK_URL}/api/${STORE_URL}/${sessionId}/get_variants`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            products_list,
            max_variants: cart_items.length
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json() as GetVariantsResponse;
        
        const removedItems = [];
        for (const productId in data.artifact) {
          const product = data.artifact[productId];
          
          if (product) {
            wishlist.removeFromWishlist(product.product_id);
            
            removedItems.push({
              title: product.title,
              price: product.price,
              image_url: product.image_url,
              link: product.link,
              product_id: product.product_id,
              variant_id: product.variant_id,
              operation: "remove"
            });
          }
        }

        return {
          success: true,
          context: `Removed ${removedItems.length} item(s) from wishlist`,
          artifact: removedItems,
          sessionId
        };
      } catch (error) {
        console.error("Error removing items from wishlist:", error);
        return {
          success: false,
          error: error instanceof Error ? error.message : "Failed to remove items from wishlist",
          sessionId
        };
      }
    }
  };

  const handleFunctionCall = async (functionCallParams: {
    name: string;
    call_id?: string;
    arguments: string;
  }) => {
    let args;
    try {
      args = JSON.parse(functionCallParams.arguments);
      if (currentSessionId.current) {
        args = { ...args, sessionId: currentSessionId.current };
      }
    } catch (error) {
      console.error("Failed to parse function arguments:", error);
      return;
    }

    addTranscriptBreadcrumb(`function call: ${functionCallParams.name}`, {
      ...args,
      name: functionCallParams.name,
      attemptedEvent: {
        type: 'function_call_arguments.done',
        name: functionCallParams.name
      }
    });

    const fn = fns[functionCallParams.name as keyof typeof fns];
    let result;
    
    if (fn !== undefined) {
      try {
        result = await fn(args);
        addTranscriptBreadcrumb(`function result: ${functionCallParams.name}`, {
          ...result,
          name: functionCallParams.name
        });
      } catch (error) {
        console.error(`Error executing function ${functionCallParams.name}:`, error);
        result = { 
          success: false, 
          error: error instanceof Error ? error.message : "Unknown error",
          sessionId: currentSessionId.current
        };
        addTranscriptBreadcrumb(`function error: ${functionCallParams.name}`, {
          ...result,
          name: functionCallParams.name
        });
      }
    } else {
      result = { 
        success: false, 
        error: `Function ${functionCallParams.name} not found`,
        sessionId: currentSessionId.current
      };
      addTranscriptBreadcrumb(`function not found: ${functionCallParams.name}`, {
        ...result,
        name: functionCallParams.name
      });
    }

    sendClientEvent({
      type: "conversation.item.create",
      item: {
        type: "function_call_output",
        call_id: functionCallParams.call_id,
        output: JSON.stringify(result),
      },
    });
    sendClientEvent({ type: "response.create" });
  };

  const handleServerEvent = (serverEvent: ServerEvent) => {
    logServerEvent(serverEvent);
    
    switch (serverEvent.type) {
      case "session.created": {
        if (serverEvent.session?.id) {
          currentSessionId.current = serverEvent.session.id;
          setSessionStatus("CONNECTED");
        }
        break;
      }

      case "conversation.item.created": {
        let text =
          serverEvent.item?.content?.[0]?.text ||
          serverEvent.item?.content?.[0]?.transcript ||
          "";
        const role = serverEvent.item?.role as "user" | "assistant";
        const itemId = serverEvent.item?.id;

        if (itemId && transcriptItems.some((item) => item.itemId === itemId)) {
          break;
        }

        if (itemId && role) {
          if (role === "user" && !text) {
            text = "[Transcribing...]";
          }
          addTranscriptMessage(itemId, role, text);
        }
        break;
      }

      case "conversation.item.input_audio_transcription.completed": {
        const itemId = serverEvent.item_id;
        const finalTranscript =
          !serverEvent.transcript || serverEvent.transcript === "\n"
            ? "[inaudible]"
            : serverEvent.transcript;
        if (itemId) {
          updateTranscriptMessage(itemId, finalTranscript, false);
        }
        break;
      }

      case "response.audio_transcript.delta": {
        const itemId = serverEvent.item_id;
        const deltaText = serverEvent.delta || "";
        if (itemId) {
          updateTranscriptMessage(itemId, deltaText, true);
        }
        break;
      }

      case "response.function_call_arguments.done": {
        console.log("response.function_call_arguments.done", serverEvent);
        if (serverEvent.name && serverEvent.arguments) {
          handleFunctionCall({
            name: serverEvent.name,
            call_id: serverEvent.call_id,
            arguments: serverEvent.arguments,
          });
        }
        break;
      }

      case "response.done": {
        console.log("response.done", serverEvent);
        break;
      }

      case "response.output_item.done": {
        const itemId = serverEvent.item?.id;
        if (itemId) {
          updateTranscriptItemStatus(itemId, "DONE");
        }
        break;
      }

      default:
        break;
    }
  };

  const handleServerEventRef = useRef(handleServerEvent);
  handleServerEventRef.current = handleServerEvent;

  return handleServerEventRef;
}
