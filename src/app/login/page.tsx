"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const defaultTab = searchParams.get("tab") === "inscription" ? "inscription" : "connexion";
    const [activeTab, setActiveTab] = useState<"connexion" | "inscription">(defaultTab);

    // Connexion state
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [loginError, setLoginError] = useState<string | null>(null);
    const [loginLoading, setLoginLoading] = useState(false);

    // Inscription state
    const [formData, setFormData] = useState({ fullName: "", email: "", password: "", confirmPassword: "" });
    const [checkboxAccepted, setCheckboxAccepted] = useState(false);
    const [registerError, setRegisterError] = useState<string | null>(null);
    const [registerLoading, setRegisterLoading] = useState(false);
    const [registerLoadingType, setRegisterLoadingType] = useState<"member" | "coach" | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError(null);
        setLoginLoading(true);
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: loginEmail, password: loginPassword }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Une erreur est survenue");
            router.push("/dashboard");
            router.refresh();
        } catch (err) {
            setLoginError(err instanceof Error ? err.message : "Une erreur est survenue");
        } finally {
            setLoginLoading(false);
        }
    };

    const submitRegister = async (asCoach: boolean) => {
        setRegisterError(null);
        if (!formData.fullName.trim()) {
            setRegisterError("Veuillez entrer votre nom complet.");
            return;
        }
        if (!formData.email.trim()) {
            setRegisterError("Veuillez entrer votre adresse e-mail.");
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            setRegisterError("Les mots de passe ne correspondent pas.");
            return;
        }
        if (!checkboxAccepted) {
            setRegisterError("Veuillez accepter les Conditions Générales d'Utilisation.");
            return;
        }
        setRegisterLoading(true);
        setRegisterLoadingType(asCoach ? "coach" : "member");
        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    firstName: formData.fullName.trim().split(/\s+/)[0] || "",
                    lastName: formData.fullName.trim().split(/\s+/).slice(1).join(" ") || "",
                    email: formData.email,
                    password: formData.password,
                    isCoach: asCoach,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Une erreur est survenue");
            // Auto-login after successful registration
            const loginRes = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: formData.email, password: formData.password }),
            });
            if (loginRes.ok) {
                router.push("/dashboard");
                router.refresh();
            } else {
                router.push("/login");
            }
        } catch (err) {
            setRegisterError(err instanceof Error ? err.message : "Une erreur est survenue lors de l'inscription.");
        } finally {
            setRegisterLoading(false);
            setRegisterLoadingType(null);
            setFormData({ fullName: "", email: "", password: "", confirmPassword: "" });
            setCheckboxAccepted(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col [background:linear-gradient(270deg,_#FBF7F2_0%,_#E2DBEF_100%)] font-['Inria_Sans']">
            <Navbar isLoggedIn={false} />
            <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 gap-10">

                {/* Titre */}
                <div className="flex flex-col items-center gap-3">
                    <h1 className="text-5xl font-bold tracking-[0.13em] underline text-[#212121] text-center font-['Inria_Sans']">
                        Compte SOREA
                    </h1>
                    <p className="text-[#212121] text-2xl tracking-[0.1em] text-center font-['Inria_Sans'] font-normal">
                        Connecte toi ou créer ton compte
                    </p>
                </div>

                {/* Card */}
                <div className="flex items-center justify-center w-full">
                    <div
                        className="flex flex-col items-center gap-10 w-full max-w-[660px] rounded-[15px] border border-[#7F6674] py-3 px-0"
                        style={{ background: "rgba(255, 255, 255, 0.2)" }}
                    >

                        {/* Onglets */}
                        <div className="w-full h-[70px] bg-[#D4D7E3] rounded-[15px] relative flex items-center">
                            {/* Indicateur actif */}
                            <div
                                className="absolute h-[55px] w-[calc(50%-8px)] rounded-[15px] bg-[#F6E1D1] transition-all duration-300"
                                style={{ left: activeTab === "connexion" ? "8px" : "calc(50%)" }}
                            />
                            <button
                                onClick={() => setActiveTab("connexion")}
                                className="relative z-10 flex-1 text-center text-[#212121] text-xl tracking-[0.1em] font-['Inria_Sans'] font-normal"
                            >
                                Connexion
                            </button>
                            <button
                                onClick={() => setActiveTab("inscription")}
                                className="relative z-10 flex-1 text-center text-[#212121] text-xl tracking-[0.1em] font-['Inria_Sans'] font-normal"
                            >
                                Inscription
                            </button>
                        </div>

                        {/* Contenu */}
                        <div className="w-[586px] flex flex-col gap-6 pb-6">

                            {activeTab === "connexion" ? (
                                <>
                                    {/* Header connexion */}
                                    <div className="flex flex-col gap-4">
                                        <h2 className="text-2xl font-bold tracking-[0.13em] underline text-[#212121] font-['Inria_Sans']">
                                            Connectez-vous
                                        </h2>
                                        <p className="text-xl tracking-[0.1em] text-[#7F6674] font-['Inria_Sans']">
                                            Entrez vos identifiants pour accéder à votre compte.
                                        </p>
                                    </div>

                                    <form onSubmit={handleLogin} className="flex flex-col gap-5">
                                        {loginError && (
                                            <div className="p-3 text-sm text-red-500 bg-red-50/50 border border-red-200 rounded-[15px] text-center">
                                                {loginError}
                                            </div>
                                        )}

                                        {/* Email */}
                                        <div className="flex flex-col gap-4">
                                            <label className="text-xl font-bold tracking-[0.1em] text-[#212121] font-['Inria_Sans']">
                                                Adresse e-mail
                                            </label>
                                            <input
                                                type="email"
                                                required
                                                value={loginEmail}
                                                onChange={(e) => setLoginEmail(e.target.value)}
                                                placeholder="exemple@domaine.com"
                                                className="w-full h-[55px] px-4 rounded-[15px] border border-[rgba(127,102,116,0.7)] text-xl tracking-[0.1em] text-[#7F6674] font-['Inria_Sans'] outline-none focus:border-[#6A18A4] transition-colors"
                                                style={{ background: "rgba(255, 250, 240, 0.2)" }}
                                            />
                                        </div>

                                        {/* Mot de passe */}
                                        <div className="flex flex-col gap-4">
                                            <label className="text-xl font-bold tracking-[0.1em] text-[#212121] font-['Inria_Sans']">
                                                Mot de passe
                                            </label>
                                            <input
                                                type="password"
                                                required
                                                value={loginPassword}
                                                onChange={(e) => setLoginPassword(e.target.value)}
                                                placeholder="••••••••••••••••••"
                                                className="w-full h-[55px] px-4 rounded-[15px] border border-[rgba(127,102,116,0.7)] text-xl tracking-[0.1em] text-[#7F6674] font-['Inria_Sans'] outline-none focus:border-[#6A18A4] transition-colors"
                                                style={{ background: "rgba(255, 250, 240, 0.2)" }}
                                            />
                                        </div>

                                        {/* Mot de passe oublié */}
                                        <div className="flex justify-end">
                                            <a href="#" className="text-xl font-bold tracking-[0.1em] text-[#6A18A4] font-['Inria_Sans'] hover:opacity-70 transition-opacity">
                                                Mot de passe oublié ?
                                            </a>
                                        </div>

                                        {/* Bouton */}
                                        <button
                                            type="submit"
                                            disabled={loginLoading}
                                            className= " btn-connexion w-full h-[50px] bg-white rounded-[10px] text-xl font-black tracking-[0.1em] text-[#6A18A4] font-['Roboto'] hover:opacity-80 transition-opacity disabled:opacity-50 cursor-pointer"
                                            style={{ boxShadow: "0px 3px 3.1px #BA98F4" }}
                                        >
                                            {loginLoading ? (
                                                <svg className="animate-spin mx-auto h-5 w-5 text-[#6A18A4]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                </svg>
                                            ) : "Se connecter"}
                                        </button>
                                    </form>
                                </>
                            ) : (
                                <>
                                    {/* Header inscription */}
                                    <div className="flex flex-col gap-4">
                                        <h2 className="text-2xl font-bold tracking-[0.13em] underline text-[#212121] font-['Inria_Sans']">
                                            Créer un compte
                                        </h2>
                                        <p className="text-xl tracking-[0.1em] text-[#7F6674] font-['Inria_Sans']">
                                            Remplissez les informations pour vous inscrire.
                                        </p>
                                    </div>

                                    <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-5">
                                        {registerError && (
                                            <div className="p-3 text-sm text-red-500 bg-red-50/50 border border-red-200 rounded-[15px] text-center">
                                                {registerError}
                                            </div>
                                        )}

                                        {/* Nom complet */}
                                        <div className="flex flex-col gap-3">
                                            <label className="text-xl font-bold tracking-[0.1em] text-[#212121] font-['Inria_Sans']">Nom complet</label>
                                            <input
                                                type="text"
                                                name="fullName"
                                                required
                                                value={formData.fullName}
                                                onChange={(e) => setFormData((p) => ({ ...p, fullName: e.target.value }))}
                                                placeholder="Votre nom"
                                                className="w-full h-[55px] px-4 rounded-[15px] border border-[rgba(127,102,116,0.7)] text-xl tracking-[0.1em] text-[#7F6674] font-['Inria_Sans'] outline-none focus:border-[#6A18A4] transition-colors"
                                                style={{ background: "rgba(255, 250, 240, 0.2)" }}
                                            />
                                        </div>

                                        {/* Email */}
                                        <div className="flex flex-col gap-3">
                                            <label className="text-xl font-bold tracking-[0.1em] text-[#212121] font-['Inria_Sans']">Adresse e-mail</label>
                                            <input
                                                type="email"
                                                name="email"
                                                required
                                                value={formData.email}
                                                onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                                                placeholder="exemple@domaine.com"
                                                className="w-full h-[55px] px-4 rounded-[15px] border border-[rgba(127,102,116,0.7)] text-xl tracking-[0.1em] text-[#7F6674] font-['Inria_Sans'] outline-none focus:border-[#6A18A4] transition-colors"
                                                style={{ background: "rgba(255, 250, 240, 0.2)" }}
                                            />
                                        </div>

                                        {/* Mot de passe */}
                                        <div className="flex flex-col gap-3">
                                            <label className="text-xl font-bold tracking-[0.1em] text-[#212121] font-['Inria_Sans']">Mot de passe</label>
                                            <input
                                                type="password"
                                                name="password"
                                                required
                                                minLength={6}
                                                value={formData.password}
                                                onChange={(e) => setFormData(p => ({ ...p, password: e.target.value }))}
                                                placeholder="••••••••••••••••••"
                                                className="w-full h-[55px] px-4 rounded-[15px] border border-[rgba(127,102,116,0.7)] text-xl tracking-[0.1em] text-[#7F6674] font-['Inria_Sans'] outline-none focus:border-[#6A18A4] transition-colors"
                                                style={{ background: "rgba(255, 250, 240, 0.2)" }}
                                            />
                                        </div>

                                        {/* Confirmer le mot de passe */}
                                        <div className="flex flex-col gap-3">
                                            <label className="text-xl font-bold tracking-[0.1em] text-[#212121] font-['Inria_Sans']">Confirmer le mot de passe</label>
                                            <input
                                                type="password"
                                                name="confirmPassword"
                                                required
                                                minLength={6}
                                                value={formData.confirmPassword}
                                                onChange={(e) => setFormData((p) => ({ ...p, confirmPassword: e.target.value }))}
                                                placeholder="••••••••••••••••••"
                                                className="w-full h-[55px] px-4 rounded-[15px] border border-[rgba(127,102,116,0.7)] text-xl tracking-[0.1em] text-[#7F6674] font-['Inria_Sans'] outline-none focus:border-[#6A18A4] transition-colors"
                                                style={{ background: "rgba(255, 250, 240, 0.2)" }}
                                            />
                                        </div>

                                        <div className="flex justify-end">
                                            <a href="#" className="text-xl font-bold tracking-[0.1em] text-[#6A18A4] font-['Inria_Sans'] hover:opacity-70 transition-opacity">
                                                Mot de passe oublié ?
                                            </a>
                                        </div>

                                        <div className="w-full pl-1 text-[16px] font-semibold text-[#212121] font-['Inria_Sans'] leading-snug max-w-[520px]">
                                            Je candidate pour travailler avec SOREA et/ ou pour devenir son ambassadrice
                                        </div>

                                        <button
                                            type="button"
                                            disabled={registerLoading}
                                            onClick={() => submitRegister(true)}
                                            className="w-full h-[50px] btn-connexion bg-white rounded-[10px] text-xl font-black tracking-[0.1em] font-['Roboto'] hover:opacity-80 transition-opacity disabled:opacity-50 cursor-pointer"
                                        >
                                            {registerLoading && registerLoadingType === "coach" ? (
                                                <svg className="animate-spin mx-auto h-5 w-5 text-[#6A18A4]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                </svg>
                                            ) : (
                                                "Je candidate"
                                            )}
                                        </button>

                                        <label className="flex w-full items-start gap-3 pl-1 text-sm text-[#3D3D3D] font-['Inria_Sans'] cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={checkboxAccepted}
                                                onChange={(e) => setCheckboxAccepted(e.target.checked)}
                                                className="accent-[#6A18A4] w-4 h-4 mt-0.5 cursor-pointer"
                                            />
                                            <span className="leading-snug">
                                                J'ai lu et j'accepte les
                                                <span className="text-[#6A18A4] underline cursor-pointer">
                                                    Conditions Générales d'Utilisation
                                                </span>.
                                            </span>
                                        </label>

                                        <button
                                            type="button"
                                            disabled={registerLoading}
                                            onClick={() => submitRegister(false)}
                                            className="w-full h-[50px] btn-connexion bg-white rounded-[10px] text-xl font-black tracking-[0.1em] font-['Roboto'] hover:opacity-80 transition-opacity disabled:opacity-50 cursor-pointer"
                                        >
                                            {registerLoading && registerLoadingType === "member" ? (
                                                <svg className="animate-spin mx-auto h-5 w-5 text-[#6A18A4]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                </svg>
                                            ) : (
                                                "S'inscrire"
                                            )}
                                        </button>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}