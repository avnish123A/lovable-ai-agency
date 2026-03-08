import { useState, RefObject } from "react";
import { Download, Share2, Bookmark, ShoppingCart, FileText, Image, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";

interface ResultActionsProps {
  title: string;
  data: Record<string, string>;
  showProducts?: boolean;
  productLink?: string;
  captureRef?: RefObject<HTMLDivElement>;
}

/** Convert all SVG elements inside a container to inline canvas for html2canvas compatibility */
async function svgsToCanvas(container: HTMLElement) {
  const svgs = container.querySelectorAll("svg");
  const replacements: { svg: SVGSVGElement; canvas: HTMLCanvasElement }[] = [];

  for (const svg of Array.from(svgs)) {
    try {
      const rect = svg.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) continue;

      const canvas = document.createElement("canvas");
      const scale = 2;
      canvas.width = rect.width * scale;
      canvas.height = rect.height * scale;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      const ctx = canvas.getContext("2d")!;
      ctx.scale(scale, scale);

      // Serialize SVG with computed styles
      const clonedSvg = svg.cloneNode(true) as SVGSVGElement;
      clonedSvg.setAttribute("width", String(rect.width));
      clonedSvg.setAttribute("height", String(rect.height));
      
      // Inline all computed styles
      const allEls = clonedSvg.querySelectorAll("*");
      const origEls = svg.querySelectorAll("*");
      allEls.forEach((el, i) => {
        if (origEls[i]) {
          const computed = getComputedStyle(origEls[i]);
          (el as HTMLElement).style.cssText = computed.cssText;
        }
      });

      const data = new XMLSerializer().serializeToString(clonedSvg);
      const blob = new Blob([data], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);

      const img = new window.Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = url;
      });

      ctx.drawImage(img, 0, 0, rect.width, rect.height);
      URL.revokeObjectURL(url);

      replacements.push({ svg: svg as SVGSVGElement, canvas });
    } catch {
      // Skip SVGs that fail
    }
  }

  // Replace SVGs with canvases
  for (const { svg, canvas } of replacements) {
    svg.parentNode?.replaceChild(canvas, svg);
  }

  return replacements;
}

/** Restore SVGs after capture */
function restoreSvgs(replacements: { svg: SVGSVGElement; canvas: HTMLCanvasElement }[]) {
  for (const { svg, canvas } of replacements) {
    canvas.parentNode?.replaceChild(svg, canvas);
  }
}

async function captureElement(el: HTMLElement): Promise<HTMLCanvasElement> {
  // Dynamically import html2canvas
  const html2canvas = (await import("html2canvas")).default;

  // Pre-convert SVGs to canvas elements
  const replacements = await svgsToCanvas(el);

  try {
    const canvas = await html2canvas(el, {
      backgroundColor: "#ffffff",
      scale: 2,
      useCORS: true,
      logging: false,
      allowTaint: true,
      removeContainer: true,
    });
    return canvas;
  } finally {
    restoreSvgs(replacements);
  }
}

