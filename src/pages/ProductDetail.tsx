import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import SEOHead from "@/components/seo/SEOHead";
import JsonLdSchema from "@/components/seo/JsonLdSchema";
import ProductCard from "@/components/shared/ProductCard";
import { Star, Shield, Zap, Headphones, MessageCircle, Send, ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import SocialShareButtons from "@/components/shared/SocialShareButtons";

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState("");

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("products").select("*").eq("slug", slug).single();
      setProduct(data);
      if (data) {
        setActiveImage(data.image_url || "");
        const { data: rel } = await supabase.from("products").select("*").eq("category", data.category).neq("id", data.id).limit(3);
        setRelated(rel || []);
      }
      setLoading(false);
    };
    if (slug) fetch();
  }, [slug]);

  if (loading) return <Layout><div className="py-24 text-center text-muted-foreground">Loading...</div></Layout>;
  if (!product) return <Layout><div className="py-24 text-center text-muted-foreground">Product not found.</div></Layout>;

  const discount = product.sale_price && product.price > 0
    ? Math.round(((product.price - product.sale_price) / product.price) * 100)
    : null;

  const allImages = [product.image_url, ...(product.gallery_images || [])].filter(Boolean);
  const inStock = product.stock_status === "in_stock";

  return (
    <Layout>
      <SEOHead
        title={product.meta_title || `${product.title} - Buy Online`}
        description={product.meta_description || product.description || product.short_description || `Buy ${product.title} from VBB STORE. Instant delivery and 7-day guarantee.`}
        ogImage={product.image_url || undefined}
        ogType="product"
      />
      <JsonLdSchema
        pageTitle={product.meta_title || product.title}
        pageDescription={product.meta_description || product.description || ""}
        pageImage={product.image_url}
        product={product}
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Shop", url: "/shop" },
          { name: product.title, url: `/product/${product.slug}` },
        ]}
      />

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/shop" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to Shop
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image Gallery */}
            <div>
              <div className="aspect-square bg-secondary rounded-xl overflow-hidden border border-border">
                {activeImage ? (
                  <img src={activeImage} alt={product.title} className="w-full h-full object-cover" loading="lazy" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">{product.category}</div>
                )}
              </div>
              {allImages.length > 1 && (
                <div className="flex gap-2 mt-3 overflow-x-auto">
                  {allImages.map((img: string, i: number) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(img)}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 shrink-0 transition-colors ${activeImage === img ? "border-primary" : "border-border hover:border-primary/50"}`}
                    >
                      <img src={img} alt={`${product.title} ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div>
              <span className="text-sm font-medium text-primary">{product.category}</span>
              {(product.badge || (product.sale_price && "Sale")) && (
                <span className="ml-3 text-xs font-bold px-3 py-1 rounded bg-primary text-primary-foreground">
                  {product.badge || "Sale"}
                </span>
              )}
              <h1 className="text-3xl font-bold text-foreground mt-2">{product.title}</h1>
              {product.sku && (
                <p className="text-xs text-muted-foreground mt-1 font-mono">SKU: {product.sku}</p>
              )}

              <div className="flex items-center gap-2 mt-4">
                <Star className="w-5 h-5 fill-[hsl(45,93%,47%)] text-[hsl(45,93%,47%)]" />
                <span className="font-medium text-foreground">{product.rating || 5.0}</span>
              </div>

              <div className="mt-6">
                {product.sale_price ? (
                  <div className="flex items-baseline gap-3">
                    <span className="text-lg text-muted-foreground line-through">${product.price}</span>
                    <span className="text-3xl font-bold text-foreground">${product.sale_price}</span>
                    <span className="text-sm text-[hsl(142,70%,45%)]">Save ${(product.price - product.sale_price).toFixed(2)} ({discount}%)</span>
                  </div>
                ) : (
                  <span className="text-3xl font-bold text-foreground">${product.price} USD</span>
                )}
              </div>

              {/* Stock Status */}
              <div className="mt-4">
                {inStock ? (
                  <span className="inline-flex items-center gap-1.5 text-sm text-[hsl(142,70%,45%)] font-medium">
                    <CheckCircle className="w-4 h-4" /> In Stock
                    {product.stock_quantity > 0 && <span className="text-muted-foreground">({product.stock_quantity} available)</span>}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-sm text-destructive font-medium">
                    <XCircle className="w-4 h-4" /> Out of Stock
                  </span>
                )}
              </div>

              {product.description && (
                <p className="text-muted-foreground mt-6">{product.description}</p>
              )}
              {product.short_description && !product.description && (
                <p className="text-muted-foreground mt-6">{product.short_description}</p>
              )}

              <div className="flex items-center gap-6 mt-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><Shield className="w-4 h-4 text-[hsl(142,70%,45%)]" /> 100% Safe</span>
                <span className="flex items-center gap-1"><Zap className="w-4 h-4 text-primary" /> Instant Delivery</span>
                <span className="flex items-center gap-1"><Headphones className="w-4 h-4 text-primary" /> 24/7 Support</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
                <a href="https://wa.me/8801302669333" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 py-3 rounded-lg bg-[hsl(142,70%,45%)] text-primary-foreground font-medium hover:opacity-90 transition-opacity">
                  <MessageCircle className="w-5 h-5" /> WhatsApp
                </a>
                <a href="https://t.me/Verifiedbmbuy" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 py-3 rounded-lg bg-[hsl(200,100%,40%)] text-primary-foreground font-medium hover:opacity-90 transition-opacity">
                  <Send className="w-5 h-5" /> Telegram
                </a>
                <button
                  onClick={() => inStock && navigate("/checkout", { state: { items: [{ id: product.id, title: product.title, price: product.price, sale_price: product.sale_price, quantity: 1, image_url: product.image_url }] } })}
                  className="flex items-center justify-center py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                  disabled={!inStock}
                >
                  {inStock ? "Buy Now" : "Sold Out"}
                </button>
                <button className="flex items-center justify-center py-3 rounded-lg border border-border text-foreground font-medium hover:bg-accent transition-colors" disabled={!inStock}>
                  Contact to Buy
                </button>
              </div>

              <p className="text-xs text-muted-foreground text-center mt-4">Verified Account • Delivered Same Day</p>

              {/* Social Share */}
              <div className="mt-8 pt-6 border-t border-border">
                <SocialShareButtons
                  url={`/product/${product.slug}`}
                  title={product.title}
                  description={product.meta_description || product.short_description}
                  image={product.image_url}
                  contentType="product"
                  contentId={product.id}
                />
              </div>
            </div>
          </div>

          {related.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-foreground mb-8">Related Products</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {related.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default ProductDetail;
