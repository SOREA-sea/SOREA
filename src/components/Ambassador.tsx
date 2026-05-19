"use client";
import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

/* ─── Section 1 : Hero ─── */
const SectionHero = () => (
  <section className="w-full max-w-[966px] flex flex-col items-center gap-[60px] px-5">
    <h1 className="text-[50px] font-bold tracking-[0.13em] underline text-center text-[#1a0533] leading-[1.2]">
      Deviens<br />Ambassadrice SOREA
    </h1>

    <div className="w-full max-w-[860px] flex flex-col items-center gap-4">
      {/* Bulle texte */}
      <div className="bg-white rounded-[99.5px] py-7 px-[60px] text-[24px] tracking-[0.1em] text-[#1a0533] leading-[1.6] w-full">
        Vous savez qu'en devenant Ambassadrice SOREA, vous pouvez
        accéder à des avantages exclusifs et cumuler des points de
        fidélité à chaque action réalisée ?
      </div>

      {/* Polygone + Image groupés — le polygone est en absolu au-dessus de l'image */}
      <div className="relative w-full max-w-[500px] flex flex-col items-center">
        <Image
          src="/image_ambassadrice_svg/Polygone.svg"
          alt="polygone"
          width={60}
          height={40}
          className="object-contain absolute"
          style={{ top: "-30px", right: "130px", transform: "rotate(15deg)", zIndex: 1 }}
        />
        <Image
          src="/image_ambassadrice_svg/ImageBulle.svg"
          alt="ambassadrices"
          className="w-full object-contain"
          width={500}
          height={300}
        />
      </div>
    </div>
  </section>
);


/* ─── Dot de la frise avec icône ─── */
const FriseDot = ({ icon = "/image_ambassadrice_svg/TimeLine1.svg" }: { icon?: string }) => (
  <div className="w-20 h-20 bg-[#BEA7E3] rounded-full flex items-center justify-center flex-shrink-0">
    <div className="w-[42px] h-[42px] bg-[#FEF0F9] rounded-full flex items-center justify-center">
      <Image src={icon} alt="icone" width={23} height={23} className="object-contain" />
    </div>
  </div>
);

/* ─── Bouton son ─── */
const SoundButton = () => {
  const [muted, setMuted] = useState(false);
  return (
    <button
      onClick={() => setMuted(!muted)}
      title={muted ? "Activer le son" : "Couper le son"}
      className="fixed top-[90px] right-6 z-[999] bg-transparent border-none cursor-pointer
        flex items-center justify-center transition-all duration-200 hover:scale-[1.12]
        hover:drop-shadow-[0_0_15px_rgba(0,229,209,0.9)]"
      style={{ width: "72px", height: "96px" }}
    >
      <Image
        src={muted ? "/image_ambassadrice_svg/no_audio.png" : "/image_ambassadrice_svg/audio.png"}
        alt={muted ? "pas de son" : "son activé"}
        width={50}
        height={50}
        className="object-contain"
      />
    </button>
  );
};

