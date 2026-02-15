import { Link } from "react-router-dom";
import { Star, Shield, Zap, Headphones, MessageCircle, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Product {
  id: string;
  title: string;
  slug: string;
  short_description?: string;
  price: number;
  sale_price?: number | null;
  category: string;
  badge?: string | null;
  image_url?: string | null;
  rating?: number;
  stock_status?: string;
}

const ProductCard = ({ product }: { product: Product }) => {
  const discount = product.sale_price && product.price > 0
    ? Math.round(((product.price - product.sale_price) / product.price) * 100)
    : null;
  const inStock = product.stock_status !== "out_of_stock";
  const showSaleBadge = product.sale_price && product.sale_price > 0;

  const badgeColors: Record<string, string> = {
    Sale: "bg-[hsl(15,90%,55%)] text-primary-foreground",
    "Best Seller": "bg-primary text-primary-foreground",
    New: "bg-[hsl(142,70%,45%)] text-primary-foreground",
    Premium: "bg-[hsl(280,60%,50%)] text-primary-foreground",
  };

  const displayBadge = showSaleBadge ? "Sale" : product.badge;

  return (
    <div className="group bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 relative">
      {!inStock && (
        <div className="absolute inset-0 bg-background/60 z-20 flex items-center justify-center pointer-events-none">
          <Badge variant="destructive" className="text-sm px-4 py-1">Out of Stock</Badge>
        </div>
      )}
      <Link to={`/product/${product.slug}`} className="block relative">
        {discount && (
          <span className="absolute top-3 left-3 z-10 bg-[hsl(0,84%,60%)] text-primary-foreground text-xs font-bold px-2 py-1 rounded">
            {discount}% SAVE
          </span>
        )}
        {displayBadge && (
          <span className={`absolute top-3 right-3 z-10 text-xs font-bold px-3 py-1 rounded ${badgeColors[displayBadge] || "bg-primary text-primary-foreground"}`}>
            {displayBadge}
          </span>
        )}
        <div className="aspect-[4/3] bg-secondary overflow-hidden">
          {product.image_url ? (
            <img src={product.image_url} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <span className="text-sm">{product.category}</span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-5">
        <span className="text-xs font-medium text-primary">{product.category}</span>
        <h3 className="font-bold text-foreground mt-1 text-sm leading-tight line-clamp-2">{product.title}</h3>
        {product.short_description && (
          <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{product.short_description}</p>
        )}

        <div className="flex items-center gap-1 mt-3">
          <Star className="w-4 h-4 fill-[hsl(45,93%,47%)] text-[hsl(45,93%,47%)]" />
          <span className="text-sm font-medium text-foreground">{product.rating || 5.0}</span>
        </div>

        <div className="mt-3">
          {product.sale_price ? (
            <div className="flex items-baseline gap-2">
              <span className="text-sm text-muted-foreground line-through">${product.price}</span>
              <span className="text-xs text-[hsl(142,70%,45%)]">Save ${(product.price - product.sale_price).toFixed(2)}</span>
              <div>
                <span className="text-xl font-bold text-foreground">${product.sale_price}</span>
                <span className="text-xs text-muted-foreground">USD</span>
              </div>
            </div>
          ) : (
            <div>
              <span className="text-xl font-bold text-foreground">${product.price}</span>
              <span className="text-xs text-muted-foreground">USD</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Shield className="w-3 h-3 text-[hsl(142,70%,45%)]" /> 100% Safe</span>
          <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-primary" /> Instant</span>
          <span className="flex items-center gap-1"><Headphones className="w-3 h-3 text-primary" /> 24/7</span>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-4">
          <a href="https://wa.me/8801302669333" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1 py-2 rounded-lg bg-[hsl(142,70%,45%)] text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity">
            <MessageCircle className="w-3 h-3" /> WhatsApp
          </a>
          <a href="https://t.me/Verifiedbmbuy" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1 py-2 rounded-lg bg-[hsl(200,100%,40%)] text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity">
            <Send className="w-3 h-3" /> Telegram
          </a>
          <Link to={`/product/${product.slug}`} className="flex items-center justify-center py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity">
            {inStock ? "Buy Now" : "View"}
          </Link>
        </div>

        <p className="text-[10px] text-muted-foreground text-center mt-3">Verified Account • Delivered Same Day</p>
      </div>
    </div>
  );
};

export default ProductCard;
