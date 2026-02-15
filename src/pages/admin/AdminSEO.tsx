import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Search, Globe, Image as ImageIcon, BarChart3, Zap, FileWarning,
  Code2, Loader2, Save, CheckCircle, XCircle, Info,
  Facebook, Twitter, Link2, Eye,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import SEOHealthWidget from "@/components/admin/SEOHealthWidget";
import SEOAnalyticsDashboard from "@/components/admin/SEOAnalyticsDashboard";

interface SEOModule {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const SEO_MODULES: SEOModule[] = [
  {
    id: "404_monitor",
    title: "404 Monitor",
    description: "Track and fix broken links across your site automatically.",
    icon: <FileWarning className="w-6 h-6" />,
    color: "text-destructive",
  },
  {
    id: "sitemap",
    title: "Sitemap Settings",
    description: "Control XML sitemap generation and submission to search engines.",
    icon: <Globe className="w-6 h-6" />,
    color: "text-[hsl(217,91%,60%)]",
  },
  {
    id: "schema",
    title: "Schema (Structured Data)",
    description: "Enable Article, Product, and Local Business schema markup.",
    icon: <Code2 className="w-6 h-6" />,
    color: "text-[hsl(262,83%,58%)]",
  },
  {
    id: "instant_indexing",
    title: "Instant Indexing",
    description: "Connect to Google Indexing API for faster content discovery.",
    icon: <Zap className="w-6 h-6" />,
    color: "text-[hsl(45,93%,47%)]",
  },
  {
    id: "image_seo",
    title: "Image SEO",
    description: "Automatic alt-text and title tag optimization for all images.",
    icon: <ImageIcon className="w-6 h-6" />,
    color: "text-[hsl(142,70%,45%)]",
  },
  {
    id: "analytics",
    title: "Analytics",
    description: "Integrate Google Search Console and Analytics data.",
    icon: <BarChart3 className="w-6 h-6" />,
    color: "text-[hsl(0,84%,60%)]",
  },
];

const SETTING_KEYS = {
  modules: "seo_active_modules",
  titlePattern_home: "seo_title_home",
  titlePattern_post: "seo_title_post",
  titlePattern_product: "seo_title_product",
  ogImage: "seo_og_image",
  ogTitle: "seo_og_title",
  ogDescription: "seo_og_description",
  twitterCard: "seo_twitter_card",
  twitterSite: "seo_twitter_site",
  searchConsoleTag: "seo_search_console_tag",
  schemaArticle: "seo_schema_article",
  schemaProduct: "seo_schema_product",
  schemaLocalBiz: "seo_schema_local_business",
  imageAutoAlt: "seo_image_auto_alt",
  imageAutoTitle: "seo_image_auto_title",
};

const AdminSEO = () => {
  const [activeTab, setActiveTab] = useState("modules");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Module states
  const [activeModules, setActiveModules] = useState<string[]>([
    "sitemap", "schema", "image_seo",
  ]);

  // Titles & Meta
  const [titleHome, setTitleHome] = useState("[Site Name] — [Tagline]");
  const [titlePost, setTitlePost] = useState("[Title] | [Site Name]");
  const [titleProduct, setTitleProduct] = useState("[Product] — Buy at [Site Name]");

  // Social Meta
  const [ogImage, setOgImage] = useState("");
  const [ogTitle, setOgTitle] = useState("");
  const [ogDescription, setOgDescription] = useState("");
  const [twitterCard, setTwitterCard] = useState("summary_large_image");
  const [twitterSite, setTwitterSite] = useState("");

  // Search Console
  const [searchConsoleTag, setSearchConsoleTag] = useState("");

  // Schema toggles
  const [schemaArticle, setSchemaArticle] = useState(true);
  const [schemaProduct, setSchemaProduct] = useState(true);
  const [schemaLocalBiz, setSchemaLocalBiz] = useState(false);

  // Image SEO
  const [imageAutoAlt, setImageAutoAlt] = useState(true);
  const [imageAutoTitle, setImageAutoTitle] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const keys = Object.values(SETTING_KEYS);
      const { data } = await supabase
        .from("site_settings")
        .select("key, value")
        .in("key", keys);

      if (data) {
        const map: Record<string, string> = {};
        data.forEach((r) => (map[r.key] = r.value));

        if (map[SETTING_KEYS.modules]) {
          try { setActiveModules(JSON.parse(map[SETTING_KEYS.modules])); } catch {}
        }
        if (map[SETTING_KEYS.titlePattern_home]) setTitleHome(map[SETTING_KEYS.titlePattern_home]);
        if (map[SETTING_KEYS.titlePattern_post]) setTitlePost(map[SETTING_KEYS.titlePattern_post]);
        if (map[SETTING_KEYS.titlePattern_product]) setTitleProduct(map[SETTING_KEYS.titlePattern_product]);
        if (map[SETTING_KEYS.ogImage]) setOgImage(map[SETTING_KEYS.ogImage]);
        if (map[SETTING_KEYS.ogTitle]) setOgTitle(map[SETTING_KEYS.ogTitle]);
        if (map[SETTING_KEYS.ogDescription]) setOgDescription(map[SETTING_KEYS.ogDescription]);
        if (map[SETTING_KEYS.twitterCard]) setTwitterCard(map[SETTING_KEYS.twitterCard]);
        if (map[SETTING_KEYS.twitterSite]) setTwitterSite(map[SETTING_KEYS.twitterSite]);
        if (map[SETTING_KEYS.searchConsoleTag]) setSearchConsoleTag(map[SETTING_KEYS.searchConsoleTag]);
        if (map[SETTING_KEYS.schemaArticle]) setSchemaArticle(map[SETTING_KEYS.schemaArticle] === "true");
        if (map[SETTING_KEYS.schemaProduct]) setSchemaProduct(map[SETTING_KEYS.schemaProduct] === "true");
        if (map[SETTING_KEYS.schemaLocalBiz]) setSchemaLocalBiz(map[SETTING_KEYS.schemaLocalBiz] === "true");
        if (map[SETTING_KEYS.imageAutoAlt]) setImageAutoAlt(map[SETTING_KEYS.imageAutoAlt] === "true");
        if (map[SETTING_KEYS.imageAutoTitle]) setImageAutoTitle(map[SETTING_KEYS.imageAutoTitle] === "true");
      }
      setLoading(false);
    };
    load();
  }, []);

  const saveSetting = async (key: string, value: string) => {
    const { data: existing } = await supabase
      .from("site_settings")
      .select("key")
      .eq("key", key)
      .single();
    if (existing) {
      await supabase.from("site_settings").update({ value, updated_at: new Date().toISOString() }).eq("key", key);
    } else {
      await supabase.from("site_settings").insert({ key, value });
    }
  };

  const toggleModule = async (moduleId: string) => {
    const updated = activeModules.includes(moduleId)
      ? activeModules.filter((m) => m !== moduleId)
      : [...activeModules, moduleId];
    setActiveModules(updated);
    await saveSetting(SETTING_KEYS.modules, JSON.stringify(updated));
    toast.success(`Module ${updated.includes(moduleId) ? "activated" : "deactivated"}.`);
  };

  const handleSaveGlobal = async () => {
    setSaving(true);
    try {
      await Promise.all([
        saveSetting(SETTING_KEYS.titlePattern_home, titleHome),
        saveSetting(SETTING_KEYS.titlePattern_post, titlePost),
        saveSetting(SETTING_KEYS.titlePattern_product, titleProduct),
        saveSetting(SETTING_KEYS.ogImage, ogImage),
        saveSetting(SETTING_KEYS.ogTitle, ogTitle),
        saveSetting(SETTING_KEYS.ogDescription, ogDescription),
        saveSetting(SETTING_KEYS.twitterCard, twitterCard),
        saveSetting(SETTING_KEYS.twitterSite, twitterSite),
        saveSetting(SETTING_KEYS.searchConsoleTag, searchConsoleTag),
        saveSetting(SETTING_KEYS.schemaArticle, String(schemaArticle)),
        saveSetting(SETTING_KEYS.schemaProduct, String(schemaProduct)),
        saveSetting(SETTING_KEYS.schemaLocalBiz, String(schemaLocalBiz)),
        saveSetting(SETTING_KEYS.imageAutoAlt, String(imageAutoAlt)),
        saveSetting(SETTING_KEYS.imageAutoTitle, String(imageAutoTitle)),
      ]);
      toast.success("SEO settings saved!");
    } catch {
      toast.error("Failed to save settings.");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading SEO settings…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Search className="w-6 h-6 text-primary" /> SEO Settings
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Centralized hub for all site-wide search engine optimization.
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-secondary/50">
          <TabsTrigger value="modules">Modules</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="titles">Titles & Meta</TabsTrigger>
          <TabsTrigger value="social">Social Meta</TabsTrigger>
          <TabsTrigger value="search-console">Search Console</TabsTrigger>
          <TabsTrigger value="health">Health Report</TabsTrigger>
        </TabsList>

        {/* ────────── ANALYTICS TAB ────────── */}
        <TabsContent value="analytics">
          <div className="mt-4">
            <SEOAnalyticsDashboard />
          </div>
        </TabsContent>

        {/* ────────── MODULES TAB ────────── */}
        <TabsContent value="modules">
          <div className="mt-4 space-y-4">
            <p className="text-sm text-muted-foreground">
              Enable or disable SEO modules. Active modules will apply their optimization rules site-wide.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {SEO_MODULES.map((mod) => {
                const isActive = activeModules.includes(mod.id);
                return (
                  <div
                    key={mod.id}
                    className={cn(
                      "relative rounded-xl border p-5 transition-all cursor-pointer group",
                      isActive
                        ? "border-primary/40 bg-primary/5 shadow-sm"
                        : "border-border bg-background hover:border-primary/20"
                    )}
                    onClick={() => toggleModule(mod.id)}
                  >
                    {/* Status badge */}
                    <div className="absolute top-3 right-3">
                      {isActive ? (
                        <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px]">Active</Badge>
                      ) : (
                        <Badge variant="outline" className="text-[10px] text-muted-foreground">Inactive</Badge>
                      )}
                    </div>

                    <div className={cn("mb-3", mod.color)}>{mod.icon}</div>
                    <h3 className="text-sm font-semibold text-foreground mb-1">{mod.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{mod.description}</p>

                    <div className="mt-4 flex items-center gap-2">
                      <Switch
                        checked={isActive}
                        onCheckedChange={() => toggleModule(mod.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <span className="text-xs text-muted-foreground">{isActive ? "Enabled" : "Disabled"}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Schema sub-settings when active */}
            {activeModules.includes("schema") && (
              <div className="bg-background rounded-xl border border-border p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-[hsl(262,83%,58%)]" />
                  <h3 className="text-sm font-semibold text-foreground">Schema Types</h3>
                </div>
                <div className="space-y-3">
                  {[
                    { label: "Article Schema", desc: "Add JSON-LD Article markup to blog posts.", checked: schemaArticle, set: setSchemaArticle },
                    { label: "Product Schema", desc: "Add JSON-LD Product markup to product pages.", checked: schemaProduct, set: setSchemaProduct },
                    { label: "Local Business Schema", desc: "Add JSON-LD LocalBusiness markup site-wide.", checked: schemaLocalBiz, set: setSchemaLocalBiz },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border">
                      <div>
                        <p className="text-sm font-medium text-foreground">{item.label}</p>
                        <p className="text-[11px] text-muted-foreground">{item.desc}</p>
                      </div>
                      <Switch checked={item.checked} onCheckedChange={item.set} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Image SEO sub-settings */}
            {activeModules.includes("image_seo") && (
              <div className="bg-background rounded-xl border border-border p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-[hsl(142,70%,45%)]" />
                  <h3 className="text-sm font-semibold text-foreground">Image SEO Options</h3>
                </div>
                <div className="space-y-3">
                  {[
                    { label: "Auto Alt-Text", desc: "Automatically generate alt text from image file names.", checked: imageAutoAlt, set: setImageAutoAlt },
                    { label: "Auto Title Tags", desc: "Automatically add title attributes to images.", checked: imageAutoTitle, set: setImageAutoTitle },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border">
                      <div>
                        <p className="text-sm font-medium text-foreground">{item.label}</p>
                        <p className="text-[11px] text-muted-foreground">{item.desc}</p>
                      </div>
                      <Switch checked={item.checked} onCheckedChange={item.set} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button onClick={handleSaveGlobal} disabled={saving} className="gap-2">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Module Settings
            </Button>
          </div>
        </TabsContent>

        {/* ────────── TITLES & META TAB ────────── */}
        <TabsContent value="titles">
          <div className="bg-background rounded-xl border border-border p-6 space-y-6 mt-4">
            <div>
              <h3 className="text-base font-semibold text-foreground mb-1">Title Patterns</h3>
              <p className="text-xs text-muted-foreground mb-4">
                Set default title patterns using variables: <code className="bg-secondary px-1.5 py-0.5 rounded text-[11px]">[Title]</code> <code className="bg-secondary px-1.5 py-0.5 rounded text-[11px]">[Site Name]</code> <code className="bg-secondary px-1.5 py-0.5 rounded text-[11px]">[Tagline]</code> <code className="bg-secondary px-1.5 py-0.5 rounded text-[11px]">[Product]</code>
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Homepage Title Pattern</Label>
                <Input value={titleHome} onChange={(e) => setTitleHome(e.target.value)} className="mt-1.5 font-mono text-sm" />
                <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
                  <Eye className="w-3 h-3" /> Preview: <span className="font-medium">VBB STORE — Your trusted source</span>
                </p>
              </div>
              <div>
                <Label>Blog Post Title Pattern</Label>
                <Input value={titlePost} onChange={(e) => setTitlePost(e.target.value)} className="mt-1.5 font-mono text-sm" />
                <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
                  <Eye className="w-3 h-3" /> Preview: <span className="font-medium">How to Buy Verified BM | VBB STORE</span>
                </p>
              </div>
              <div>
                <Label>Product Title Pattern</Label>
                <Input value={titleProduct} onChange={(e) => setTitleProduct(e.target.value)} className="mt-1.5 font-mono text-sm" />
                <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
                  <Eye className="w-3 h-3" /> Preview: <span className="font-medium">Premium BM — Buy at VBB STORE</span>
                </p>
              </div>
            </div>

            <Button onClick={handleSaveGlobal} disabled={saving} className="gap-2">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Title Patterns
            </Button>
          </div>
        </TabsContent>

        {/* ────────── SOCIAL META TAB ────────── */}
        <TabsContent value="social">
          <div className="bg-background rounded-xl border border-border p-6 space-y-6 mt-4">
            <div>
              <h3 className="text-base font-semibold text-foreground mb-1 flex items-center gap-2">
                <Facebook className="w-4 h-4 text-[hsl(217,89%,61%)]" /> Open Graph (Facebook)
              </h3>
              <p className="text-xs text-muted-foreground mb-4">Default social share settings when no per-page values are set.</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Default OG Title</Label>
                <Input value={ogTitle} onChange={(e) => setOgTitle(e.target.value)} placeholder="VBB STORE — Verified Facebook Business Managers" className="mt-1.5" />
              </div>
              <div>
                <Label>Default OG Description</Label>
                <Textarea value={ogDescription} onChange={(e) => setOgDescription(e.target.value)} placeholder="Your trusted source for verified Facebook Business Managers." rows={3} className="mt-1.5" />
              </div>
              <div>
                <Label>Default OG Image URL</Label>
                <Input value={ogImage} onChange={(e) => setOgImage(e.target.value)} placeholder="https://yoursite.com/og-image.png" className="mt-1.5 font-mono text-sm" />
                {ogImage && (
                  <div className="mt-2 border border-border rounded-lg overflow-hidden max-w-xs">
                    <img src={ogImage} alt="OG Preview" className="w-full h-auto" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-border pt-6">
              <h3 className="text-base font-semibold text-foreground mb-1 flex items-center gap-2">
                <Twitter className="w-4 h-4" /> X (Twitter) Card
              </h3>
              <div className="space-y-4 mt-4">
                <div>
                  <Label>Card Type</Label>
                  <select
                    value={twitterCard}
                    onChange={(e) => setTwitterCard(e.target.value)}
                    className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="summary">Summary</option>
                    <option value="summary_large_image">Summary Large Image</option>
                  </select>
                </div>
                <div>
                  <Label>Twitter @username</Label>
                  <Input value={twitterSite} onChange={(e) => setTwitterSite(e.target.value)} placeholder="@vbbstore" className="mt-1.5" />
                </div>
              </div>
            </div>

            <Button onClick={handleSaveGlobal} disabled={saving} className="gap-2">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Social Settings
            </Button>
          </div>
        </TabsContent>

        {/* ────────── SEARCH CONSOLE TAB ────────── */}
        <TabsContent value="search-console">
          <div className="bg-background rounded-xl border border-border p-6 space-y-6 mt-4">
            <div>
              <h3 className="text-base font-semibold text-foreground mb-1 flex items-center gap-2">
                <Search className="w-4 h-4 text-primary" /> Google Search Console
              </h3>
              <p className="text-xs text-muted-foreground mb-4">
                Paste your Google Search Console HTML verification tag below. This will be injected into the <code className="bg-secondary px-1 py-0.5 rounded text-[11px]">&lt;head&gt;</code> of your site.
              </p>
            </div>

            <div>
              <Label>HTML Verification Tag</Label>
              <Textarea
                value={searchConsoleTag}
                onChange={(e) => setSearchConsoleTag(e.target.value)}
                placeholder='<meta name="google-site-verification" content="YOUR_CODE_HERE" />'
                rows={3}
                className="mt-1.5 font-mono text-sm"
              />
              <div className="flex items-start gap-2 mt-2 p-3 bg-primary/5 rounded-lg border border-primary/15">
                <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <p className="text-[11px] text-muted-foreground">
                  Go to <span className="font-medium text-foreground">Google Search Console → Settings → Ownership verification → HTML tag</span> and copy the full meta tag.
                </p>
              </div>
            </div>

            {/* Google API JSON Key */}
            <div className="border-t border-border pt-6">
              <h3 className="text-base font-semibold text-foreground mb-1 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[hsl(45,93%,47%)]" /> Google Search Console API (Advanced)
              </h3>
              <p className="text-xs text-muted-foreground mb-4">
                Upload a Google Service Account JSON key to fetch impressions, clicks, and keyword data automatically. Data refreshes every 24 hours to keep server resources low.
              </p>
              <div className="flex items-start gap-2 p-4 bg-[hsl(45,93%,47%)]/5 rounded-lg border border-[hsl(45,93%,47%)]/15">
                <Info className="w-4 h-4 text-[hsl(45,93%,47%)] shrink-0 mt-0.5" />
                <div className="text-[11px] text-muted-foreground space-y-1">
                  <p className="font-medium text-foreground">How to get a JSON key:</p>
                  <ol className="list-decimal list-inside space-y-0.5">
                    <li>Go to <span className="font-medium text-foreground">Google Cloud Console → APIs & Services → Credentials</span></li>
                    <li>Create a Service Account and download the JSON key file</li>
                    <li>Enable the <span className="font-medium text-foreground">Google Search Console API</span> in API Library</li>
                    <li>Add the service account email as a user in Google Search Console</li>
                  </ol>
                  <p className="mt-2">Once connected, the Analytics tab will automatically populate with real data from your search performance.</p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-3">
                <Badge variant="outline" className="text-xs text-muted-foreground gap-1">
                  <XCircle className="w-3 h-3" /> Not Connected
                </Badge>
                <span className="text-[11px] text-muted-foreground">Refresh interval: every 24 hours</span>
              </div>
            </div>

            <Button onClick={handleSaveGlobal} disabled={saving} className="gap-2">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Verification Tag
            </Button>
          </div>
        </TabsContent>

        {/* ────────── HEALTH REPORT TAB ────────── */}
        <TabsContent value="health">
          <div className="mt-4">
            <SEOHealthWidget />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSEO;
