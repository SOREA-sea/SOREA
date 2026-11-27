// Appareil d'une connexion (liste « Connexions actives » de /dashboard/profile).
// Le navigateur et le système sont déduits de l'en-tête User-Agent, enregistré à la création de la session.

// En-tête User-Agent de la requête, raccourci (null s'il est absent)
export function userAgentDe(request: Request): string | null {
  const ua = request.headers.get("user-agent");
  return ua ? ua.slice(0, 300) : null;
}

// « Chrome sur Windows », « Safari sur iPhone »... (l'ordre des tests compte : Edge et Opera contiennent « Chrome »)
export function decrireAppareil(ua: string | null | undefined): string {
  if (!ua) return "Appareil inconnu";

  const navigateur = /Edg\//.test(ua)
    ? "Edge"
    : /OPR\/|Opera/.test(ua)
    ? "Opera"
    : /Firefox\//.test(ua)
    ? "Firefox"
    : /Chrome\/|CriOS\//.test(ua)
    ? "Chrome"
    : /Safari\//.test(ua)
    ? "Safari"
    : "Navigateur inconnu";

  const systeme = /iPhone/.test(ua)
    ? "iPhone"
    : /iPad/.test(ua)
    ? "iPad"
    : /Android/.test(ua)
    ? "Android"
    : /Windows/.test(ua)
    ? "Windows"
    : /Mac OS X|Macintosh/.test(ua)
    ? "Mac"
    : /Linux/.test(ua)
    ? "Linux"
    : null;

  return systeme ? `${navigateur} sur ${systeme}` : navigateur;
}
