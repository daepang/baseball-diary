export async function compressImage(
  file: File,
  opts: { maxSize?: number; quality?: number } = {}
): Promise<File> {
  const { maxSize = 1600, quality = 0.8 } = opts;

  const imageBitmap = await createImageBitmap(file);
  const { width, height } = imageBitmap;

  const scale = Math.min(1, maxSize / Math.max(width, height));
  const targetW = Math.max(1, Math.round(width * scale));
  const targetH = Math.max(1, Math.round(height * scale));

  // 가능하면 OffscreenCanvas를 사용하고, 지원되지 않으면 HTMLCanvasElement로 대체합니다.
  let blob: Blob;
  if (typeof OffscreenCanvas !== "undefined") {
    const canvas = new OffscreenCanvas(targetW, targetH);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Failed to get 2D context");
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(imageBitmap, 0, 0, targetW, targetH);
    blob = await canvas.convertToBlob({ type: "image/jpeg", quality });
  } else {
    const canvas = document.createElement("canvas");
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Failed to get 2D context");
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(imageBitmap, 0, 0, targetW, targetH);
    const dataUrl = canvas.toDataURL("image/jpeg", quality);
    const res = await fetch(dataUrl);
    blob = await res.blob();
  }

  return new File([blob], file.name.replace(/\.[^.]+$/, ".jpg"), {
    type: "image/jpeg",
    lastModified: Date.now(),
  });
}

export async function fileToDataURL(file: File): Promise<string> {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
