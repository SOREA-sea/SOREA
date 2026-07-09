"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Clock, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
/*import StreakTracker from "@/components/StreakTracker";*/
import MenstrualCalendar from "@/components/MenstrualCalendar";
import { useRouter } from "next/navigation";
import { getFavoriFilRouge, FilRougeItem } from "@/lib/fil-rouge-store";
import FilRougeCard from "@/components/FilRougeCard";

export default function MiroirDesAffirmations() {
  const router = useRouter();
  
  const [favori, setFavori] = useState<FilRougeItem | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setFavori(getFavoriFilRouge());
      setIsLoaded(true);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  const sections = [
    {
      img: "/image_icone/Courrier.svg",
      alt: "mot à moi",
      imgWidth: "280px",
      title: "Mot à moi",
      description: (
        <>
          Retape une affirmation positive, un mot de gratitude ou une pensée inspirante. Chaque mot que tu écris{" "}
          <span className="text-[#8B47FF] font-semibold">développera ta paix intérieure</span>.
        </>
      ),
      btnLabel: <>Je laisse parler<br />ma plume</>,
      href: "/mot-a-moi",
    },
    {
      img: "/image_icone/Appareil_photo.svg",
      alt: "visualise toi",
      imgWidth: "280px",
      title: "Visualise-toi",
      description: (
        <>
          Ajoute tes images inspirantes et{" "}
          <span className="text-[#8B47FF] font-semibold">projette-toi dans tes rêves</span> : voyage, carrière, projets, instants de gratitude, paysages...
        </>
      ),
      btnLabel: <>Visualisation<br />de mon idéal</>,
      href: "/visualisation",
    },
    {
      img: "/image_icone/Lotus.svg",
      alt: "wim hof",
      imgWidth: "180px",
      title: "Wim Hof féminine",
      description: (
        <>
          Plonge dans une expérience de souffle consciente, inspirée de la méthode Wim Hof et adaptée pour la stabilité hormonale.
          <span className="text-[#8B47FF] font-semibold"> Reconnecte-toi à ton équilibre intérieur</span>.
        </>
      ),
      btnLabel: <>Je me lance<br />dans ma séance</>,
      href: "/wim-hof",
    },
    {
      img: "/image_icone/miroire.png",
      alt: "miroir",
      imgWidth: "280px",
      title: "Miroir mon beau miroir",
      description: (
        <>
          Affirme-toi chaque jour face à ton miroir virtuel. Répète des phrases positives pour{" "}
          <span className="text-[#8B47FF] font-semibold">renforcer ta confiance</span>.
        </>
      ),
      btnLabel: <>Affirmer ma<br />lumière intérieure</>,
      href: "/miroir",
    },
  ];

  return (
    <div
      className="relative min-h-screen flex flex-col text-gray-800"
      style={{
        background: "radial-gradient(ellipse at center, #FEF0F9 0%, #FFFFFF 100%)",
        fontFamily: "'Inria Sans', sans-serif",
      }}
    >
      <link href="https://fonts.googleapis.com/css2?family=Inria+Sans:wght@400;700&display=swap" rel="stylesheet" />

      <div className="w-full max-w-[1440px] px-6 lg:px-[96px] mx-auto pb-[24px] gap-[50px] pt-8">
        <Navbar />
      </div>

      {/*}<div className="fixed right-3 sm:right-6 lg:right-[56px] top-[132px] z-30 w-[340px] max-w-[calc(100vw-24px)] origin-top-right scale-[0.62] sm:scale-[0.68] lg:scale-75">
        <StreakTracker floating joursConsecutifs={5} />
      </div>*/}

      <main className="flex flex-col mx-auto w-full max-w-[1440px] px-6 lg:px-[96px] gap-[72px] py-12">
        <section className="grid grid-cols-1 xl:grid-cols-[1fr_360px_1fr] items-center gap-12">
          <div className="flex flex-col items-start gap-7">
            <p className="text-[#8B47FF] font-bold tracking-[0.32em] uppercase text-sm">Challenge SOREA</p>
            <h1 className="text-6xl font-bold tracking-[0.08em] text-black">Challenge</h1>
            <p className="text-[#4b3b5c] text-xl leading-relaxed max-w-[390px]">
              Choisis ton défi bien-être du jour et avance avec douceur, une action après l&apos;autre.
            </p>
            <Link href="/route">
              <button className="bg-SOREA-V1 text-white font-bold px-10 py-5 rounded-2xl shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl tracking-[0.18em] uppercase cursor-pointer">
                Tourner
              </button>
            </Link>
          </div>

          <div className="flex items-center justify-center">
            <img src="/image_icone/image_Wheel-Spinner/WS_Bien-être1.png" alt="roue" style={{ width: "280px", display: "block" }} />
          </div>

          <article
            className="flex flex-col border-2 border-[#8B47FF] rounded-2xl p-8 gap-5"
            style={{ background: "radial-gradient(ellipse at center, #FEF0F9 0%, #FFFFFF 100%)" }}
          >
            <div className="flex items-center gap-2 text-[#8B47FF] font-bold text-sm tracking-[0.16em] uppercase">
              <Sparkles className="h-4 w-4" /> Défi du jour
            </div>
            <h2 className="text-3xl font-bold text-black">Respire et rayonne</h2>
            <p className="bg-[#F4EBFF] rounded-2xl p-5 text-[#4b3b5c] leading-relaxed">
              Prends 15 minutes pour respirer, relâcher tes épaules et écrire une intention simple.
            </p>
            <div className="flex items-center gap-2 text-black font-bold">
              <Clock className="h-4 w-4" /> 15 min
            </div>
            <Link href="/route">
              <button className="w-full bg-[#8B47FF] text-white font-bold px-8 py-5 rounded-2xl shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl tracking-[0.18em] uppercase cursor-pointer">
                Commencer
              </button>
            </Link>
          </article>
        </section>

        <section className="w-full flex justify-center">
          <MenstrualCalendar />
        </section>

        <section className="rounded-2xl border-2 border-[#8B47FF] bg-white/85 shadow-xl shadow-purple-100/70 backdrop-blur overflow-hidden p-8">
          {isLoaded ? (
            favori ? (
              <div className="flex flex-col gap-6">
                <FilRougeCard item={favori} readOnly />
                <button
                  onClick={() => router.push("/fil_rouge")}
                  className="mx-auto flex items-center gap-2 text-[#7d53b2] font-semibold hover:text-[#592592] transition-colors"
                >
                  <Sparkles size={18} /> Découvrir d&apos;autres Fils Rouges
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-6 py-10">
                <p className="text-purple-300 italic">Tu n&apos;as pas encore de Fil Rouge favori.</p>
                <button
                  onClick={() => router.push("/fil_rouge")}
                  className="flex items-center gap-2 bg-[#8B47FF] text-white font-bold text-lg px-10 py-4 rounded-full shadow-lg shadow-purple-200 hover:-translate-y-1 transition-transform"
                >
                  <Sparkles size={20} /> Découvrir
                </button>
              </div>
            )
          ) : (
            <div className="py-10 text-center text-purple-400">Chargement de ton Fil Rouge...</div>
          )}
        </section>

        <section className="flex flex-col gap-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold tracking-[0.16em] text-black">Défis bien-être</h2>
            <p className="text-[#4b3b5c] text-xl mt-3">Choisis le rituel qui te ressemble aujourd&apos;hui.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {sections.map((section, i) => (
              <Link
                key={i}
                href={section.href}
                className="group grid grid-cols-[96px_minmax(0,1fr)] lg:grid-cols-[120px_minmax(0,1fr)] items-center gap-4 bg-white/60 px-4 py-4 shadow-sm border border-[#8B47FF]/20 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-[#8B47FF]/55 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8B47FF]/50"
                aria-label={`Ouvrir ${section.title}`}
              >
                <div className="flex-shrink-0 flex items-center justify-center" style={{ width: "100%" }}>
                  <img src={section.img} alt={section.alt} style={{ width: section.imgWidth, maxWidth: "100%", display: "block" }} />
                </div>
                <div className="flex flex-col items-center gap-4 min-w-0">
                  <h3 className="text-xl lg:text-2xl font-bold text-black text-center tracking-[0.12em]">{section.title}</h3>
                  <p className="w-full bg-[#F4EBFF] rounded-xl px-4 py-3 text-center text-black text-sm lg:text-base leading-relaxed">
                    {section.description}
                  </p>
                  <span className="bg-[#8B47FF] text-white font-bold px-7 py-3 rounded-xl shadow-md transition-shadow duration-300 group-hover:shadow-lg ring-0 group-hover:ring-2 group-hover:ring-[#8B47FF]/20 text-xs lg:text-sm text-center leading-tight tracking-[0.14em] uppercase cursor-pointer">
                    {section.btnLabel}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="rounded-2xl bg-[linear-gradient(90deg,#F4EBFF_0_12.5%,#FFFFFF_12.5%_25%,#F4EBFF_25%_37.5%,#FFFFFF_37.5%_50%,#F4EBFF_50%_62.5%,#FFFFFF_62.5%_75%,#F4EBFF_75%_87.5%,#FFFFFF_87.5%_100%)] p-8 text-center">
          <p className="text-xl font-bold text-black">Chaque petit défi compte. Tu avances déjà.</p>
        </section>
      </main>

        <Footer />
    </div>
  );
}

