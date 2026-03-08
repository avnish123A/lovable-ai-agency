import { useState, RefObject } from "react";
import { Share2, Bookmark, ShoppingCart, FileText, Image, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface ResultActionsProps {
  title: string;
  data: Record<string, string>;
  showProducts?: boolean;
  productLink?: string;
  captureRef?: RefObject<HTMLDivElement>;
}

/** Convert SVGs to canvas for proper capture */
async function svgsToCanvas(container: HTMLElement) {
  const svgs = container.querySelectorAll("svg");
  const replacements: { svg: SVGSVGElement; canvas: HTMLCanvasElement }[] = [];

  for (const svg of Array.from(svgs)) {
    try {
      const rect = svg.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) continue;

      const canvas = document.createElement("canvas");
      const scale = 3;
      canvas.width = rect.width * scale;
      canvas.height = rect.height * scale;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      const ctx = canvas.getContext("2d")!;
      ctx.scale(scale, scale);

      const clonedSvg = svg.cloneNode(true) as SVGSVGElement;
      clonedSvg.setAttribute("width", String(rect.width));
      clonedSvg.setAttribute("height", String(rect.height));

      // Inline computed styles for accurate rendering
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
      // Skip failed SVGs
    }
  }

  for (const { svg, canvas } of replacements) {
    svg.parentNode?.replaceChild(canvas, svg);
  }
  return replacements;
}

function restoreSvgs(replacements: { svg: SVGSVGElement; canvas: HTMLCanvasElement }[]) {
  for (const { svg, canvas } of replacements) {
    canvas.parentNode?.replaceChild(svg, canvas);
  }
}

async function captureElement(el: HTMLElement): Promise<HTMLCanvasElement> {
  const html2canvas = (await import("html2canvas")).default;
  const replacements = await svgsToCanvas(el);
  try {
    return await html2canvas(el, {
      backgroundColor: "#ffffff",
      scale: 3,
      useCORS: true,
      logging: false,
      allowTaint: true,
      removeContainer: true,
    });
  } finally {
    restoreSvgs(replacements);
  }
}

/** Add premium branded frame to captured canvas */
function addBrandedFrame(canvas: HTMLCanvasElement, title: string): HTMLCanvasElement {
  const pad = 40;
  const headerH = 80;
  const footerH = 50;
  const out = document.createElement("canvas");
  out.width = canvas.width + pad * 2;
  out.height = canvas.height + headerH + footerH + pad;
  const ctx = out.getContext("2d")!;

  // White bg
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, out.width, out.height);

  // Header gradient
  const grad = ctx.createLinearGradient(0, 0, out.width, 0);
  grad.addColorStop(0, "#0f172a");
  grad.addColorStop(0.5, "#1e3a5f");
  grad.addColorStop(1, "#2563eb");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, out.width, headerH);

  // Brand
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 36px system-ui, -apple-system, sans-serif";
  ctx.fillText("ApniNivesh.in", pad, 35);
  ctx.font = "16px system-ui, sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.8)";
  ctx.fillText(title, pad, 60);

  // Date
  const dateStr = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  ctx.textAlign = "right";
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.font = "14px system-ui, sans-serif";
  ctx.fillText(dateStr, out.width - pad, 60);
  ctx.textAlign = "left";

  // Content with subtle shadow
  ctx.shadowColor = "rgba(0,0,0,0.08)";
  ctx.shadowBlur = 20;
  ctx.shadowOffsetY = 4;
  ctx.drawImage(canvas, pad, headerH + pad / 2);
  ctx.shadowColor = "transparent";

  // Footer
  const footerY = out.height - footerH;
  ctx.fillStyle = "#f8fafc";
  ctx.fillRect(0, footerY, out.width, footerH);
  ctx.strokeStyle = "#e2e8f0";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, footerY);
  ctx.lineTo(out.width, footerY);
  ctx.stroke();

  ctx.fillStyle = "#94a3b8";
  ctx.font = "13px system-ui, sans-serif";
  ctx.fillText("Generated on apninivesh.in • For informational purposes only", pad, footerY + 30);
  ctx.textAlign = "right";
  ctx.font = "bold 13px system-ui, sans-serif";
  ctx.fillStyle = "#2563eb";
  ctx.fillText("apninivesh.in", out.width - pad, footerY + 30);

  return out;
}

const ResultActions = ({
  title,
  data,
  showProducts = true,
  productLink = "/credit-cards",
  captureRef,
}: ResultActionsProps) => {
  const [downloading, setDownloading] = useState<"png" | null>(null);
  const [sharing, setSharing] = useState(false);

  const textSummary = `════════════════════════════════════════
  ${title}
════════════════════════════════════════

${Object.entries(data)
  .map(([k, v]) => `  ${k.padEnd(20)} : ${v}`)
  .join("\n")}

────────────────────────────────────────
Generated on ${new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
ApniNivesh.in | India's Trusted Finance Platform
apninivesh.in
════════════════════════════════════════`;

  const getTarget = () =>
    captureRef?.current || (document.querySelector("[data-result-capture]") as HTMLElement | null);


  const handleDownloadPNG = async () => {
    setDownloading("png");
    try {
      const target = getTarget();
      let canvas: HTMLCanvasElement;

      if (target) {
        canvas = await captureElement(target);
      } else {
        // Fallback
        const fallback = document.createElement("div");
        fallback.style.cssText = "padding:32px;background:#fff;width:600px;font-family:system-ui";
        fallback.innerHTML = `<h2 style="font-size:20px;font-weight:bold;color:#0f172a;margin-bottom:16px">${title}</h2>
          <div>${Object.entries(data).map(([k, v]) => `<div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #e2e8f0"><span style="color:#64748b">${k}</span><strong style="color:#0f172a">${v}</strong></div>`).join("")}</div>`;
        document.body.appendChild(fallback);
        const html2canvas = (await import("html2canvas")).default;
        canvas = await html2canvas(fallback, { backgroundColor: "#fff", scale: 3 });
        document.body.removeChild(fallback);
      }

      const branded = addBrandedFrame(canvas, title);
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
          const branded = addBrandedFrame(canvas, title);
          const blob = await new Promise<Blob>((r) => branded.toBlob((b) => r(b!), "image/png"));
          files = [new File([blob], `${title.replace(/\s+/g, "-").toLowerCase()}.png`, { type: "image/png" })];
        } catch { /* continue */ }
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
        toast.success("Copied to clipboard!");
      }
    } catch (err: any) {
      if (err?.name !== "AbortError") {
        try {
          await navigator.clipboard.writeText(textSummary);
          toast.success("Copied to clipboard!");
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
    toast.success("Saved locally!");
  };

  return (
    <div className="flex flex-wrap gap-2 mt-4">
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
