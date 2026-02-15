import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface PageContent {
  [key: string]: string;
}

export const usePageContent = (slug: string) => {
  const [content, setContent] = useState<PageContent>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("pages")
        .select("content, components")
        .eq("slug", slug)
        .eq("status", "published")
        .single();
      
      if (data?.content) {
        try {
          setContent(JSON.parse(data.content));
        } catch {
          setContent({});
        }
      }
      setLoading(false);
    };
    load();
  }, [slug]);

  return { content, loading };
};

export const usePageComponents = (slug: string) => {
  const [components, setComponents] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("pages")
        .select("components")
        .eq("slug", slug)
        .eq("status", "published")
        .single();
      
      if (data?.components) {
        setComponents(data.components as Record<string, boolean>);
      }
    };
    load();
  }, [slug]);

  return components;
};
