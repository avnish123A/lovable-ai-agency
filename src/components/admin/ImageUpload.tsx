import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  bucket?: string;
  folder?: string;
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

const resizeImage = (
  file: File,
  maxWidth: number,
  maxHeight: number,
  quality: number
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    img.onload = () => {
      let { width, height } = img;

      // Calculate new dimensions maintaining aspect ratio
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      canvas.width = width;
      canvas.height = height;

      if (!ctx) {
        reject(new Error("Canvas context not available"));
        return;
      }

      // Draw with white background for JPEGs
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Failed to create blob"));
          }
        },
        "image/webp",
        quality
      );
    };

    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = URL.createObjectURL(file);
  });
};

const ImageUpload = ({
  value,
  onChange,
  bucket = "media",
  folder = "products",
  maxWidth = 800,
  maxHeight = 600,
  quality = 0.85,
}: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    setUploading(true);

    try {
      // Resize and optimize the image
      const resizedBlob = await resizeImage(file, maxWidth, maxHeight, quality);
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.webp`;

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, resizedBlob, {
          contentType: "image/webp",
          cacheControl: "31536000",
        });

      if (error) {
        toast.error("Upload failed: " + error.message);
        setUploading(false);
        return;
      }

      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path);
      onChange(urlData.publicUrl);
      
      const originalKB = Math.round(file.size / 1024);
      const newKB = Math.round(resizedBlob.size / 1024);
      toast.success(`Image uploaded (${originalKB}KB → ${newKB}KB)`);
    } catch (err) {
      toast.error("Failed to process image");
      console.error(err);
    }

    setUploading(false);
  };

  const handleRemove = () => {
    onChange("");
  };

  return (
    <div className="space-y-2">
      {value ? (
        <div className="relative inline-block">
          <img
            src={value}
            alt="Uploaded"
            className="w-24 h-24 object-cover rounded-lg border border-border"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 w-6 h-6"
            onClick={handleRemove}
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      ) : (
        <label className="flex items-center justify-center w-24 h-24 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
          {uploading ? (
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          ) : (
            <Upload className="w-5 h-5 text-muted-foreground" />
          )}
          <Input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
            disabled={uploading}
          />
        </label>
      )}
      <p className="text-[10px] text-muted-foreground">
        Auto-optimized to WebP
      </p>
    </div>
  );
};

export default ImageUpload;
