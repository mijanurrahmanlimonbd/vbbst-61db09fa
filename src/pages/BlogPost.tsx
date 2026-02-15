import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import DOMPurify from "dompurify";
import Layout from "@/components/layout/Layout";
import SEOHead from "@/components/seo/SEOHead";
import JsonLdSchema from "@/components/seo/JsonLdSchema";
import CommentSection from "@/components/blog/CommentSection";
import { ArrowLeft, Clock } from "lucide-react";
import SocialShareButtons from "@/components/shared/SocialShareButtons";

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      const { data } = await supabase.from("blog_posts").select("*").eq("slug", slug).single();
      setPost(data);
      setLoading(false);
    };
    if (slug) fetchPost();
  }, [slug]);

  if (loading) return <Layout><div className="py-24 text-center text-muted-foreground">Loading...</div></Layout>;
  if (!post) return <Layout><div className="py-24 text-center text-muted-foreground">Post not found.</div></Layout>;

  return (
    <Layout>
      <JsonLdSchema
        pageTitle={post.meta_title || post.title}
        pageDescription={post.meta_description || post.excerpt || ""}
        pageImage={post.featured_image}
        datePublished={post.published_at}
        dateModified={post.created_at}
        article={post}
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Blog", url: "/blog" },
          { name: post.title, url: `/blog/${post.slug}` },
        ]}
      />
      <SEOHead
        title={(post as any).meta_title || post.title}
        description={(post as any).meta_description || post.excerpt || `Read ${post.title} on VBB STORE blog.`}
        ogImage={post.featured_image || undefined}
        ogType="article"
      />
      <section className="bg-primary text-primary-foreground py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/blog" className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>
          <span className="inline-block px-3 py-1 bg-primary-foreground/20 rounded-full text-xs font-semibold uppercase mb-4">{post.category}</span>
          <h1 className="text-3xl md:text-5xl font-bold">{post.title}</h1>
          <div className="flex items-center gap-4 mt-4 text-primary-foreground/80 text-sm">
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {post.read_time}</span>
            <span>{new Date(post.published_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {post.featured_image && (
            <img src={post.featured_image} alt={post.title} className="w-full rounded-xl mb-8" loading="lazy" />
          )}
          <div
            className="prose prose-lg max-w-none text-foreground"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content || post.excerpt || "") }}
          />

          {/* Social Share */}
          <div className="mt-10 pt-6 border-t border-border">
            <SocialShareButtons
              url={`/blog/${post.slug}`}
              title={post.title}
              description={post.meta_description || post.excerpt}
              image={post.featured_image}
              contentType="blog"
              contentId={post.id}
            />
          </div>
          
          <CommentSection postId={post.id} />
        </div>
      </section>
    </Layout>
  );
};

export default BlogPost;
