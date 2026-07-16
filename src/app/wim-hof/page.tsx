import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Play, Star } from "lucide-react";
import WimHofPlayer from "@/components/WimHofPlayer";

const sessions = [
  {
    title: "Respiration d'ancrage",
    text: "Une séance douce pour revenir au calme et poser une intention.",
    duration: "3 min",
    favorite: true,
  },
  {
    title: "Souffle énergie",
    text: "Un rythme guidé pour réveiller le corps sans brusquer le cycle.",
    duration: "10 min",
    favorite: false,
  },
  {
    title: "Retour à soi",
    text: "Une pratique courte pour relâcher les épaules et apaiser le mental.",
    duration: "5 min",
    favorite: false,
  },
];

export default function WimHofPage({
  searchParams,
}: {
  searchParams?: { play?: string };
}) {
  const mainSession = sessions.find((session) => session.favorite) ?? sessions[0];

  // Si on vient d'un fil rouge en mode "jouer directement",
  // on saute la page de présentation et on ouvre le player directement.
  if (searchParams?.play === "true") {
    return <WimHofPlayer session={mainSession} />;
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-white text-[#201A2B]">
      <div className="mx-auto w-full max-w-[1440px] px-4 pb-6 md:px-12 lg:px-[96px]">
        <Navbar />
      </div>

      <main className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col gap-14 px-4 pb-14 pt-28 md:px-12 lg:px-[96px] lg:pt-36">
        <section className="relative min-h-[280px] overflow-hidden rounded-none">
          <Image
            src="/image_photo/footer_WH.png"
            alt="Femme pratiquant une posture de respiration face à la mer"
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1440px) 100vw, 1248px"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1f2740]/65 via-[#1f2740]/25 to-transparent" />
          <div className="relative z-10 flex min-h-[280px] max-w-xl flex-col justify-center gap-4 px-8 py-10 text-white md:px-12">
            <p className="text-sm font-bold uppercase tracking-[0.35em] text-white/70">Gratitude et engagement</p>
            <h1 className="text-4xl font-bold tracking-[0.24em] md:text-5xl">Hook text</h1>
            <Link
              href="#seances"
              className="mt-2 inline-flex w-fit items-center gap-2 rounded-md bg-[#8B47FF] px-6 py-3 text-xs font-bold uppercase tracking-[0.14em] text-white shadow-md transition-shadow hover:ring-2 hover:ring-white/70"
            >
              Commencer ma séance
            </Link>
          </div>
        </section>

        <section className="relative overflow-hidden rounded-t-2xl border-t-[12px] border-[#8F8F98] bg-white px-6 py-10 shadow-sm md:px-12 lg:min-h-[390px]">
          <span className="pointer-events-none absolute right-0 top-0 h-44 w-44 rounded-full bg-[#8B47FF]/35 blur-3xl" />
          <span className="pointer-events-none absolute right-16 top-24 h-56 w-56 rounded-full bg-[#8B47FF]/25 blur-3xl" />

          <div className="relative z-10 grid items-center gap-10 lg:grid-cols-[1fr_420px]">
            <div className="flex flex-col items-start gap-7">
              <h2 className="text-5xl font-bold tracking-[0.18em] text-black">Title</h2>
              <p className="w-full max-w-[410px] bg-[#9E9E9E] px-8 py-8 text-center text-sm font-semibold text-[#201A2B]">
                {mainSession.text}
              </p>
              <Link
                href="#seances"
                className="inline-flex items-center gap-2 rounded-md bg-[#8F8F8F] px-8 py-3 text-xs font-bold uppercase tracking-[0.12em] text-white transition-shadow hover:ring-2 hover:ring-[#8B47FF]/45"
              >
                <Play size={14} fill="currentColor" />
                CTA
              </Link>
            </div>

            <div className="relative flex min-h-[260px] items-center justify-center">
              <Image
                src="/image_Design-SOREA/Design_Respiration.png"
                alt="Lotus violet SOREA"
                width={340}
                height={340}
                className="relative z-10 h-auto w-[260px] object-contain md:w-[340px]"
              />
            </div>
          </div>
        </section>

        <section id="seances" className="rounded-xl border border-[#DABFFF] bg-white px-5 py-5 shadow-sm md:px-6">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold tracking-[0.1em] text-black">Title</h2>
              <p className="mt-1 text-sm text-[#201A2B]">Some text</p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-[#F4EBFF] px-3 py-1 text-xs font-bold text-[#8B47FF]">
              <Star size={12} fill="currentColor" /> Populaire
            </span>
          </div>

          <div className="flex flex-col">
            {sessions.map((session, index) => (
              <Link
                key={session.title}
                href="#"
                className="group grid grid-cols-[42px_1fr_auto] items-center gap-4 border-t border-[#B9B9B9] py-3 transition-colors hover:bg-[#F9F4FF]"
                aria-label={`Ouvrir la séance ${session.title}`}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E5D8FF] text-base font-bold text-[#8B47FF]">
                  {index + 1}
                </span>
                <span>
                  <span className="block text-sm font-bold text-[#201A2B]">{session.title}</span>
                  <span className="block text-xs text-[#201A2B]/60">{session.text}</span>
                </span>
                <span className="rounded-full bg-[#DABFFF] px-3 py-1 text-xs font-bold text-[#8B47FF] transition-shadow group-hover:ring-2 group-hover:ring-[#8B47FF]/25">
                  {session.duration}
                </span>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <div className="mx-auto w-full max-w-[1440px] px-4 pb-6 md:px-12 lg:px-[96px]">
        <Footer />
      </div>
    </div>
  );
}
