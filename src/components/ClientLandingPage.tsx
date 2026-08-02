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
      <section className="w-full py-16 px-4">
        <div className={pageSectionClass}>
          <div className="flex flex-col items-center mb-12">
            <h2 className="text-2xl md:text-3xl font-medium tracking-wide">L&apos;univers que vous propose SOREA</h2>
            <div className="h-px bg-[#2A2340] w-full max-w-[400px] mt-2 mb-8"></div>
          </div>
          
          <div className="max-w-3xl mx-auto flex flex-col gap-4 text-lg mb-16">
            <div className="flex items-start gap-4">
              <span className="mt-2 text-xs">⚫</span>
              <p>SOREA t&apos;accompagne pour prendre soin de ton corps, apaiser ton esprit et tes émotions avec simplicité.</p>
            </div>
            <div className="flex items-start gap-4">
              <span className="mt-2 text-xs">⚫</span>
              <p>Ton kit, ton espace, ton coaching : ton bien-être sur mesure.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 xl:gap-8">
            <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-purple-100 flex flex-col items-center text-center">
              <div className="w-full aspect-square rounded-[1.5rem] bg-[#EAE5F8] mb-6 overflow-hidden relative border-4 border-white shadow-sm">
                <Image src="/images/product_3.webp" alt="Kit personnalisé" fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
              </div>
              <h3 className="text-lg font-semibold text-[#665D8B] mb-4">Kit personnalisé</h3>
              <p className="text-xs text-left text-gray-600 leading-relaxed pl-3 border-l-2 border-purple-200">
                Un coffret bien-être unique, composé d&apos;accessoires de pilates, d&apos;un carnet et de soins skincare. 
                Pensé pour allier activité physique, journaling et beauté, il t&apos;accompagne dans les moments de détente et de ressourcement.
              </p>
            </div>

            <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-purple-100 flex flex-col items-center text-center">
              <div className="w-full aspect-square rounded-[1.5rem] bg-[#F7E5D4] mb-6 overflow-hidden relative border-4 border-white shadow-sm">
                <Image src="/images/illustration_features.webp" alt="Espace digital personnel" fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover object-left-top" />
              </div>
              <h3 className="text-lg font-semibold text-[#665D8B] mb-4 leading-tight">Espace digital<br />personnel</h3>
              <p className="text-xs text-left text-gray-600 leading-relaxed pl-3 border-l-2 border-purple-200">
                Du contenu inspirant sous forme de news, du shopping bien-être et surtout un carnet intime connecté 
                pour noter tes humeurs, relever des challenges, suivre tes routines et les habitudes. Ton 
                compagnon digital pour cultiver ton bien-être au quotidien.
              </p>
            </div>

            <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-purple-100 flex flex-col items-center text-center">
              <div className="w-full aspect-square rounded-[1.5rem] bg-[#EAE5F8] mb-6 overflow-hidden relative border-4 border-white shadow-sm">
                <Image src="/images/coaching_pilate.webp" alt="Coaching et inspiration" fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover object-center" />
              </div>
              <h3 className="text-lg font-semibold text-[#665D8B] mb-4 leading-tight">Coaching et<br />inspiration</h3>
              <p className="text-xs text-left text-gray-600 leading-relaxed pl-3 border-l-2 border-purple-200">
                Des séances de coaching (en ligne ou guidées), des conseils inspirants et des pratiques bien-être 
                simples à intégrer chaque jour pour prendre soin de ton corps et de ton esprit.
              </p>
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

      {/* 6. COACHING */}
      <section className="w-full py-16 px-4">
        <div className="w-full max-w-[1180px] mx-auto flex flex-col items-center">
          <div className="flex flex-col items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-medium tracking-wide">Coaching</h2>
            <div className="h-px bg-[linear-gradient(90deg,#d3cced_0%,#fbf7f2_100%)] w-[120px] mt-2 mb-4"></div>
          </div>
          <p className="text-base italic font-light mb-12">Un moment d&apos;accompagnement à vivre ensemble.</p>

          <div className="w-full bg-[#FAF8FC] border border-purple-50 flex flex-col md:flex-row items-center mb-8 shadow-sm">
            <div className="w-full md:w-1/2 relative aspect-video md:aspect-auto md:h-[400px]">
              <Image src="/images/coaching_pilate.webp" alt="Coaching" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
              <button onClick={() => router.push("/coaching")} className={`absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/50 backdrop-blur rounded-full flex items-center justify-center hover:bg-white text-gray-700 ${gradientButtonClass}`}>
                <i className="fa-solid fa-chevron-left"></i>
              </button>
            </div>
            
            <div className="w-full md:w-1/2 p-10 flex flex-col justify-center items-center text-center relative border-l border-white h-full min-h-[400px]">
              <p className="text-lg md:text-xl font-medium leading-relaxed max-w-sm mb-16">
                Explorez une<br />
                multitude de séance<br />
                de coaching pour tous<br />
                les besoins et tous les<br />
                niveau, animés par<br />
                nos coachs<br />
                passionnées.
              </p>
              
              <div className="absolute bottom-0 w-full left-0 right-0 h-14 bg-[#7627A8] flex items-center justify-between px-6 text-white font-medium tracking-widest text-lg">
                <span className="w-6"></span>
                <span>Pilate</span>
                <i className="fa-solid fa-chevron-right text-xl"></i>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={() => router.push("/dashboard/sessions")}
              className={`py-2.5 px-8 text-[#584D7C] bg-[#F2EBF9] rounded-md text-xs font-semibold hover:bg-purple-100 transition-colors ${gradientButtonClass}`}
            >
              Je réserve ma séance
            </button>
            <button 
              onClick={() => router.push("/dashboard")}
              className={`py-2.5 px-8 text-[#584D7C] bg-[#F2EBF9] rounded-md text-xs font-semibold hover:bg-purple-100 transition-colors ${gradientButtonClass}`}
            >
              Proposer une séance
            </button>
          </div>
        </div>
      </section>

      {/* 7. ELLES PARLENT DE SOREA */}
      <section id="review" className="w-full py-16 px-4">
        <div className="w-full max-w-[1180px] mx-auto flex flex-col items-center">
          <div className="flex flex-col items-center mb-6">
            <h2 className="text-2xl md:text-3xl font-medium tracking-wide">Elles parlent de SOREA !</h2>
            <div className="h-px bg-[linear-gradient(90deg,#d3cced_0%,#fbf7f2_100%)] w-full max-w-[280px] mt-2 mb-4"></div>
          </div>
          <p className="text-lg italic font-light mb-12">De petites habitudes, de grands effets</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            {[
              { name: "Marie C.", loc: "Toulouse, France", m: 4, review: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris." },
              { name: "Lila C.", loc: "Toulouse, France", m: 4, review: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris." },
              { name: "Hugo B.", loc: "Toulouse, France", m: 4, review: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris." },
            ].map((t, idx) => (
              <div key={idx} className="bg-white p-6 shadow-sm border border-gray-100 flex flex-col">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden shrink-0">
                    <Image src={`/images/product_${(idx % 6) + 1}.webp`} alt={t.name} width={40} height={40} className="object-cover w-full h-full" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm m-0 leading-tight">{t.name}</h4>
                    <p className="text-[10px] text-gray-500 m-0">{t.loc}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex text-xs text-black">
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-regular fa-star"></i>
                  </div>
                  <span className="text-[10px] text-gray-400">avril 2025</span>
                </div>
                <p className="text-[11px] text-gray-600 leading-relaxed mb-4">
                  {t.review}
                </p>
                <a href="#review" className="text-[10px] font-bold uppercase underline mt-auto text-black">
                  En savoir plus
                </a>
              </div>
            ))}
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

      {/* 9. REJOINS L'AVENTURE SOREA */}
      <section className="w-full py-16 px-4">
        <div className="w-full max-w-[1120px] mx-auto flex flex-col items-center mb-6">
          <h2 className="text-2xl md:text-3xl font-medium tracking-wide">Rejoindre la communauté SOREA</h2>
          <div className="h-px bg-[linear-gradient(90deg,#d3cced_0%,#fbf7f2_100%)] w-[180px] mt-2 mb-4"></div>
        </div>
        <p className="text-base text-center italic font-light mb-12 max-w-[720px] mx-auto">
          Rejoins nous et incarne nos valeurs <br />
          en tant qu&apos; ambassadrice.
        </p>
        <div className="w-full max-w-[1120px] mx-auto flex flex-col items-center text-center">
          <div className="relative w-full rounded-[28px] overflow-hidden px-6 md:px-10 py-10 md:py-12 min-h-[500px]">
            {/* Background */}
            <div 
              className="absolute inset-0 z-0 bg-[linear-gradient(180deg,#fadcce_0%,#fbddcf_100%)]"
              style={{
                WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 50%)',
                maskImage: 'linear-gradient(to right, transparent 0%, black 100%)'
              }}
            />

            {/* Content */}
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-10 lg:gap-12">
              
              {/* Left Block: Text */}
              <div className="w-full md:w-1/2 flex flex-col gap-7">
                {[
                  "Développe ton activité et transforme ta passion pour le bien-être en véritable opportunité",
                  "Partage avec tes proches l'univers des soins naturels SOREA",
                  "Organise tes séances en toute liberté, selon tes envies et ton rythme",
                  "Rejoins un réseau inspirant d'ambassadrice de SOREA et inspire ta communauté.",
                  "Accède à des événements exclusifs réservés à la communauté SOREA"
                ].map((text, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="text-purple-300 text-2xl mt-0.5">
                      <Image src="/images/fleur.png" alt="Fleur" width={30} height={30} />
                    </div>
                    <p className="text-sm leading-relaxed max-w-[340px] font-medium">
                      {text}
                    </p>
                  </div>
                ))}

                <div className="mt-4 flex justify-center md:justify-start">
                  <button
                    onClick={() => router.push("/ambassador-bientot")}
                    className={`py-2.5 px-6 bg-white border border-purple-200 text-[#665D8B] rounded-md text-xs font-bold hover:bg-purple-50 shadow-sm transition-all ${gradientButtonClass}`}
                  >
                    Je veux être membre de SOREA !
                  </button>
                </div>
              </div>
              
              {/* Right Block: Image */}
              <div className="w-full md:w-1/2 flex flex-col items-center justify-center relative min-h-[400px]">
                <div className="absolute top-6">
                  <span className="text-4xl text-[#782ca7] font-semibold tracking-widest drop-shadow-[2px_2px_0_rgba(255,255,255,1)]">
                    Rayonne
                  </span>
                </div>
                
                <Image 
                  src="/images/rejoindre_SOREA.png" 
                  alt="Communauté SOREA" 
                  width={400} 
                  height={400} 
                  className="w-full max-w-[420px] h-auto mt-8 mix-blend-multiply object-contain" 
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Text */}
      <div className="w-full max-w-[1180px] mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-medium tracking-wide text-center mb-6"><strong>S</strong>érénité, <strong>É</strong>quilibre et <strong>A</strong>lignement. SOREA ton bien-être au quotidien.</h2>
      </div>
      <div className="pb-8">
        <Image src="/images/etoile1.png" alt="Etoile" width={60} height={60} className="mx-auto" />
      </div>
        </main>
      </div>
    </>
  );
}
