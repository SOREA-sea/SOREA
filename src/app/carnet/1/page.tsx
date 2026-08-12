"use client"
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CarnetC from "@/components/CarnetC";

function CarnetChallengePageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const moodParam = searchParams.get("mood");
    const sectionParam = searchParams.get("section") as
        | "challenge"
        | "blocnote"
        | "divertissement"
        | null;

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
                        <h1 className="text-3xl font-bold">Carnet Challenge</h1>
                        <p className="mt-2 text-sm text-[#5f4e85]">Tout le carnet Challenge en grand, avec accès aux modules.</p>
                    </div>
                </div>

                <div className="rounded-[28px] bg-white shadow-xl p-6">
                    <CarnetC
                        onClose={() => router.push("/carnet")}
                        isDedicated={true}
                        initialMood={moodParam || null}
                        initialSection={sectionParam || null}
                    />
                </div>
            </div>
        </div>
    );
}

export default function CarnetChallengePage() {
    // useSearchParams nécessite un Suspense boundary pour ne pas désactiver
    // le rendu statique de toute la route.
    return (
        <Suspense fallback={null}>
            <CarnetChallengePageContent />
        </Suspense>
    );
}