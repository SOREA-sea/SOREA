"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [isCoach, setIsCoach] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, isCoach }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Une erreur est survenue");
      }

      // Connexion automatique après inscription
      const loginRes = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });

      if (loginRes.ok) {
        router.push("/");
        router.refresh();
      } else {
        router.push("/login");
      }

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
        <div className="w-full max-w-lg glass-panel rounded-[2rem] p-8 md:p-10 relative overflow-hidden mt-12 mb-12">
        {/* Décoration d'arrière-plan */}
        <div className="absolute -top-32 -left-20 w-52 h-52 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animation-blob"></div>
        <div className="absolute -bottom-32 -right-20 w-52 h-52 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animation-blob animation-delay-2000"></div>

        <div className="relative z-10 flex flex-col items-center">
          <Link href="/">
            <Image src="/images/logo_sorea.webp" alt="SOREA Logo" width={70} height={70} className="rounded-full shadow-lg border-2 border-white/50 mb-6" />
          </Link>
          
          <h1 className="text-3xl font-black section-title text-center text-foreground">Créer un compte</h1>
          <p className="text-foreground/70 mt-2 text-center text-sm md:text-base">
            Commencez votre voyage vers le bien-être avec SOREA.
          </p>

          <form onSubmit={handleSubmit} className="w-full mt-8 space-y-5">
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-50/50 border border-red-200 rounded-2xl text-center">
                {error}
              </div>
            )}

            {/* Toggle Coach / User */}
            <div className="flex bg-white/50 p-1 rounded-full border border-white/60 mb-6">
              <button
                type="button"
                onClick={() => setIsCoach(false)}
                className={`flex-1 py-3 text-sm font-semibold rounded-full transition-all ${!isCoach ? 'bg-white shadow-sm text-purple-700' : 'text-foreground/60 hover:text-foreground'}`}
              >
                Pour moi
              </button>
              <button
                type="button"
                onClick={() => setIsCoach(true)}
                className={`flex-1 py-3 text-sm font-semibold rounded-full transition-all ${isCoach ? 'bg-white shadow-sm text-pink-600' : 'text-foreground/60 hover:text-foreground'}`}
              >
                Je suis praticien
              </button>
            </div>

            {isCoach && (
              <div className="text-center p-4 bg-pink-50/50 rounded-2xl border border-pink-100 text-sm text-pink-800 font-medium mb-6">
                Créez votre profil complet et accompagnez la communauté SOREA.
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium ml-1">Prénom</label>
                <input 
                  type="text" 
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Camille" 
                  className="w-full p-4 rounded-full border border-white/80 bg-white/75 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] outline-none focus:ring-2 focus:ring-purple-300 transition-all placeholder:text-gray-400 text-sm"
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
                  placeholder="Dupont" 
                  className="w-full p-4 rounded-full border border-white/80 bg-white/75 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] outline-none focus:ring-2 focus:ring-purple-300 transition-all placeholder:text-gray-400 text-sm"
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
                placeholder="votre@email.com" 
                className="w-full p-4 rounded-full border border-white/80 bg-white/75 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] outline-none focus:ring-2 focus:ring-purple-300 transition-all placeholder:text-gray-400 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium ml-1">Mot de passe</label>
              <input 
                type="password" 
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••" 
                minLength={6}
                className="w-full p-4 rounded-full border border-white/80 bg-white/75 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] outline-none focus:ring-2 focus:ring-purple-300 transition-all placeholder:text-gray-400 text-sm"
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="btn-primary w-full mt-4 py-4 flex justify-center items-center hover:scale-[1.02] transition-transform disabled:opacity-70 disabled:hover:scale-100 cursor-pointer"
            >
              {isLoading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : "Poursuivre mon inscription"}
            </button>
          </form>

          <p className="mt-8 text-sm text-foreground/70">
            Déjà un compte ?{" "}
            <Link href="/login" className="font-bold text-purple-600 hover:text-purple-800 transition-colors">
              Me connecter
            </Link>
          </p>
        </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
