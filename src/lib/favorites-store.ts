export interface Feature {
  key: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  href: string;
}

export const allFeatures: Feature[] = [
  { key: "fleure", src: "/image_icone/Lotus.svg", alt: "Lotus", width: 70, height: 70, href: "/wim-hof" },
  { key: "miroire", src: "/image_icone/miroir_affirmation_manche.svg", alt: "Miroir", width: 65, height: 95, href: "/miroir" },
  { key: "appareil", src: "/image_icone/Appareil_photo.svg", alt: "Appareil photo", width: 80, height: 65, href: "/visualisation" },
  { key: "enveloppe", src: "/image_icone/Courrier.svg", alt: "Courrier", width: 70, height: 60, href: "/mot-a-moi" },
  { key: "roue", src: "/images/wheelspinner.png", alt: "Roulette", width: 70, height: 90, href: "/route" },
];

export interface FilRougeItem {
  id: string;
  title: string;
  objectif?: string;
  favori: boolean;
  steps: string[];
}


const STORAGE_KEY = "sorea_fil_rouges_data_v3";
const WHEEL_STORAGE_KEY = "sorea_favori_wheel";

const defaultFilRouges: FilRougeItem[] = [
  {
    id: "conseille",
    title: "FilRouge Conseillé",
    objectif: "Bien démarrer la journée",
    favori: true,
    steps: ["fleure", "miroire", "appareil", "enveloppe", "roue"],
  },
  {
    id: "speciale-vacance",
    title: "Spéciale Vacance",
    objectif: "Être plus productive",
    favori: false,
    steps: ["miroire", "appareil", "roue"],
  },
  {
    id: "journee-chargee",
    title: "Pour ma journée chargée",
    objectif: "Me reposer le plus tôt",
    favori: false,
    steps: ["fleure", "miroire"],
  }
];

function save(items: FilRougeItem[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }
}

export function getFeature(key: string): Feature {
  return allFeatures.find((f) => f.key === key)!;
}

export function getAllFilRouges(): FilRougeItem[] {
  if (typeof window === "undefined") return defaultFilRouges;
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) return JSON.parse(saved);
  return defaultFilRouges;
}

export function getFavoriFilRouge(): FilRougeItem | null {
  const items = getAllFilRouges();
  return items.find((f) => f.favori) || null;
}

export function toggleFavori(id: string) {
  let items = getAllFilRouges();
  items = items.map((f) => ({ ...f, favori: f.id === id ? !f.favori : false }));
  save(items);
}

export function deleteFilRouge(id: string) {
  let items = getAllFilRouges();
  items = items.filter((f) => f.id !== id);
  save(items);
}

export function upsertFilRouge(item: FilRougeItem) {
  let items = getAllFilRouges();
  const exists = items.some((f) => f.id === item.id);
  items = exists ? items.map((f) => (f.id === item.id ? item : f)) : [...items, item];
  save(items);
}

// --- GESTION DE LA ROULETTE FAVORITE ---
export type WheelCategory = "bien-etre" | "nutrition" | "sport";

export function getFavoriWheel(): WheelCategory {
  if (typeof window === "undefined") return "bien-etre";
  return (localStorage.getItem(WHEEL_STORAGE_KEY) as WheelCategory) || "bien-etre";
}

export function setFavoriWheel(category: WheelCategory) {
  if (typeof window !== "undefined") {
    localStorage.setItem(WHEEL_STORAGE_KEY, category);
  }
}