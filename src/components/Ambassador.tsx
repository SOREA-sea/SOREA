import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

/* ─── Section 1 : Hero ─── */
const SectionHero = () => (
  <section className="w-full max-w-[966px] flex flex-col items-center gap-[60px] px-5">
    <h1 className="text-[50px] font-bold tracking-[0.13em] underline text-center text-[#1a0533] leading-[1.2]">
      Deviens<br />Ambassadrice SOREA
    </h1>
    <div className="w-full max-w-[860px] flex flex-col items-center relative">
      <div className="bg-white rounded-[99.5px] py-7 px-[60px] text-[24px] tracking-[0.1em] text-[#1a0533] leading-[1.6] relative z-[2] w-full">
        Vous savez qu'en devenant Ambassadrice SOREA, vous pouvez
        accéder à des avantages exclusifs et cumuler des points de
        fidélité à chaque action réalisée ?
      </div>
      <div className="w-0 h-0 border-l-[45px] border-l-transparent border-r-[0px] border-r-transparent border-t-[60px] border-t-white absolute top-full left-[55%] z-[1]" />
      <div className="w-full max-w-[516px] h-[220px] bg-gradient-to-br from-[#e2dbef] to-[#f4c0d1] rounded-z-[16px] rounded-[16px] flex items-center justify-content: center justify-center text-[#6a18a4] text-[16px] font-bold tracking-[0.1em] mt-5">
        Photo ambassadrice
      </div>
    </div>
  </section>
);

/* Dot de la frise */
const FriseDot = () => (
  <div className="w-20 h-20 bg-[#BEA7E3] rounded-full flex items-center justify-center flex-shrink-0">
    <div className="w-[44px] h-[44px] bg-[#FEF0F9] rounded-full flex items-center justify-center">
      <div className="w-[30px] h-[30px] bg-[#6a18a4] rounded-full" />
    </div>
  </div>
);

