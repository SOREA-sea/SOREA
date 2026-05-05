"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
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
    const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", password: "" });
    const [isCoach, setIsCoach] = useState(false);
    const [registerError, setRegisterError] = useState<string | null>(null);
    const [registerLoading, setRegisterLoading] = useState(false);

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
        } catch (err: any) {
            setLoginError(err.message);
        } finally {
            setLoginLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setRegisterError(null);
        setRegisterLoading(true);
        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, isCoach }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Une erreur est survenue");
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
        } catch (err: any) {
            setRegisterError(err.message);
        } finally {
            setRegisterLoading(false);
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
                                            className="w-full h-[50px] bg-white rounded-[10px] text-xl font-black tracking-[0.1em] text-[#6A18A4] font-['Roboto'] hover:opacity-80 transition-opacity disabled:opacity-50 cursor-pointer"
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
                                            Commencez votre voyage vers le bien-être avec SOREA.
                                        </p>
                                    </div>

                                    <form onSubmit={handleRegister} className="flex flex-col gap-5">
                                        {registerError && (
                                            <div className="p-3 text-sm text-red-500 bg-red-50/50 border border-red-200 rounded-[15px] text-center">
                                                {registerError}
                                            </div>
                                        )}

                                        {/* Toggle coach */}
                                        <div className="flex bg-[#D4D7E3] p-1 rounded-[15px]">
                                            <button
                                                type="button"
                                                onClick={() => setIsCoach(false)}
                                                className={`flex-1 py-3 text-sm font-semibold rounded-[12px] transition-all font-['Inria_Sans'] tracking-[0.1em] ${!isCoach ? 'bg-[#F6E1D1] text-[#212121]' : 'text-[#7F6674] hover:text-[#212121]'}`}
                                            >
                                                Pour moi
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setIsCoach(true)}
                                                className={`flex-1 py-3 text-sm font-semibold rounded-[12px] transition-all font-['Inria_Sans'] tracking-[0.1em] ${isCoach ? 'bg-[#F6E1D1] text-[#212121]' : 'text-[#7F6674] hover:text-[#212121]'}`}
                                            >
                                                Je suis praticien
                                            </button>
                                        </div>

                                        {isCoach && (
                                            <div className="p-4 bg-pink-50/50 rounded-[15px] border border-pink-100 text-sm text-pink-800 font-medium text-center font-['Inria_Sans']">
                                                Créez votre profil complet et accompagnez la communauté SOREA.
                                            </div>
                                        )}

                                        {/* Prénom / Nom */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="flex flex-col gap-3">
                                                <label className="text-xl font-bold tracking-[0.1em] text-[#212121] font-['Inria_Sans']">Prénom</label>
                                                <input
                                                    type="text"
                                                    name="firstName"
                                                    required
                                                    value={formData.firstName}
                                                    onChange={(e) => setFormData(p => ({ ...p, firstName: e.target.value }))}
                                                    placeholder="Camille"
                                                    className="w-full h-[55px] px-4 rounded-[15px] border border-[rgba(127,102,116,0.7)] text-xl tracking-[0.1em] text-[#7F6674] font-['Inria_Sans'] outline-none focus:border-[#6A18A4] transition-colors"
                                                    style={{ background: "rgba(255, 250, 240, 0.2)" }}
                                                />
                                            </div>
                                            <div className="flex flex-col gap-3">
                                                <label className="text-xl font-bold tracking-[0.1em] text-[#212121] font-['Inria_Sans']">Nom</label>
                                                <input
                                                    type="text"
                                                    name="lastName"
                                                    required
                                                    value={formData.lastName}
                                                    onChange={(e) => setFormData(p => ({ ...p, lastName: e.target.value }))}
                                                    placeholder="Dupont"
                                                    className="w-full h-[55px] px-4 rounded-[15px] border border-[rgba(127,102,116,0.7)] text-xl tracking-[0.1em] text-[#7F6674] font-['Inria_Sans'] outline-none focus:border-[#6A18A4] transition-colors"
                                                    style={{ background: "rgba(255, 250, 240, 0.2)" }}
                                                />
                                            </div>
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

                                        {/* Bouton */}
                                        <button
                                            type="submit"
                                            disabled={registerLoading}
                                            className="w-full h-[50px] bg-white rounded-[10px] text-xl font-black tracking-[0.1em] text-[#6A18A4] font-['Roboto'] hover:opacity-80 transition-opacity disabled:opacity-50 cursor-pointer"
                                            style={{ boxShadow: "0px 3px 3.1px #BA98F4" }}
                                        >
                                            {registerLoading ? (
                                                <svg className="animate-spin mx-auto h-5 w-5 text-[#6A18A4]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                </svg>
                                            ) : "Poursuivre mon inscription"}
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