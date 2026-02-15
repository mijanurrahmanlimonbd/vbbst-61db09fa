import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import { ArrowLeft, Clock, User } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .single();

      if (!data) {
        navigate("/404", { replace: true });
        return;
      }
      setPost(data);

      // Fetch related posts
      const { data: relatedData } = await supabase
        .from("blog_posts")
        .select("id, title, slug, category, featured_image, read_time, published_at, excerpt")
        .eq("status", "published")
        .eq("category", data.category)
        .neq("id", data.id)
        .order("published_at", { ascending: false })
        .limit(3);
      setRelated(relatedData || []);
      setLoading(false);
    };
    if (slug) {
      setLoading(true);
      fetchPost();
    }
  }, [slug, navigate]);

  if (loading) {
    return (
      <Layout>
        <div className="bg-primary py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
            <Skeleton className="h-4 w-32 bg-primary-foreground/20" />
            <Skeleton className="h-10 w-full bg-primary-foreground/20" />
            <Skeleton className="h-10 w-2/3 bg-primary-foreground/20" />
            <Skeleton className="h-4 w-48 bg-primary-foreground/20" />
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-4">
          <Skeleton className="h-64 w-full rounded-xl" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* SEO: title tag set via document.title */}
      <HelmetTitle title={`${post.title} | VBB Store Blog`} description={post.excerpt || post.title} />

      <section className="bg-primary text-primary-foreground py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/blog" className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>
          <span className="inline-block px-3 py-1 bg-primary-foreground/20 rounded-full text-xs font-semibold uppercase mb-4">{post.category}</span>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight">{post.title}</h1>
          <div className="flex items-center gap-4 mt-4 text-primary-foreground/80 text-sm">
            <span className="flex items-center gap-1"><User className="w-4 h-4" /> {post.author}</span>
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {post.read_time}</span>
            <span>{new Date(post.published_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
          </div>
        </div>
      </section>

      <article className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {post.featured_image && (
            <img
              src={post.featured_image}
              alt={post.title}
              className="w-full rounded-xl mb-8 max-h-[500px] object-cover"
              loading="eager"
              sizes="(max-width: 896px) 100vw, 896px"
            />
          )}
          <div
            className="prose prose-lg max-w-none text-foreground prose-headings:text-foreground prose-a:text-primary prose-strong:text-foreground prose-blockquote:border-primary"
            dangerouslySetInnerHTML={{ __html: post.content || "" }}
          />
        </div>
      </article>

      {/* Related Posts */}
      {related.length > 0 && (
        <section className="py-12 border-t border-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-foreground mb-8">Related Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((r) => (
                <Link key={r.id} to={`/blog/${r.slug}`} className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-primary/10 overflow-hidden">
                    {r.featured_image ? (
                      <img src={r.featured_image} alt={r.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" sizes="(max-width: 768px) 100vw, 33vw" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-primary font-bold uppercase">{r.category}</div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 text-sm">{r.title}</h3>
                    <span className="text-xs text-muted-foreground mt-1 block">{new Date(r.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
};

// Simple component to set document title for SEO
const HelmetTitle = ({ title, description }: { title: string; description: string }) => {
  useEffect(() => {
    document.title = title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", description);
    else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = description;
      document.head.appendChild(meta);
    }
  }, [title, description]);
  return null;
};

export default BlogPost;
