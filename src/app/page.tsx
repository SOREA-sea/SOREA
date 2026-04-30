import Hero from '../components/Hero';
import Navbar from '../components/Navbar';
import FeatureCard from '../components/FeatureCard';
import ProductCard from '../components/ProductCard';
import SessionCard from '../components/SessionCard';
import Testimonial from '../components/Testimonial';
import Footer from '../components/Footer';
import Image from 'next/image';
import prisma from '../lib/prisma';
import { cookies } from 'next/headers';

export default async function Home() {
  let products: any[] = [];
  let sessions: any[] = [];
  let testimonials: any[] = [];
  try {
    products = await prisma.shopProduct.findMany({ where: { isActive: true }, orderBy: { id: 'asc' } });
  } catch (e) {
    products = [];
  }
  try {
    sessions = await prisma.coachSession.findMany({ where: { isPublished: true }, orderBy: { id: 'asc' } });
  } catch (e) {
    sessions = [];
  }
  try {
    const reviews = await prisma.coachReview.findMany({ take: 6, orderBy: { createdAt: 'desc' } });
    testimonials = reviews.map(r => ({ id: r.id, author: `User ${r.userId}`, text: r.reviewText || '' }));
  } catch (e) {
    testimonials = [];
  }

  const cookieStore = await cookies();
  const sessionId = cookieStore.get("sorea_session")?.value;
  let isLoggedIn = false;
  if (sessionId) {
    const session = await prisma.userSession.findUnique({
      where: { id: sessionId },
    });
    if (session && session.expiresAt > new Date()) {
      isLoggedIn = true;
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pastel-1 to-pastel-2 text-foreground font-sans">
      <Navbar isLoggedIn={isLoggedIn} />
      <main className="max-w-7xl mx-auto px-6 pb-24">
        <Hero title="SOREA — Votre bulle de sérénité" subtitle={"Des rituels, des produits et des accompagnements pour mieux vivre chaque jour."} primaryCta="Nos kits" secondaryCta="Nos coachings" />

        {/* Features / value props */}
        <section className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard title="Kits sélectionnés" description="Des coffrets pour apaiser le corps et l'esprit." />
          <div className="flex flex-col justify-center items-center p-6 card">
            <h3 className="text-lg font-semibold">Expérience digitale</h3>
            <p className="text-foreground/70 mt-2">Un accompagnement où que vous soyez, sur mobile ou desktop.</p>
            <div className="mt-4 w-full">
              <Image src="/images/illustration_features.webp" alt="features" width={520} height={320} style={{ width: '100%', height: 'auto' }} />
            </div>
          </div>
          <FeatureCard title="Coaching sur-mesure" description="Séances privées et challenges pour se (re)connecter." />
        </section>

        {/* Products grid */}
        <section id="products" className="mt-20">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-foreground/50">Sélection</p>
              <h2 className="section-title mt-2 text-3xl md:text-4xl font-black">Nos essentiels bien-être</h2>
            </div>
            <a href="#products" className="btn-ghost">Voir tout</a>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((p: any, idx: number)=> (
              <div key={p.id ?? idx} className="product-card hover:shadow-2xl transition-shadow">
                <ProductCard name={p.name} price={p.price ?? 0} description={p.description} imageSrc={p.imageUrl ?? p.imageSrc ?? `/images/product_${(idx%6)+1}.webp`} />
              </div>
            ))}
          </div>
        </section>

        {/* Séances */}
        <section id="sessions" className="mt-20">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-foreground/50">Accompagnement</p>
              <h2 className="section-title mt-2 text-3xl md:text-4xl font-black">Coaching & Séances</h2>
            </div>
            <a href="#sessions" className="btn-ghost">Toutes les séances</a>
          </div>
          <p className="text-foreground/70 mt-2">Des séances guidées pour vos objectifs de bien-être.</p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {sessions.map((s: any)=> (
              <SessionCard key={s.id} title={s.title} price={s.price ?? 45} kind={s.title + ' · séance'} imageSrc={s.imageUrl ?? s.image} />
            ))}
          </div>
        </section>

        {/* Newsletter / CTA */}
        <section className="mt-20 glass-panel rounded-[2rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-foreground/50">Newsletter</p>
            <h3 className="mt-2 text-2xl font-black">Restez informé·e</h3>
            <p className="text-foreground/70 mt-2">Recevez nos conseils et offres exclusives.</p>
          </div>
          <form className="flex w-full md:w-1/2 gap-2">
            <input aria-label="email" placeholder="Votre email" className="flex-1 p-3 rounded-full border border-white/80 bg-white/75 shadow-sm outline-none" />
            <button type="button" className="btn-primary">S'inscrire</button>
          </form>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="mt-20">
          <p className="text-xs uppercase tracking-[0.28em] text-foreground/50">Avis</p>
          <h2 className="section-title mt-2 text-3xl md:text-4xl font-black">Ils parlent de SOREA</h2>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t: any, i: number)=> (
              <div key={t.id ?? i} className="testimonial">
                <Testimonial author={t.author ?? `User ${i+1}`} text={t.text ?? ''} avatarSrc={t.avatarSrc ?? `/images/product_${(i%6)+1}.webp`} />
              </div>
            ))}
          </div>
        </section>

        {/* Community / final CTA */}
        <section id="community" className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-foreground/50">Communauté</p>
            <h3 className="mt-2 text-3xl font-black">Rejoindre la communauté</h3>
            <p className="text-foreground/70 mt-2">Des moments partagés, des challenges et un réseau bien-être.</p>
            <div className="mt-6 flex gap-4">
              <a className="btn-primary" href="#">Devenir ambassadrice</a>
              <a className="btn-ghost" href="#">En savoir plus</a>
            </div>
          </div>
          <div className="flex justify-center">
            <Image src="/images/illustration_community.webp" alt="community" width={520} height={420} style={{ width: '100%', height: 'auto' }} />
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}