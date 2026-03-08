import { Download, Share2, Bookmark, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface ResultActionsProps {
  title: string;
  data: Record<string, string>;
  showProducts?: boolean;
  productLink?: string;
}

const ResultActions = ({ title, data, showProducts = true, productLink = "/credit-cards" }: ResultActionsProps) => {
  const handleDownload = () => {
    const text = `${title}\n${"=".repeat(30)}\n${Object.entries(data).map(([k, v]) => `${k}: ${v}`).join("\n")}\n\nGenerated on ApniNivesh.in`;
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title.replace(/\s+/g, "-").toLowerCase()}-result.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Result downloaded!");
  };

  const handleShare = async () => {
    const text = `${title}\n${Object.entries(data).map(([k, v]) => `${k}: ${v}`).join("\n")}\n\nCalculated on apninivesh.in`;
    if (navigator.share) {
      await navigator.share({ title, text });
    } else {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard!");
    }
  };

  const handleSave = () => {
    const saved = JSON.parse(localStorage.getItem("apninivesh_saved") || "[]");
    saved.push({ title, data, date: new Date().toISOString() });
    localStorage.setItem("apninivesh_saved", JSON.stringify(saved));
    toast.success("Result saved!");
  };

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      <Button variant="outline" size="sm" onClick={handleDownload} className="rounded-xl text-xs gap-1.5">
        <Download className="w-3.5 h-3.5" /> Download
      </Button>
      <Button variant="outline" size="sm" onClick={handleShare} className="rounded-xl text-xs gap-1.5">
        <Share2 className="w-3.5 h-3.5" /> Share
      </Button>
      <Button variant="outline" size="sm" onClick={handleSave} className="rounded-xl text-xs gap-1.5">
        <Bookmark className="w-3.5 h-3.5" /> Save
      </Button>
      {showProducts && (
        <Link to={productLink}>
          <Button size="sm" className="rounded-xl text-xs gap-1.5">
            <ShoppingCart className="w-3.5 h-3.5" /> View Products
          </Button>
        </Link>
      )}
    </div>
  );
};

export default ResultActions;
