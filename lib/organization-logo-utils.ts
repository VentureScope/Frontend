const SUPPORTED_LOGO_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export function isSupportedOrganizationLogoMime(mime: string): boolean {
  return SUPPORTED_LOGO_MIME.has(mime);
}

/** Convert a data URL from the wizard draft into a `File` for multipart upload. */
export function dataUrlToLogoFile(dataUrl: string): File | null {
  try {
    const match = /^data:([^;]+);base64,(.+)$/.exec(dataUrl);
    if (!match) return null;

    const mime = match[1];
    const base64 = match[2];
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    const ext =
      mime === "image/jpeg"
        ? "jpg"
        : mime === "image/webp"
          ? "webp"
          : mime === "image/png"
            ? "png"
            : "bin";

    return new File([bytes], `logo.${ext}`, { type: mime });
  } catch {
    return null;
  }
}
