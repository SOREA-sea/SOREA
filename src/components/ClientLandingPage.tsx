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

      {/* 3. NOS ESSENTIELS BIEN-ETRE */}
      <section className="w-full py-16 px-4">
        <div className="w-full max-w-[1180px] mx-auto px-4">
          <div className="flex flex-col items-center mb-10">
            <h2 className="text-2xl md:text-3xl font-medium tracking-wide">Nos essentiels bien-être</h2>
            <div className="h-px bg-[linear-gradient(90deg,#d3cced_0%,#fbf7f2_100%)] w-full max-w-[260px] mt-2 mb-4"></div>
            <p className="text-center font-light text-lg md:text-xl leading-relaxed">Des objectifs doux & beaux,<br />sélectionnés pour vous accompagner chaque jour.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            {[
              { name: "Kit anti anxiété", desc: "Respiration guidée, roll-on et cartes rituels, votre pause apaisante à portée de main.", price: 29 },
              { name: "Lunettes anti lumière bleue", desc: "Protection premium pour les yeux, design léger et confortable.", price: 49 },
              { name: "Coffret relaxation", desc: "Gua-sha, brume d'oreiller et carnet de nuit, un moment rien que pour vous", price: 59 },
            ].map((product, idx) => (
              <div key={idx} className="min-h-[312px] bg-white rounded-[10px] shadow-sm border border-[#cfc9d5] overflow-hidden flex flex-col">
                <div className="h-[138px] bg-[linear-gradient(90deg,rgba(255,255,255,0.65)_0_24px,rgba(234,234,234,0.9)_24px_48px),linear-gradient(0deg,rgba(255,255,255,0.65)_0_34px,rgba(234,234,234,0.9)_34px_68px)] bg-[length:68px_68px]"></div>
                <div className="p-3 md:p-4 flex flex-1 flex-col">
                  <h3 className="font-bold text-[#2A2340] mb-2 leading-tight">{product.name}</h3>
                  <p className="text-sm text-[#2A2340]/85 leading-snug max-w-[440px]">{product.desc}</p>
                  <div className="mt-auto flex items-end justify-between gap-4 pt-6">
                    <p className="font-bold text-lg text-[#8B47FF]">{product.price}€</p>
                    <button
                      onClick={() => addToCart(product.name, product.price)}
                      className="min-w-[120px] py-2.5 px-5 bg-[#8B47FF] text-white text-sm font-semibold rounded-[7px] hover:opacity-90 transition-opacity shadow-[0_5px_0_rgba(154,132,204,0.45),0_10px_24px_rgba(67,56,114,0.12)]"
                    >
                      Découvrir
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => router.push("/shop")}
              className="min-h-[312px] rounded-[10px] border-2 border-dashed border-[#8B47FF] bg-[#E9E7FF] flex flex-col items-center justify-center gap-4 text-[#000] hover:bg-[#e2ddff] transition-colors"
            >
              <span className="w-12 h-12 rounded-full bg-[#8B47FF] text-white flex items-center justify-center text-3xl leading-none shadow-[0_5px_0_rgba(154,132,204,0.45),0_10px_24px_rgba(67,56,114,0.12)]">
                →
              </span>
              <span className="text-lg md:text-xl font-medium">Voir toutes les catégories</span>
            </button>
          </div>
          
          <div className="mt-10 flex justify-center">
            <button
              onClick={() => router.push("/shop")}
              className="text-base md:text-lg font-semibold text-white py-3 px-10 rounded-full bg-[#8B47FF] hover:opacity-90 transition-opacity shadow-[0_5px_0_rgba(154,132,204,0.45),0_10px_24px_rgba(67,56,114,0.12)]"
            >
              Accéder à la boutique
            </button>
          </div>
        </div>
      </section>

      {/* 4. NOS CHALLENGES SURPRISES */}
      <section className="w-full py-16 px-4 overflow-hidden">
        <div className={pageSectionClass + " flex flex-col items-center"}>
          <div className="flex flex-col items-center mb-16">
            <h2 className="text-2xl md:text-3xl font-medium tracking-wide text-center">Nos challenges<br />surprises</h2>
            <div className="h-px bg-[linear-gradient(90deg,#d3cced_0%,#fbf7f2_100%)] w-[200px] mt-2"></div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between w-full gap-8 relative">
            {/* Wheel Spinner */}
            <div>
              <Image src="/images/wheelspinner.png" alt="Roulette des défis" width={400} height={400} className="w-full h-auto object-contain" />
            </div>

            {/* Middle: Text and Buttons */}
            <div className="w-full md:w-1/3 flex flex-col items-center text-center">
              <p className="text-base mb-8 max-w-sm">
                Tes défis SOREA t&apos;attendent, avec une multitude de challenges intégrés pour te dépasser et te développer personnellement !
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => router.push("/carnet")}
                  className={`py-2.5 px-6 border border-[#2A2340] bg-white rounded-md text-xs font-semibold hover:bg-gray-50 ${gradientButtonClass}`}
                >
                  Découvrir tous<br/>les défis SOREA
                </button>
                <button 
                  onClick={() => addToCart("Kit Défis SOREA", 49)}
                  className={`py-2.5 px-6 bg-[#A18FE3] border border-[#A18FE3] text-white rounded-md text-xs font-semibold hover:bg-[#8D7CD4] ${gradientButtonClass}`}
                >
                  Recevoir mon kit<br/>à défis SOREA
                </button>
              </div>
            </div>

            {/* GiftBox */}
            <div>
              <Image src="/images/cadeaux.png" alt="Roulette des défis" width={400} height={400} className="w-full h-auto object-contain" />
            </div>
          </div>
        </div>
      </section>

      {/* 5. SUIVRE, ECRIRE, PROGRESSER */}
      <section className="w-full py-16 px-4">
        <div className="w-full max-w-[1080px] mx-auto flex flex-col items-center">
          <div className="flex flex-col items-center mb-6">
            <h2 className="text-2xl md:text-3xl font-medium tracking-wide">Suivre, écrire, progresser</h2>
            <div className="h-px bg-[linear-gradient(90deg,#d3cced_0%,#fbf7f2_100%)] w-full max-w-[300px] mt-2 mb-4"></div>
          </div>
          <p className="text-sm tracking-wider uppercase mb-16 text-center">Notes, Humeurs, Habitudes, Challenges et<br />Coin divertissement</p>

          <div>
            <Image src="/images/Diary_SOREA.png" alt="Carnet SOREA" width={1200} height={800} className="w-full max-w-[1080px] h-auto object-cover" />
          </div>

          <div className="flex gap-4">
            <button 
              onClick={() => router.push("/carnet")}
              className={`py-2 px-6 border border-[#2A2340] bg-white rounded-md text-xs font-semibold hover:bg-gray-50 ${gradientButtonClass}`}
            >
              Découvrir mon Carnet
            </button>
            <button 
              onClick={() => addToCart("Carnet Challenge SOREA", 39)}
              className={`py-2 px-6 border border-[#2A2340] bg-white rounded-md text-xs font-semibold hover:bg-gray-50 ${gradientButtonClass}`}
            >
              Commander mon Carnet Challenge
            </button>
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


      {/* Footer Text */}
      <div className="w-full max-w-[1180px] mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-medium tracking-wide text-center mb-6"><strong>S</strong>érénité, <strong>É</strong>quilibre et <strong>A</strong>lignement. SOREA ton bien-être au quotidien.</h2>
      </div>

        </main>
      </div>
    </>
  );
}
