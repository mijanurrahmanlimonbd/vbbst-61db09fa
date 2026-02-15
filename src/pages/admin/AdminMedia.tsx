import { Upload, Image } from "lucide-react";

const AdminMedia = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold text-foreground">Media Library</h2>
      <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
        <Upload className="w-4 h-4" /> Upload
      </button>
    </div>
    <div className="bg-background rounded-xl border border-border p-12 text-center">
      <div className="w-16 h-16 bg-secondary rounded-xl flex items-center justify-center mx-auto mb-4">
        <Image className="w-8 h-8 text-muted-foreground" />
      </div>
      <p className="font-medium text-foreground">No media files yet</p>
      <p className="text-sm text-muted-foreground mt-1">Upload images, videos, and documents to your media library.</p>
    </div>
  </div>
);

export default AdminMedia;
