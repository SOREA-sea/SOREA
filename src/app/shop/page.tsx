import Footer from '../../components/Footer';
import Navbar from '../../components/Navbar';
import Image from 'next/image';
import prisma from '@/lib/prisma';
import ShopProductCarousel from '../../components/ShopProductCarousel';

export default async function Shop() {
  // Fetch active products from DB
  const products = await prisma.shopProduct.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#EBE7F8_0%,#F5FAFA_100%)] text-[#2A2340] font-sans flex flex-col pt-8">
      <Navbar />
      
      <main className="flex-grow w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title */}
        <div className="text-center mb-12 mt-8">
          <h1 className="text-3xl md:text-5xl font-bold tracking-[0.25em]  inline-block pb-2 border-b-2 border-[#2A2340]">
            SOREA SHOP
          </h1>
        </div>

        {/* Best-sellers Banner */}
        <div className="mb-16">
          <h2 className="text-xl md:text-2xl font-bold tracking-widest mb-2">
            Best-sellers
          </h2>
          <div className="relative w-full h-[250px] md:h-[350px] bg-gradient-to-r from-[#FCECAE] via-[#F3C2C6] to-[#DC8EEA] flex items-center justify-between px-6 shadow-sm">
            <button className="text-[#64218C] hover:opacity-80 transition-opacity">
              <i className="fa-solid fa-chevron-left text-5xl"></i>
            </button>
            <button className="text-[#64218C] hover:opacity-80 transition-opacity">
              <i className="fa-solid fa-chevron-right text-5xl"></i>
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-col items-center mb-20">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-x-8 gap-y-12 mb-8 max-w-5xl w-full mx-auto justify-items-center">
            
            {/* Beauté & bien-être */}
            <div className="md:col-start-1 w-[150px] h-[150px] bg-white rounded-full flex flex-col items-center justify-center shadow-md relative overflow-hidden group">
              <Image src="/images/product_1.webp" alt="Beauté" fill sizes="150px" priority className="object-cover opacity-60 object-center" />
              <span className="relative z-10 font-bold text-sm leading-snug tracking-wider text-center ">Beauté<br/>&<br/>bien-être</span>
            </div>
            
            {/* Vêtements */}
            <div className="md:col-start-2 w-[150px] h-[150px] bg-white rounded-full flex flex-col items-center justify-center shadow-md relative overflow-hidden group">
              <div className="absolute inset-0 bg-purple-100 opacity-60"></div>
              <Image src="/images/product_2.webp" alt="Vêtements" fill sizes="150px" className="object-cover opacity-50 object-center" />
              <span className="relative z-10 font-bold text-sm leading-snug tracking-wider text-center ">Vêtements</span>
            </div>

            {/* Enfant & Bébé */}
            <div className="md:col-start-3 w-[150px] h-[150px] bg-white rounded-full flex flex-col items-center justify-center shadow-md relative overflow-hidden group">
              <Image src="/images/product_3.webp" alt="Enfant & Bébé" fill sizes="150px" className="object-cover opacity-60 object-center" />
              <span className="relative z-10 font-bold text-sm leading-snug tracking-wider text-center ">Enfant<br/>&<br/>Bébé</span>
            </div>

            {/* Édition limitée */}
            <div className="md:col-start-4 w-[150px] h-[150px] bg-white rounded-full flex flex-col items-center justify-center shadow-md relative group">
              <span className="relative z-10 font-bold text-sm leading-snug tracking-wider text-center ">Édition<br/>limité</span>
            </div>

            {/* Accessoire bien-être */}
            <div className="md:col-start-2 w-[150px] h-[150px] bg-white rounded-full flex flex-col items-center justify-center shadow-md relative group">
              <span className="relative z-10 font-bold text-sm leading-snug tracking-wider text-center ">Accessoire<br/>bien-être</span>
            </div>

            {/* Papeterie */}
            <div className="md:col-start-3 w-[150px] h-[150px] bg-white rounded-full flex flex-col items-center justify-center shadow-md relative overflow-hidden group">
              <Image src="/images/Diary_SOREA.png" alt="Papeterie" fill sizes="150px" className="object-cover opacity-60 object-center" />
              <span className="relative z-10 font-bold text-sm leading-snug tracking-wider text-center ">Papeterie</span>
            </div>

            {/* Accessoire Pilate */}
            <div className="md:col-start-4 w-[150px] h-[150px] bg-white rounded-full flex flex-col items-center justify-center shadow-md relative overflow-hidden group">
              <Image src="/images/coaching_pilate.webp" alt="Accessoire Pilate" fill sizes="150px" className="object-cover opacity-60 object-center" />
              <span className="relative z-10 font-bold text-sm leading-snug tracking-wider text-center ">Accessoire<br/>Pilate</span>
            </div>

            {/* Kits personnalisable */}
            <div className="md:col-start-5 w-[150px] h-[150px] bg-white rounded-full flex flex-col items-center justify-center shadow-md relative group">
              <span className="relative z-10 font-bold text-sm leading-snug tracking-wider text-center ">Kits<br/>personnalisable</span>
            </div>

          </div>
        </div>

        {/* Products Tabs */}
        <div className="w-full bg-white shadow-sm flex justify-between items-center mb-8 px-8 py-4">
          <button className="text-sm md:text-base font-bold tracking-widest hover:text-[#64218C] transition-colors">Best-sellers</button>
          <button className="text-sm md:text-base font-bold tracking-widest hover:text-[#64218C] transition-colors">Jusqu'à -50%</button>
          <button className="text-sm md:text-base font-bold tracking-widest hover:text-[#64218C] transition-colors">Réduction</button>
          <button className="text-sm md:text-base font-bold tracking-widest hover:text-[#64218C] transition-colors">Meilleures vente</button>
        </div>

        {/* Product Cards Row */}
        <ShopProductCarousel products={products} />
        
      </main>
      
      {/* We are removing the explicit Footer call here to just show how it sits with the page, or keeping it as it was */}
      <Footer />
    </div>
  );
}
