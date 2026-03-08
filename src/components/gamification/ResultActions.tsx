import { useState, RefObject } from "react";
import { Download, Share2, Bookmark, ShoppingCart, FileText, Image, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface ResultActionsProps {
  title: string;
  data: Record<string, string>;
  showProducts?: boolean;
  productLink?: string;
  /** Ref to the container whose visual (charts + results) should be captured */
  captureRef?: RefObject<HTMLDivElement>;
}

async function captureImage(el: HTMLElement): Promise<HTMLCanvasElement> {
  return html2canvas(el, {
    backgroundColor: "#ffffff",
    scale: 2,
    useCORS: true,
    logging: false,
    allowTaint: true,
  });
}

const ResultActions = ({
  title,
  data,
  showProducts = true,
  productLink = "/credit-cards",
  captureRef,
}: ResultActionsProps) => {
  const [downloading, setDownloading] = useState<"pdf" | "png" | null>(null);
  const [sharing, setSharing] = useState(false);

  const textSummary = `${title}\n${"─".repeat(30)}\n${Object.entries(data)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n")}\n\nGenerated on ApniNivesh.in | apninivesh.in`;

  const handleDownloadPDF = async () => {
    setDownloading("pdf");
    try {
      const pdf = new jsPDF("p", "mm", "a4");
      const pageW = pdf.internal.pageSize.getWidth();

      // Header
      pdf.setFillColor(37, 99, 235);
      pdf.rect(0, 0, pageW, 28, "F");
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(18);
      pdf.setFont("helvetica", "bold");
      pdf.text("ApniNivesh.in", 14, 12);
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      pdf.text("India's Trusted Finance Platform", 14, 19);
      pdf.text(new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }), pageW - 14, 19, { align: "right" });

      // Title
      pdf.setTextColor(30, 30, 30);
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.text(title, 14, 40);

      // Data table
      let y = 50;
      pdf.setFontSize(11);
      const entries = Object.entries(data);
      entries.forEach(([k, v], i) => {
        if (i % 2 === 0) {
          pdf.setFillColor(245, 247, 250);
          pdf.rect(14, y - 5, pageW - 28, 10, "F");
        }
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(100, 100, 100);
        pdf.text(k, 18, y);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(30, 30, 30);
        pdf.text(v, pageW - 18, y, { align: "right" });
        y += 10;
      });

      // Capture chart image if ref available
      if (captureRef?.current) {
        try {
          const canvas = await captureImage(captureRef.current);
          const imgData = canvas.toDataURL("image/png");
          const imgW = pageW - 28;
          const imgH = (canvas.height / canvas.width) * imgW;
          y += 8;
          if (y + imgH > pdf.internal.pageSize.getHeight() - 20) {
            pdf.addPage();
            y = 20;
          }
          pdf.addImage(imgData, "PNG", 14, y, imgW, imgH);
          y += imgH;
        } catch {
          // Chart capture failed, continue without it
        }
      }

      // Footer
      const footerY = pdf.internal.pageSize.getHeight() - 10;
      pdf.setFontSize(8);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(150, 150, 150);
      pdf.text("This is for informational purposes only. Verify details with respective banks/institutions.", 14, footerY);
      pdf.text("apninivesh.in", pageW - 14, footerY, { align: "right" });

      pdf.save(`${title.replace(/\s+/g, "-").toLowerCase()}-apninivesh.pdf`);
      toast.success("PDF downloaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate PDF");
    }
    setDownloading(null);
  };

  const handleDownloadPNG = async () => {
    setDownloading("png");
    try {
      const target = captureRef?.current || document.querySelector("[data-result-capture]") as HTMLElement;
      if (!target) {
        // Fallback: create a styled div to capture
        const fallback = document.createElement("div");
        fallback.style.cssText = "padding:32px;background:#fff;width:600px;font-family:system-ui";
        fallback.innerHTML = `<h2 style="font-size:20px;font-weight:bold;color:#1e3a5f;margin-bottom:16px">${title}</h2>
          <div style="margin-bottom:12px">${Object.entries(data).map(([k, v]) => `<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #eee"><span style="color:#666">${k}</span><strong style="color:#111">${v}</strong></div>`).join("")}</div>
          <p style="font-size:11px;color:#999;margin-top:16px">Generated on ApniNivesh.in</p>`;
        document.body.appendChild(fallback);
        const canvas = await captureImage(fallback);
        document.body.removeChild(fallback);
        const link = document.createElement("a");
        link.download = `${title.replace(/\s+/g, "-").toLowerCase()}-apninivesh.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
        toast.success("Image downloaded!");
        setDownloading(null);
        return;
      }

      const canvas = await captureImage(target);
      const link = document.createElement("a");
      link.download = `${title.replace(/\s+/g, "-").toLowerCase()}-apninivesh.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      toast.success("Image downloaded!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to capture image");
    }
    setDownloading(null);
  };

  const handleShare = async () => {
    setSharing(true);
    try {
      let files: File[] = [];

      // Try to capture chart as image for sharing
      const target = captureRef?.current || document.querySelector("[data-result-capture]") as HTMLElement;
      if (target) {
        try {
          const canvas = await captureImage(target);
          const blob = await new Promise<Blob>((resolve) =>
            canvas.toBlob((b) => resolve(b!), "image/png")
          );
          files = [new File([blob], `${title.replace(/\s+/g, "-").toLowerCase()}.png`, { type: "image/png" })];
        } catch {
          // Continue without image
        }
      }

      if (navigator.share) {
        const shareData: ShareData = {
          title: `${title} | ApniNivesh`,
          text: textSummary,
        };
        // Check if file sharing is supported
        if (files.length > 0 && navigator.canShare && navigator.canShare({ files })) {
          shareData.files = files;
        }
        await navigator.share(shareData);
        toast.success("Shared successfully!");
      } else {
        await navigator.clipboard.writeText(textSummary);
        toast.success("Result copied to clipboard!");
      }
    } catch (err: any) {
      if (err?.name !== "AbortError") {
        // Fallback to clipboard
        try {
          await navigator.clipboard.writeText(textSummary);
          toast.success("Result copied to clipboard!");
        } catch {
          toast.error("Failed to share");
        }
      }
    }
    setSharing(false);
  };

  const handleSave = () => {
    const saved = JSON.parse(localStorage.getItem("apninivesh_saved") || "[]");
    saved.push({ title, data, date: new Date().toISOString() });
    localStorage.setItem("apninivesh_saved", JSON.stringify(saved));
    toast.success("Result saved locally!");
  };

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      <Button
        variant="outline"
        size="sm"
        onClick={handleDownloadPDF}
        disabled={downloading === "pdf"}
        className="rounded-xl text-xs gap-1.5"
      >
        {downloading === "pdf" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileText className="w-3.5 h-3.5" />}
        PDF
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleDownloadPNG}
        disabled={downloading === "png"}
        className="rounded-xl text-xs gap-1.5"
      >
        {downloading === "png" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Image className="w-3.5 h-3.5" />}
        Image
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleShare}
        disabled={sharing}
        className="rounded-xl text-xs gap-1.5"
      >
        {sharing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Share2 className="w-3.5 h-3.5" />}
        Share
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
