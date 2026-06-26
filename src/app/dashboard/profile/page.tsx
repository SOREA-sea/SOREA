"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

interface ProfileData {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl: string | null;
  role: string;
  createdAt: string;
  twoFactorEnabled?: boolean;
  timezone?: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", timezone: "Europe/Paris" });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Avatar
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);

  // 2FA
  const [twoFASetup, setTwoFASetup] = useState<{ secret?: string; qrCode?: string } | null>(null);
  const [twoFACode, setTwoFACode] = useState("");
  const [twoFAProcessing, setTwoFAProcessing] = useState(false);
  const [twoFAMessage, setTwoFAMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showDisable2FA, setShowDisable2FA] = useState(false);
  const [disablePassword, setDisablePassword] = useState("");

  useEffect(() => { fetchProfile(); }, []);

  async function fetchProfile() {
    try {
      const res = await fetch("/api/dashboard/profile");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setProfile(data);
      setFormData({ firstName: data.firstName, lastName: data.lastName, email: data.email, timezone: data.timezone || "Europe/Paris" });
    } catch {
      setMessage({ type: "error", text: "Impossible de charger le profil" });
    } finally {
      setIsLoading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/dashboard/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      setProfile(data.user);
      setMessage({ type: "success", text: "Profil mis à jour avec succès !" });
      setTimeout(() => setMessage(null), 4000);
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarUploading(true);
    try {
      const fd = new FormData();
      fd.append("avatar", file);
      const res = await fetch("/api/dashboard/avatar", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur upload");
      setProfile((prev) => prev ? { ...prev, avatarUrl: data.avatarUrl } : prev);
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setAvatarUploading(false);
    }
  };

  const handle2FAEnable = async () => {
    setTwoFAProcessing(true);
    setTwoFAMessage(null);
    try {
      const res = await fetch("/api/auth/2fa/setup");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      // On stocke secret et qrCode mais PAS les backupCodes (ne pas afficher)
      setTwoFASetup({ secret: data.secret, qrCode: data.qrCode });
    } catch (err: any) {
      setTwoFAMessage({ type: "error", text: err.message });
    } finally {
      setTwoFAProcessing(false);
    }
  };

  const handle2FAVerify = async () => {
    if (!twoFACode || !/^\d{6}$/.test(twoFACode)) {
      setTwoFAMessage({ type: "error", text: "Code à 6 chiffres requis." });
      return;
    }
    setTwoFAProcessing(true);
    try {
      const res = await fetch("/api/auth/2fa/setup");
      const setupData = await res.json();
      const res2 = await fetch("/api/auth/2fa/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret: twoFASetup?.secret, code: twoFACode, backupCodes: setupData.backupCodes || [] }),
      });
      const data = await res2.json();
      if (!res2.ok) throw new Error(data.error || "Erreur");
      setProfile((prev) => prev ? { ...prev, twoFactorEnabled: true } : prev);
      setTwoFASetup(null);
      setTwoFACode("");
      setTwoFAMessage({ type: "success", text: "Double authentification activée avec succès !" });
    } catch (err: any) {
      setTwoFAMessage({ type: "error", text: err.message });
    } finally {
      setTwoFAProcessing(false);
    }
  };

  const handle2FADisable = async () => {
    if (!disablePassword) return;
    setTwoFAProcessing(true);
    try {
      const res = await fetch("/api/auth/2fa/disable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: disablePassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      setProfile((prev) => prev ? { ...prev, twoFactorEnabled: false } : prev);
      setShowDisable2FA(false);
      setDisablePassword("");
      setTwoFAMessage({ type: "success", text: "Double authentification désactivée." });
    } catch (err: any) {
      setTwoFAMessage({ type: "error", text: err.message });
    } finally {
      setTwoFAProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs uppercase tracking-[0.28em] text-foreground/50">Paramètres</p>
        <h1 className="text-3xl md:text-4xl font-black section-title mt-1">Mon profil</h1>
        <p className="text-foreground/60 mt-2">Gérez vos informations personnelles et vos préférences.</p>
      </header>

      {/* Carte identité + photo modifiable */}
      {profile && (
        <div className="glass-panel rounded-3xl p-6 flex items-center gap-5">
          <div className="relative shrink-0">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={avatarUploading}
              className="group w-16 h-16 rounded-full overflow-hidden bg-white/80 shadow ring-2 ring-white/60 block cursor-pointer relative"
              title="Modifier la photo"
            >
              <img
                src={profile.avatarUrl || "/images/logo_sorea.webp"}
                alt="Avatar"
                className="w-full h-full object-cover transition-opacity group-hover:opacity-70"
              />
              <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/25 rounded-full">
                {avatarUploading ? (
                  <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </span>
            </button>
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={handleAvatarChange} />
          </div>
          <div>
            <p className="font-bold text-lg">{profile.firstName} {profile.lastName}</p>
            <p className="text-foreground/50 text-sm">{profile.email}</p>
            <p className="text-foreground/40 text-xs mt-1">
              Membre depuis le {new Date(profile.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
        </div>
      )}

      {/* Messagerie */}
      <div className="glass-panel rounded-3xl p-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-bold">Messagerie Mot à moi</h2>
          <p className="text-foreground/60 mt-1">Consultez vos photos, audios et vidéos programmés pour votre futur vous.</p>
        </div>
        <Link href="/dashboard/messagerie" className="btn-primary px-6 py-3 text-center">Ouvrir ma messagerie</Link>
      </div>

      {/* Formulaire infos */}
      <form onSubmit={handleSubmit} className="glass-panel rounded-3xl p-8 space-y-6">
        <h2 className="text-xl font-bold">Modifier mes informations</h2>

        {message && (
          <div className={`p-4 rounded-2xl text-sm font-medium ${message.type === "success" ? "bg-green-50/80 text-green-700 border border-green-200" : "bg-red-50/80 text-red-600 border border-red-200"}`}>
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-sm font-medium ml-1">Prénom</label>
            <input type="text" name="firstName" required value={formData.firstName}
              onChange={(e) => setFormData((p) => ({ ...p, firstName: e.target.value }))}
              className="w-full p-4 rounded-full border border-white/80 bg-white/75 outline-none focus:ring-2 focus:ring-purple-300 transition-all" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium ml-1">Nom</label>
            <input type="text" name="lastName" required value={formData.lastName}
              onChange={(e) => setFormData((p) => ({ ...p, lastName: e.target.value }))}
              className="w-full p-4 rounded-full border border-white/80 bg-white/75 outline-none focus:ring-2 focus:ring-purple-300 transition-all" />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium ml-1">Adresse email</label>
          <input type="email" name="email" required value={formData.email}
            onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
            className="w-full p-4 rounded-full border border-white/80 bg-white/75 outline-none focus:ring-2 focus:ring-purple-300 transition-all" />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium ml-1">Fuseau horaire</label>
          <select name="timezone" value={formData.timezone}
            onChange={(e) => setFormData((p) => ({ ...p, timezone: e.target.value }))}
            className="w-full p-4 rounded-full border border-white/80 bg-white/75 outline-none focus:ring-2 focus:ring-purple-300 transition-all">
            <option value="Europe/Paris">Heure d'Europe Centrale (Paris, Bruxelles, etc.)</option>
            <option value="America/Montreal">Heure de l'Est (Montréal, New York, etc.)</option>
            <option value="Europe/London">Heure de Greenwich (Londres, etc.)</option>
            <option value="Indian/Reunion">Heure de La Réunion</option>
            <option value="America/Guadeloupe">Heure de la Guadeloupe / Martinique</option>
            <option value="Pacific/Noumea">Heure de Nouvelle-Calédonie</option>
            <option value="Pacific/Tahiti">Heure de Tahiti</option>
          </select>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={isSaving}
            className="btn-primary px-8 py-3.5 flex items-center gap-2 hover:scale-[1.02] transition-transform disabled:opacity-70 cursor-pointer">
            {isSaving ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Enregistrement...
              </>
            ) : "Enregistrer les modifications"}
          </button>
        </div>
      </form>

      {/* 2FA — sans affichage des codes de secours */}
      <div className="glass-panel rounded-3xl p-8 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Double authentification (2FA)</h2>
            <p className="text-foreground/60 text-sm mt-1">Renforcez la sécurité de votre compte.</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${profile?.twoFactorEnabled ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
            {profile?.twoFactorEnabled ? "Activée" : "Désactivée"}
          </span>
        </div>

        {twoFAMessage && (
          <div className={`p-3 rounded-2xl text-sm font-medium ${twoFAMessage.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
            {twoFAMessage.text}
          </div>
        )}

        {!profile?.twoFactorEnabled ? (
          !twoFASetup ? (
            <button onClick={handle2FAEnable} disabled={twoFAProcessing} className="btn-primary px-6 py-3">
              {twoFAProcessing ? "Génération..." : "Activer la 2FA"}
            </button>
          ) : (
            <div className="space-y-4">
              {twoFASetup.qrCode && (
                <div className="flex justify-center">
                  <img src={twoFASetup.qrCode} alt="QR 2FA" className="w-36 h-36 rounded-2xl border border-white/60 shadow" />
                </div>
              )}
              <p className="text-sm text-foreground/60 text-center">Scannez le QR code avec votre application 2FA puis entrez le code à 6 chiffres :</p>
              <input
                type="text"
                maxLength={6}
                placeholder="000000"
                value={twoFACode}
                onChange={(e) => setTwoFACode(e.target.value.replace(/\D/g, ""))}
                className="w-full p-4 rounded-full border border-white/80 bg-white/75 text-center text-2xl tracking-widest outline-none focus:ring-2 focus:ring-purple-300"
              />
              <div className="flex gap-3">
                <button onClick={handle2FAVerify} disabled={twoFAProcessing} className="btn-primary flex-1 py-3">
                  {twoFAProcessing ? "Vérification..." : "Vérifier et activer"}
                </button>
                <button onClick={() => { setTwoFASetup(null); setTwoFACode(""); }} className="flex-1 py-3 bg-white/60 rounded-full hover:bg-white/80 transition-all font-medium">
                  Annuler
                </button>
              </div>
            </div>
          )
        ) : (
          !showDisable2FA ? (
            <button onClick={() => setShowDisable2FA(true)} className="px-6 py-3 bg-red-50 text-red-600 rounded-full font-medium hover:bg-red-100 transition-all">
              Désactiver la 2FA
            </button>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-foreground/60">Entrez votre mot de passe pour confirmer la désactivation :</p>
              <input
                type="password"
                placeholder="Mot de passe"
                value={disablePassword}
                onChange={(e) => setDisablePassword(e.target.value)}
                className="w-full p-4 rounded-full border border-white/80 bg-white/75 outline-none focus:ring-2 focus:ring-red-200"
              />
              <div className="flex gap-3">
                <button onClick={handle2FADisable} disabled={twoFAProcessing} className="flex-1 py-3 bg-red-500 text-white rounded-full font-medium hover:bg-red-600 transition-all">
                  {twoFAProcessing ? "Traitement..." : "Confirmer"}
                </button>
                <button onClick={() => { setShowDisable2FA(false); setDisablePassword(""); }} className="flex-1 py-3 bg-white/60 rounded-full hover:bg-white/80 transition-all font-medium">
                  Annuler
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}