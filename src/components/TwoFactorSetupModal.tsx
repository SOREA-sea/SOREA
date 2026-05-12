"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

interface TwoFactorSetupModalProps {
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  onComplete: () => void;
  pendingId: string | null;
}

interface TwoFactorData {
  secret: string;
  qrCode: string;
  backupCodes: string[];
}

export default function TwoFactorSetupModal({
  isOpen,
  isLoading,
  onClose,
  onComplete,
  pendingId,
}: TwoFactorSetupModalProps) {
  const [step, setStep] = useState<"setup" | "verify" | "backup">("setup");
  const [twoFactorData, setTwoFactorData] = useState<TwoFactorData | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Fetch 2FA setup data
  useEffect(() => {
    if (isOpen && step === "setup" && !twoFactorData) {
      fetchSetupData();
    }
  }, [isOpen, step]);

  const fetchSetupData = async () => {
    try {
      const res = await fetch("/api/auth/2fa/setup", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const data = await res.json();
        // 2FA might already be enabled or other error - skip setup
        if (res.status === 400) {
          onComplete();
          return;
        }
        throw new Error(data.error || "Erreur lors de la génération du secret 2FA");
      }

      const data = await res.json();
      setTwoFactorData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la génération du secret");
    }
  };

const handleVerifyCode = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(null);
  setVerifyLoading(true);

  try {
    const res = await fetch("/api/auth/register/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pendingId: pendingId, // ID récupéré du cookie
        totpCode: code,      // 'code' est ton state local, envoyé sous le nom 'totpCode'
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Le code 2FA est incorrect");
    }

    // Si ça marche, on passe aux codes de secours
    setStep("backup");
    setCode("");
  } catch (err) {
    setError(err instanceof Error ? err.message : "Erreur de vérification");
  } finally {
    setVerifyLoading(false);
  }
};

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleClose = () => {
    // During registration, 2FA setup is MANDATORY - cannot close
    // Only allow closing after verification is complete
    if (step === "backup" && showBackupCodes) {
      onComplete();
    } else if (step === "setup" || step === "verify") {
      // Prevent closing during setup or verification
      alert("La configuration de l'authentification à deux facteurs est obligatoire pour sécuriser votre compte.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[20px] max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-[#212121]">
            {step === "setup" && "Sécurisez votre compte"}
            {step === "verify" && "Vérifiez votre code"}
            {step === "backup" && "Codes de secours"}
          </h2>
          <button
            onClick={handleClose}
            className="text-2xl disabled:opacity-50 disabled:cursor-not-allowed text-gray-500 hover:text-gray-700"
            disabled={step !== "backup" || !showBackupCodes}
            title={step !== "backup" ? "La configuration 2FA est obligatoire" : "Fermer"}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Setup Step */}
          {step === "setup" && twoFactorData && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-[#212121] mb-4">
                  Authentification à deux facteurs (2FA)
                </h3>
                <p className="text-gray-600 mb-4">
                  Renforcez la sécurité de votre compte avec l'authentification à deux facteurs. Vous devrez entrer
                  un code 6 chiffres en plus de votre mot de passe à chaque connexion.
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-[10px] p-4">
                <p className="text-sm text-blue-800 font-semibold mb-3">📱 Étapes :</p>
                <ol className="text-sm text-blue-700 space-y-2 list-decimal list-inside">
                  <li>Téléchargez <strong>Google Authenticator</strong>, <strong>Microsoft Authenticator</strong> ou <strong>Authy</strong></li>
                  <li>Scannez le QR code ci-dessous avec votre application</li>
                  <li>Conservez les codes de secours en lieu sûr</li>
                  <li>Vérifiez le code 6 chiffres de votre application</li>
                </ol>
              </div>

              {/* QR Code */}
              <div className="flex justify-center">
                <div className="bg-white border-4 border-gray-200 rounded-[10px] p-4">
                  {twoFactorData.qrCode && (
                    <img
                      src={twoFactorData.qrCode}
                      alt="QR Code"
                      width={250}
                      height={250}
                      className="rounded-[5px]"
                    />
                  )}
                </div>
              </div>

              {/* Manual Entry */}
              <div className="bg-gray-50 rounded-[10px] p-4">
                <p className="text-sm text-gray-600 font-semibold mb-2">Si vous ne pouvez pas scanner :</p>
                <p className="text-sm font-mono bg-white p-3 rounded-[5px] break-all text-center">
                  {twoFactorData.secret}
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-[10px]">
                  {error}
                </div>
              )}

              {/* Button */}
              <button
                onClick={() => setStep("verify")}
                disabled={isLoading}
                className="w-full h-[50px] bg-[#6A18A4] text-white rounded-[10px] font-bold text-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
              >
                {isLoading ? (
                  <svg className="animate-spin mx-auto h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : "J'ai scannné le code"}
              </button>
            </div>
          )}

          {/* Verify Step */}
          {step === "verify" && (
            <form onSubmit={handleVerifyCode} className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-[#212121] mb-3">
                  Vérifiez votre code 2FA
                </h3>
                <p className="text-gray-600 text-sm">
                  Entrez le code 6 chiffres de votre application d'authentification
                </p>
              </div>

              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-[10px]">
                  {error}
                </div>
              )}

              <div className="space-y-3">
                <label className="text-lg font-semibold text-[#212121]">Code TOTP</label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="000000"
                  className="w-full h-[55px] px-4 rounded-[10px] border-2 border-gray-300 text-2xl text-center tracking-[0.2em] font-mono font-bold text-[#212121] outline-none focus:border-[#6A18A4] transition-colors"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep("setup")}
                  disabled={verifyLoading}
                  className="flex-1 h-[50px] bg-gray-300 text-[#212121] rounded-[10px] font-bold text-lg hover:opacity-80 disabled:opacity-50 transition-opacity"
                >
                  Retour
                </button>
                <button
                  type="submit"
                  disabled={verifyLoading || code.length !== 6}
                  className="flex-1 h-[50px] bg-[#6A18A4] text-white rounded-[10px] font-bold text-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
                >
                  {verifyLoading ? (
                    <svg className="animate-spin mx-auto h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : "Vérifier"}
                </button>
              </div>
            </form>
          )}

          {/* Backup Codes Step */}
          {step === "backup" && twoFactorData && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-[#212121] mb-3">
                  ✅ 2FA Activée avec succès!
                </h3>
                <p className="text-gray-600 text-sm">
                  Vous pouvez maintenant vous connecter avec votre code 2FA.
                </p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-[10px] p-4">
                <p className="text-sm text-yellow-800 font-semibold mb-3">⚠️ Codes de secours</p>
                <p className="text-sm text-yellow-700 mb-4">
                  Conservez ces codes dans un endroit sûr. Vous pouvez les utiliser si vous perdez accès à votre application 2FA.
                </p>

                {/* Backup Codes List */}
                <div className="space-y-2 max-h-[300px] overflow-y-auto bg-white p-3 rounded-[5px] border border-yellow-200">
                  {twoFactorData.backupCodes.map((code, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-[5px] group cursor-pointer"
                      onClick={() => copyToClipboard(code)}
                    >
                      <span className="font-mono font-bold text-gray-700">{code}</span>
                      <button
                        type="button"
                        className="opacity-0 group-hover:opacity-100 text-sm text-gray-500 hover:text-gray-700 transition-opacity"
                        title="Copier"
                      >
                        {copiedCode === code ? "✓ Copié" : "📋"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Show All Codes Toggle */}
              <button
                type="button"
                onClick={() => setShowBackupCodes(!showBackupCodes)}
                className="text-sm text-[#6A18A4] font-semibold hover:underline"
              >
                {showBackupCodes ? "Masquer les codes" : "Afficher les codes"}
              </button>

              {/* Acknowledgement */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="backup-ack"
                  className="mt-1 w-5 h-5 rounded border-gray-300 cursor-pointer"
                  onChange={(e) => setShowBackupCodes(!e.target.checked)}
                  checked={!showBackupCodes}
                />
                <label htmlFor="backup-ack" className="text-sm text-gray-600 cursor-pointer">
                  J'ai conservé mes codes de secours dans un endroit sûr
                </label>
              </div>

              {/* Complete Button */}
              <button
                onClick={() => {
                  onComplete();
                  onClose();
                }}
                className="w-full h-[50px] bg-[#6A18A4] text-white rounded-[10px] font-bold text-lg hover:opacity-90 transition-opacity"
              >
                Terminer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
