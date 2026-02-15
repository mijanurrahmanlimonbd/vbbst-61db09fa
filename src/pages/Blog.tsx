import { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import { Clock, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const POSTS_PER_PAGE = 10;

const PostCardSkeleton = () => (
  <div className="flex flex-col sm:flex-row bg-card border border-border rounded-xl overflow-hidden">
    <Skeleton className="sm:w-64 aspect-video sm:aspect-auto sm:h-auto shrink-0" />
    <div className="p-6 space-y-3 flex-1">
      <Skeleton className="h-3 w-32" />
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  </div>
);

const Blog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") || "All";
  const searchQuery = searchParams.get("search") || "";
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>(["All"]);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("status", "published")
        .order("published_at", { ascending: false });
      const fetched = data || [];
      setPosts(fetched);
      const uniqueCats = Array.from(new Set(fetched.map((p: any) => p.category).filter(Boolean)));
      setCategories(["All", ...uniqueCats]);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  const filtered = useMemo(() => {
    let result = posts;
    if (activeCategory !== "All") {
      result = result.filter((p) => p.category === activeCategory);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((p) => p.title.toLowerCase().includes(q) || (p.excerpt || "").toLowerCase().includes(q));
    }
    return result;
  }, [posts, activeCategory, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / POSTS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = filtered.slice((safePage - 1) * POSTS_PER_PAGE, safePage * POSTS_PER_PAGE);

  const setPage = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(page));
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const setCategory = (cat: string) => {
    const params = new URLSearchParams(searchParams);
    if (cat === "All") params.delete("category");
    else params.set("category", cat);
    params.delete("page");
    setSearchParams(params);
  };

  return (
    <Layout>
      <header className="bg-primary text-primary-foreground py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Blog</h1>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
            Expert tips, industry insights, and guides on Meta advertising, verified Business Managers, and WhatsApp API.
          </p>
        </div>
      </header>

      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
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
            <div className="space-y-6">
              {Array.from({ length: 4 }).map((_, i) => <PostCardSkeleton key={i} />)}
            </div>
          ) : paginated.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">No posts found.</div>
          ) : (
            <div className="space-y-6">
              {paginated.map((post) => (
                <Link key={post.id} to={`/blog/${post.slug}`} className="group flex flex-col sm:flex-row bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="sm:w-64 aspect-video sm:aspect-auto shrink-0 bg-primary/10 overflow-hidden">
                    {post.featured_image ? (
                      <img src={post.featured_image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" sizes="256px" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-primary font-bold text-lg uppercase min-h-[120px]">{post.category}</div>
                    )}
                  </div>
                  <div className="p-6 flex-1">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.read_time}</span>
                      <span>•</span>
                      <span>{new Date(post.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                    </div>
                    <h2 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors mb-1">{post.title}</h2>
                    <span className="text-xs font-semibold text-primary uppercase">{post.category}</span>
                    {post.excerpt && <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{post.excerpt}</p>}
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-primary mt-3">Read More <ArrowRight className="w-4 h-4" /></span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              <button
                onClick={() => setPage(safePage - 1)}
                disabled={safePage <= 1}
                className="p-2 rounded-lg border border-border text-foreground hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setPage(page)}
                  className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                    page === safePage ? "bg-primary text-primary-foreground" : "border border-border text-foreground hover:bg-accent"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setPage(safePage + 1)}
                disabled={safePage >= totalPages}
                className="p-2 rounded-lg border border-border text-foreground hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Blog;
