import Image from 'next/image';

interface HeroProps {
  title?: string;
  subtitle?: string;
  primaryCta?: string;
  secondaryCta?: string;
}

export default function Hero({title, subtitle, primaryCta = 'Shop essentials', secondaryCta = 'Discover coaching'}: HeroProps){
  return (
    <section className="grid grid-cols-1 lg:grid-cols-[1.08fr_0.92fr] gap-10 items-center py-10 lg:py-16">
      <div className="max-w-2xl">
        <div className="inline-flex items-center rounded-full border border-white/70 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-foreground/70 shadow-sm backdrop-blur">
          Bien-être quotidien
        </div>
        <h1 className="mt-6 text-4xl md:text-5xl xl:text-6xl font-black text-foreground leading-[0.95] tracking-[-0.04em]">{title ?? 'Votre bulle de sérénité, où que vous soyez'}</h1>
        <p className="mt-6 text-base md:text-lg text-foreground/75 max-w-xl leading-8">{subtitle ?? 'Des essentiels pensés pour apaiser l\'esprit et harmoniser votre quotidien.'}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a className="btn-primary" href="#products">{primaryCta}</a>
          <a className="btn-ghost" href="#sessions">{secondaryCta}</a>
        </div>
        <div className="mt-8 flex flex-wrap gap-3 text-sm text-foreground/70">
          <span className="rounded-full border border-white/70 bg-white/60 px-4 py-2">Kits sensoriels</span>
          <span className="rounded-full border border-white/70 bg-white/60 px-4 py-2">Coaching personnalisé</span>
          <span className="rounded-full border border-white/70 bg-white/60 px-4 py-2">Communauté active</span>
        </div>
      </div>

      <div className="relative">
        <div className="glass-panel rounded-[2rem] p-5 md:p-6 overflow-hidden">
          <Image
            src="/images/hero_cover.webp"
            alt="Hero cover"
            width={900}
            height={540}
            className="rounded-[1.5rem] object-cover"
            loading="eager"
            priority
            style={{ width: '100%', height: 'auto' }}
          />
        </div>
      </div>
    </section>
  );
}