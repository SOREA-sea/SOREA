"use client"
import { useState } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CarnetG from "@/components/CarnetG";

export default function AboutPage() {
    const [open, setOpen] = useState(false);

    return (
        <div className="bg-[#e8e0f0] min-h-screen font-nunito text-[#2A2340]">
            <main className="max-w-6xl mx-auto px-6 py-16 space-y-20">
                <section>
                    <h2 className="text-center md:text-5xl font-Inria_Sans text-[#000000] mb-4 mid underline tracking-wide">Mon carnet</h2>
                    <h3 className="text-center text-[#000000] mb-6 tracking-wide">Ouvre ton coeur,trace ton chemin et aligne toi à ta valeur</h3>
                </section>

                <section>
                    {!open ? (
                        <div className="flex justify-center">
                            <button
                                onClick={() => setOpen(true)}
                                className="p-0 bg-transparent border-0 cursor-pointer"
                                aria-label="Ouvrir le carnet"
                            >
                                <Image src="/image_carnet/carnet_2.svg" alt="Carnet" className="object-contain" width={200} height={150} />
                            </button>
                        </div>
                    ) : (
                        <div className="flex justify-center">
                            <CarnetG onClose={() => setOpen(false)} />
                        </div>
                    )}
                </section>

                <section>
                    <h2 className="text-center md:text-5xl font-Inria_Sans text-[#000000] mb-4 mid underline tracking-wide">Suivre, écrire, progresser</h2>
                    <h3 className="text-center text-[#000000] mb-6 tracking-wide">Gratitude, Humeurs, Habitudes, Challenges et Coin divertissement</h3>
                    <Image src="/image_carnet/Diary_SOREA.svg" alt="Stylo" className="object-contain mx-auto" width={600} height={200} />
                    <div className="flex justify-center gap-8 mt-8">
                        <button className="w-50 h-12 bg-white cursor-pointer rounded-md border-0 border-[#9748FF] shadow-[inset_0px_0px_0px_1px_#9748FF] group hover:bg-[#9748FF] transition duration-450 ease-in-out"><span className="font-medium text-[#6a18a4] group-hover:text-white">Découvrir mon carnet</span></button>
                        <button className="w-75 h-12 bg-white cursor-pointer rounded-md border-0 border-[#9748FF] shadow-[inset_0px_0px_0px_1px_#9748FF] group hover:bg-[#9748FF] transition duration-450 ease-in-out"><span className="font-medium text-[#6a18a4] group-hover:text-white">Commander mon Carnet Challenge</span></button>
                    </div>
                </section>
            </main>
            <Navbar />
            <Footer />
        </div>
    );
}