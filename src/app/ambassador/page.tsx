/*import { notFound } from "next/navigation";

export default function AmbassadorPage() {
  notFound();
}*/
/*import Ambassador from "@/components/Ambassador";

export default function AmbassadorPage() {
  return <Ambassador />;
  /*return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Page Ambassadeur</h1>
      <p>Bienvenue sur la page des ambassadeurs !</p>
    </div>
  );
}*/

/*import Ambassador from "@/components/Ambassador"; 

export default function AmbassadorPage() {
 
  return (
    <div className="overflow-x-hidden">a
      <Ambassador />
    </div>
  );
}*/

import React from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import AmbassadorRayonne from "@/components/AmbassadorRayonne";

export default function Ambassador() {
  return (
    <div className="w-full bg-[#fbf9fe] text-gray-800 flex flex-col items-center overflow-x-hidden">
      <div className="w-full max-w-[1440px] px-6 lg:px-[96px] mx-auto pb-[24px] gap-[50px] pt-8">
        <Navbar />
      </div>
      {/* 1. Section En-tête / Hero */}
      <section className="w-full py-16 px-4 text-center flex flex-col items-center justify-center">
        <h1 className="text-3xl md:text-4xl font-bold text-purple-900 tracking-wide mb-3 font-serif">
          DEVIENS AMBASSADRICE SOREA
        </h1>
        <p className="text-sm md:text-base text-gray-700 max-w-lg mb-6">
          Please add your content here. Keep it short and simple. And smile :)
        </p>
        <button className="bg-[#8b5cf6] hover:bg-[#7c3aed] text-white font-medium px-8 py-2.5 rounded-full shadow-md transition-all">
          CTA
        </button>
      </section>

      {/* 2. Section "Je deviens ambassadrice pour..." */}
      {/* 2. Section "Je deviens ambassadrice pour..." */}
      <section
        className="w-full max-w-6xl py-20 px-8 md:px-16 text-center rounded-3xl"
        style={{
          background:
            "linear-gradient(90deg, rgba(220, 202, 242, 0) 0%, rgba(220, 202, 242, 1) 20%, rgba(220, 202, 242, 1) 80%, rgba(220, 202, 242, 0) 100%)",
        }}
      >
        <h2 className="text-2xl md:text-3xl font-semibold text-purple-900 mb-12 font-serif">
          JE DEVIENS AMBASSADRICE POUR...
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 relative">
          {/* Étape 01 */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-[#8b5cf6] text-white flex items-center justify-center text-xl font-bold shadow-lg mb-4 z-10">
              01
            </div>
            <p className="text-xs md:text-sm text-gray-600 px-2">
              Donne un nouveau souffle à ta vision et partage ta passion.
            </p>
          </div>

          {/* Étape 02 */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-[#8b5cf6] text-white flex items-center justify-center text-xl font-bold shadow-lg mb-4 z-10">
              02
            </div>
            <p className="text-xs md:text-sm text-gray-600 px-2">
              Teste et vis des engagements uniques au quotidien.
            </p>
          </div>

          {/* Étape 03 */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-[#8b5cf6] text-white flex items-center justify-center text-xl font-bold shadow-lg mb-4 z-10">
              03
            </div>
            <p className="text-xs md:text-sm text-gray-600 px-2">
              Vis de ta passion et fais grandir ta communauté de femmes.
            </p>
          </div>

          {/* Étape 04 */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-[#8b5cf6] text-white flex items-center justify-center text-xl font-bold shadow-lg mb-4 z-10">
              04
            </div>
            <p className="text-xs md:text-sm text-gray-600 px-2">
              Rejoins une communauté bienveillante, active et grandissante.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Blocs alternés (Image + Texte) */}
      <section className="w-full max-w-6xl px-6 py-10 flex flex-col gap-12">
        {/* Ligne 1 */}
        <div className="flex flex-col md:flex-row items-center gap-8 bg-white p-6 rounded-2xl shadow-sm border border-purple-50">
          <div className="w-full md:w-1/2 h-56 bg-gray-200 rounded-xl overflow-hidden flex items-center justify-center text-gray-400">
            [Espace Image / Sharing]
          </div>
          <div className="w-full md:w-1/2 text-center md:text-left">
            <h3 className="text-xl font-semibold text-purple-900 mb-3 font-serif">
              Un rôle clé d’ambassadrice
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Participe activement au développement de SOREA en partageant tes
              valeurs et tes coups de cœur autour de toi. Inspire ta communauté
              à prendre soin d’elle au quotidien tout en profitant d'avantages
              exclusifs.
            </p>
          </div>
        </div>

        {/* Ligne 2 */}
        <div className="flex flex-col md:flex-row-reverse items-center gap-8 bg-white p-6 rounded-2xl shadow-sm border border-purple-50">
          <div className="w-full md:w-1/2 h-56 bg-gray-200 rounded-xl overflow-hidden flex items-center justify-center text-gray-400">
            [Espace Image / Fidélité]
          </div>
          <div className="w-full md:w-1/2 text-center md:text-left">
            <h3 className="text-xl font-semibold text-purple-900 mb-3 font-serif">
              Vos points de fidélité
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Cumule des points à chaque action partagée et débloque des
              privilèges uniques. Chaque engagement compte pour te remercier de
              ton implication au sein de la famille SOREA.
            </p>
          </div>
        </div>

        {/* Ligne 3 */}
        <div className="flex flex-col md:flex-row items-center gap-8 bg-white p-6 rounded-2xl shadow-sm border border-purple-50">
          <div className="w-full md:w-1/2 h-56 bg-gray-200 rounded-xl overflow-hidden flex items-center justify-center text-gray-400">
            [Espace Image / Catalogue]
          </div>
          <div className="w-full md:w-1/2 text-center md:text-left">
            <h3 className="text-xl font-semibold text-purple-900 mb-3 font-serif">
              Découvertes et catalogues
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Accède en avant-première à nos nouveautés, nos collections
              exclusives et nos carnets inspirants pensés pour sublimer ta
              routine bien-être.
            </p>
          </div>
        </div>

        {/* Ligne 4 */}
        <div className="flex flex-col md:flex-row-reverse items-center gap-8 bg-white p-6 rounded-2xl shadow-sm border border-purple-50">
          <div className="w-full md:w-1/2 h-56 bg-gray-200 rounded-xl overflow-hidden flex items-center justify-center text-gray-400">
            [Espace Image / Communauté]
          </div>
          <div className="w-full md:w-1/2 text-center md:text-left">
            <h3 className="text-xl font-semibold text-purple-900 mb-3 font-serif">
              Avantages exclusifs de la communauté SOREA
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Profitez d’un accès privilégié à nos événements, d’un réseau de
              soutien inestimable et d’un espace de discussion pensé pour
              grandir ensemble et porter haut nos ambitions.
            </p>
          </div>
        </div>
      </section>

      <div className="overflow-x-hidden">
        {/* Vos autres composants si besoin */}

        {/* Intégration propre de la section Rayonne */}
        <AmbassadorRayonne />

        {/* Votre footer déjà importé plus bas */}
      </div>

      {/* 4. Section FAQ / Accordéons factices */}
      <section className="w-full max-w-4xl py-12 px-6">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-8 font-serif">
          Headline/text
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="bg-white border border-gray-200 rounded-lg p-4 flex justify-between items-center shadow-sm cursor-pointer hover:border-purple-300 transition-colors"
            >
              <span className="text-sm text-gray-500">
                Please add your content here.
              </span>
              <span className="text-purple-600 font-bold text-lg">+</span>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Section Call to Action Final (Grisé) */}
      <section className="w-full max-w-4xl my-12 mx-6 bg-[#e5e7eb] rounded-xl p-10 text-center shadow-inner">
        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 font-serif">
          HEADLINE
        </h3>
        <p className="text-sm text-gray-600 max-w-md mx-auto mb-6">
          Please add your content here. Keep it short and simple. And smile :)
        </p>
        <button className="bg-[#6b7280] hover:bg-[#4b5563] text-white font-medium px-8 py-2.5 rounded-md shadow transition-all">
          CTA
        </button>
      </section>

      {/* Note : Le footer n'est pas inclus ici car vous l'avez déjà importé ailleurs. */}
      <div className="w-full max-w-[1440px] px-6 lg:px-[96px] mx-auto pb-[24px]">
        <Footer />
      </div>
    </div>
  );
}
