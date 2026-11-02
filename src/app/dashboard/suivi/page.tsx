"use client";

import { useState, useEffect } from "react";
import MenstrualCalendar from "@/components/MenstrualCalendar";
import { Download } from "lucide-react";

export default function SuiviPage() {
  const [showSummaryCard, setShowSummaryCard] = useState(false);
  const [summaryData, setSummaryData] = useState<{ date: string; time: string } | null>(null);

  useEffect(() => {
    const checkSummary = () => {
      if (typeof window !== 'undefined') {
        const isSaved = localStorage.getItem('sorea_show_summary') === 'true';
        if (isSaved) {
          const now = new Date();
          const dateStr = now.toLocaleDateString("fr-FR");
          const timeStr = now.toLocaleTimeString("fr-FR", { hour: '2-digit', minute: '2-digit' });
          setSummaryData({ date: dateStr, time: timeStr });
          setShowSummaryCard(true);
        }
      }
    };

    checkSummary();
    window.addEventListener('sorea_summary_update', checkSummary);
    return () => {
      window.removeEventListener('sorea_summary_update', checkSummary);
    };
  }, []);

  // Fonction de téléchargement / impression PDF au format A4
  const handleDownloadPDF = () => {
    if (!summaryData) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <title>Synthese_Suivi_Menstruel_${summaryData.date.replace(/\//g, "-")}</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 20mm;
          }
          body {
            font-family: Arial, sans-serif;
            color: #212121;
            margin: 0;
            padding: 0;
            background-color: #ffffff;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #8B47FF;
            padding-bottom: 15px;
            margin-bottom: 25px;
          }
          .logo {
            font-size: 24px;
            font-weight: bold;
            color: #8B47FF;
          }
          .subtitle {
            font-size: 14px;
            color: #7F6674;
          }
          .date-info {
            text-align: right;
            font-size: 12px;
            color: #666;
          }
          .content-box {
            border: 1px solid #E2DBEF;
            border-radius: 12px;
            padding: 20px;
            background-color: #FAF8FC;
            margin-bottom: 25px;
          }
          .section-title {
            font-size: 16px;
            font-weight: bold;
            color: #8B47FF;
            margin-bottom: 10px;
          }
          .footer-disclaimer {
            margin-top: 40px;
            padding-top: 15px;
            border-top: 1px dashed #CCC;
            font-size: 11px;
            color: #666;
            text-align: center;
            font-style: italic;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="logo">SOREA</div>
            <div class="subtitle">Synthèse du Suivi Menstruel</div>
          </div>
          <div class="date-info">
            <strong>Généré le :</strong><br/>
            ${summaryData.date} à ${summaryData.time}
          </div>
        </div>

        <div class="content-box">
          <div class="section-title">Informations Générales</div>
          <p><strong>Utilisatrice :</strong> Prénom NOM</p>
          <p><strong>Période enregistrée :</strong> ${summaryData.date}</p>
        </div>

        <div class="content-box">
          <div class="section-title">Résumé du Journal</div>
          <p>Symptômes et observations enregistrés avec succès dans le calendrier menstruel SOREA.</p>
        </div>

        <div class="footer-disclaimer">
          Ces informations sont fournies à titre purement indicatif. Pour obtenir un diagnostic ou un avis médical, consultez un professionnel.
        </div>

        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <div className="space-y-6 pt-20 px-4 max-w-2xl mx-auto">
      {/* Frame de synthèse qui s'affiche au-dessus du composant uniquement sur dashboard/suivi */}
      {showSummaryCard && summaryData && (
        <div className="w-full bg-white rounded-xl border-2 border-[#8B47FF] p-6 shadow-sm flex flex-col gap-4 transition-all animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-[#8B47FF]">Prénom NOM</h3>
              <p className="text-sm font-semibold text-gray-800">Synthèse Suivi menstruel</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <button
                type="button"
                onClick={handleDownloadPDF}
                className="text-[#E256B3] hover:text-[#c73e99] hover:scale-110 transition-all cursor-pointer p-2"
                title="Télécharger la synthèse (PDF A4)"
              >
                <Download className="w-6 h-6" />
              </button>
              <span className="text-xs text-gray-500">
                {summaryData.date} à {summaryData.time}
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100 text-[11px] text-gray-500 italic text-center">
            Ces informations sont fournies à titre purement indicatif. Pour obtenir un diagnostic ou un avis médical, consultez un professionnel.
          </div>
        </div>
      )}

    </div>
  );
}