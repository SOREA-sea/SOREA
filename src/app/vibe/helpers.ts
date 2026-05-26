export function wIcon(code: number): string {
  if (code === 800) return "☀️";
  if (code === 801) return "🌤️";
  if (code === 802 || code === 803 || code === 804) return "☁️";
  if (code >= 200 && code < 300) return "⛈️";
  if (code >= 300 && code < 400) return "🌦️";
  if (code >= 500 && code < 600) return "🌧️";
  if (code >= 600 && code < 700) return "❄️";
  if (code >= 700 && code < 800) return "🌫️";
  if (code === 0) return "☀️"; if (code <= 2) return "🌤️"; if (code <= 3) return "☁️";
  if (code <= 48) return "🌫️"; if (code <= 57) return "🌧️"; if (code <= 67) return "🌧️";
  if (code <= 77) return "❄️"; if (code <= 82) return "🌧️"; if (code <= 99) return "⛈️";
  return "🌡️";
}
export function wLabel(code: number): string {
  if (code === 800) return "Ensoleillé";
  if (code === 801) return "Peu nuageux";
  if (code === 802 || code === 803 || code === 804) return "Nuageux";
  if (code >= 200 && code < 300) return "Orage";
  if (code >= 300 && code < 400) return "Bruine";
  if (code >= 500 && code < 600) return "Pluie";
  if (code >= 600 && code < 700) return "Neige";
  if (code >= 700 && code < 800) return "Brouillard";
  if (code === 0) return "Ensoleillé"; if (code <= 2) return "Peu nuageux"; if (code <= 3) return "Nuageux";
  if (code <= 48) return "Brouillard"; if (code <= 57) return "Bruine"; if (code <= 67) return "Pluie";
  if (code <= 77) return "Neige"; if (code <= 82) return "Averses"; return "Orage";
}
export function shortDay(date: Date): string {
  return date.toLocaleDateString("fr-FR", { weekday: "short" })
    .replace(".", "").slice(0, 3).replace(/^[A-Za-zÀ-ÖØ-öø-ÿ]/, c => c.toUpperCase());
}

export async function reverseGeocode(lat: number, lon: number): Promise<string> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;
    const res = await fetch(url, { headers: { "User-Agent": "SOREA-App/1.0 (your-email@example.com)" } });
    if (!res.ok) return "Localité inconnue";
    const data = await res.json();
    const addr = data?.address ?? {};
    return addr.city || addr.town || addr.village || addr.hamlet || addr.county || addr.state || data?.display_name || "Localité inconnue";
  } catch {
    return "Localité inconnue";
  }
}
