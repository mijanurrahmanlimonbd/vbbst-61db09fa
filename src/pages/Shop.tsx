import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import SEOHead from "@/components/seo/SEOHead";
import JsonLdSchema from "@/components/seo/JsonLdSchema";
import PageHeader from "@/components/layout/PageHeader";
import ProductCard from "@/components/shared/ProductCard";
import { usePageHeroBySlug } from "@/hooks/usePageHeroBySlug";

const categories = ["All", "Verified BM", "WhatsApp API", "Facebook Accounts", "TikTok Ads", "Reinstated Profiles"];

const Shop = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { heroImage, heroOverlay } = usePageHeroBySlug("shop");

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase.from("products").select("*").order("sort_order", { ascending: true });
      setProducts(data || []);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const filtered = products.filter((p) => {
    const matchesCategory = activeCategory === "All" || p.category === activeCategory;
    const matchesSearch = !search || p.title.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <Layout>
      <SEOHead title="Shop - Verified Accounts" description="Browse and buy premium verified Meta accounts, WhatsApp Business API, Facebook Ads accounts. Instant delivery and 7-day replacement guarantee." />
      <JsonLdSchema
        pageTitle="Shop - Verified Accounts"
        pageDescription="Browse and buy premium verified Meta accounts, WhatsApp Business API, Facebook Ads accounts."
        breadcrumbs={[{ name: "Home", url: "/" }, { name: "Shop", url: "/shop" }]}
      />
      <PageHeader
        breadcrumb="Shop"
        subtitle="BROWSE & BUY"
        title="Our Products"
        description="Premium verified Meta accounts, WhatsApp API access, and more. All with instant delivery and 7-day replacement guarantee."
        showSearch
        searchValue={search}
        onSearchChange={setSearch}
        heroImage={heroImage}
        heroOverlay={heroOverlay}
      />

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-background border border-border text-foreground hover:bg-accent"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Loading products...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No products found.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Shop;
