"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

const gradientButtonClass = "btn--color-degrade";

export default function ClientLandingPage() {
  const router = useRouter();
  const pageSectionClass = "w-full max-w-[1180px] mx-auto px-4 md:px-0";

  // Add product to cart
  const addToCart = async (productName: string, price: number) => {
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productName, price, quantity: 1 }),
      });
      if (res.ok) {
        alert(`${productName} ajouté au panier!`);
      } else {
        alert("Erreur lors de l'ajout au panier");
      }
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  return (
    <>
      <div className="w-full overflow-x-hidden font-['Inria_Sans',sans-serif]">
        <main className="w-full max-w-[1440px] mx-auto flex flex-col items-center gap-[72px] py-[64px] px-4 md:px-0">
      {/* 1. HERO SECTION */}
      <section className="relative w-full h-[600px] md:h-[750px] flex items-center justify-center overflow-hidden">
        {/* Image de fond : Welcome.png */}
        <Image
          src="/image_LandingPage/Welcome.png"
          alt="SOREA Welcome"
          fill
          priority
          className="object-cover object-center"
        />

        {/* Overlay translucide (Glassmorphism) centré */}
        <div className="relative z-10 w-full max-w-[900px] mx-4 bg-white/25 backdrop-blur-md border border-white/30 rounded-[32px] p-8 md:p-14 text-white shadow-xl flex flex-col items-start gap-6">
          <h1 className="text-4xl md:text-6xl font-light tracking-wide text-white drop-shadow-sm">
            SOREA
          </h1>
          
          <p className="text-lg md:text-2xl font-light leading-relaxed max-w-xl text-[var(--color-Ecriture)] drop-shadow-sm">
            Des essentiels pensés pour apaiser l&apos;esprit<br className="hidden sm:inline" />
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
            L&apos;UNIVERS QUE VOUS PROPOSE <span className="text-[#8B47FF]">SOREA</span>
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
              <h3 className="text-base font-semibold leading-tight">Kit personnalisé</h3>
              <p className="text-xs font-normal text-[var(--color-Blanc-Violet)] leading-snug">
                Un coffret sur-mesure, pensé pour vos besoins.
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
              <h3 className="text-base font-semibold leading-tight">Espace Digital Personnalisable</h3>
              <p className="text-xs font-normal text-[var(--color-Blanc-Violet)] leading-snug">
                Suivez vos progrès et découvrez du contenu inspirant.
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
              <h3 className="text-base font-semibold leading-tight">Coaching et inspiration</h3>
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
        <div className="w-full max-w-[1440px] flex flex-col md:flex-row items-center justify-center gap-10 md:gap-[50px]">
          
          {/* Illustration (Cadeau / Spinner) */}
          <div className="w-full md:w-1/2 flex justify-center">
            <Image
              src="/image_LandingPage/DefisBienEtre.png"
              alt="Les challenges et surprises SOREA"
              width={361}
              height={439.45}
              className="w-[300px] h-auto object-contain"
            />
          </div>

          {/* Contenu Texte & Bouton */}
          <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left gap-4">
            <h2 className="text-2xl md:text-4xl font-semibold tracking-wide text-[#2A2340]">
              LES CHALLENGES ET SURPRISES <span className="text-[#8B47FF]">SOREA</span>
            </h2>
            
            <p className="text-sm md:text-base text-[#2A2340]/80 font-normal max-w-md">
              Des défis de développement personnel pensés pour vous inspirer et vous faire grandir, un jour à la fois.
            </p>

            <button
              onClick={() => router.push("/carnet")}
              className="mt-2 px-8 py-3 bg-[var(--color-SOREA-V1)] hover:bg-[#7833ee] text-white text-sm font-medium rounded-full transition-colors shadow-sm"
            >
              Commencer mon défi
            </button>
          </div>

        </div>
      </section>

      {/* 4. SECTION : SUIVRE, ÉCRIRE, PROGRESSER */}
      <section className="w-full py-[48px] px-4 md:px-[32px] flex items-center justify-center">
        <div className="w-full max-w-[1440px] flex flex-col md:flex-row items-center justify-center gap-[22px]">
          
          {/* Bloc Texte & Boutons (Gauche) */}
          <div className="w-full md:w-1/2 flex flex-col items-center text-center gap-6">
            <h2 className="text-2xl md:text-4xl font-semibold tracking-wide text-[#2A2340]">
              SUIVRE, ÉCRIRE, PROGRESSER
            </h2>
            
            <p className="text-base md:text-lg text-[#2A2340]/80 font-normal">
              Notes, Humeurs, Habitudes, Challenges<br />et Coin divertissement
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
              <button
                onClick={() => router.push("/carnet")}
                className="px-6 py-3 bg-[#8B47FF] hover:bg-[#7833ee] text-white text-sm font-medium rounded-full transition-colors shadow-sm"
              >
                Découvrir mon carnet
              </button>
              
              <button
                onClick={() => router.push("/shop")}
                className="px-6 py-3 bg-[#8B47FF] hover:bg-[#7833ee] text-white text-sm font-medium rounded-full transition-colors shadow-sm"
              >
                Commander mon carnet
              </button>
            </div>
          </div>

          {/* Bloc Image Carnet (Droite) */}
          <div className="w-full md:w-1/2 flex justify-center">
            <div className="relative overflow-hidden ">
              <Image
                src="/image_LandingPage/Carnet.png"
                alt="Mon carnet SOREA"
                width={500}
                height={700}
                className="max-w-[500px] h-auto object-cover rounded-[4px] drop-shadow-[18px_17px_10px_#F8DAEA]"
              />
            </div>
          </div>

        </div>
      </section>

      {/* 8. SOREA NEWS */}
      <section className="w-full py-16 px-4">
        <div className="w-full max-w-[1120px] mx-auto flex flex-col items-center">
          <div className="flex flex-col items-center mb-6">
            <h2 className="text-2xl md:text-3xl font-medium tracking-wide">SOREA NEWS</h2>
            <div className="h-px bg-[linear-gradient(90deg,#d3cced_0%,#fbf7f2_100%)] w-[180px] mt-2 mb-4"></div>
          </div>
          <p className="text-base text-center italic font-light mb-12">
            Parce qu&apos;être informé peut aussi être un moment de bien-être :<br />
            Inspirez-vous, informez-vous, vivez l&apos;instant.
          </p>

          <div className="w-full max-w-[920px] relative aspect-[16/7] md:aspect-[21/9] mb-12">
            <Image src="/images/News_landing.png" alt="SOREA News Collage" fill sizes="(min-width: 1024px) 896px, 100vw" className="object-contain" />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <button
              onClick={() => router.push("/vibe-bientot")}
              className={`py-2.5 px-6 border border-purple-200 text-[#665D8B] bg-white rounded-md text-xs font-semibold hover:bg-purple-50 transition-colors ${gradientButtonClass}`}
            >
              Découvrir SOREA News
            </button>
            <button
              onClick={() => router.push("/ambassadrice-bientot")}
              className={`py-2.5 px-6 border border-purple-200 text-[#665D8B] bg-white rounded-md text-xs font-semibold hover:bg-purple-50 transition-colors ${gradientButtonClass}`}
            >
              Recevoir mon magazine
            </button>
          </div>
        </div>
      </section>

      {/* 4. SECTION : LES CHALLENGES ET SURPRISES SOREA (WHEEL SPINNER) */}
      <section className="w-full bg-[#DAC3FF]/30 py-[48px] px-4 md:px-[106px] flex items-center justify-center">
        <div className="w-full max-w-[1440px] flex flex-col md:flex-row items-center justify-center gap-10 md:gap-[60px]">
          
          {/* Roue de la fortune (Gauche) */}
          <div className="w-full md:w-1/2 flex justify-center items-center">
            <Image
              src="/image_icone/image_Wheel-Spinner/WS_Bien-être1.png"
              alt="Roue des challenges SOREA"
              width={300}
              height={300}
              className="w-full max-w-[300px] md:max-w-[380px] h-auto object-contain drop-shadow-md"
              priority
            />
          </div>

          {/* Contenu Texte + Tag + Bouton (Droite) */}
          <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left gap-5">
            <h2 className="text-2xl md:text-4xl font-semibold tracking-wide text-[#2A2340]">
              LES CHALLENGES ET SURPRISES <span className="text-[#8B47FF]">SOREA</span>
            </h2>
            
            <p className="text-sm md:text-base text-[#2A2340]/80 font-normal max-w-md">
              Des défis de développement personnel pensés pour vous inspirer et vous faire grandir, un jour à la fois.
            </p>

            {/* Carte/Encadré translucide "Exemple de défis" */}
            <div className="w-full max-w-[340px] bg-[#D6BBFF]/60 rounded-[14px] p-3 px-4 flex items-center gap-3">
              <Image
                src="/image_icone/image_Wheel-Spinner/Introspection.png"
                alt="Loupe Introspection"
                width={36}
                height={36}
                className="w-9 h-9 object-contain shrink-0"
              />
              <span className="text-white text-sm font-medium">
                Exemple de défis
              </span>
            </div>

            {/* Bouton Commencer */}
            <button
              onClick={() => router.push("/carnet")}
              className="mt-1 px-8 py-3 bg-[#8B47FF] hover:bg-[#7833ee] text-white text-sm font-medium rounded-full transition-colors shadow-sm"
            >
              Commencer mon défi
            </button>
          </div>

        </div>
      </section>

      {/* Footer Text */}
      <div className="w-full max-w-[1180px] mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-medium tracking-wide text-center mb-6"><strong>S</strong>érénité, <strong>É</strong>quilibre et <strong>A</strong>lignement. SOREA ton bien-être au quotidien.</h2>
      </div>

<section className="rounded-2xl bg-[linear-gradient(90deg,#F4EBFF_0_12.5%,#FFFFFF_12.5%_25%,#F4EBFF_25%_37.5%,#FFFFFF_37.5%_50%,#F4EBFF_50%_62.5%,#FFFFFF_62.5%_75%,#F4EBFF_75%_87.5%,#FFFFFF_87.5%_100%)] p-8 text-center">
          <p className="w-full text-xl font-bold text-black">Chaque petit défi compte. Tu avances déjà.</p>
        </section>

        </main>
      </div>
    </>
  );
}