/** Add branded watermark to a canvas */
function addWatermark(canvas: HTMLCanvasElement, title: string): HTMLCanvasElement {
  const headerH = 60;
  const footerH = 40;
  const padding = 20;
  const out = document.createElement("canvas");
  out.width = canvas.width + padding * 2;
  out.height = canvas.height + headerH + footerH + padding * 2;
  const ctx = out.getContext("2d")!;

  // Background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, out.width, out.height);

  // Header bar
  const grad = ctx.createLinearGradient(0, 0, out.width, 0);
  grad.addColorStop(0, "#1e40af");
  grad.addColorStop(1, "#2563eb");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, out.width, headerH);

  // Brand name
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 28px system-ui, -apple-system, sans-serif";
  ctx.fillText("ApniNivesh.in", padding + 10, 28);
  ctx.font = "14px system-ui, sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.fillText(title, padding + 10, 48);

  // Date on right
  const dateStr = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  ctx.textAlign = "right";
  ctx.fillText(dateStr, out.width - padding - 10, 48);
  ctx.textAlign = "left";

  // Content
  ctx.drawImage(canvas, padding, headerH + padding / 2);

  // Footer
  const footerY = headerH + padding / 2 + canvas.height + padding;
  ctx.fillStyle = "#f1f5f9";
  ctx.fillRect(0, footerY, out.width, footerH);
  ctx.fillStyle = "#94a3b8";
  ctx.font = "12px system-ui, sans-serif";
  ctx.fillText("Generated on apninivesh.in | For informational purposes only", padding + 10, footerY + 25);
  ctx.textAlign = "right";
  ctx.fillText("apninivesh.in", out.width - padding - 10, footerY + 25);

  return out;
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

  const getTarget = () =>
    captureRef?.current || (document.querySelector("[data-result-capture]") as HTMLElement | null);

  const handleDownloadPDF = async () => {
    setDownloading("pdf");
    try {
      const pdf = new jsPDF("p", "mm", "a4");
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();

      // ── Header ──
      pdf.setFillColor(30, 64, 175);
      pdf.rect(0, 0, pageW, 30, "F");
      // Gradient overlay
      pdf.setFillColor(37, 99, 235);
      pdf.rect(pageW / 2, 0, pageW / 2, 30, "F");

      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(20);
      pdf.setFont("helvetica", "bold");
      pdf.text("ApniNivesh.in", 14, 14);
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "normal");
      pdf.text("India's Trusted Finance Platform", 14, 22);
      const dateStr = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
      pdf.text(dateStr, pageW - 14, 22, { align: "right" });

      // ── Title ──
      pdf.setTextColor(15, 23, 42);
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.text(title, 14, 44);

      // Divider
      pdf.setDrawColor(226, 232, 240);
      pdf.setLineWidth(0.5);
      pdf.line(14, 48, pageW - 14, 48);

      // ── Data Table ──
      let y = 56;
      const entries = Object.entries(data);
      pdf.setFontSize(11);

      entries.forEach(([k, v], i) => {
        if (i % 2 === 0) {
          pdf.setFillColor(248, 250, 252);
          pdf.roundedRect(14, y - 5.5, pageW - 28, 11, 2, 2, "F");
        }
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(100, 116, 139);
        pdf.text(k, 20, y);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(15, 23, 42);
        pdf.text(v, pageW - 20, y, { align: "right" });
        y += 12;
      });

      // ── Chart Image ──
      const target = getTarget();
      if (target) {
        try {
          const canvas = await captureElement(target);
          const imgData = canvas.toDataURL("image/png");
          const imgW = pageW - 28;
          const imgH = (canvas.height / canvas.width) * imgW;

          y += 6;
          // Check if chart fits on current page
          if (y + imgH > pageH - 25) {
            pdf.addPage();
            y = 20;
          }

          // Border around chart
          pdf.setDrawColor(226, 232, 240);
          pdf.setLineWidth(0.3);
          pdf.roundedRect(13, y - 1, imgW + 2, imgH + 2, 3, 3, "S");
          pdf.addImage(imgData, "PNG", 14, y, imgW, imgH);
          y += imgH + 8;
        } catch {
          // Chart capture failed silently
        }
      }

      // ── Footer ──
      const footerY = pageH - 12;
      pdf.setDrawColor(226, 232, 240);
      pdf.line(14, footerY - 4, pageW - 14, footerY - 4);
      pdf.setFontSize(7);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(148, 163, 184);
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
      const target = getTarget();
      let canvas: HTMLCanvasElement;

      if (target) {
        canvas = await captureElement(target);
      } else {
        // Fallback: render data as styled HTML
        const fallback = document.createElement("div");
        fallback.style.cssText = "padding:32px;background:#fff;width:600px;font-family:system-ui";
        fallback.innerHTML = `<h2 style="font-size:20px;font-weight:bold;color:#1e3a5f;margin-bottom:16px">${title}</h2>
          <div>${Object.entries(data).map(([k, v]) => `<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #e2e8f0"><span style="color:#64748b">${k}</span><strong style="color:#0f172a">${v}</strong></div>`).join("")}</div>`;
        document.body.appendChild(fallback);
        const html2canvas = (await import("html2canvas")).default;
        canvas = await html2canvas(fallback, { backgroundColor: "#fff", scale: 2 });
        document.body.removeChild(fallback);
      }

      // Add branded watermark
      const branded = addWatermark(canvas, title);

      const link = document.createElement("a");
      link.download = `${title.replace(/\s+/g, "-").toLowerCase()}-apninivesh.png`;
      link.href = branded.toDataURL("image/png");
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

      const target = getTarget();
      if (target) {
        try {
          const canvas = await captureElement(target);
          const branded = addWatermark(canvas, title);
          const blob = await new Promise<Blob>((resolve) =>
            branded.toBlob((b) => resolve(b!), "image/png")
          );
          files = [new File([blob], `${title.replace(/\s+/g, "-").toLowerCase()}.png`, { type: "image/png" })];
        } catch {
          // Continue without image
        }
      }

      if (navigator.share) {
        const shareData: ShareData = { title: `${title} | ApniNivesh`, text: textSummary };
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
      <Button variant="outline" size="sm" onClick={handleDownloadPDF} disabled={downloading === "pdf"} className="rounded-xl text-xs gap-1.5">
        {downloading === "pdf" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileText className="w-3.5 h-3.5" />}
        PDF
      </Button>
      <Button variant="outline" size="sm" onClick={handleDownloadPNG} disabled={downloading === "png"} className="rounded-xl text-xs gap-1.5">
        {downloading === "png" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Image className="w-3.5 h-3.5" />}
        Image
      </Button>
      <Button variant="outline" size="sm" onClick={handleShare} disabled={sharing} className="rounded-xl text-xs gap-1.5">
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
