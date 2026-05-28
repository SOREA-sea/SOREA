"use client";

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

            {/* SECTION MIROIR */}
            <div className="flex flex-row items-center gap-2 mx-auto w-[1440px] px-[96px] py-16">
                <div className="flex-shrink-0">
                    <img src="/image_ambassadrice_svg/Frame 29031.png" alt="miroir" style={{ width: "420px" }} />
                </div>
                <div className="flex flex-col border-2 border-[#8B47FF] rounded-2xl p-10 gap-6 flex-1"
                    style={{ background: "radial-gradient(ellipse at center, #FEF0F9 0%, #FFFFFF 100%)" }}>
                    <h2 className="text-3xl font-bold underline text-black text-center">Miroir mon beau miroir</h2>
                    <p className="text-center text-black text-xl leading-relaxed">
                        Affirme-toi chaque jour face à ton miroir virtuel.
                        Active ta caméra et ton micro, observe ton beau reflet et répète des phrases positives pour{" "}
                        <span className="text-[#8B47FF] font-semibold">renforcer ta confiance et ton bien-être intérieur</span>.
                    </p>
                    <div className="flex flex-row gap-4 justify-center mt-2">
                        <Link href="/miroir">
                            <button className="bg-white text-[#8B47FF] font-bold px-8 py-5 rounded-2xl shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl text-sm text-center leading-tight cursor-pointer h-full">
                                Affirmer ma<br />lumière intérieur
                            </button>
                        </Link>
                        <button
                            className="text-white font-bold px-8 py-5 rounded-2xl shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl text-sm text-center leading-tight cursor-pointer"
                            style={{ background: "linear-gradient(to right, #8B47FF, #BA98F4)" }}
                        >
                            Recevoir le<br />miroir SOREA
                        </button>
                    </div>
                </div>
            </div>

            {/* SECTION WIM HOF */}
            <div className="flex flex-row items-center gap-2 mx-auto w-[1440px] px-[96px] py-16">
                <div className="flex-shrink-0 flex items-center justify-center" style={{ width: "420px", height: "420px" }}>
                    <img src="/image_ambassadrice_svg/Lotus.png" alt="wim hof" style={{ width: "200px" }} />
                </div>
                <div className="flex flex-col border-2 border-[#8B47FF] rounded-2xl p-10 gap-6 flex-1"
                    style={{ background: "radial-gradient(ellipse at center, #FEF0F9 0%, #FFFFFF 100%)" }}>
                    <h2 className="text-3xl font-bold underline text-black text-center">Wim Hof féminine</h2>
                    <p className="text-center text-black text-xl leading-relaxed">
                        Plonge dans une expérience de souffle consciente, inspirée de la méthode Wim Hof et
                        adapté pour la stabilité hormonal. Adopte un rythme doux, une énergie apaisante
                        et <span className="text-[#8B47FF] font-semibold">reconnecte-toi à ton équilibre intérieur</span>.
                    </p>
                    <div className="flex flex-row gap-4 justify-center mt-2">
                        <Link href="/wim-hof">
                            <button className="bg-white text-[#8B47FF] font-bold px-8 py-5 rounded-2xl shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl text-sm text-center leading-tight cursor-pointer h-full">
                                Je me lance<br />dans ma séance
                            </button>
                        </Link>
                        <button
                            className="text-white font-bold px-8 py-5 rounded-2xl shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl text-sm text-center leading-tight cursor-pointer"
                            style={{ background: "linear-gradient(to right, #8B47FF, #BA98F4)" }}
                        >
                            Télécharger<br />l'audio SOREA
                        </button>
                    </div>
                </div>
            </div>

            {/* SECTION VISUALISE TOI */}
            <div className="flex flex-row items-center gap-2 mx-auto w-[1440px] px-[96px] py-16">
                <div className="flex-shrink-0">
                    <img src="/images/Frame 29037.png" alt="visualise toi" style={{ width: "420px" }} />
                </div>
                <div className="flex flex-col border-2 border-[#8B47FF] rounded-2xl p-10 gap-6 flex-1"
                    style={{ background: "radial-gradient(ellipse at center, #FEF0F9 0%, #FFFFFF 100%)" }}>
                    <h2 className="text-3xl font-bold underline text-black text-center">Visualise toi, projète toi</h2>
                    <p className="text-center text-black text-xl leading-relaxed">
                        Ajoute tes images inspirantes et{" "}
                        <span className="text-[#8B47FF] font-semibold">projette toi dans tes rêves</span>{" "}
                        : voyage, carrière, projets, instants de gratitude, paysages...
                        Nourris ta pellicule du bien-être, renforce ta visualisation et ancre toi dans le positif.
                    </p>
                    <div className="flex flex-row gap-4 justify-center mt-2">
                        <Link href="/visualisation">
                            <button className="bg-white text-[#8B47FF] font-bold px-8 py-5 rounded-2xl shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl text-sm text-center leading-tight cursor-pointer h-full">
                                Visualisation<br />de mon idéal
                            </button>
                        </Link>
                        <button
                            className="text-white font-bold px-8 py-5 rounded-2xl shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl text-sm text-center leading-tight cursor-pointer"
                            style={{ background: "linear-gradient(to right, #8B47FF, #BA98F4)" }}
                        >
                            Recevoir<br />l'appareil photo<br />SOREA
                        </button>
                    </div>
                </div>
            </div>

            {/* SECTION MOT À MOI */}
            <div className="flex flex-row items-center gap-2 mx-auto w-[1440px] px-[96px] py-16">
                <div className="flex-shrink-0">
                    <img src="/image_ambassadrice_svg/Frame 29045.png" alt="mot à moi" style={{ width: "420px" }} />
                </div>
                <div className="flex flex-col border-2 border-[#8B47FF] rounded-2xl p-10 gap-6 flex-1"
                    style={{ background: "radial-gradient(ellipse at center, #FEF0F9 0%, #FFFFFF 100%)" }}>
                    <h2 className="text-3xl font-bold underline text-black text-center">Mot à moi</h2>
                    <p className="text-center text-black text-xl leading-relaxed">
                        Retape une affirmation positive, un mot de gratitude ou une pensée inspirante.
                        Chaque mot que tu écris{" "}
                        <span className="text-[#8B47FF] font-semibold">développera ta paix intérieur</span>.
                    </p>
                    <div className="flex flex-row gap-4 justify-center mt-2">
                        <Link href="/mot-a-moi">
                            <button className="bg-white text-[#8B47FF] font-bold px-8 py-5 rounded-2xl shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl text-sm text-center leading-tight cursor-pointer h-full">
                                Je laisse parler<br />ma plume
                            </button>
                        </Link>
                        <button
                            className="text-white font-bold px-8 py-5 rounded-2xl shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl text-sm text-center leading-tight cursor-pointer"
                            style={{ background: "linear-gradient(to right, #8B47FF, #BA98F4)" }}
                        >
                            Écrire pour mon<br />futur moi
                        </button>
                    </div>
                </div>
            </div>

            {/* SECTION ROUE */}
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
                        <Link href="/route">
                            <button className="bg-white text-[#8B47FF] font-bold px-8 py-5 rounded-2xl shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl text-sm text-center leading-tight cursor-pointer h-full">
                                Tourner la roue<br />de mes défis
                            </button>
                        </Link>
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