/* ─── Bouton devenir ambassadrice ─── */
function DevenirAmbassadriceBtn() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleBecomeAmbassador = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        const user = data.user;
        if (user.role === "COACH" || user.role === "AMBASSADEUR") {
          router.push("/dashboard");
          return;
        } else {
          await fetch("/api/auth/logout", { method: "POST" });
          sessionStorage.clear();
          router.push("/login?tab=inscription");
          router.refresh();
          return;
        }
      }
    } catch (error) {
      console.error("Erreur lors de la vérification du statut SOREA:", error);
    }
    router.push("/login?tab=inscription");
    setIsLoading(false);
  };

  return (
    <button
      onClick={handleBecomeAmbassador}
      disabled={isLoading}
      className="border-none px-7 h-[50px] bg-white shadow-[0_3px_3.1px_rgba(186,152,244,0.7)]
      rounded-[10px] cursor-pointer font-['Roboto',sans-serif] font-black text-[16px] tracking-[0.1em]
      text-[#6a18a4] transition-[box-shadow,transform] duration-200 hover:shadow-[0_6px_16px_rgba(186,152,244,0.9)]
      hover:-translate-y-0.5 hover:bg-gradient-to-r hover:from-[#8B47FF] hover:to-[#BA98F4] hover:text-white
      hover:shadow-[0_0_0_4px_rgba(59,7,100,0.25),0_0_18px_rgba(59,7,100,0.5)] whitespace-nowrap disabled:opacity-50"
    >
      {isLoading ? "Vérification..." : "Je veux être membre de SOREA !"}
    </button>
  );
}

/* ─── Section 2 : Je deviens ambassadrice pour ─── */
const SectionPour = () => (
  <section className="flex flex-col items-center gap-[50px] w-full max-w-[1274px] px-10">
    <h1 className="text-[50px] font-bold tracking-[0.13em] underline text-center text-[#1a0533] max-w-[653px]">
      Je deviens ambassadrice pour...
    </h1>

    <div className="w-full max-w-[860px] flex flex-col items-stretch gap-0 relative py-5">

      {/* Ligne de la frise */}
      <div className="absolute top-5 bottom-5 left-1/2 -translate-x-1/2 w-[21px] bg-[#6A18A4] rounded-[10px] z-0" />

      {/* ── Dot début ── */}
      <div className="flex justify-center z-[2] py-0">
        <FriseDot icon="/image_ambassadrice_svg/Fleur_Fond2.svg" />
      </div>

      {/* ── Row 1 : image+titre GAUCHE · carte DROITE ── */}
      <div className="grid grid-cols-[1fr_1fr] items-center relative z-[1] py-8">
        <div className="flex justify-end pr-12 mr-10">
          <div className="flex flex-col items-center max-w-[260px]">
            <Image
              src="/image_ambassadrice_svg/TimeLine1.svg"
              alt="TimeLine1"
              width={100}
              height={100}
              className="object-contain ml-8 mt-4"
            />
            <h2 className="text-[20px] font-bold tracking-[0.1em] text-[#6a18a4] text-center leading-[1.4] mt-1">
              Devenez une source d'inspiration et de sérénité.
            </h2>
          </div>
        </div>
        <div className="flex justify-start pl-12 ml-10">
          <div className="bg-white rounded-[20px] py-5 px-6 pb-[30px] max-w-[280px] w-full">
            <h3 className="text-[20px] font-bold tracking-[0.1em] text-[#1a0533] mb-3">
              Rôle de l'Ambassadrice
            </h3>
            <p className="text-[14px] tracking-[0.08em] text-[#1a0533] leading-[1.65]">
              Partagez l'univers apaisant de SOREA avec votre entourage à
              travers des moments bien-être uniques.<br /><br />
              Organisez vos propres séances (si vous êtes coach), diffusez
              nos valeurs et faites découvrir les produits de la marque.
            </p>
          </div>
        </div>
      </div>

      {/* ── Dot entre row 1 et row 2 ── */}
      <div className="flex justify-center z-[2] py-4">
        <FriseDot icon="/image_ambassadrice_svg/cadeau.svg" />
      </div>

      {/* ── Row 2 : carte GAUCHE · image+titre DROITE ── */}
      <div className="grid grid-cols-[1fr_1fr] items-center relative z-[1] py-8">
        <div className="flex justify-end pr-12 mr-10">
          <div className="bg-white rounded-[20px] py-5 px-6 pb-[30px] max-w-[280px] w-full">
            <h3 className="text-[20px] font-bold tracking-[0.1em] text-center text-[#1a0533] mb-3">
              Points de fidélité
            </h3>
            <p className="text-[14px] tracking-[0.08em] text-[#1a0533] leading-[1.65]">
              Chaque action compte : partage, organisation de séance,
              recommandation... Cumulez des points à chaque initiative et
              transformez-les en cadeaux exclusifs, bons d'achat ou
              avantages premium.
            </p>
          </div>
        </div>
        <div className="flex justify-start pl-12">
          <div className="flex flex-col items-center max-w-[260px]">
            <Image
              src="/image_ambassadrice_svg/TimeLine2.svg"
              alt="TimeLine2"
              width={100}
              height={100}
              className="object-contain"
              style={{ marginRight: "80px", marginTop: "4px" }}
            />
            <h2
              className="text-[20px] font-bold tracking-[0.1em] text-[#6a18a4] text-center leading-[1.4]"
              style={{ marginLeft: "40px" }}
            >
              Votre engagement <br /> est récompensé
            </h2>
          </div>
        </div>
      </div>

      {/* ── Dot entre row 2 et row 3 ── */}
      <div className="flex justify-center z-[2] py-4">
        <FriseDot icon="/image_ambassadrice_svg/avion.svg" />
      </div>

      {/* ── Row 3 : image+titre GAUCHE · carte DROITE ── */}
      <div className="grid grid-cols-[1fr_1fr] items-center relative z-[1] py-8">
        <div className="flex justify-end pr-12 mr-10">
          <div className="relative max-w-[260px] w-full h-[200px]">
            {/* Icône en haut à gauche */}
            <Image
              src="/image_ambassadrice_svg/TimeLine3.svg"
              alt="TimeLine3"
              width={110}
              height={110}
              className="object-contain absolute top-2 left-5"
            />
            {/* Texte en bas à droite qui chevauche */}
            <h2 className="text-[20px] font-bold tracking-[0.1em] text-[#6a18a4] leading-[1.4] absolute bottom-0 right-0 w-[200px] text-center">
              Vivez votre passion du bien-être sous toutes ses formes
            </h2>
          </div>
        </div>
        <div className="flex justify-start pl-12 ml-10">
          <div className="bg-white rounded-[20px] py-5 px-6 pb-[30px] max-w-[280px] w-full">
            <h3 className="text-[20px] font-bold tracking-[0.1em] text-center text-[#1a0533] mb-3">
              Récompenses et privilèges
            </h3>
            <p className="text-[14px] tracking-[0.08em] text-[#1a0533] leading-[1.65]">
              Accédez à des réductions spéciales, à des coffrets saisonniers,
              et à des voyages bien-être dédiés à nos ambassadrices les plus actives.
            </p>
          </div>
        </div>
      </div>

      {/* ── Dot entre row 3 et row 4 ── */}
      <div className="flex justify-center z-[2] py-4">
        <FriseDot icon="/image_ambassadrice_svg/Community.svg" />
      </div>

      {/* ── Row 4 : carte GAUCHE · image+titre DROITE ── */}
      <div className="grid grid-cols-[1fr_1fr] items-center relative z-[1] py-8 mr-10">
        <div className="flex justify-end pr-12">
          <div className="bg-white rounded-[20px] py-5 px-6 pb-[30px] max-w-[280px] w-full">
            <h3 className="text-[18px] font-bold tracking-[0.1em] text-center text-[#1a0533] mb-3">
              Avantages exclusifs de la communauté SOREA
            </h3>
            <p className="text-[14px] tracking-[0.08em] text-[#1a0533] leading-[1.65]">
              Faites partie d'un <b>réseau</b> inspirant et bienveillant,
              participez à des évènements exclusifs et recevez les{" "}
              <b>nouveautés SOREA en avant-première.</b><br />
              Profitez d'une visibilité au sein de la marque et collaborez
              sur de futurs projets inspirants.
            </p>
          </div>
        </div>
        <div className="flex justify-start pl-12">
          <div className="flex flex-col items-center max-w-[260px]">
            <Image
              src="/image_ambassadrice_svg/TimeLine4.svg"
              alt="TimeLine4"
              width={100}
              height={100}
              className="object-contain"
            />
            <h2 className="text-[20px] font-bold tracking-[0.1em] text-[#6a18a4] text-center leading-[1.4]">
              Rejoignez une communauté qui <br /> cultive la sérénité.
            </h2>
          </div>
        </div>
      </div>

      {/* ── Dot fin ── */}
      <div className="flex justify-center z-[2] py-0">
        <FriseDot icon="/image_ambassadrice_svg/crown.svg" />
      </div>

    </div>

    {/* Rayonne */}
    <div className="flex justify-center relative z-[1]" >
      {/* Conteneur relative : les étoiles sont absolute, elles ne créent aucun vide */}
      <div className="relative flex items-center justify-center py-5 px-[30px] relative -top-10" >

        {/* Étoile gauche — absolute, ancrée à gauche du texte */}
        <Image
          src="/image_ambassadrice_svg/etoile2.svg"
          alt="etoile"
          width={80}
          height={50}
          className="object-contain absolute"
          style={{ left: "30px", bottom: "28px" }}
        />

        <span
          className="text-[60px] font-bold tracking-[0.13em] text-white"
          style={{
            WebkitTextStroke: "2px #280267",
            textShadow: "-7px -5px 10.8px #280267, 7px 5px 10.8px #280267",
          }}
        >
          Rayonne
        </span>

        {/* Étoile droite — absolute, ancrée à droite du texte */}
        <Image
          src="/image_ambassadrice_svg/etoile.svg"
          alt="etoile"
          width={70}
          height={100}
          className="object-contain absolute"
          style={{ right: "-5px", top: "52px" }}
        />

      </div>
    </div>

    <DevenirAmbassadriceBtn />
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
      <p className="text-[24px] tracking-[0.1em] text-black text-center">
        Rejoins nous et incarne nos valeurs en tant qu'ambassadrice.
      </p>
    </div>

    <div className="w-full max-w-[1248px] bg-gradient-to-r from-[rgba(251,221,207,0)] to-[#fadcce] rounded-[20px] overflow-hidden flex flex-row items-stretch min-h-[500px]">
      <div className="flex-1 p-[60px_40px_60px_40px] flex flex-col gap-10">
        <div className="flex flex-col gap-8">
          {s3Items.map((text, i) => (
            <div className="flex items-center gap-6" key={i}>
              <div className="w-[70px] h-[70px] flex-shrink-0 rounded-full flex items-center justify-center">
                <Image
                  src="/image_ambassadrice_svg/Fleur_Fond1.svg"
                  alt="check"
                  width={84}
                  height={64}
                  className="object-contain"
                />
              </div>
              <p className="text-[18px] tracking-[0.08em] text-[#1a0533] leading-[1.5]">{text}</p>
            </div>
          ))}
        </div>
        <div>
          <DevenirAmbassadriceBtn />
        </div>
      </div>
      <div className="flex-shrink-0 w-[420px] flex items-stretch">
        <Image
          src="/image_ambassadrice_svg/ChatGPT_image2.png"
          alt="Ambassadrice SOREA"
          width={420}
          height={500}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  </section>
);

/* ─── Page principale ─── */
const AmbassadriceSOREA = () => (
  <>
    <Navbar />
    <SoundButton />
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