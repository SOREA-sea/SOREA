"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import AmbassadorRayonne from "@/components/AmbassadorRayonne";
import DailyEncouragement from "@/components/DailyEncouragement";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[var(--color-FondViolet)] text-[#2A2340] font-sans overflow-x-hidden">
      {/* NAVBAR UNIQUE */}
      <Navbar />

      <main className="w-full max-w-[1440px] mx-auto flex flex-col items-center gap-[72px] py-[64px] px-4 md:px-0">
        
        {/* 1. HERO SECTION */}
        <section className="relative w-full h-[600px] md:h-[750px] flex items-center justify-center overflow-hidden">
          {/* Image de fond : Welcome.png */}
          <Image
            src="/image_photo/Welcome.svg"
            alt="SOREA Welcome"
            fill
            priority
            className="object-cover object-center"
          />

          {/* Overlay translucide (Glassmorphism) centré */}
          <div className="relative z-10 w-full max-w-[1228px] mx-4 bg-white/25 backdrop-blur-md border border-white/30 rounded-[30.5px] p-8 md:p-14 text-white shadow-xl flex flex-col items-start gap-8">
              <h1 className="text-4xl md:text-6xl font-light tracking-wide text-white drop-shadow-sm">
                SOREA
              </h1>

              <p className="text-lg md:text-2xl font-light leading-relaxed max-w-xl text-[var(--color-Ecriture)] drop-shadow-sm">
                Des essentiels pensés pour apaiser l&apos;esprit
                <br className="hidden sm:inline" />
                et harmoniser votre quotidien.
              </p>

              <button
                onClick={() => router.push("/shop")}
                className="mt-2 px-8 py-3 bg-[#8B47FF] hover:bg-[#7833ee] text-white text-sm md:text-base font-medium rounded-full transition-all shadow-md"
              >
                Je commence
              </button>
            </div>
          </section>

        {/* 2. L'UNIVERS QUE VOUS PROPOSE SOREA */}
        <section className="w-full py-[48px] px-4 flex flex-col items-center gap-[50px]">
            {/* Titres */}
            <div className="flex flex-col items-center text-center gap-3">
              <h2 className="text-3xl md:text-4xl font-semibold tracking-wide text-[#2A2340]">
                L&apos;UNIVERS QUE VOUS PROPOSE{" "}
                <span className="text-[#8B47FF]">SOREA</span>
              </h2>
              <p className="text-base md:text-lg text-[#2A2340]/80 font-medium">
                Ton kit, ton espace, ton coaching, ton bien-être sur mesure.
              </p>
            </div>

            {/* Grille des 3 Cartes (306px x 365px) */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-[32px] w-full max-w-[1440px]">
              {/* Carte 1 */}
              <div className="w-[306px] h-[365px] relative rounded-[20px] overflow-hidden flex flex-col justify-end p-2">
                <Image
                  src="/image_LandingPage/KitPersonnalisable.png"
                  alt="Kit personnalisable"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                {/* Overlay Glassmorphism Figma */}
                <div className="relative z-10 w-full h-[162px] bg-[#1E1E1E]/20 backdrop-blur-md rounded-[12px] px-[25px] py-[12px] flex flex-col justify-between items-center text-center text-[var(--color-Blanc-Violet)]">
                  <h3 className="text-base font-semibold leading-tight">
                    Calendrier de suivi
                  </h3>
                  <p className="text-xs font-normal text-[var(--color-Blanc-Violet)] leading-snug">
                    Suivez vos progrès et organise toi quotidiennement
                  </p>
                  <button
                    onClick={() => router.push("/shop")}
                    className="w-full py-2 bg-[#8B47FF] hover:bg-[#7833ee] text-[var(--color-Blanc-Violet)] text-xs font-medium rounded-full transition-colors"
                  >
                    En savoir plus
                  </button>
                </div>
              </div>

              {/* Carte 2 */}
              <div className="w-[306px] h-[365px] relative rounded-[20px] overflow-hidden flex flex-col justify-end p-2">
                <Image
                  src="/image_LandingPage/EspaceDigital.jpg"
                  alt="Espace Digital"
                  fill
                  className="object-cover"
                />
                {/* Overlay Glassmorphism Figma */}
                <div className="relative z-10 w-full h-[162px] bg-[#1E1E1E]/20 backdrop-blur-md rounded-[12px] px-[25px] py-[12px] flex flex-col justify-between items-center text-center text-[var(--color-Blanc-Violet)]">
                  <h3 className="text-base font-semibold leading-tight">
                    Espace Digital
                  </h3>
                  <p className="text-xs font-normal text-[var(--color-Blanc-Violet)] leading-snug">
                    Maintien ta discipline en te challengeant dans un espace cocooning
                  </p>
                  <button
                    onClick={() => router.push("/carnet")}
                    className="w-full py-2 bg-[#8B47FF] hover:bg-[#7833ee] text-[var(--color-Blanc-Violet)] text-xs font-medium rounded-full transition-colors"
                  >
                    En savoir plus
                  </button>
                </div>
              </div>

              {/* Carte 3 */}
              <div className="w-[306px] h-[365px] relative rounded-[20px] overflow-hidden flex flex-col justify-end p-2">
                <Image
                  src="/image_LandingPage/LevelUp.jpg"
                  alt="Coaching et inspiration"
                  fill
                  className="object-cover"
                />
                {/* Overlay Glassmorphism Figma */}
                <div className="relative z-10 w-full h-[162px] bg-[#1E1E1E]/20 backdrop-blur-md rounded-[12px] px-[25px] py-[12px] flex flex-col justify-between items-center text-center text-[var(--color-Blanc-Violet)]">
                  <h3 className="text-base font-semibold leading-tight">
                    Deviens membre/ambassadrice
                  </h3>
                  <p className="text-xs font-normal text-[var(--color-Blanc-Violet)] leading-snug">
                    Des séances guidées par des coachs passionnées.
                  </p>
                  <button
                    onClick={() => router.push("/coaching")}
                    className="w-full py-2 bg-[#8B47FF] hover:bg-[#7833ee] text-[var(--color-Blanc-Violet)] text-xs font-medium rounded-full transition-colors"
                  >
                    En savoir plus
                  </button>
                </div>
              </div>
            </div>
          </section>

        {/* 3. SECTION : LES CHALLENGES ET SURPRISES SOREA */}
          <section className="w-full bg-[#DAC3FF]/30 py-[48px] px-4 md:px-[106px] flex items-center justify-center">
            <div className="w-full max-w-[1440px] flex flex-col md:flex-row items-center justify-center gap-10 md:gap-[60px]">
              {/* Roue de la fortune (Gauche) */}
              <div className="w-full md:w-1/2 flex justify-center items-center">
                {/*<Image
              src="/image_Design-SOREA/image_Wheel-Spinner/WS_Bien-être1.png"
              alt="Roue des challenges SOREA"
              width={300}
              height={300}
              className="w-full max-w-[300px] md:max-w-[380px] h-auto object-contain drop-shadow-md"
              priority
            />*/}
                <Image
                  src="/image_Design-SOREA/DefisBienEtre.svg"
                  alt="Les challenges et surprises SOREA"
                  width={400}
                  height={400}
                  className="w-[300px] h-auto object-contain"
                />
              </div>

              {/* Contenu Texte + Tag + Bouton (Droite) */}
              <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left gap-5">
                <h2 className="text-2xl md:text-4xl font-semibold tracking-wide text-[#2A2340]">
                  LES CHALLENGES ET SURPRISES <span className="text-[#7F4DC5]">SOREA</span>
                </h2>

                <p className="text-sm md:text-base text-[#2A2340]/80 font-normal max-w-md">
                  Des défis de développement personnel pensés <br/> pour vous aider à atteindre vos plus grands objectifs.
                </p>

                {/* Carte/Encadré translucide "Exemple de défis" */}
                <div className="w-full max-w-[340px] bg-[#D6BBFF]/60 rounded-[8px] p-3 px-4 flex items-center gap-3">
                  <Image
                    src="/image_Design-SOREA/image_Wheel-Spinner/Introspection.svg"
                    alt="icône Introspection"
                    width={50}
                    height={50}
                    className="w-9 h-9 object-contain shrink-0"
                  />
                  <span className="text-[#7F4DC5] text-sm font-medium">
                    Exemple de défis
                  </span>
                </div>

                {/* Bouton Commencer */}
                <button
                  onClick={() => router.push("/challenge")}
                  className="mt-1 px-8 py-3 bg-[#8B47FF] hover:bg-[#7833ee] text-white text-sm font-medium rounded-full transition-colors shadow-sm"
                >
                  Découvrir mes routines 
                </button>
              </div>
            </div>
          </section>

       {/* 4. SECTION RAYONNE (AMBASSADRICE) AVEC LE CARROUSEL D'IMAGES */}
        <div className="overflow-x-hidden">
          <AmbassadorRayonne />
        </div>

        {/* Footer Text */}
        <div className="w-full max-w-[1180px] mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-medium tracking-wide text-center mb-6">
            <strong>S</strong>érénité, <strong>É</strong>quilibre et{" "}
            <strong>A</strong>lignement. SOREA ton bien-être au quotidien.
          </h2>
        </div>

        {/* 5. DAILY ENCOURAGEMENT */}
        <div 
          className="w-full py-10 relative z-10 flex justify-center"
          style={{background: "linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 20%, rgba(255, 255, 255, 1) 80%, rgba(255, 255, 255, 0) 100%)"
        }}>
          <div className="w-full max-w-[1228px] px-4 md:px-0 my-4">
            <DailyEncouragement />
          </div>
        </div>

      </main>

      {/* FOOTER UNIQUE */}
      <Footer />
    </div>
  );
}