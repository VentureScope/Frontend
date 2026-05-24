"use client";

/** Printable width for A4 with ~10mm side margins at 96dpi. */
const PDF_CONTENT_WIDTH_PX = 718;

function sanitizeFilename(title: string): string {
  const base = title.trim() || "resume";
  const slug = base
    .replace(/[^\w\s-]+/g, "")
    .replace(/\s+/g, "-")
    .toLowerCase();
  return slug || "resume";
}

export function resumePdfFilename(title: string): string {
  return `${sanitizeFilename(title)}-cv.pdf`;
}

function inlineComputedStyles(root: HTMLElement) {
  const nodes = [root, ...Array.from(root.querySelectorAll<HTMLElement>("*"))];

  for (const node of nodes) {
    if (!(node instanceof HTMLElement)) {
      continue;
    }

    const computed = window.getComputedStyle(node);
    node.style.color = computed.color;
    node.style.backgroundColor = computed.backgroundColor;
    node.style.borderTopColor = computed.borderTopColor;
    node.style.borderRightColor = computed.borderRightColor;
    node.style.borderBottomColor = computed.borderBottomColor;
    node.style.borderLeftColor = computed.borderLeftColor;
    node.style.fontSize = computed.fontSize;
    node.style.fontWeight = computed.fontWeight;
    node.style.fontFamily = computed.fontFamily;
    node.style.lineHeight = computed.lineHeight;
    node.style.textAlign = computed.textAlign;
    node.style.boxShadow = "none";
    node.style.filter = "none";
    node.style.backdropFilter = "none";
  }
}

function addCanvasToPdf(
  pdf: InstanceType<(typeof import("jspdf"))["jsPDF"]>,
  imgData: string,
) {
  const marginMm = 10;
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const contentWidth = pageWidth - marginMm * 2;
  const contentHeight = pageHeight - marginMm * 2;

  const imgProps = pdf.getImageProperties(imgData);
  const imgHeightMm = (imgProps.height * contentWidth) / imgProps.width;

  if (imgHeightMm <= contentHeight) {
    pdf.addImage(imgData, "JPEG", marginMm, marginMm, contentWidth, imgHeightMm);
    return;
  }

  let heightLeft = imgHeightMm;
  let offsetY = 0;

  while (heightLeft > 0) {
    pdf.addImage(
      imgData,
      "JPEG",
      marginMm,
      marginMm + offsetY,
      contentWidth,
      imgHeightMm,
    );
    heightLeft -= contentHeight;
    offsetY -= contentHeight;
    if (heightLeft > 0) {
      pdf.addPage();
    }
  }
}

export async function downloadResumePdf(
  element: HTMLElement,
  filename: string,
): Promise<void> {
  const surface =
    element.querySelector<HTMLElement>(".resume-print-surface") ?? element;

  const prevWidth = surface.style.width;
  const prevMaxWidth = surface.style.maxWidth;
  const prevBoxSizing = surface.style.boxSizing;
  const prevBackground = surface.style.backgroundColor;

  surface.style.width = `${PDF_CONTENT_WIDTH_PX}px`;
  surface.style.maxWidth = `${PDF_CONTENT_WIDTH_PX}px`;
  surface.style.boxSizing = "border-box";
  surface.style.backgroundColor = "#ffffff";

  try {
    const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
      import("html2canvas"),
      import("jspdf"),
    ]);

    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => resolve());
    });

    const canvas = await html2canvas(surface, {
      scale: 2,
      backgroundColor: "#ffffff",
      useCORS: true,
      logging: false,
      width: PDF_CONTENT_WIDTH_PX,
      windowWidth: PDF_CONTENT_WIDTH_PX,
      scrollX: 0,
      scrollY: 0,
      onclone: (_clonedDoc, clonedNode) => {
        if (!(clonedNode instanceof HTMLElement)) {
          return;
        }
        clonedNode.style.width = `${PDF_CONTENT_WIDTH_PX}px`;
        clonedNode.style.maxWidth = `${PDF_CONTENT_WIDTH_PX}px`;
        clonedNode.style.boxSizing = "border-box";
        clonedNode.style.backgroundColor = "#ffffff";
        clonedNode.style.boxShadow = "none";
        clonedNode.style.border = "none";
        inlineComputedStyles(clonedNode);
      },
    });

    if (canvas.width === 0 || canvas.height === 0) {
      throw new Error("PDF capture produced an empty canvas");
    }

    const imgData = canvas.toDataURL("image/jpeg", 0.95);
    const pdf = new jsPDF({
      unit: "mm",
      format: "a4",
      orientation: "portrait",
    });

    addCanvasToPdf(pdf, imgData);
    pdf.save(filename);
  } finally {
    surface.style.width = prevWidth;
    surface.style.maxWidth = prevMaxWidth;
    surface.style.boxSizing = prevBoxSizing;
    surface.style.backgroundColor = prevBackground;
  }
}
