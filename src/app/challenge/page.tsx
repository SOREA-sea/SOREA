"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import DailyEncouragement from "@/components/DailyEncouragement";
import { useRouter } from "next/navigation";
import { getFavoriFilRouge, FilRougeItem, getFavoriWheel, WheelCategory } from "../../lib/favorites-store";
import FilRougeCard from "../../components/FilRougeCard";

const wheelDataConfig = {
  "bien-etre": {
    img: "/image_icone/image_Wheel-Spinner/WS_Bien-être1.png",
    title: "Cultive ta paix intérieure",
    desc: "Développer un bien-être durable en apprenant à mieux te connaître, à renforcer ton équilibre émotionnel et à cultiver des habitudes positives qui permettront de révéler ton plein potentiel."
  },
  "sport": {
    img: "/image_icone/image_Wheel-Spinner/WS_Sport1.png",
    title: "Active ton corps",
    desc: "Fait du mouvement ton allié du bien-être. Bouge à ton rythme, renforce ton corps et booste ton énergie pour révéler pleinement ton potentiel."
  },
  "nutrition": {
    img: "/image_icone/image_Wheel-Spinner/WS_Nutrition1.png",
    title: "Nourri ton équilibre",
    desc: "Écoute ton corps et adopte une alimentation bienveillante pour découvrir ce qui te fait du bien. Repère tes besoins, sans pression ni culpabilité."
  }
};

  export default function MiroirDesAffirmations() {
  const router = useRouter();
  
  const [favori, setFavori] = useState<FilRougeItem | null>(null);
  const [favoriWheel, setFavoriWheel] = useState<WheelCategory>("bien-etre");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setFavori(getFavoriFilRouge());
    setFavoriWheel(getFavoriWheel());
    setIsLoaded(true);
  }, []);

  const currentWheelData = wheelDataConfig[favoriWheel] || wheelDataConfig["bien-etre"];

  const sections = [

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

    {
      img: "/image_icone/Appareil_photo.svg",
      alt: "Visualisation de mes possibles",
      imgWidth: "280px",
      title: "Je visualise, je me projette",
      description: (
        <>
          Ajoute tes images inspirantes et{" "}
          <span className="text-[#8B47FF] font-semibold">projette-toi dans tes rêves</span> : voyage, carrière, projets, instants de gratitude, paysages...
        </>
      ),
      btnLabel: <>Visualisation<br />de mon idéal</>,
      href: "/visualisation",
      locked: true,
    },
    {
      img: "/image_icone/Lotus.svg",
      alt: "Mon souffle, mon équilibre",
      imgWidth: "180px",
      title: "Mon souffle, mon équilibre",
      description: (
        <>
          Plonge dans une expérience de souffle consciente, inspirée de la méthode Wim Hof et adaptée pour la stabilité hormonale.
          <span className="text-[#8B47FF] font-semibold"> Reconnecte-toi à ton équilibre intérieur</span>.
        </>
      ),
      btnLabel: <>Je me lance<br />dans ma séance</>,
      href: "/wim-hof",
      locked: true,
    },

    {
      img: "/image_icone/Courrier.svg",
      alt: "Courrier du futur",
      imgWidth: "280px",
      title: "Au fil de mes mots",
      description: (
        <>
          Retape une affirmation positive, un mot de gratitude ou une pensée inspirante. Chaque mot que tu écris{" "}
          <span className="text-[#8B47FF] font-semibold">développera ta paix intérieure</span>.
        </>
      ),
      btnLabel: <>Je laisse parler<br />ma plume</>,
      href: "/mot-a-moi",
      locked: true,
    },

    {
      img: "image_icone/image_Wheel-Spinner/WS_BienEtreHead1.png",
      alt: "Wheel-Spinner",
      imgWidth: "280px",
      title: "Ton potentiel intérieur",
      description: (
        <>
          Choisis ton défi bien-être parmi <span className="text-[#8B47FF] font-semibold">plusieurs roues à thèmes</span> et retrouve calme et sérénité grâce aux défis qui te seront proposés. Chaque tirage est une nouvelle occasion de prendre soin de toi, à ton rythme.{" "}
          <span className="text-[#8B47FF] font-semibold">renforcer ta confiance</span>.
        </>
      ),
      btnLabel: <>Affirmer ma<br />lumière intérieure</>,
      href: `/route?cat=${favoriWheel}`,
    },

  ];

  return (
    <div
      className="relative min-h-screen flex flex-col overflow-x-hidden"
    >
      <link href="https://fonts.googleapis.com/css2?family=Inria+Sans:wght@400;700&display=swap" rel="stylesheet" />
      
      <div className="w-full max-w-[1440px] px-6 lg:px-[96px] mx-auto pb-[24px] gap-[50px] pt-8">
        <Navbar />
      </div>

      <main className="flex flex-col mx-auto w-full max-w-[1440px] px-6 lg:px-[96px] gap-[72px] py-12">
        <div className="text-center">
            <h2 className="text-4xl font-bold tracking-[0.16em] text-black">Challenge</h2>
            <p className="text-[#4b3b5c] text-xl mt-3">Choisis ton défi bien-être du moment, avance avec douceur, une action après l&apos;autre.</p>
          </div>
          
          {/*WS */}
        
        <section className="grid grid-cols-1 xl:grid-cols-[1fr_360px_1fr] items-center gap-12">

        <div className="flex flex-col items-start gap-7">
            <p className="text-[#8B47FF] font-bold tracking-[0.32em] uppercase text-sm">Challenge SOREA</p>
            <h1 className="text-6xl font-bold tracking-[0.08em] text-black">Challenge</h1>
            <p className="text-[#4b3b5c] text-xl leading-relaxed max-w-[390px]">
              Choisis ton défi bien-être du jour et avance avec douceur, une action après l&apos;autre.
            </p>
            <Link href={`/route?cat=${favoriWheel}`}>
              <button className="bg-SOREA-V1 text-white font-bold px-10 py-5 rounded-2xl shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl tracking-[0.18em] uppercase cursor-pointer">
                Tourner
              </button>
            </Link>
          </div>

          <div className="flex items-center justify-center">
            {isLoaded && <img src={currentWheelData.img} alt="roue" style={{ width: "280px", display: "block" }} />}
          </div>

          <article
            className="flex flex-col border-2 border-[#8B47FF] rounded-2xl p-8 gap-5"
            style={{ background: "radial-gradient(ellipse at center, #FEF0F9 0%, #FFFFFF 100%)" }}
          >
            <div className="flex items-center gap-2 text-[#8B47FF] font-bold text-sm tracking-[0.16em] uppercase whitespace-nowrap">
            Ton potentiel intérieur
            </div>
            {isLoaded && (
              <>
                <h2 className="text-3xl font-bold text-black">{currentWheelData.title}</h2>
                <p className="bg-[#F4EBFF] rounded-2xl p-5 text-[#4b3b5c] leading-relaxed">
                  {currentWheelData.desc}
                </p>
              </>
            )}
            
          </article>
        </section>

{/* MIROIR */}
<section className="grid grid-cols-1 md:grid-cols-[auto_1fr] items-center gap-12">
          <div className="flex items-center justify-center">
            <img src="/image_icone/miroire.png" alt="Miroir affirmation" style={{ width: "280px", display: "block" }} />
          </div>
          <article
            className="flex flex-col border-2 border-[#8B47FF] rounded-2xl p-8 gap-5"
            style={{ background: "radial-gradient(ellipse at center, #FEF0F9 0%, #FFFFFF 100%)" }}
          >
          <div className="flex flex-col items-start gap-7">
            <p className="text-[#8B47FF] font-bold tracking-[0.32em] uppercase text-sm">Challenge SOREA</p>
            <h1 className="text-6xl font-bold tracking-[0.08em] text-black">MON REFLET</h1>
            <p className="text-[#4b3b5c] text-xl leading-relaxed max-w-[390px]">
              Choisis ton défi bien-être du jour et avance avec douceur, une action après l&apos;autre.
            </p>
            <Link href={`/route?cat=${favoriWheel}`}>
              <button className="bg-SOREA-V1 text-white font-bold px-10 py-5 rounded-2xl shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl tracking-[0.18em] uppercase cursor-pointer">
                Tourner
              </button>
            </Link>
          </div>
          </article>

</section>

        {/*<section className="rounded-2xl border-2 border-[#8B47FF] bg-white/85 shadow-xl shadow-purple-100/70 backdrop-blur overflow-hidden p-8">
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
        </section>*/}

        <section className="flex flex-col gap-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold tracking-[0.16em] text-black">Défis bien-être</h2>
            <p className="text-[#4b3b5c] text-xl mt-3">Choisis le rituel qui te ressemble aujourd&apos;hui.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {sections.map((section, i) => (
              <Link
                key={i}
                href={section.locked ? "#" : section.href}
                onClick={(e) => section.locked && e.preventDefault()}
                className={`group relative grid grid-cols-[96px_minmax(0,1fr)] lg:grid-cols-[120px_minmax(0,1fr)] items-center gap-4 bg-white/60 px-4 py-4 shadow-sm border border-[#8B47FF]/20 transition-all duration-300 ${
                  section.locked ? "cursor-default" : "hover:scale-105 hover:shadow-xl hover:border-[#8B47FF]/55"
                } focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8B47FF]/50 ${
                  i === sections.length - 1 ? "md:col-span-2" : ""
                }`}
                aria-label={`Ouvrir ${section.title}`}
              >
                {section.locked && (
                  <div className="absolute inset-0 bg-black/40 backdrop-grayscale backdrop-blur-[1px] z-20 flex flex-col items-center justify-center">
                    <img src="/image_icone/Cadenas_Close_Stroke.png" alt="Cadenas" className="w-10 h-10 drop-shadow-md" />
                    <div className="absolute bottom-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/80 text-white text-xs px-3 py-1.5 rounded-md shadow-lg pointer-events-none whitespace-nowrap">
                      Ce challenge sera bientôt disponible
                    </div>
                  </div>
                )}
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

        

      </main>

    <div 
  className="w-full py-25 relative z-10 flex justify-center"
  style={{background: "linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 20%, rgba(255, 255, 255, 1) 80%, rgba(255, 255, 255, 0) 100%)"
  }}>
    <div className="w-full max-w-[1228px] px-4 md:px-0 my-4 mx-auto">
      <DailyEncouragement />
    </div>
    </div>

      <div className="w-full max-w-[1440px] px-6 lg:px-[96px] mx-auto pb-[24px]">
        <Footer />
      </div>
      
    </div>
  );
}
