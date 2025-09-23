export const COLORS = {
  BRAND_DARK: "#211C84",
  BRAND: "#0065F8",
  BRAND_LIGHT: "#00CAFF",
  BRAND_SOFT: "#A3D8FF",
  BASE: {
    WHITE: "#FFFFFF",
    LIGHT: "#F5F5F5",
    BLACK: "#000000",
  },
} as const;

export function withAlpha(hex: string, alpha: number) {
  const h = hex.replace("#", "");
  const bigint = parseInt(
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h,
    16
  );
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
