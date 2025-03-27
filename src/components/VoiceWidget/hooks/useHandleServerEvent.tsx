import { useRef } from "react";
import { ServerEvent, SessionStatus } from "../types";
import { useTranscript } from "../contexts/TranscriptContext";
import { useEvent } from "../contexts/EventContext";
import { useFittingRoom } from "@/contexts/FittingRoomContext";
import { useNavigate } from "react-router-dom";

// Default values for environment variables
const DEFAULT_NGROK_URL = "https://conv-engine-testing.ngrok.io";
const DEFAULT_STORE_URL = "appella-test.myshopify.com";

// Global variable for the ngrok address
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

      window.location.href = productInfo.link;

      return {
        success: true,
        link: productInfo.link,
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
      window.location.href = '/cart';
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
      window.location.href = '/wishlist';
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
      return { success: true };
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
      return { success: true };
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

      const fittingRoomContext = window.fittingRoomContext;
      if (fittingRoomContext && variants_info.length > 0) {
        fittingRoomContext.addProducts(variants_info);
        window.location.href = '/fitting-room';
      }

      return {
        success: true,
        context: "Product cards displayed to the user",
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
  }
};

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
  const currentSessionId = useRef<string | null>(null);

  if (typeof window !== 'undefined') {
    window.fittingRoomContext = fittingRoom;
  }

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
      ...args
    });

    const fn = fns[functionCallParams.name as keyof typeof fns];
    let result;
    
    if (fn !== undefined) {
      try {
        result = await fn(args);
        
        if (functionCallParams.name === 'display_products' && result.success) {
          addTranscriptBreadcrumb(`Displaying products in fitting room`, {
            count: Object.keys(args.products_list?.products || {}).length
          });
        }
        
        addTranscriptBreadcrumb(`function result: ${functionCallParams.name}`, {
          ...result
        });
      } catch (error) {
        console.error(`Error executing function ${functionCallParams.name}:`, error);
        result = { 
          success: false, 
          error: error instanceof Error ? error.message : "Unknown error",
          sessionId: currentSessionId.current
        };
        addTranscriptBreadcrumb(`function error: ${functionCallParams.name}`, {
          ...result
        });
      }
    } else {
      result = { 
        success: false, 
        error: `Function ${functionCallParams.name} not found`,
        sessionId: currentSessionId.current
      };
      addTranscriptBreadcrumb(`function not found: ${functionCallParams.name}`, {
        ...result
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
          addTranscriptBreadcrumb(
            `session.id: ${
              serverEvent.session.id
            }\nStarted at: ${new Date().toLocaleString()}`
          );
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

declare global {
  interface Window {
    fittingRoomContext?: any;
  }
}
