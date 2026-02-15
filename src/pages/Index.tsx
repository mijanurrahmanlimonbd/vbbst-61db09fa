import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import { Clock, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const PostCardSkeleton = () => (
  <div className="bg-card border border-border rounded-xl overflow-hidden">
    <Skeleton className="aspect-video w-full" />
    <div className="p-6 space-y-3">
      <Skeleton className="h-3 w-32" />
      <Skeleton className="h-5 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  </div>
);

const Index = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("status", "published")
        .order("published_at", { ascending: false });
      setPosts(data || []);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  const latestPost = posts[0];
  const otherPosts = posts.slice(1, 7);

  return (
    <Layout>
      {/* Hero / Latest Post */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-primary/10 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <Skeleton className="aspect-video rounded-xl w-full" />
              <div className="space-y-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-10 w-36" />
              </div>
            </div>
          ) : latestPost ? (
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <Link to={`/blog/${latestPost.slug}`} className="block aspect-video rounded-xl overflow-hidden bg-primary/10">
                {latestPost.featured_image ? (
                  <img
                    src={latestPost.featured_image}
                    alt={latestPost.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    loading="eager"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-primary font-bold text-2xl uppercase">{latestPost.category}</div>
                )}
              </Link>
              <div>
                <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold uppercase mb-4">{latestPost.category}</span>
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-4 break-words">
                  <Link to={`/blog/${latestPost.slug}`} className="hover:text-primary transition-colors">{latestPost.title}</Link>
                </h1>
                {latestPost.excerpt && <p className="text-muted-foreground text-lg mb-6 line-clamp-3">{latestPost.excerpt}</p>}
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {latestPost.read_time}</span>
                  <span>{new Date(latestPost.published_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
                </div>
                <Link to={`/blog/${latestPost.slug}`} className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
                  Read Article <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">No published posts yet.</div>
          )}
        </div>
      </section>

      {/* Recent Posts Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Recent Posts</h2>
            <Link to="/blog" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading
              ? Array.from({ length: 3 }).map((_, i) => <PostCardSkeleton key={i} />)
              : otherPosts.map((post) => (
                  <Link key={post.id} to={`/blog/${post.slug}`} className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-video bg-primary/10 overflow-hidden">
                      {post.featured_image ? (
                        <img
                          src={post.featured_image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-primary font-bold text-lg uppercase">{post.category}</div>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.read_time}</span>
                        <span>•</span>
                        <span>{new Date(post.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                      </div>
                      <h3 className="font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">{post.title}</h3>
                      <span className="inline-block mt-2 text-xs font-semibold text-primary uppercase">{post.category}</span>
                      {post.excerpt && <p className="text-sm text-muted-foreground mt-3 line-clamp-2">{post.excerpt}</p>}
                    </div>
                  </Link>
                ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
