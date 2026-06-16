"use client"
import { useRouter } from "next/navigation";
import CarnetG from "@/components/CarnetG";

export default function CarnetGratitudePage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-[#f7f3fb] text-[#2A2340] px-6 py-10">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col gap-6 mb-8">
                    <button
                        type="button"
                        onClick={() => router.push("/carnet")}
                        className="w-fit px-4 py-2 rounded-full bg-white text-[#6a18a4] border border-[#7b3ee3] shadow-sm"
                    >
                        ← Retour aux carnets
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold">Carnet Gratitude</h1>
                        <p className="mt-2 text-sm text-[#5f4e85]">Ton carnet Gratitude en plein écran avec tous les modules disponibles.</p>
                    </div>
                </div>

                <div className="rounded-[28px] bg-white shadow-xl p-6">
                    <CarnetG onClose={() => router.push("/carnet")} isDedicated />
                </div>
            </div>
        </div>
    );
}
