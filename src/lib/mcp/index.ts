import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listProducts from "./tools/list-products";
import getProduct from "./tools/get-product";
import listMyOrders from "./tools/list-my-orders";
import searchBlog from "./tools/search-blog";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "verified-bm-shop-mcp",
  title: "Verified BM Shop",
  version: "0.1.0",
  instructions:
    "Tools for Verified BM Shop — a store selling Verified Facebook Business Managers and WhatsApp Business API access. Use `list_products` and `get_product` to browse the catalog, `search_blog` for guides and articles, and `list_my_orders` to see the signed-in user's own orders.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listProducts, getProduct, listMyOrders, searchBlog],
});
