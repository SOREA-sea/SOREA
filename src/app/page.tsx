import Image from 'next/image';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

export default function Home() {
  return (
    <div className="min-h-screen bg-[linear-gradient(90deg,#d3cced_0%,#fbf7f2_100%)] text-[#2A2340] font-sans overflow-x-hidden">
      <Navbar />
      
      {/* 1. HERO SECTION */}
      <section className="w-full flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto pt-32 pb-16 px-4">
        {/* Left Side: Text */}
        <div className="w-full md:w-1/2 flex flex-col items-center text-center mb-12 md:mb-0">
          <p className="text-lg tracking-[0.5em] mb-4 font-normal text-[#2A2340]">SOREA</p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl leading-tight font-semibold mb-8 text-[#2A2340]">
            Votre bulle de sérénité<br />
            où que vous soyez
          </h1>
          <p className="text-base md:text-lg text-gray-700 font-medium mb-10 max-w-md">
            Des essentiels pensés pour apaiser<br />l&apos;esprit et harmoniser votre quotidien.
          </p>
          <p className="text-sm md:text-base tracking-wide text-gray-800">
            SOREA, ton allié bien-être au<br />quotidien
          </p>
        </div>

        {/* Right Side: Image */}
        <div className="w-full md:w-1/2 flex justify-center relative">
          <Image 
            src="/images/yoga.webp" 
            alt="Yoga" 
            width={600} 
            height={600} 
            className="w-full max-w-[400px] lg:max-w-[500px] h-auto mix-blend-multiply object-contain"
            priority
          />
        </div>
      </section>

      {/* 2. L'UNIVERS QUE VOUS PROPOSE SOREA */}
      <section className="w-full py-16 px-4 bg-[linear-gradient(90deg,#d3cced_0%,#fbf7f2_100%)]">
        <div className="max-w-5xl mx-auto">
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-purple-100 flex flex-col items-center text-center">
              <div className="w-full aspect-square rounded-[1.5rem] bg-[#EAE5F8] mb-6 overflow-hidden relative border-4 border-white shadow-sm">
                <Image src="/images/product_3.webp" alt="Kit personnalisé" fill className="object-cover" />
              </div>
              <h3 className="text-lg font-semibold text-[#665D8B] mb-4">Kit personnalisé</h3>
              <p className="text-xs text-left text-gray-600 leading-relaxed pl-3 border-l-2 border-purple-200">
                Un coffret bien-être unique, composé d&apos;accessoires de pilates, d&apos;un carnet et de soins skincare. 
                Pensé pour allier activité physique, journaling et beauté, il t&apos;accompagne dans les moments de détente et de ressourcement.
              </p>
            </div>

            <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-purple-100 flex flex-col items-center text-center">
              <div className="w-full aspect-square rounded-[1.5rem] bg-[#F7E5D4] mb-6 overflow-hidden relative border-4 border-white shadow-sm">
                <Image src="/images/illustration_features.webp" alt="Espace digital personnel" fill className="object-cover object-left-top" />
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
                <Image src="/images/coaching_pilate.webp" alt="Coaching et inspiration" fill className="object-cover object-center" />
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
      <section className="w-full py-16 px-4 bg-[linear-gradient(90deg,#d3cced_0%,#fbf7f2_100%)]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center mb-10">
            <h2 className="text-2xl md:text-3xl font-medium tracking-wide">Nos essentiels bien-être</h2>
            <div className="h-px bg-[linear-gradient(90deg,#d3cced_0%,#fbf7f2_100%)]"></div>
            <p className="text-center italic font-light text-lg">Des objectifs doux & beaux, sélectionnés<br />pour vous accompagner chaque jour.</p>
          </div>
          
          <div className="flex overflow-x-auto gap-6 hide-scrollbars pb-8 snap-x snap-mandatory px-4">
            <div className="shrink-0 w-64 bg-white rounded-[1.5rem] p-3 shadow-sm border border-purple-100 flex flex-col snap-center">
              <div className="w-full aspect-[4/5] bg-pink-100 rounded-xl mb-4 relative overflow-hidden"></div>
              <h3 className="font-semibold text-[#2A2340] mb-2 leading-tight">Kit anti-anxiété</h3>
              <p className="text-xs text-gray-500 mb-4 h-12">Respiration guidée, roll-on, carte rituels : votre pause apaisante à portée de main.</p>
              <div className="mt-auto">
                <p className="font-bold text-lg mb-3">29€</p>
                <button className="w-full py-2.5 bg-[#A18FE3] text-white text-xs font-semibold rounded-md hover:bg-[#8D7CD4] transition-colors">Ajouter au panier</button>
              </div>
            </div>
            
            <div className="shrink-0 w-64 bg-white rounded-[1.5rem] p-3 shadow-sm border border-purple-100 flex flex-col snap-center">
              <div className="w-full aspect-[4/5] bg-blue-50 rounded-xl mb-4 relative overflow-hidden"></div>
              <h3 className="font-semibold text-[#2A2340] mb-2 leading-tight">Lunettes anti-lumière<br/>bleue</h3>
              <p className="text-xs text-gray-500 mb-4 h-12">Protection premium pour tes yeux, design léger et confortable.</p>
              <div className="mt-auto">
                <p className="font-bold text-lg mb-3">49€</p>
                <button className="w-full py-2.5 bg-[#A18FE3] text-white text-xs font-semibold rounded-md hover:bg-[#8D7CD4] transition-colors">Ajouter au panier</button>
              </div>
            </div>

            <div className="shrink-0 w-64 bg-white rounded-[1.5rem] p-3 shadow-sm border border-purple-100 flex flex-col snap-center">
              <div className="w-full aspect-[4/5] bg-green-50 rounded-xl mb-4 relative overflow-hidden"></div>
              <h3 className="font-semibold text-[#2A2340] mb-2 leading-tight">Coffret relaxation</h3>
              <p className="text-xs text-gray-500 mb-4 h-12">Gua-sha, brume d&apos;oreiller, carnet de nuit : un moment rien que pour vous</p>
              <div className="mt-auto">
                <p className="font-bold text-lg mb-3">59€</p>
                <button className="w-full py-2.5 bg-[#A18FE3] text-white text-xs font-semibold rounded-md hover:bg-[#8D7CD4] transition-colors">Ajouter au panier</button>
              </div>
            </div>

            <div className="shrink-0 w-64 bg-white rounded-[1.5rem] p-3 shadow-sm border border-purple-100 flex flex-col snap-center">
              <div className="w-full aspect-[4/5] bg-gradient-to-tr from-yellow-50 to-green-50 rounded-xl mb-4 relative overflow-hidden">
                 <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full border border-[#2A2340] flex items-center justify-center"><i className="fa-solid fa-chevron-right text-xs"></i></div>
                 </div>
              </div>
              <h3 className="font-semibold text-[#2A2340] mb-2 leading-tight">Soin skin care</h3>
              <p className="text-xs text-gray-500 mb-4 h-12">Profitez d&apos;une crème de l&apos;un de nos masque (jour/nuit)</p>
              <div className="mt-auto">
                <p className="font-bold text-lg mb-3">29€</p>
                <button className="w-full py-2.5 bg-[#A18FE3] text-white text-xs font-semibold rounded-md hover:bg-[#8D7CD4] transition-colors">Ajouter au panier</button>
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex justify-center">
            <button className="text-xs font-semibold border border-purple-300 text-[#665D8B] py-2 px-6 rounded-full bg-white hover:bg-purple-50 transition-colors">
              Accéder à la boutique
            </button>
          </div>
        </div>
      </section>

      {/* 4. NOS CHALLENGES SURPRISES */}
      <section className="w-full py-16 px-4 bg-[linear-gradient(90deg,#d3cced_0%,#fbf7f2_100%)] overflow-hidden">
        <div className="max-w-5xl mx-auto flex flex-col items-center">
          <div className="flex flex-col items-center mb-16">
            <h2 className="text-2xl md:text-3xl font-medium tracking-wide text-center">Nos challenges<br />surprises</h2>
            <div className="h-px bg-[linear-gradient(90deg,#d3cced_0%,#fbf7f2_100%)] w-[200px] mt-2"></div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between w-full gap-8 relative">
            
            {/* Left side: Fake wheel */}
            <div className="w-full md:w-1/3 flex justify-center relative">
              <div className="w-[300px] h-[300px] rounded-full border-[15px] border-[#CCC4E9] bg-white relative overflow-hidden shadow-sm flex items-center justify-center rotate-[-15deg]">
                {/* Segments */}
                <div className="absolute inset-0 bg-[#A697E3] opacity-30 w-1/2 h-full left-0 origin-right"></div>
                <div className="absolute inset-0 bg-[#F4D9EE] opacity-50 w-full h-1/2 top-0 origin-bottom"></div>
                <div className="absolute w-full h-1 bg-white"></div>
                <div className="absolute w-1 h-full bg-white"></div>
                <div className="absolute w-full h-1 bg-white rotate-45"></div>
                <div className="absolute w-full h-1 bg-white -rotate-45"></div>
                <div className="w-12 h-12 bg-white rounded-full z-10 border-4 border-[#CCC4E9]"></div>
              </div>
              {/* Product small image overlapping bottom of wheel */}
              <div className="absolute -bottom-8 left-10 opacity-70">
                <Image src="/images/product_4.webp" alt="Accessoire" width={60} height={60} />
              </div>
            </div>

            {/* Middle: Text and Buttons */}
            <div className="w-full md:w-1/3 flex flex-col items-center text-center">
              <p className="text-base mb-8 max-w-sm">
                Tes défis SOREA t&apos;attendent, avec une multitude de challenges intégrés pour te dépasser et te développer personnellement !
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="py-2.5 px-6 border border-[#2A2340] bg-white rounded-md text-xs font-semibold hover:bg-gray-50">
                  Découvrir tous<br/>les défis SOREA
                </button>
                <button className="py-2.5 px-6 bg-[#A18FE3] border border-[#A18FE3] text-white rounded-md text-xs font-semibold hover:bg-[#8D7CD4]">
                  Recevoir mon kit<br/>à défis SOREA
                </button>
              </div>
            </div>

            {/* Right: small product box */}
            <div className="w-full md:w-1/3 flex justify-center mt-12 md:mt-0">
              <div className="relative">
                <div className="w-32 h-32 bg-[#D1C6F3] rounded-md shadow-sm rotate-6 flex items-center justify-center border-t-[20px] border-[#F4D9EE]">
                  <span className="text-white font-semibold text-sm -rotate-6">SOREA</span>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* 5. SUIVRE, ECRIRE, PROGRESSER */}
      <section className="w-full py-16 px-4 bg-[linear-gradient(90deg,#d3cced_0%,#fbf7f2_100%)]">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <div className="flex flex-col items-center mb-6">
            <h2 className="text-2xl md:text-3xl font-medium tracking-wide">Suivre, écrire, progresser</h2>
            <div className="h-px bg-[linear-gradient(90deg,#d3cced_0%,#fbf7f2_100%)] w-full max-w-[300px] mt-2 mb-4"></div>
          </div>
          <p className="text-sm tracking-wider uppercase mb-16 text-center">Notes, Humeurs, Habitudes, Challenges et<br />Coin divertissement</p>

          <div>
            <Image src="/images/Diary_SOREA.png" alt="Carnet SOREA" width={600} height={400} className="w-full max-w-[500px] h-auto object-cover" />
          </div>

          <div className="flex gap-4">
            <button className="py-2 px-6 border border-[#2A2340] bg-white rounded-md text-xs font-semibold hover:bg-gray-50">Découvrir mon Carnet</button>
            <button className="py-2 px-6 border border-[#2A2340] bg-white rounded-md text-xs font-semibold hover:bg-gray-50">Commander mon Carnet Challenge</button>
          </div>
        </div>
      </section>

      {/* 6. COACHING */}
      <section className="w-full py-16 px-4 bg-[linear-gradient(90deg,#d3cced_0%,#fbf7f2_100%)]">
        <div className="max-w-6xl mx-auto flex flex-col items-center">
          <div className="flex flex-col items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-medium tracking-wide">Coaching</h2>
            <div className="h-px bg-[linear-gradient(90deg,#d3cced_0%,#fbf7f2_100%)] w-[120px] mt-2 mb-4"></div>
          </div>
          <p className="text-base italic font-light mb-12">Un moment d&apos;accompagnement à vivre ensemble.</p>

          <div className="w-full bg-[#FAF8FC] border border-purple-50 flex flex-col md:flex-row items-center mb-8 shadow-sm">
            <div className="w-full md:w-1/2 relative aspect-video md:aspect-auto md:h-[400px]">
              <Image src="/images/coaching_pilate.webp" alt="Coaching" fill className="object-cover" />
              <button className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/50 backdrop-blur rounded-full flex items-center justify-center hover:bg-white text-gray-700">
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
            <button className="py-2.5 px-8 text-[#584D7C] bg-[#F2EBF9] rounded-md text-xs font-semibold hover:bg-purple-100 transition-colors">Je réserve ma séance</button>
            <button className="py-2.5 px-8 text-[#584D7C] bg-[#F2EBF9] rounded-md text-xs font-semibold hover:bg-purple-100 transition-colors">Proposer une séance</button>
          </div>
        </div>
      </section>

      {/* 7. ELLES PARLENT DE SOREA */}
      <section className="w-full py-16 px-4 bg-[linear-gradient(90deg,#d3cced_0%,#fbf7f2_100%)]">
        <div className="max-w-6xl mx-auto flex flex-col items-center">
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
      <section className="w-full py-16 px-4 bg-[linear-gradient(90deg,#d3cced_0%,#fbf7f2_100%)]">
        <div className="max-w-5xl mx-auto flex flex-col items-center">
          <div className="flex flex-col items-center mb-6">
            <h2 className="text-2xl md:text-3xl font-medium tracking-wide">SOREA NEWS</h2>
            <div className="h-px bg-[linear-gradient(90deg,#d3cced_0%,#fbf7f2_100%)] w-[180px] mt-2 mb-4"></div>
          </div>
          <p className="text-base text-center italic font-light mb-12">
            Parce qu&apos;être informé peut aussi être un moment de bien-être :<br />
            Inspirez-vous, informez-vous, vivez l&apos;instant.
          </p>

          <div className="w-full max-w-4xl relative aspect-video md:aspect-[21/9] mb-12">
            <Image src="/images/News_landing.png" alt="SOREA News Collage" fill className="object-contain" />
          </div>

          <div className="flex gap-4">
            <button className="py-2.5 px-6 border border-purple-200 text-[#665D8B] bg-white rounded-md text-xs font-semibold hover:bg-purple-50 transition-colors">Découvrir SOREA News</button>
            <button className="py-2.5 px-6 border border-purple-200 text-[#665D8B] bg-white rounded-md text-xs font-semibold hover:bg-purple-50 transition-colors">Recevoir mon magazine</button>
          </div>
        </div>
      </section>

      {/* 9. REJOINS L'AVENTURE SOREA */}
      <section className="w-full py-16 px-4 bg-[linear-gradient(90deg,#d3cced_0%,#fbf7f2_100%)]">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
          <div className="flex flex-col items-center mb-6">
            <h2 className="text-2xl md:text-3xl font-medium tracking-wide">Rejoins l&apos;aventure SOREA</h2>
            <div className="h-px bg-[linear-gradient(90deg,#d3cced_0%,#fbf7f2_100%)]"></div>
          </div>
          <p className="text-base tracking-wide mb-8 leading-relaxed max-w-2xl">
            Organise des moments de bien-être, découvre des routines apaisantes pour avancer sereinement.<br />
            Profite d&apos;expérience unique et d&apos;avantages exclusifs.
          </p>
          <button className="py-2.5 px-8 border border-purple-200 text-[#665D8B] bg-white rounded-md text-xs font-semibold hover:bg-purple-50 transition-colors">Créer mon compte gratuit</button>
        </div>
      </section>

      {/* 10. REJOINDRE LA COMMUNAUTE SOREA */}
      <section className="w-full py-16 px-4 bg-[linear-gradient(90deg,#d3cced_0%,#fbf7f2_100%)]">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col items-center mb-12 text-center">
            <h2 className="text-2xl md:text-3xl font-medium tracking-wide">Rejoindre la<br/>communauté SOREA</h2>
            <div className="h-px bg-[#2A2340] w-[280px] mt-2 mb-4"></div>
            <p className="text-base">Rejoins nous et incarne nos valeurs en tant qu&apos;ambassadrice.</p>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/2 flex flex-col gap-8">
              {[
                "Développe ton activité et transforme ta passion pour le bien-être en véritable opportunité",
                "Partage avec tes proches l&apos;univers des soins naturels SOREA",
                "Organise tes séances en toute liberté, selon tes envies et ton rythme",
                "Rejoins un réseau inspirant d&apos;ambassadrice de SOREA et inspire ta communauté.",
                "Accède à des événements exclusifs réservés à la communauté SOREA"
              ].map((text, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="text-purple-300 text-2xl mt-0.5"><Image src="/images/fleur.png" alt="Fleur" width={50} height={50} /></div>
                  <p className="text-sm leading-relaxed max-w-[300px] text-[#2A2340]">{text}</p>
                </div>
              ))}
              <div className="mt-4 flex justify-center md:justify-start">
                <button className="py-2.5 px-6 bg-white border border-purple-200 text-[#665D8B] rounded-md text-xs font-bold hover:bg-purple-50 shadow-sm">
                  Je veux être membre de SOREA !
                </button>
              </div>
            </div>
            
            <div className="w-full md:w-1/2 bg-[#F6D0BA] p-8 rounded-[2rem] flex flex-col items-center justify-center relative min-h-[400px]">
              <div className="absolute top-6">
                <span className="text-4xl text-[#782ca7] font-semibold tracking-widest stroke-black drop-shadow-md outline-white drop-shadow-[2px_2px_0_rgba(255,255,255,1)]">Rayonne</span>
              </div>
              <Image src="/images/rejoindre_SOREA.png" alt="Communauté SOREA" width={400} height={400} className="w-[85%] h-auto mt-8 mix-blend-multiply" />
            </div>
          </div>
          
          <div className="w-full text-center mt-16 pb-4 relative">
             <Image src="/images/etoile1.png" alt="Étoile 1" width={50} height={50} className="absolute left-[50%]" />
             <p className="text-[#2A2340] tracking-wider text-sm md:text-base">Sérénité, Équilibre et Alignement. SOREA ton bien-être au quotidien.</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
