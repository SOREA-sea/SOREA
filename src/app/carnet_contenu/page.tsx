"use client"
import { useRouter } from "next/navigation";
import CarnetPlanning from "@/components/Carnet_planning";
import CarnetBN from "@/components/Carnet_bn";
import CarnetChallenge from "@/components/Carnet_challenge";
import CarnetDivertissement from "@/components/Carnet_divertissement";

export default function AboutPage() {
    const router = useRouter();

    return (
        <main className="p-8 bg-[#fdfafb] min-h-screen">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold">Mon carnet — privé</h1>
                <button
                    type="button"
                    onClick={() => router.push('/carnet')}
                    className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                    Retour au carnet
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                    <CarnetBN />
                </div>
                <div>
                    <CarnetPlanning />
                </div>
                <div>
                    <CarnetChallenge />
                </div>
                <div>
                    <CarnetDivertissement />
                </div>
            </div>
        </main>
    );
}
