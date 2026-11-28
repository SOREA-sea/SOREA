// Durée des connexions : une connexion reste ouverte jusqu'à ce que l'utilisatrice se déconnecte
// (« Se déconnecter », « Déconnecter » dans Connexions actives, ou changement de mot de passe).
//
// - En base, la session reçoit une échéance lointaine (100 ans) : en pratique, elle ne s'arrête jamais seule.
// - Le cookie, lui, ne peut pas vivre plus de 400 jours dans les navigateurs : il est donc renouvelé
//   à chaque visite par /api/auth/me (renouvelerCookieSession). Sans visite pendant 400 jours, il faudra se reconnecter.

const JOUR = 24 * 60 * 60;

export const echeanceSession = () => new Date(Date.now() + 100 * 365 * JOUR * 1000);

export function optionsCookieSession() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 400 * JOUR,
    path: "/",
  };
}
