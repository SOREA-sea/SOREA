"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Une erreur est survenue");
      }

      router.push("/");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-pastel-1 to-pastel-2 text-foreground font-sans">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-6 pb-24 flex items-center justify-center min-h-[75vh]">
        <div className="w-full max-w-md glass-panel rounded-[2rem] p-8 md:p-10 relative overflow-hidden">
        {/* Décoration d'arrière-plan de la carte */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animation-blob"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animation-blob animation-delay-2000"></div>

        <div className="relative z-10 flex flex-col items-center">
          <Link href="/">
            <Image src="/images/logo_sorea.webp" alt="SOREA Logo" width={80} height={80} className="rounded-full shadow-lg border-2 border-white/50 mb-6" />
          </Link>
          
          <h1 className="text-3xl font-black section-title text-center text-foreground">Bon retour</h1>
          <p className="text-foreground/70 mt-2 text-center text-sm md:text-base">
            Connectez-vous pour retrouver votre bulle de sérénité.
          </p>

          <form onSubmit={handleSubmit} className="w-full mt-8 space-y-5">
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-50/50 border border-red-200 rounded-2xl text-center">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-medium ml-1">Adresse email</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com" 
                className="w-full p-4 rounded-full border border-white/80 bg-white/75 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] outline-none focus:ring-2 focus:ring-purple-300 transition-all placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium ml-1 flex justify-between">
                Mot de passe
                <a href="#" className="text-purple-600 hover:text-purple-800 transition-colors text-xs">Oublié ?</a>
              </label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full p-4 rounded-full border border-white/80 bg-white/75 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] outline-none focus:ring-2 focus:ring-purple-300 transition-all placeholder:text-gray-400"
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="btn-primary w-full mt-2 py-4 flex justify-center items-center hover:scale-[1.02] transition-transform disabled:opacity-70 disabled:hover:scale-100 cursor-pointer"
            >
              {isLoading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : "Se connecter"}
            </button>
          </form>

          <p className="mt-8 text-sm text-foreground/70">
            Nouveau chez SOREA ?{" "}
            <Link href="/register" className="font-bold text-purple-600 hover:text-purple-800 transition-colors">
              Créer un compte
            </Link>
          </p>
        </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
