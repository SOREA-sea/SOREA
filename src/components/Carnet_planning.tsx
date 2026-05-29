"use client";
import { useState } from "react";

// Types pour la structure des données
interface Habitude {
    id: string;
    nom: string;
    emoji: string;
}

export default function SuiviQuotidien() {
    // ---- 1. ÉTATS POUR LES HABITUDES ----
    const listeHabitudes: Habitude[] = [
        { id: "1", nom: "Hydratation", emoji: "💧" },
        { id: "2", nom: "Pilates / mouvement", emoji: "🧘" },
        { id: "3", nom: "Respiration 5 min", emoji: "🧘‍♀️" },
        { id: "4", nom: "Journal 5 min", emoji: "📓" },
    ];

    const joursSemaine = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

    // Grille d'état : { "idHabitude-indexJour": true / false }
    const [coches, setCoches] = useState<Record<string, boolean>>({
        "2-1": true, // Exemple coché : Pilates le Mardi
        "3-4": true, // Exemple coché : Respiration le Vendredi
    });

    const toggleCase = (habitudeId: string, jourIndex: number) => {
        const cle = `${habitudeId}-${jourIndex}`;
        setCoches((prev) => ({ ...prev, [cle]: !prev[cle] }));
    };

    const reinitialiserHabitudes = () => {
        setCoches({});
    };

    // Calculer le nombre total de rituels cochés aujourd'hui (simulé ici sur le global pour l'exemple)
    const totalRituels = Object.values(coches).filter(Boolean).length;

    // ---- 2. ÉTATS POUR L'HUMEUR ----
    const humeurs = [
        { id: "energique", label: "Énergique", emoji: "⚡" },
        { id: "calme", label: "Calme", emoji: "🧘" },
        { id: "reconnaissant", label: "Reconnaissant·e", emoji: "😇" },
        { id: "fatigue", label: "Fatigué·e", emoji: "🥱" },
    ];

    const [humeurActive, setHumeurActive] = useState<string | null>("fatigue");

    return (
        <div className="max-w-2xl mx-auto space-y-6 p-4 bg-[#f3edf7] min-h-screen font-sans text-gray-800">

            {/* ========================================================= */}
            {/* COMPOSANT : HABITUDES DE LA SEMAINE                       */}
            {/* ========================================================= */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                {/* Header */}
                <div className="flex items-start gap-3 mb-1">
                    <div className="w-8 h-8 rounded-lg bg-[#9d4edd] flex items-center justify-center text-white text-sm">
                        ✓
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 text-base">Habitudes de la semaine</h3>
                        <p className="text-xs text-gray-500">Cochez vos rituels quotidiens</p>
                    </div>
                </div>

                {/* Tableau des Habitudes */}
                <div className="mt-6 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr>
                                <th className="text-[11px] font-bold text-gray-400 pb-3 w-1/3">Habitude</th>
                                {joursSemaine.map((jour) => (
                                    <th key={jour} className="text-[11px] font-bold text-gray-400 text-center pb-3 px-1">
                                        {jour}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {listeHabitudes.map((hab) => (
                                <tr key={hab.id} className="border-b border-gray-50 last:border-none">
                                    {/* Nom Habitude */}
                                    <td className="py-3 text-xs font-medium text-gray-700 flex items-center gap-2">
                                        <span className="text-sm">{hab.emoji}</span>
                                        {hab.nom}
                                    </td>
                                    {/* Les Cases à cocher */}
                                    {joursSemaine.map((_, jourIndex) => {
                                        const estCoche = coches[`${hab.id}-${jourIndex}`];
                                        return (
                                            <td key={jourIndex} className="text-center py-2 px-1">
                                                <button
                                                    onClick={() => toggleCase(hab.id, jourIndex)}
                                                    className={`w-7 h-7 rounded-xl border transition-all flex items-center justify-center text-xs
                            ${estCoche
                                                            ? "bg-[#e8fbf3] border-[#a7f3d0] text-[#10b981] font-bold"
                                                            : "bg-white border-gray-200 hover:border-gray-300"
                                                        }`}
                                                >
                                                    {estCoche && "✓"}
                                                </button>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer Habitudes */}
                <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500">
                    <div className="flex items-center gap-1.5 font-medium">
                        <span>❤️</span>
                        <span>{totalRituels} rituel(s) aujourd&apos;hui</span>
                    </div>
                    <button
                        onClick={reinitialiserHabitudes}
                        className="text-gray-400 hover:text-gray-600 underline transition cursor-pointer"
                    >
                        Réinitialiser
                    </button>
                </div>
            </div>

            {/* ========================================================= */}
            {/* COMPOSANT : HUMEUR DU JOUR                                */}
            {/* ========================================================= */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                {/* Header */}
                <div className="flex items-start gap-3 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-[#7b2fbf] flex items-center justify-center text-white text-sm">
                        📅
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 text-base">Humeur du jour</h3>
                        <p className="text-xs text-gray-500">Filtre rapide pour le journal</p>
                    </div>
                </div>

                {/* Grille des boutons d'humeur */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {humeurs.map((h) => {
                        const estActif = humeurActive === h.id;
                        return (
                            <button
                                key={h.id}
                                onClick={() => setHumeurActive(h.id)}
                                className={`py-3 px-2 rounded-2xl border text-xs font-medium flex flex-col items-center justify-center gap-2 transition-all cursor-pointer
                ${estActif
                                        ? "bg-white border-[#9d4edd] ring-2 ring-[#9d4edd]/20 text-[#7b2fbf]"
                                        : "bg-white border-gray-100 hover:border-gray-200 text-gray-600 shadow-sm"
                                    }`}
                            >
                                <span className="text-lg">{h.emoji}</span>
                                <span>{h.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Information d'activation basse */}
                <div className="mt-4 text-[11px] text-gray-400 flex items-center gap-1">
                    <span>Filtre actif :</span>
                    <span>{humeurs.find(h => h.id === humeurActive)?.emoji || "Aucun"}</span>
                </div>
            </div>

        </div>
    );
}