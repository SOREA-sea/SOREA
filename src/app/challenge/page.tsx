"use client";

import Link from "next/link";
import Image from "next/image";
import { Clock, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StreakTracker from "@/components/StreakTracker";
import MenstrualCalendar from "@/components/MenstrualCalendar";
import FilRougeMatin  from "@/components/FilRouge";

const challengeCards = [
  {
    img: "/image_ambassadrice_svg/miroire.png",
    alt: "Miroir violet",
    title: "Miroir mon beau miroir",
    description: "Répète une affirmation positive face à ton reflet.",
    cta: "Ouvrir le miroir",
    href: "/miroir",
  },
  {
    img: "/image_ambassadrice_svg/envelope.png",
    alt: "Enveloppe Mot à moi",
    title: "Mot à moi",
    description: "Écris une phrase douce à retrouver plus tard.",
    cta: "Écrire mon mot",
    href: "/mot-a-moi",
  },
  {
    img: "/image_ambassadrice_svg/appareilphoto.png",
    alt: "Appareil photo",
    title: "Visualise-toi",
    description: "Ajoute une image qui nourrit ton futur idéal.",
    cta: "Visualiser",
    href: "/visualisation",
  },
  {
    img: "/image_ambassadrice_svg/lotus.png",
    alt: "Lotus violet",
    title: "Souffle féminin",
    description: "Prends quelques minutes pour respirer et revenir à toi.",
    cta: "Respirer",
    href: "/wim-hof",
  },
];

export default function ChallengePage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,#fff4fb_0%,#ffffff_48%,#f7efff_100%)] font-sans text-[#2f2238]">
      <Navbar />

      <nav className="fixed left-1/2 top-6 z-30 hidden w-[calc(100%-96px)] max-w-5xl -translate-x-1/2 items-center justify-between rounded-full border border-[#cdb5ff] bg-white/85 px-6 py-3 shadow-xl shadow-purple-100/70 backdrop-blur md:flex">
        {[
          ["Shopping", "/shop"],
          ["Coaching", "/coaching"],
          ["Challenge", "/challenge"],
          ["Mon carnet", "/carnet"],
        ].map(([label, href]) => (
          <Link
            key={href}
            href={href}
            className="rounded-full px-5 py-2 text-sm font-black uppercase tracking-[0.22em] text-[#6c42bf] transition hover:bg-[#f2e8ff] hover:text-[#8B47FF]"
          >
            {label}
          </Link>
        ))}
        <Link
          href="/login"
          className="rounded-full bg-[#8B47FF] px-8 py-3 text-sm font-black uppercase tracking-[0.2em] text-white shadow-md shadow-purple-200 transition hover:bg-[#7432e6]"
        >
          CTA
        </Link>
      </nav>

      <div className="fixed right-2 top-20 z-40 w-[320px] max-w-[calc(100vw-24px)] origin-top-right scale-[0.72] md:right-6 md:top-24 md:scale-75 lg:right-8">
        <StreakTracker floating joursConsecutifs={5} />
      </div>

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-20 px-6 pb-20 pt-36 md:pt-44 lg:px-12">

        {/* HERO */}
        <section className="grid items-center gap-10 lg:grid-cols-[1fr_1.05fr_0.85fr]">
          <div className="space-y-7">
            <p className="text-xs font-black uppercase tracking-[0.32em] text-[#8B47FF]/70">
              Challenge SOREA
            </p>
            <div className="space-y-3">
              <h1 className="text-5xl font-black tracking-[0.08em] text-[#2f2238] md:text-6xl">
                Challenge
              </h1>
              <p className="max-w-sm text-lg leading-8 text-[#6f617a]">
                Choisis ton défi bien-être du jour et avance avec douceur, une action après l&apos;autre.
              </p>
            </div>
            <Link
              href="/route"
              className="inline-flex min-w-48 items-center justify-center rounded-2xl bg-[#8B47FF] px-8 py-4 text-base font-black uppercase tracking-[0.18em] text-white shadow-lg shadow-purple-200 transition hover:-translate-y-0.5 hover:bg-[#7432e6]"
            >
              Tourner
            </Link>
          </div>

          <div className="flex justify-center">
            <Image
              src="/images/wheelspinner.png"
              alt="Roue des défis SOREA"
              width={350}
              height={482}
              className="w-full max-w-[360px] object-contain drop-shadow-[0_18px_28px_rgba(139,71,255,0.25)]"
              priority
            />
          </div>

          <article className="rounded-3xl border border-[#cdb5ff] bg-white/85 p-5 shadow-xl shadow-purple-100/70 backdrop-blur">
            <div className="mb-5 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[#8B47FF]">
              <Sparkles className="h-4 w-4 fill-[#8B47FF]" />
              Défi du jour
            </div>
            <h2 className="text-3xl font-black tracking-[0.08em] text-[#2f2238]">
              Respire et rayonne
            </h2>
            <div className="my-5 rounded-2xl bg-[#f2e8ff] p-5 text-sm leading-6 text-[#6f617a]">
              Prends 15 minutes pour respirer, relâcher tes épaules et écrire une intention simple.
            </div>
            <div className="mb-4 flex items-center gap-2 text-sm font-bold text-[#2f2238]">
              <Clock className="h-4 w-4" />
              15 min
            </div>
            <Link
              href="/route"
              className="flex w-full items-center justify-center rounded-2xl bg-[#8B47FF] px-6 py-4 font-black uppercase tracking-[0.18em] text-white transition hover:bg-[#7432e6]"
            >
              Commencer
            </Link>
          </article>
        </section>

        {/* CALENDRIER */}
        <section className="rounded-3xl border border-[#cdb5ff] bg-white/85 p-4 shadow-xl shadow-purple-100/70 backdrop-blur md:p-8">
          <MenstrualCalendar />
        </section>

        {/* FIL ROUGE — juste après le calendrier */}
        <section className="rounded-3xl border border-[#cdb5ff] bg-white/85 shadow-xl shadow-purple-100/70 backdrop-blur overflow-hidden">
          <FilRougeMatin  />
        </section>

        {/* DÉFIS BIEN-ÊTRE */}
        <section>
          <div className="mb-8 text-center">
            <h2 className="text-4xl font-black tracking-[0.18em] text-[#2f2238]">
              Défis bien-être
            </h2>
            <p className="mt-3 text-lg text-[#6f617a]">
              Choisis le rituel qui te ressemble aujourd&apos;hui.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {challengeCards.map((card) => (
              <article
                key={card.title}
                className="grid items-center gap-5 rounded-3xl bg-white/75 p-5 shadow-lg shadow-purple-100/70 md:grid-cols-[120px_1fr]"
              >
                <div className="flex justify-center">
                  <Image
                    src={card.img}
                    alt={card.alt}
                    width={112}
                    height={112}
                    className="h-28 w-28 object-contain drop-shadow-md"
                  />
                </div>
                <div>
                  <h3 className="mb-3 text-2xl font-black tracking-[0.14em] text-[#2f2238]">
                    {card.title}
                  </h3>
                  <p className="mb-4 rounded-2xl bg-[#f2e8ff] p-4 text-sm leading-6 text-[#6f617a]">
                    {card.description}
                  </p>
                  <Link
                    href={card.href}
                    className="inline-flex min-w-44 justify-center rounded-2xl bg-[#8B47FF] px-6 py-3 font-black uppercase tracking-[0.16em] text-white transition hover:bg-[#7432e6]"
                  >
                    {card.cta}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* BANDEAU BAS */}
        <section className="rounded-3xl bg-[linear-gradient(90deg,#f4ecff_0_12.5%,#ffffff_12.5%_25%,#f4ecff_25%_37.5%,#ffffff_37.5%_50%,#f4ecff_50%_62.5%,#ffffff_62.5%_75%,#f4ecff_75%_87.5%,#ffffff_87.5%_100%)] p-8 text-center shadow-inner">
          <p className="text-xl font-bold text-[#2f2238]">
            Chaque petit défi compte. Tu avances déjà.
          </p>
        </section>

      </main>

      <Footer />
    </div>
  );
}