/* ─── Section 2 : Je deviens ambassadrice pour ─── */
const SectionPour = () => (
  <section className="flex flex-col items-center gap-[50px] w-full max-w-[1274px] px-10">
    <h1 className="text-[50px] font-bold tracking-[0.13em] underline text-center text-[#1a0533] max-w-[653px]">
      Je deviens ambassadrice pour...
    </h1>

    <div className="w-full max-w-[860px] flex flex-col items-stretch gap-10 relative py-5">
      {/* Ligne de la frise */}
      <div className="absolute top-0 bottom-0 left-[calc(50%-10px)] w-[21px] bg-[#6A18A4] rounded-[10px] z-0" />

      {/* Rayonne (centré) */}
      <div className="flex justify-center relative z-[1]">
        <div className="text-[42px] font-bold tracking-[0.13em] text-white [text-shadow:-7px_-5px_10.8px_#280267,7px_5px_10.8px_#280267] flex items-center gap-3 py-5 px-[30px]">
          <div className="w-10 h-10 lg:w-[60px] lg:h-[60px] bg-gradient-to-br from-[#9B6FD9] to-[#f498c5] rounded-full flex items-center justify-center flex-shrink-0" />
          Rayonne
          <div className="w-10 h-10 lg:w-[60px] lg:h-[60px] bg-gradient-to-br from-[#9B6FD9] to-[#f498c5] rounded-full flex items-center justify-center flex-shrink-0" />
        </div>
      </div>

      {/* Row 1 : dot + carte à droite */}
      <div className="flex items-center relative z-[1] min-h-[60px]">
        <div className="w-[calc(50%-60px)] flex justify-end pr-5" />
        <div className="w-[120px] flex-shrink-0 flex justify-center items-center z-[2]"><FriseDot /></div>
        <div className="w-[calc(50%-60px)] flex justify-start pl-5">
          <div className="bg-white rounded-[20px] py-5 px-6 pb-[30px] max-w-[320px] w-full">
            <h2 className="text-[22px] font-bold tracking-[0.1em] text-center text-[#1a0533] mb-3.5">Rôle de l'Ambassadrice</h2>
            <p className="text-[15px] tracking-[0.08em] text-[#1a0533] leading-[1.65]">
              Partagez l'univers apaisant de SOREA avec votre entourage à
              travers des moments bien-être uniques.<br /><br />
              Organisez vos propres séances, diffusez nos valeurs
              et faites découvrir les produits de la marque.
            </p>
          </div>
        </div>
      </div>

      {/* Row 2 : carte à gauche + dot */}
      <div className="flex items-center relative z-[1] min-h-[60px]">
        <div className="w-[calc(50%-60px)] flex justify-end pr-5">
          <div className="bg-white rounded-[20px] py-5 px-6 pb-[30px] max-w-[320px] w-full">
            <h3 className="text-[22px] font-bold tracking-[0.1em] text-center text-[#1a0533] mb-3.5">Récompenses et privilèges</h3>
            <p className="text-[15px] tracking-[0.08em] text-[#1a0533] leading-[1.65]">
              Accédez à des réductions spéciales, à des <b>coffrets saisonniers</b>,
              et à des <b>voyages bien-être</b> dédiés à nos ambassadrices les plus actives.
            </p>
          </div>
        </div>
        <div className="w-[120px] flex-shrink-0 flex justify-center items-center z-[2]"><FriseDot /></div>
        <div className="w-[calc(50%-60px)] flex justify-start pl-5" />
      </div>

      {/* Row 3 : dot + carte à droite */}
      <div className="flex items-center relative z-[1] min-h-[60px]">
        <div className="w-[calc(50%-60px)] flex justify-end pr-5" />
        <div className="w-[120px] flex-shrink-0 flex justify-center items-center z-[2]"><FriseDot /></div>
        <div className="w-[calc(50%-60px)] flex justify-start pl-5">
          <div className="bg-white rounded-[20px] py-5 px-6 pb-[30px] max-w-[320px] w-full">
            <h3 className="text-[22px] font-bold tracking-[0.1em] text-center text-[#1a0533] mb-3.5">Avantages exclusifs de la communauté SOREA</h3>
            <p className="text-[15px] tracking-[0.08em] text-[#1a0533] leading-[1.65]">
              Faites partie d'un <b>réseau</b> inspirant et bienveillant, participez à des
              évènements exclusifs et recevez les <b>nouveautés SOREA en avant-première.</b>
            </p>
          </div>
        </div>
      </div>

      {/* Row 4 : carte à gauche + dot */}
      <div className="flex items-center relative z-[1] min-h-[60px]">
        <div className="w-[calc(50%-60px)] flex justify-end pr-5">
          <div className="bg-white rounded-[20px] py-5 px-6 pb-[30px] max-w-[320px] w-full">
            <h2 className="text-[22px] font-bold tracking-[0.1em] text-center text-[#1a0533] mb-3.5">Points de fidélité</h2>
            <p className="text-[15px] tracking-[0.08em] text-[#1a0533] leading-[1.65]">
              Chaque action compte : partage, organisation de séance, recommandation...
              Cumulez des points et transformez-les en cadeaux exclusifs ou bons d'achat.
            </p>
          </div>
        </div>
        <div className="w-[120px] flex-shrink-0 flex justify-center items-center z-[2]"><FriseDot /></div>
        <div className="w-[calc(50%-60px)] flex justify-start pl-5" />
      </div>

      {/* Row 5 : dot + texte violet droite */}
      <div className="flex items-center relative z-[1] min-h-[60px]">
        <div className="w-[calc(50%-60px)] flex justify-end pr-5" />
        <div className="w-[120px] flex-shrink-0 flex justify-center items-center z-[2]"><FriseDot /></div>
        <div className="w-[calc(50%-60px)] flex justify-start pl-5">
          <div className="z-[1] relative max-w-[280px]">
            <div className="w-full h-[60px] bg-gradient-to-br from-[#e2dbef] to-[#bea7e3] rounded-[10px] flex items-center justify-center text-[12px] text-[#6a18a4]">🌸</div>
            <h2 className="text-[22px] font-bold tracking-[0.1em] text-[#6a18a4] text-center leading-[1.4] mt-2.5">Rejoignez une communauté qui cultive la sérénité.</h2>
          </div>
        </div>
      </div>

      {/* Row 6 : texte violet gauche + dot */}
      <div className="flex items-center relative z-[1] min-h-[60px]">
        <div className="w-[calc(50%-60px)] flex justify-end pr-5">
          <div className="z-[1] relative max-w-[280px] text-right">
            <div className="w-full h-[60px] bg-gradient-to-br from-[#e2dbef] to-[#bea7e3] rounded-[10px] flex items-center justify-center text-[12px] text-[#6a18a4]">✈️</div>
            <h2 className="text-[22px] font-bold tracking-[0.1em] text-[#6a18a4] text-center leading-[1.4] mt-2.5">Vivez votre passion du bien-être sous toutes ses formes</h2>
          </div>
        </div>
        <div className="w-[120px] flex-shrink-0 flex justify-center items-center z-[2]"><FriseDot /></div>
        <div className="w-[calc(50%-60px)] flex justify-start pl-5" />
      </div>

      {/* Row 7 : dot + texte violet droite */}
      <div className="flex items-center relative z-[1] min-h-[60px]">
        <div className="w-[calc(50%-60px)] flex justify-end pr-5" />
        <div className="w-[120px] flex-shrink-0 flex justify-center items-center z-[2]"><FriseDot /></div>
        <div className="w-[calc(50%-60px)] flex justify-start pl-5">
          <div className="z-[1] relative max-w-[280px]">
            <div className="w-full h-[60px] bg-gradient-to-br from-[#e2dbef] to-[#bea7e3] rounded-[10px] flex items-center justify-center text-[12px] text-[#6a18a4]">🎁</div>
            <h2 className="text-[22px] font-bold tracking-[0.1em] text-[#6a18a4] text-center leading-[1.4] mt-2.5">Votre engagement est récompensé</h2>
          </div>
        </div>
      </div>

      {/* Row 8 : texte violet gauche + dot */}
      <div className="flex items-center relative z-[1] min-h-[60px]">
        <div className="w-[calc(50%-60px)] flex justify-end pr-5">
          <div className="z-[1] relative max-w-[280px] text-right">
            <div className="w-full h-[60px] bg-gradient-to-br from-[#e2dbef] to-[#bea7e3] rounded-[10px] flex items-center justify-center text-[12px] text-[#6a18a4]">🎯</div>
            <h2 className="text-[22px] font-bold tracking-[0.1em] text-[#6a18a4] text-center leading-[1.4] mt-2.5">Devenez une source d'inspiration et de sérénité.</h2>
          </div>
        </div>
        <div className="w-[120px] flex-shrink-0 flex justify-center items-center z-[2]"><FriseDot /></div>
        <div className="w-[calc(50%-60px)] flex justify-start pl-5" />
      </div>

    </div>

    <button className="border-none px-7 h-[50px] bg-white shadow-[0_3px_3.1px_rgba(186,152,244,0.7)] rounded-[10px] cursor-pointer font-['Roboto',sans-serif] font-black text-[16px] tracking-[0.1em] text-[#6a18a4] transition-[box-shadow,transform] duration-200 hover:shadow-[0_6px_16px_rgba(186,152,244,0.9)] hover:-translate-y-0.5 whitespace-nowrap">
      Je veux être membre de SOREA !
    </button>
  </section>
);

