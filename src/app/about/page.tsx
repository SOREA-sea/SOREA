import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <div className="bg-[#e8e0f0] min-h-screen font-nunito text-[#2A2340]">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-16 space-y-20">
        
        {/* --- SECTION 1 : NOTRE HISTOIRE --- */}
        <section>
          <h2 className="text-2xl font-bold text-[#7b2fbf] mb-6 uppercase tracking-wider">Notre histoire, notre mission</h2>
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-purple-100 relative">
            <ul className="space-y-6 text-sm md:text-base leading-relaxed list-disc list-inside marker:text-purple-300">
              <li>Description storytelling</li>
              <li>SOREA est née du désir de créer un espace dédié au bien-être et à l&apos;épanouissement personnel, pour aider chacun à cultiver la sérénité dans son quotidien.</li>
              <li>Notre mission est d&apos;accompagner chacun sur son chemin de développement personnel à travers des produits et outils inspirants.</li>
            </ul>
            <button className="absolute bottom-4 right-8 text-[#7b2fbf] font-bold text-xs hover:underline">Lire plus</button>
          </div>
        </section>

        {/* --- SECTION 2 : LE CONCEPT (LES CARTES) --- */}
        <section>
          <h2 className="text-2xl font-bold text-[#7b2fbf] mb-8 uppercase tracking-wider">Le concept SOREA : des articles pensés pour votre équilibre</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Kits", icon: "🎁", text: "Des coffrets bien-être personnalisés pour transformer chaque instant en rituel de sérénité." },
              { title: "Accessoires", icon: "👜", text: "Des accessoires et objets aussi utiles qu'élégants pour apaiser l'esprit et embellir le quotidien." },
              { title: "Coaching", icon: "🧘", text: "Un accompagnement inspirant (Pilates, respiration, conseils) pour progresser en douceur." },
              { title: "Abonnement", icon: "📅", text: "Un espace digital exclusif avec un suivi et un accompagnement programmé pour prendre soin de soi chaque jour." }
            ].map((item, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-purple-100 flex flex-col items-start gap-4">
                <div className="w-12 h-12 bg-[#c4a8e8]/30 rounded-xl flex items-center justify-center text-2xl">
                  {item.icon}
                </div>
                <h3 className="font-bold text-[#7b2fbf] text-lg">{item.title}</h3>
                <p className="text-xs leading-relaxed text-[#9080aa]">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* --- SECTION 3 : VALEURS & ENGAGEMENTS --- */}
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Valeurs */}
          <section className="flex-1">
            <h2 className="text-2xl font-bold text-[#7b2fbf] mb-6 uppercase tracking-wider">Les valeurs de SOREA</h2>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-purple-100 h-full relative">
              <ul className="space-y-6 text-sm list-disc list-inside marker:text-purple-300">
                <li><strong>SEA</strong> : Sérénité, Équilibre et Alignement sont au coeur de notre approche, guidant chacune de nos actions et créations.</li>
                <li>“SOREA”, pourquoi ce nom ?</li>
                <li>L&apos;équipe : Derrière SOREA se trouve une équipe passionnée par le bien-être, composée d&apos;experts et de créateurs partageant une vision commune.</li>
              </ul>
              <button className="absolute bottom-4 right-8 text-[#7b2fbf] font-bold text-xs hover:underline">En savoir plus</button>
            </div>
          </section>

          {/* Engagements */}
          <section className="w-full lg:w-1/3">
            <h2 className="text-2xl font-bold text-[#7b2fbf] mb-6 uppercase tracking-wider">Notre engagements</h2>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-purple-100 flex flex-col items-center gap-6 relative">
              <p className="text-sm list-disc list-inside text-left w-full">
                Nous nous engageons à adopter une démarche éthique et responsable, que ce soit dans le choix des matériaux, nos processus ou nos partenaires.
              </p>
              <div className="text-5xl opacity-50">🌍</div>
              <button className="absolute bottom-4 right-8 text-[#7b2fbf] font-bold text-xs hover:underline">En savoir plus</button>
            </div>
          </section>
        </div>

        {/* --- SECTION 4 : FAQ --- */}
        <section>
          <h2 className="text-2xl font-bold text-[#7b2fbf] mb-6 uppercase tracking-wider">FAQ</h2>
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-purple-100 relative">
            <ul className="space-y-4 text-sm">
              <li>• Tous savoir sur le fonctionnement de l’outil et tes défis bien-être</li>
              <li>• Tous savoir sur le fonctionnement de l’outil et tes défis bien-être</li>
              <li>• Tous savoir sur le fonctionnement de l’outil et tes défis bien-être</li>
            </ul>
            <button className="absolute bottom-4 right-8 text-[#7b2fbf] font-bold text-xs hover:underline">Lire plus</button>
          </div>
        </section>

        {/* --- SECTION 5 : FORMULAIRE --- */}
        <section className="pb-20">
          <h2 className="text-2xl font-bold text-[#7b2fbf] text-center mb-10 uppercase tracking-widest">Posez vos questions</h2>
          <form className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-[#9080aa]">Adresse e-mail</label>
              <input type="email" placeholder="exemple@domaine.com" className="bg-[#f3f0f7] border border-purple-200 rounded-xl p-3 outline-none focus:border-[#7b2fbf]" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-[#9080aa]">Vous êtes ?</label>
              <select className="bg-[#f3f0f7] border border-purple-200 rounded-xl p-3 outline-none focus:border-[#7b2fbf] appearance-none">
                <option>Choisis ton statut</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <textarea className="w-full bg-[#f3f0f7] border border-purple-200 rounded-2xl p-4 outline-none focus:border-[#7b2fbf]"></textarea>
            </div>
          </form>
        </section>

      </main>

      <Footer />
    </div>
  );
}