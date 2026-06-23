import Link from "next/link";
import Navbar from '@/components/Navbar';
import Footer from "@/components/Footer";

export default function NouvellePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-50 to-[#f9f5fa] font-sans text-gray-800 relative items-center">
      
      {/* Conteneur global pour la Navbar avec padding fluide */}
      <div className="w-full max-w-[1440px] px-4 md:px-12 lg:px-[96px] mx-auto pb-[24px]">
        <Navbar />
      </div>

{/* Main ajusté pour être totalement responsive */}
      <main className="flex flex-col flex-grow items-center mx-auto w-[1440px] pt-[100px] md:pt-[150px] px-4 md:px-12 lg:px-[96px] pb-[24px]">

        {/* Bouton Retour */}
        <div className="w-full mb-6">
          <Link href="/challenge">
            <button className="flex items-center gap-2 bg-white text-[#8B47FF] font-bold px-6 py-3 rounded-2xl shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer border-2 border-[#8B47FF]">
              ← Retour
            </button>
          </Link>
        </div>

        {/* Contenu central */}
        <div className="flex-grow flex flex-col items-center justify-center min-h-[300px] gap-8 w-full">
          <img 
            src="/image_ambassadrice_svg/lotus.png" 
            alt="lotus" 
            className="w-[250px] md:w-[350px] h-auto object-contain"
          />
          <h1 className="text-2xl md:text-4xl font-bold text-[#8B47FF] text-center">
            Future page wim-hof
          </h1>
        </div>
      </main>

      {/* Conteneur global pour le Footer */}
      <div className="w-full max-w-[1440px] px-4 md:px-12 lg:px-[96px] mx-auto pb-[24px]">
        <Footer />
      </div>
    </div>
  );
}