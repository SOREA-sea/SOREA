"use client"
import CarnetPlanning from "@/components/Carnet_planning";
import CarnetBN from "@/components/Carnet_bn";

export default function AboutPage() {
    return (
        <main className="p-8 bg-[#fdfafb] min-h-screen">
            <h1 className="text-2xl font-bold mb-8">Mon carnet — privé</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                    <CarnetBN />
                </div>
                <div>
                    <CarnetPlanning />
                </div>
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <h2 className="font-bold text-gray-900 text-base mb-4">À venir...</h2>
                    <p className="text-sm text-gray-500">Reste à l&apos;écoute, de nouvelles fonctionnalités arrivent bientôt !</p>
                </div>

            </div>
        </main>
    );
}
