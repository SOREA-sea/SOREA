import Link from "next/link";
import Navbar from '@/components/Navbar';
import Footer from "@/components/Footer";
import Wheeltestcopy from "@/components/Wheeltestcopy";

export default function MiroirDesAffirmations() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-50 to-[#f9f5fa] font-sans text-gray-800 relative items-center">
      
      <div className="w-[1440px] pr-[96px] pl-[96px] mx-auto pb-[24px] gap-[50px]">
      <Navbar />
    </div>

    
      <main className="flex flex-col flex-grow items-center mx-auto w-[1440px] pt-[150px] pr-[96px] pb-[24px] pl-[96px]">
        <h1 className="text-4xl font-bold text-black mb-6 underline">
          Relève tes défis bien-être avec SOREA
        </h1>
      </main>

    <Wheeltestcopy />



      <div className="w-[1440px] pr-[96px] pl-[96px] mx-auto pb-[24px]">
        <Footer />
      </div>
    </div>
  );
}