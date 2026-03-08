import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ImageIcon, Upload, Trash2, Loader2, Copy, Check, FolderOpen, Search } from "lucide-react";
import { toast } from "sonner";

interface MediaItem {
  id: string;
  file_name: string;
  file_path: string;
  file_type: string | null;
  file_size: number | null;
  category: string;
  alt_text: string | null;
  created_at: string;
}

const CATEGORIES = ["general", "bank-logos", "credit-cards", "loans", "banners", "icons"];

const AdminMedia = () => {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadCategory, setUploadCategory] = useState("general");

  const fetchMedia = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("media")
      .select("*")
      .order("created_at", { ascending: false });
    setMedia((data as MediaItem[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    let successCount = 0;

    for (const file of Array.from(files)) {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${uploadCategory}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("media")
        .upload(filePath, file);

      if (uploadError) {
        toast.error(`Failed to upload ${file.name}: ${uploadError.message}`);
        continue;
      }

      const { data: urlData } = supabase.storage.from("media").getPublicUrl(filePath);

      const { error: dbError } = await supabase.from("media").insert({
        file_name: file.name,
        file_path: urlData.publicUrl,
        file_type: file.type,
        file_size: file.size,
        category: uploadCategory,
      });

      if (dbError) {
        toast.error(`DB error for ${file.name}: ${dbError.message}`);
      } else {
        successCount++;
      }
    }

    if (successCount > 0) {
      toast.success(`${successCount} file(s) uploaded`);
      fetchMedia();
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDelete = async (item: MediaItem) => {
    if (!confirm(`Delete "${item.file_name}"?`)) return;

    // Extract path from URL
    const urlParts = item.file_path.split("/storage/v1/object/public/media/");
    const storagePath = urlParts[1];

    if (storagePath) {
      await supabase.storage.from("media").remove([storagePath]);
    }

    const { error } = await supabase.from("media").delete().eq("id", item.id);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("File deleted");
      setSelectedItem(null);
      fetchMedia();
    }
  };

  const copyUrl = async (url: string) => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("URL copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const filtered = media.filter((m) => {
    const matchSearch = !search || m.file_name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = categoryFilter === "all" || m.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  const formatSize = (bytes: number | null) => {
    if (!bytes) return "—";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold flex items-center gap-2">
            <FolderOpen className="w-6 h-6 text-primary" />
            Media Library
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Upload and manage images for products and banners
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={uploadCategory} onValueChange={setUploadCategory}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat.replace("-", " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={() => fileInputRef.current?.click()} disabled={uploading}>
            {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
            Upload
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleUpload}
            className="hidden"
            accept="image/*"
            multiple
          />
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search files..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat.replace("-", " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">No media files found.</p>
            <Button variant="link" onClick={() => fileInputRef.current?.click()} className="mt-2">
              Upload your first file
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filtered.map((item) => (
            <Card
              key={item.id}
              className="group cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all"
              onClick={() => setSelectedItem(item)}
            >
              <CardContent className="p-0">
                <div className="aspect-square bg-muted/50 flex items-center justify-center overflow-hidden rounded-t-xl">
                  {item.file_type?.startsWith("image/") ? (
                    <img
                      src={item.file_path}
                      alt={item.alt_text || item.file_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-muted-foreground" />
                  )}
                </div>
                <div className="p-2">
                  <p className="text-xs font-medium truncate">{item.file_name}</p>
                  <p className="text-[10px] text-muted-foreground">{formatSize(item.file_size)}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Detail Dialog */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-heading truncate">{selectedItem?.file_name}</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4">
              <div className="aspect-video bg-muted/50 rounded-lg overflow-hidden flex items-center justify-center">
                {selectedItem.file_type?.startsWith("image/") ? (
                  <img
                    src={selectedItem.file_path}
                    alt={selectedItem.alt_text || selectedItem.file_name}
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <ImageIcon className="w-12 h-12 text-muted-foreground" />
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <Label className="text-xs text-muted-foreground">Category</Label>
                  <p className="font-medium capitalize">{selectedItem.category.replace("-", " ")}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Size</Label>
                  <p className="font-medium">{formatSize(selectedItem.file_size)}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Type</Label>
                  <p className="font-medium">{selectedItem.file_type || "—"}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Uploaded</Label>
                  <p className="font-medium">{new Date(selectedItem.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">URL</Label>
                <div className="flex gap-2">
                  <Input value={selectedItem.file_path} readOnly className="text-xs" />
                  <Button variant="outline" size="icon" onClick={() => copyUrl(selectedItem.file_path)}>
                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => handleDelete(selectedItem)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminMedia;
