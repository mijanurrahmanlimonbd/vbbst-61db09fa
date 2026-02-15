import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Globe } from "lucide-react";

interface SEOSettingsPanelProps {
  metaTitle: string;
  metaDescription: string;
  focusKeyword: string;
  postTitle: string;
  slug: string;
  onMetaTitleChange: (v: string) => void;
  onMetaDescriptionChange: (v: string) => void;
  onFocusKeywordChange: (v: string) => void;
}

const SEOSettingsPanel = ({
  metaTitle,
  metaDescription,
  focusKeyword,
  postTitle,
  slug,
  onMetaTitleChange,
  onMetaDescriptionChange,
  onFocusKeywordChange,
}: SEOSettingsPanelProps) => {
  const previewTitle = (metaTitle || postTitle || "Untitled Post") + " | VBB STORE";
  const previewDesc = metaDescription || "No description provided. Add a meta description to improve search visibility.";
  const previewUrl = `vbbstore.com/blog/${slug || "post-slug"}`;

  return (
    <div className="bg-background rounded-xl border border-border p-5 space-y-4">
      <div className="flex items-center gap-2">
        <Globe className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">SEO Settings</h3>
      </div>

      {/* Google Preview */}
      <div className="bg-secondary/40 rounded-lg p-4 space-y-1">
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2">Google Preview</p>
        <p className="text-[hsl(217,89%,61%)] text-sm font-medium leading-tight truncate">
          {previewTitle.slice(0, 60)}
        </p>
        <p className="text-[hsl(142,70%,45%)] text-xs truncate">{previewUrl}</p>
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {previewDesc.slice(0, 160)}
        </p>
      </div>

      {/* Meta Title */}
      <div>
        <label className="text-sm font-medium text-foreground mb-1.5 block">Meta Title</label>
        <Input
          value={metaTitle}
          onChange={(e) => onMetaTitleChange(e.target.value)}
          placeholder={postTitle || "Defaults to post title"}
          maxLength={60}
          className="text-sm"
        />
        <p className="text-xs text-muted-foreground mt-1">
          {(metaTitle || postTitle || "").length}/60 characters
        </p>
      </div>

      {/* Meta Description */}
      <div>
        <label className="text-sm font-medium text-foreground mb-1.5 block">Meta Description</label>
        <Textarea
          value={metaDescription}
          onChange={(e) => {
            if (e.target.value.length <= 160) onMetaDescriptionChange(e.target.value);
          }}
          placeholder="Write a concise summary for search engines…"
          rows={3}
          className="text-sm"
        />
        <p className={`text-xs mt-1 ${metaDescription.length > 150 ? "text-destructive" : "text-muted-foreground"}`}>
          {metaDescription.length}/160 characters
        </p>
      </div>

      {/* Focus Keyword */}
      <div>
        <label className="text-sm font-medium text-foreground mb-1.5 block">Focus Keyword</label>
        <Input
          value={focusKeyword}
          onChange={(e) => onFocusKeywordChange(e.target.value)}
          placeholder="e.g. verified business manager"
          className="text-sm"
        />
      </div>
    </div>
  );
};

export default SEOSettingsPanel;
