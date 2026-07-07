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

// J'ai ajouté "_v2" ici pour forcer ton navigateur à oublier l'ancienne sauvegarde
const STORAGE_KEY = "sorea_fil_rouges_data_v2";

// On ne laisse que le Fil Rouge conseillé par défaut
const defaultFilRouges: FilRougeItem[] = [
  {
    id: "conseille",
    title: "FilRouge Conseillé",
    objectif: "Bien démarrer la journée",
    favori: true,
    steps: ["fleure", "miroire", "appareil", "enveloppe", "roue"],
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