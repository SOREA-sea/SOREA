import Link from "next/link";
import Navbar from '@/components/Navbar';
import Footer from "@/components/Footer";

export default function MiroirDesAffirmations() {
  return (
    <div className="min-h-screen flex flex-col text-gray-800"
      style={{ background: "radial-gradient(ellipse at center, #FEF0F9 0%, #FFFFFF 100%)", fontFamily: "'Inria Sans', sans-serif" }}>

      <link href="https://fonts.googleapis.com/css2?family=Inria+Sans:wght@400;700&display=swap" rel="stylesheet" />

      <div className="w-[1440px] pr-[96px] pl-[96px] mx-auto pb-[24px] gap-[50px]">
        <Navbar />
      </div>

      <main className="flex flex-row items-center gap-2 flex-grow mx-auto w-[1440px] px-[96px] py-16">

        <div className="flex-shrink-0">
          <img src="/images/wheelspinner.png" alt="roue" style={{ width: "420px" }} />
        </div>

        <div className="flex flex-col border-2 border-[#8B47FF] rounded-2xl p-10 gap-6 flex-1"
          style={{ background: "radial-gradient(ellipse at center, #FEF0F9 0%, #FFFFFF 100%)" }}>
          
          <h2 className="text-3xl font-bold underline text-black text-center">
            Ton équilibre en un tour de roue
          </h2>

          <p className="text-center text-black text-xl leading-relaxed">
            Fais tourner la roue et découvre ton défi bien-être du jour parmi 10 thèmes inspirants.
            Chaque défi t'invite à{" "}
            <span className="text-[#8B47FF] font-semibold">cultiver ton équilibre</span> et à{" "}
            <span className="text-[#8B47FF] font-semibold">célébrer ton évolution au quotidien</span>.
          </p>

          <div className="flex flex-row gap-4 justify-center mt-2">
            <button className="bg-white text-[#8B47FF] font-bold px-8 py-5 rounded-2xl shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl text-sm text-center leading-tight cursor-pointer">
              Tourner la roue<br />de mes défis
            </button>
            <button
              className="text-white font-bold px-8 py-5 rounded-2xl shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl text-sm text-center leading-tight cursor-pointer"
              style={{ background: "linear-gradient(to right, #8B47FF, #BA98F4)" }}
            >
              Recevoir ma roue<br />à défis SOREA
            </button>
          </div>

        </div>
      </main>

      <div className="w-[1440px] pr-[96px] pl-[96px] mx-auto pb-[24px]">
        <Footer />
      </div>

    </div>
  );
}