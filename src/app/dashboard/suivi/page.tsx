"use client";

import { useState } from "react";
import MenstrualCalendar from "@/components/MenstrualCalendar";
import { Download } from "lucide-react";

export default function SuiviPage() {
  const [showSummaryCard, setShowSummaryCard] = useState(false);
  const [summaryData, setSummaryData] = useState<{ date: string; time: string } | null>(null);

  const handleSaveSymptoms = () => {
    const now = new Date();
    const dateStr = now.toLocaleDateString("fr-FR");
    const timeStr = now.toLocaleTimeString("fr-FR", { hour: '2-digit', minute: '2-digit' });
    setSummaryData({ date: dateStr, time: timeStr });
    setShowSummaryCard(true);
  };

  return (
    <div className="space-y-6 pt-20 px-4 max-w-2xl mx-auto">
      {/* Frame de synthèse qui s'affiche au-dessus du composant une fois cliqué */}
      {showSummaryCard && summaryData && (
        <div className="w-full bg-white rounded-xl border-2 border-[#8B47FF] p-6 shadow-sm flex items-center justify-between transition-all animate-in fade-in duration-300">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-[#8B47FF]">Prénom NOM</h3>
            <p className="text-sm font-semibold text-gray-800">Synthèse Suivi menstruel</p>
          </div>
          <div className="flex flex-col items-end gap-3">
            <button
              type="button"
              onClick={() => alert("Téléchargement de la synthèse...")}
              className="text-[#E256B3] hover:text-[#c73e99] transition-colors cursor-pointer p-2"
              title="Télécharger la synthèse"
            >
              <Download className="w-6 h-6" />
            </button>
            <span className="text-xs text-gray-500">
              {summaryData.date} à {summaryData.time}
            </span>
          </div>
        </div>
      )}

      <MenstrualCalendar onSaveSuccess={handleSaveSymptoms} />
    </div>
  );
}