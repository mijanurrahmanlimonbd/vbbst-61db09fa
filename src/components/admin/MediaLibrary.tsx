import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { convertToWebP, toBrandedUrl } from "@/lib/imageUtils";
import {
  Upload,
  Search,
  Check,
  X,
  Trash2,
  ImageIcon,
  Loader2,
  CheckSquare,
  Square,
  Copy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

/** Editable Public URL field with explicit Save */
const PublicUrlField = ({ file, onSave }: { file: MediaFile; onSave: (url: string) => void }) => {
  const branded = toBrandedUrl(file.url);
  const [value, setValue] = useState(branded);
  const [dirty, setDirty] = useState(false);

  // Reset when a different file is selected
  useEffect(() => {
    setValue(toBrandedUrl(file.url));
    setDirty(false);
  }, [file.id, file.url]);

  return (
    <div>
      <label className="text-xs font-medium text-muted-foreground mb-1 block">Public URL</label>
      <div className="flex gap-1">
        <Input
          value={value}
          onChange={(e) => { setValue(e.target.value); setDirty(true); }}
          className="text-xs h-8 font-mono flex-1"
        />
        {dirty && (
          <Button size="sm" variant="default" className="h-8 px-2 text-xs" onClick={() => { onSave(value); setDirty(false); toast.success("URL saved"); }}>
            Save
          </Button>
        )}
      </div>
      <p className="text-[10px] text-muted-foreground mt-1">Edit to set a custom path. Click Save to persist.</p>
    </div>
  );
};
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export interface MediaFile {
  id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  width: number | null;
  height: number | null;
  alt_text: string;
  caption: string;
  url: string;
  created_at: string;
}

interface UploadingFile {
  id: string;
  name: string;
  progress: number;
}

interface MediaLibraryProps {
  mode?: "page" | "modal";
  onSelect?: (file: MediaFile) => void;
}

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const MediaLibrary = ({ mode = "page", onSelect }: MediaLibraryProps) => {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [bulkMode, setBulkMode] = useState(false);
  const [bulkSelected, setBulkSelected] = useState<Set<string>>(new Set());
  const [uploading, setUploading] = useState<UploadingFile[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("media_files")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setFiles(data as unknown as MediaFile[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const selectedFile = files.find((f) => f.id === selectedId) || null;

  const getImageDimensions = (file: File): Promise<{ width: number; height: number }> =>
    new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
      img.onerror = () => resolve({ width: 0, height: 0 });
      img.src = URL.createObjectURL(file);
    });

  const uploadFile = async (originalFile: File) => {
    if (!ALLOWED_TYPES.includes(originalFile.type)) {
      toast.error(`"${originalFile.name}" is not allowed. Only JPG, PNG, and WebP images are supported.`);
      return;
    }
    if (originalFile.size > MAX_FILE_SIZE) {
      toast.error(`"${originalFile.name}" exceeds the 10MB size limit.`);
      return;
    }

    // Auto-convert to WebP at 80% quality
    const file = await convertToWebP(originalFile, 0.8);

    const uploadId = crypto.randomUUID();
    const ext = file.name.split(".").pop();
    const filePath = `${Date.now()}-${uploadId}.${ext}`;

    setUploading((prev) => [...prev, { id: uploadId, name: file.name, progress: 30 }]);

    try {
      const dims = await getImageDimensions(file);
      setUploading((prev) => prev.map((u) => (u.id === uploadId ? { ...u, progress: 50 } : u)));

      const { error: uploadError } = await supabase.storage
        .from("media")
        .upload(filePath, file, { contentType: file.type });

      if (uploadError) throw uploadError;

      setUploading((prev) => prev.map((u) => (u.id === uploadId ? { ...u, progress: 80 } : u)));

      const { data: urlData } = supabase.storage.from("media").getPublicUrl(filePath);

      // Auto-generate alt text from filename (strip extension, replace dashes/underscores)
      const autoAlt = file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");

      await supabase.from("media_files").insert({
        file_name: file.name,
        file_path: filePath,
        file_size: file.size,
        mime_type: file.type,
        width: dims.width,
        height: dims.height,
        alt_text: autoAlt,
        caption: "",
        url: urlData.publicUrl,
      });

      setUploading((prev) => prev.map((u) => (u.id === uploadId ? { ...u, progress: 100 } : u)));
      setTimeout(() => {
        setUploading((prev) => prev.filter((u) => u.id !== uploadId));
      }, 500);

      toast.success(`"${file.name}" uploaded successfully.`);
      fetchFiles();
    } catch (err: any) {
      toast.error(`Failed to upload "${file.name}".`);
      setUploading((prev) => prev.filter((u) => u.id !== uploadId));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList) return;
    Array.from(fileList).forEach(uploadFile);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const fileList = e.dataTransfer.files;
    Array.from(fileList).forEach(uploadFile);
  };

  const handleDelete = async (id: string) => {
    const file = files.find((f) => f.id === id);
    if (!file) return;
    await supabase.storage.from("media").remove([file.file_path]);
    await supabase.from("media_files").delete().eq("id", id);
    setFiles((prev) => prev.filter((f) => f.id !== id));
    if (selectedId === id) setSelectedId(null);
    setDeleteTarget(null);
    toast.success("File deleted.");
  };

  const handleBulkDelete = async () => {
    const toDelete = files.filter((f) => bulkSelected.has(f.id));
    const paths = toDelete.map((f) => f.file_path);
    const ids = toDelete.map((f) => f.id);

    await supabase.storage.from("media").remove(paths);
    for (const id of ids) {
      await supabase.from("media_files").delete().eq("id", id);
    }

    setFiles((prev) => prev.filter((f) => !bulkSelected.has(f.id)));
    setBulkSelected(new Set());
    setBulkDeleteOpen(false);
    setBulkMode(false);
    setSelectedId(null);
    toast.success(`${ids.length} file(s) deleted.`);
  };

  const updateFileField = async (id: string, field: "alt_text" | "caption" | "url", value: string) => {
    await supabase.from("media_files").update({ [field]: value }).eq("id", id);
    setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, [field]: value } : f)));
  };

  const toggleBulkSelect = (id: string) => {
    setBulkSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredFiles = files.filter((f) =>
    f.file_name.toLowerCase().includes(search.toLowerCase())
  );

  const isCompact = mode === "modal";

  return (
    <div className={cn("flex flex-col lg:flex-row gap-6", isCompact && "h-full")}>
      {/* Main Area */}
      <div className="flex-1 space-y-4 min-w-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          {!isCompact && <h2 className="text-2xl font-bold text-foreground">Media Library</h2>}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="gap-2"
              size={isCompact ? "sm" : "default"}
            >
              <Upload className="w-4 h-4" />
              Upload New
            </Button>
            <Button
              variant={bulkMode ? "default" : "outline"}
              size={isCompact ? "sm" : "default"}
              onClick={() => {
                setBulkMode((b) => !b);
                setBulkSelected(new Set());
              }}
              className="gap-2"
            >
              <CheckSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Bulk Select</span>
            </Button>
            {bulkMode && bulkSelected.size > 0 && (
              <Button
                variant="destructive"
                size={isCompact ? "sm" : "default"}
                onClick={() => setBulkDeleteOpen(true)}
                className="gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete ({bulkSelected.size})
              </Button>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search images…"
            className="pl-9"
          />
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp"
          multiple
          className="hidden"
          onChange={handleFileSelect}
        />

        {/* Grid */}
        <div
          ref={dropRef}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={cn(
            "rounded-xl border-2 border-dashed transition-colors min-h-[200px]",
            dragOver ? "border-primary bg-primary/5" : "border-transparent"
          )}
        >
          {loading ? (
            <div className="p-16 text-center text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
              Loading…
            </div>
          ) : filteredFiles.length === 0 && uploading.length === 0 ? (
            <div
              className="p-16 text-center cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <ImageIcon className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-1">
                {search ? "No images match your search" : "Drag and drop your first image"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {search
                  ? "Try a different search term."
                  : "Or click here to browse. Supports JPG, PNG, WebP up to 10MB."}
              </p>
            </div>
          ) : (
            <div className={cn(
              "grid gap-3",
              isCompact
                ? "grid-cols-3 sm:grid-cols-4"
                : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
            )}>
              {/* Uploading items */}
              {uploading.map((u) => (
                <div key={u.id} className="aspect-square rounded-lg border border-border bg-secondary/50 relative overflow-hidden">
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    <span className="text-xs text-muted-foreground truncate max-w-[80%]">{u.name}</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-secondary">
                    <div
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${u.progress}%` }}
                    />
                  </div>
                </div>
              ))}

              {/* Files */}
              {filteredFiles.map((file) => {
                const isSelected = selectedId === file.id;
                const isBulkSelected = bulkSelected.has(file.id);

                return (
                  <div
                    key={file.id}
                    onClick={() => {
                      if (bulkMode) {
                        toggleBulkSelect(file.id);
                      } else if (mode === "modal" && onSelect) {
                        setSelectedId(file.id);
                      } else {
                        setSelectedId(isSelected ? null : file.id);
                      }
                    }}
                    className={cn(
                      "aspect-square rounded-lg border-2 relative overflow-hidden cursor-pointer group transition-all",
                      isSelected || isBulkSelected
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <img
                      src={file.url}
                      alt={file.alt_text || file.file_name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    {/* Selection indicator */}
                    {(isSelected || isBulkSelected) && (
                      <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 text-primary-foreground" />
                      </div>
                    )}
                    {/* Bulk checkbox */}
                    {bulkMode && !isBulkSelected && (
                      <div className="absolute top-2 right-2 w-6 h-6 rounded-full border-2 border-background/80 bg-background/50" />
                    )}
                    {/* Hover overlay */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-xs text-background truncate">{file.file_name}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Sidebar Details */}
      {selectedFile && !bulkMode && (
        <div className={cn(
          "bg-background rounded-xl border border-border p-5 space-y-4",
          isCompact ? "w-full lg:w-64" : "w-full lg:w-80 shrink-0"
        )}>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">File Details</h3>
            <button
              onClick={() => setSelectedId(null)}
              className="p-1 rounded hover:bg-accent text-muted-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Preview */}
          <img
            src={selectedFile.url}
            alt={selectedFile.alt_text || selectedFile.file_name}
            className="w-full rounded-lg border border-border object-contain max-h-48"
          />

          {/* File Info */}
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Name</span>
              <span className="text-foreground font-medium truncate max-w-[60%] text-right">{selectedFile.file_name}</span>
            </div>
            {selectedFile.width && selectedFile.height && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Dimensions</span>
                <span className="text-foreground">{selectedFile.width} × {selectedFile.height}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Size</span>
              <span className="text-foreground">{formatFileSize(selectedFile.file_size)}</span>
            </div>
          </div>

          {/* Public URL (editable) */}
          <PublicUrlField file={selectedFile} onSave={(val) => updateFileField(selectedFile.id, "url", val)} />

          {/* Editable Fields */}
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Alt Text</label>
              <Input
                value={selectedFile.alt_text || ""}
                onChange={(e) => updateFileField(selectedFile.id, "alt_text", e.target.value)}
                placeholder="Describe the image…"
                className="text-sm h-8"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Caption</label>
              <Textarea
                value={selectedFile.caption || ""}
                onChange={(e) => updateFileField(selectedFile.id, "caption", e.target.value)}
                placeholder="Optional caption…"
                rows={2}
                className="text-sm"
              />
            </div>
          </div>

          {/* Select button in modal mode */}
          {mode === "modal" && onSelect && (
            <Button className="w-full" onClick={() => onSelect(selectedFile)}>
              Select Image
            </Button>
          )}

          {/* Copy URL */}
          <Button
            variant="outline"
            size="sm"
            className="w-full gap-2"
            onClick={() => {
              navigator.clipboard.writeText(toBrandedUrl(selectedFile.url));
              toast.success("Branded URL copied to clipboard!");
            }}
          >
            <Copy className="w-3.5 h-3.5" />
            Copy URL
          </Button>

          {/* Delete */}
          <Button
            variant="destructive"
            size="sm"
            className="w-full gap-2"
            onClick={() => setDeleteTarget(selectedFile.id)}
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete Permanently
          </Button>
        </div>
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this file?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The file will be permanently removed from storage.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteTarget && handleDelete(deleteTarget)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Confirmation */}
      <AlertDialog open={bulkDeleteOpen} onOpenChange={setBulkDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {bulkSelected.size} file(s)?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. All selected files will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MediaLibrary;
