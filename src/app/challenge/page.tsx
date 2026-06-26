"use client";

import Link from "next/link";
import Navbar from '@/components/Navbar';
import Footer from "@/components/Footer";
import StreakTracker from "@/components/StreakTracker";
import MenstrualCalendar from "@/components/MenstrualCalendar";

export default function MiroirDesAffirmations() {
    const sections = [
        {
            img: "/image_mirror/miroire.png",
            alt: "miroir",
            imgWidth: "280px",
            title: "Miroir mon beau miroir",
            description: (
                <>
                    Affirme-toi chaque jour face à ton miroir virtuel.
                    Active ta caméra et ton micro, observe ton beau reflet et répète des phrases positives pour{" "}
                    <span className="text-[#8B47FF] font-semibold">renforcer ta confiance et ton bien-être intérieur</span>.
                </>
            ),
            btnLabel: <>Affirmer ma<br />lumière intérieure</>,
            href: "/miroir",
        },
        {
            img: "/image_ambassadrice_svg/lotus.png",
            alt: "wim hof",
            imgWidth: "180px",
            title: "Wim Hof féminine",
            description: (
                <>
                    Plonge dans une expérience de souffle consciente, inspirée de la méthode Wim Hof et
                    adapté pour la stabilité hormonal. Adopte un rythme doux, une énergie apaisante
                    et <span className="text-[#8B47FF] font-semibold">reconnecte-toi à ton équilibre intérieur</span>.
                </>
            ),
            btnLabel: <>Je me lance<br />dans ma séance</>,
            href: "/wim-hof",
        },
        {
            img: "/image_ambassadrice_svg/appareilphoto.png",
            alt: "visualise toi",
            imgWidth: "280px",
            title: "Visualise toi, projète toi",
            description: (
                <>
                    Ajoute tes images inspirantes et{" "}
                    <span className="text-[#8B47FF] font-semibold">projette toi dans tes rêves</span>{" "}
                    : voyage, carrière, projets, instants de gratitude, paysages...
                    Nourris ta pellicule du bien-être, renforce ta visualisation et ancre toi dans le positif.
                </>
            ),
            btnLabel: <>Visualisation<br />de mon idéal</>,
            href: "/visualisation",
        },
        {
            img: "/image_ambassadrice_svg/envelope.png",
            alt: "mot à moi",
            imgWidth: "280px",
            title: "Mot à moi",
            description: (
                <>
                    Retape une affirmation positive, un mot de gratitude ou une pensée inspirante.
                    Chaque mot que tu écris{" "}
                    <span className="text-[#8B47FF] font-semibold">développera ta paix intérieur</span>.
                </>
            ),
            btnLabel: <>Je laisse parler<br />ma plume</>,
            href: "/mot-a-moi",
        },
        {
            img: "/images/wheelspinner.png",
            alt: "roue",
            imgWidth: "280px",
            title: "Ton équilibre en un tour de roue",
            description: (
                <>
                    Fais tourner la roue et découvre ton défi bien-être du jour parmi 10 thèmes inspirants.
                    Chaque défi t'invite à{" "}
                    <span className="text-[#8B47FF] font-semibold">cultiver ton équilibre</span> et à{" "}
                    <span className="text-[#8B47FF] font-semibold">célébrer ton évolution au quotidien</span>.
                </>
            ),
            btnLabel: <>Tourner la roue<br />de mes défis</>,
            href: "/route",
        },
    ];

    return (
        <div
            className="min-h-screen flex flex-col w-full text-gray-800"
            style={{
                background: "radial-gradient(ellipse at center, #FEF0F9 0%, #FFFFFF 100%)",
                fontFamily: "'Inria Sans', sans-serif",
            }}
        >
            <link
                href="https://fonts.googleapis.com/css2?family=Inria+Sans:wght@400;700&display=swap"
                rel="stylesheet"
            />

            {/* NAVBAR */}
            <div className="w-full">
                <div className="max-w-[1440px] mx-auto px-[96px] pt-8 pb-[24px]">
                    <Navbar />
                </div>
            </div>

            {/* CONTENU */}
            <main className="flex-1 w-full flex flex-col">
                <div className="w-full flex justify-center">
                    <StreakTracker />
                </div>

                <div className="w-full flex justify-center mt-8 px-[96px]">
                    <MenstrualCalendar />
                </div>

                <div className="flex flex-col mx-auto w-full max-w-[1440px] px-[96px] gap-[64px] py-16">
                    {sections.map((section, i) => (
                        <div key={i} className="flex flex-row items-center gap-12">
                            <div
                                className="flex-shrink-0 flex items-center justify-center"
                                style={{ width: "320px" }}
                            >
                                <img
                                    src={section.img}
                                    alt={section.alt}
                                    style={{ width: section.imgWidth, display: "block" }}
                                />
                            </div>

                            <div
                                className="flex flex-col border-2 border-[#8B47FF] rounded-2xl p-10 gap-6 flex-1 relative z-10"
                                style={{
                                    background: "radial-gradient(ellipse at center, #FEF0F9 0%, #FFFFFF 100%)",
                                }}
                            >
                                <h2 className="text-3xl font-bold underline text-black text-center">
                                    {section.title}
                                </h2>
                                <p className="text-center text-black text-xl leading-relaxed">
                                    {section.description}
                                </p>
                                <div className="flex flex-row items-center justify-center gap-4 mt-2">
                                    <Link href={section.href}>
                                        <button className="bg-white text-[#8B47FF] font-bold px-8 py-5 rounded-2xl shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl text-sm text-center leading-tight cursor-pointer">
                                            {section.btnLabel}
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            {/* FOOTER */}
            <Footer />
        </div>
    );
}