/* ─── Section 3 : Rejoindre ─── */
const s3Items = [
  "Développe ton activité et transforme ta passion pour le bien-être en véritable opportunité",
  "Partage avec tes proches l'univers des soins naturels SOREA",
  "Organise tes séances en toute liberté, selon tes envies et ton rythme",
  "Rejoins un réseau inspirant d'ambassadrices de SOREA et inspire ta communauté.",
  "Accède à des évènements exclusifs réservés à la communauté SOREA",
];

const SectionRejoindre = () => (
  <section className="w-full flex flex-col items-center gap-[50px] px-5">
    <div className="flex flex-col items-center gap-[44px]">
      <h1 className="text-[50px] font-bold tracking-[0.13em] underline text-center text-[#1a0533] max-w-[688px]">
        Rejoindre la communauté SOREA
      </h1>
      <p className="text-[24px] tracking-[0.1em] text-black text-center">Rejoins nous et incarne nos valeurs en tant qu'ambassadrice.</p>
    </div>

    <div className="w-full max-w-[1248px] bg-gradient-to-r from-[rgba(251,221,207,0)] to-[#fadcce] rounded-[20px] overflow-hidden flex flex-row items-stretch min-h-[500px]">
      <div className="flex-1 p-[60px_40px_60px_40px] flex flex-col gap-10">
        <div className="flex flex-col gap-8">
          {s3Items.map((text, i) => (
            <div className="flex items-center gap-6" key={i}>
              <div className="w-[70px] h-[70px] flex-shrink-0 bg-gradient-to-br from-[#bea7e3] to-[#f498c5] rounded-full flex items-center justify-center text-[24px]">🌸</div>
              <p className="text-[18px] tracking-[0.08em] text-[#1a0533] leading-[1.5]">{text}</p>
            </div>
          ))}
        </div>
        <div>
          <button className="border-none px-7 h-[50px] bg-white shadow-[0_3px_3.1px_rgba(186,152,244,0.7)] rounded-[10px] cursor-pointer font-['Roboto',sans-serif] font-black text-[16px] tracking-[0.1em] text-[#6a18a4] transition-[box-shadow,transform] duration-200 hover:shadow-[0_6px_16px_rgba(186,152,244,0.9)] hover:-translate-y-0.5 whitespace-nowrap">
            Je veux être membre de SOREA !
          </button>
        </div>
      </div>
      <div className="flex-shrink-0 w-[420px] flex items-stretch">
        <div className="w-full bg-gradient-to-b from-[#f4c0d1] to-[#e2c0ef] flex items-center justify-center text-[#6a18a4] text-[16px] font-bold">
          Photo ambassadrice
        </div>
      </div>
    </div>
  </section>
);

/* ─── Page principale ─── */
const AmbassadriceSOREA = () => (
  <>
    
    
    <Navbar />
    
    <div className="w-full pt-[40px] flex flex-col items-center overflow-x-hidden bg-gradient-to-r from-[#FBF7F2] to-[#E2DBEF] font-['Inria_Sans',sans-serif] text-[#1a0533]">
      <main className="w-full max-w-[1440px] flex flex-col items-center gap-[120px] py-[80px] px-0">
        <SectionHero />
        <SectionPour />
        <SectionRejoindre />
      </main>
    </div>
    
    <Footer />
  </>
);

export default AmbassadriceSOREA;