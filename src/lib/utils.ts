import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import L from "leaflet";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function dedupeConsecutive(points: [number, number][]) {
  const out: [number, number][] = []
  for (const p of points) {
    const last = out[out.length - 1]
    if (!last || Math.abs(last[0] - p[0]) > 1e-9 || Math.abs(last[1] - p[1]) > 1e-9) {
      out.push(p)
    }
  }
  return out
}

export function round6(n: number) {
  return Math.round(n * 1e6) / 1e6
}

export function initializeLeafletIcons() {
  // This check is to prevent the code from running on the server
  if (typeof window !== "undefined") {
    import("leaflet").then((L) => {
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });
    });
  }
}