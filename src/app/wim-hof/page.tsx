import Navbar from '@/components/Navbar';
import Footer from "@/components/Footer";

export default function NouvellePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-50 to-[#f9f5fa]">
      <div className="w-[1440px] pr-[96px] pl-[96px] mx-auto pb-[24px]">
        <Navbar />
      </div>

      <main className="flex-grow flex items-center justify-center">
        <h1 className="text-4xl font-bold text-[#8B47FF]">Future page wim-hof</h1>
      </main>

      <div className="w-[1440px] pr-[96px] pl-[96px] mx-auto pb-[24px]">
        <Footer />
      </div>
    </div>
  );
}