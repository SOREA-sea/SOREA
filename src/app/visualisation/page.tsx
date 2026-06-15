import Link from "next/link";
import Navbar from '@/components/Navbar';
import Footer from "@/components/Footer";
import Visualisation from "@/components/visualisation"; // Import du nouveau composant

export default function NouvellePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-50 to-[#f9f5fa] font-sans text-gray-800 relative items-center">
      
      <div className="w-[1440px] pr-[96px] pl-[96px] mx-auto pb-[24px]">
        <Navbar />
      </div>

      <main className="flex flex-col flex-grow items-center mx-auto w-[1440px] pt-[150px] pr-[96px] pb-[24px] pl-[96px]">
        
        
        <div className="w-full mb-10">
          <Link href="/challenge">
            <button className="flex items-center gap-2 bg-white text-[#8B47FF] font-bold px-6 py-3 rounded-2xl shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer border-2 border-[#8B47FF]">
              ← Retour
            </button>
          </Link>
        </div>

        
        <div className="w-full flex-grow flex flex-col items-center">
          <Visualisation />
        </div>

      </main>

      <div className="w-[1440px] pr-[96px] pl-[96px] mx-auto pb-[24px] mt-16">
        <Footer />
      </div>
    </div>
  );
}