"use client";

import { useState, useEffect } from "react";

interface ProfileData {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl: string | null;
  role: string;
  createdAt: string;
  twoFactorEnabled?: boolean;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [twoFactorSetupState, setTwoFactorSetupState] = useState<{
    secret?: string;
    qrCode?: string;
    backupCodes?: string[];
    showing?: boolean;
  }>({});
  const [twoFactorProcessing, setTwoFactorProcessing] = useState(false);
  const [showDisableModal, setShowDisableModal] = useState(false);
  const [disablePassword, setDisablePassword] = useState("");
  const [disableError, setDisableError] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const res = await fetch("/api/dashboard/profile");
      if (!res.ok) throw new Error("Erreur lors du chargement du profil");
      const data = await res.json();
      setProfile(data);
      setFormData({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
      });
    } catch (error) {
      setMessage({ type: "error", text: "Impossible de charger le profil" });
    } finally {
      setIsLoading(false);
    }
  };

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

      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de la mise à jour");
      }

      setProfile(data.user);
      setMessage({ type: "success", text: "Profil mis à jour avec succès !" });

      // Auto-clear success message
      setTimeout(() => setMessage(null), 4000);
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header>
        <p className="text-xs uppercase tracking-[0.28em] text-foreground/50">Paramètres</p>
        <h1 className="text-3xl md:text-4xl font-black section-title mt-1">Mon profil</h1>
        <p className="text-foreground/60 mt-2">
          Gérez vos informations personnelles et vos préférences.
        </p>
      </header>

      {/* Profile info card */}
      {profile && (
        <div className="glass-panel rounded-3xl p-6 flex items-center gap-5">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-white/80 shadow ring-2 ring-white/60 shrink-0">
            <img
              src={profile.avatarUrl || "/images/logo_sorea.webp"}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
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

      {/* Edit form */}
      <form onSubmit={handleSubmit} className="glass-panel rounded-3xl p-8 space-y-6">
        <h2 className="text-xl font-bold">Modifier mes informations</h2>

        {message && (
          <div
            className={`p-4 rounded-2xl text-sm font-medium ${
              message.type === "success"
                ? "bg-green-50/80 text-green-700 border border-green-200"
                : "bg-red-50/80 text-red-600 border border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-sm font-medium ml-1">Prénom</label>
            <input
              type="text"
              name="firstName"
              required
              value={formData.firstName}
              onChange={handleChange}
              className="w-full p-4 rounded-full border border-white/80 bg-white/75 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] outline-none focus:ring-2 focus:ring-purple-300 transition-all placeholder:text-gray-400"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium ml-1">Nom</label>
            <input
              type="text"
              name="lastName"
              required
              value={formData.lastName}
              onChange={handleChange}
              className="w-full p-4 rounded-full border border-white/80 bg-white/75 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] outline-none focus:ring-2 focus:ring-purple-300 transition-all placeholder:text-gray-400"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium ml-1">Adresse email</label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full p-4 rounded-full border border-white/80 bg-white/75 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] outline-none focus:ring-2 focus:ring-purple-300 transition-all placeholder:text-gray-400"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="btn-primary px-8 py-3.5 flex items-center gap-2 hover:scale-[1.02] transition-transform disabled:opacity-70 disabled:hover:scale-100 cursor-pointer"
          >
            {isSaving ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Enregistrement...
              </>
            ) : (
              "Enregistrer les modifications"
            )}
          </button>
        </div>
      </form>

      {/* 2FA Controls */}
      <div className="glass-panel rounded-3xl p-8 space-y-4">
        <h2 className="text-xl font-bold">Authentification à deux facteurs (2FA)</h2>
        {profile && (
          <p className="text-sm">Statut actuel: <strong>{profile.twoFactorEnabled ? 'Activée' : 'Désactivée'}</strong></p>
        )}

        {!profile?.twoFactorEnabled ? (
          <div className="space-y-3">
            {!twoFactorSetupState.showing ? (
              <button
                onClick={async () => {
                  setTwoFactorProcessing(true);
                  try {
                    const res = await fetch('/api/auth/2fa/setup');
                    const data = await res.json();
                    if (!res.ok) throw new Error(data.error || 'Impossible de générer le secret 2FA');
                    setTwoFactorSetupState({ secret: data.secret, qrCode: data.qrCode, backupCodes: data.backupCodes, showing: true });
                  } catch (err: any) {
                    setMessage({ type: 'error', text: err.message || 'Erreur' });
                  } finally { setTwoFactorProcessing(false); }
                }}
                className="btn-primary px-6 py-2"
                disabled={twoFactorProcessing}
              >{twoFactorProcessing ? 'Génération...' : 'Activer la 2FA'}</button>
            ) : (
              <div className="space-y-3">
                {twoFactorSetupState.qrCode && (
                  <img src={twoFactorSetupState.qrCode} alt="QR" className="w-36 h-36 border" />
                )}
                <p className="text-sm">Scannez le QR code avec votre application 2FA et entrez le code ci-dessous :</p>
                <input id="twofa_code" className="p-3 rounded border w-48" placeholder="000000" />
                <div className="flex gap-3">
                  <button onClick={async () => {
                    const el = document.getElementById('twofa_code') as HTMLInputElement | null;
                    const code = el?.value?.trim();
                    if (!code || !/^\d{6}$/.test(code)) { setMessage({ type: 'error', text: 'Entrez un code valide de 6 chiffres.' }); return; }
                    setTwoFactorProcessing(true);
                    try {
                      const res = await fetch('/api/auth/2fa/verify', {
                        method: 'POST', headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ secret: twoFactorSetupState.secret, code, backupCodes: twoFactorSetupState.backupCodes || [] })
                      });
                      const data = await res.json();
                      if (!res.ok) throw new Error(data.error || 'Erreur activation 2FA');
                      setMessage({ type: 'success', text: '2FA activée avec succès.' });
                      setProfile(prev => prev ? { ...prev, twoFactorEnabled: true } : prev);
                      setTwoFactorSetupState({});
                    } catch (err: any) { setMessage({ type: 'error', text: err.message || 'Erreur' }); }
                    finally { setTwoFactorProcessing(false); }
                  }} className="btn-primary px-4 py-2" disabled={twoFactorProcessing}>Vérifier et activer</button>
                  <button onClick={() => setTwoFactorSetupState({})} className="px-4 py-2 bg-gray-200 rounded">Annuler</button>
                </div>
                {twoFactorSetupState.backupCodes && (
                  <div className="text-sm text-foreground/60">Codes de secours: {twoFactorSetupState.backupCodes.join(', ')}</div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <button
              className="btn-primary px-6 py-2"
              onClick={() => {
                setDisablePassword("");
                setDisableError(null);
                setShowDisableModal(true);
              }}
              disabled={twoFactorProcessing}
            >{twoFactorProcessing ? 'Traitement...' : 'Désactiver la 2FA'}</button>

            {/* Disable confirmation modal */}
            {showDisableModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <div className="bg-white rounded-2xl p-6 w-full max-w-md">
                  <h3 className="text-lg font-bold mb-2">Confirmer la désactivation</h3>
                  <p className="text-sm text-foreground/60 mb-4">Entrez votre mot de passe pour confirmer la désactivation de l'authentification à deux facteurs.</p>

                  {disableError && (
                    <div className="p-3 mb-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded">{disableError}</div>
                  )}

                  <input
                    type="password"
                    value={disablePassword}
                    onChange={(e) => setDisablePassword(e.target.value)}
                    placeholder="Mot de passe"
                    className="w-full p-3 rounded-full border mb-4"
                  />

                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => { setShowDisableModal(false); setDisablePassword(""); setDisableError(null); }}
                      className="px-4 py-2 bg-gray-200 rounded-full"
                    >Annuler</button>
                    <button
                      onClick={async () => {
                        setDisableError(null);
                        if (!disablePassword) { setDisableError('Veuillez entrer votre mot de passe'); return; }
                        setTwoFactorProcessing(true);
                        try {
                          const res = await fetch('/api/auth/2fa/disable', {
                            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: disablePassword })
                          });
                          const data = await res.json();
                          if (!res.ok) throw new Error(data.error || 'Erreur lors de la désactivation');
                          setMessage({ type: 'success', text: '2FA désactivée.' });
                          setProfile(prev => prev ? { ...prev, twoFactorEnabled: false } : prev);
                          setShowDisableModal(false);
                        } catch (err: any) {
                          setDisableError(err.message || 'Erreur');
                        } finally {
                          setTwoFactorProcessing(false);
                          setDisablePassword("");
                        }
                      }}
                      className="btn-primary px-4 py-2"
                      disabled={twoFactorProcessing}
                    >{twoFactorProcessing ? 'Traitement...' : 'Confirmer'}</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}