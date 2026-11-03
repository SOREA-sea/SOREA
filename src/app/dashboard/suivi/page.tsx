"use client";

import { useState, useEffect } from "react";
import MenstrualCalendar from "@/components/MenstrualCalendar";
import { Download } from "lucide-react";

export default function SuiviPage() {
  const [summaries, setSummaries] = useState<Array<{ id: string; date: string; time: string; phase?: string; icon?: string }>>([]);
  const [activeTab, setActiveTab] = useState<"Liste" | "Par date">("Liste");
  const [profile, setProfile] = useState<{ cycleLength: number; periodLength: number; lastPeriodStartDate: string | null } | null>(null);
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);
  const [sortOrder, setSortOrder] = useState<"Croissant" | "Décroissant">("Croissant");

  // Charger le profil menstruel pour déterminer la phase de chaque synthèse
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/menstrual-profile");
        if (res.ok) {
          const data = await res.json();
          setProfile(data.profile);
        }
      } catch (e) {
        console.error(e);
      }
    }
    fetchProfile();
  }, []);

  const getPhaseInfo = (dateStr: string) => {
    const isDiscret = typeof window !== 'undefined' && localStorage.getItem('sorea_snowflake_mode') === 'true';
    const parts = dateStr.split('/');
    if (parts.length !== 3) {
      return isDiscret 
        ? { name: "Hiver", icon: "/image_icone/Flocon.svg" }
        : { name: "Phase Menstruelle", icon: "/image_Design-SOREA/Hiver.svg" };
    }
    const day = parseInt(parts[0], 10);
    const monthIndex = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    const date = new Date(year, monthIndex, day);

    if (!profile || !profile.lastPeriodStartDate) {
      return isDiscret 
        ? { name: "Hiver", icon: "/image_icone/Flocon.svg" }
        : { name: "Phase Menstruelle", icon: "/image_Design-SOREA/Hiver.svg" };
    }

    const cLength = profile.cycleLength || 28;
    const pLength = profile.periodLength || 5;
    const ref = new Date(profile.lastPeriodStartDate);
    ref.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    const diffTime = date.getTime() - ref.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const currentDay = (((diffDays % cLength) + cLength) % cLength) + 1;

    if (currentDay <= pLength) {
      return isDiscret
        ? { name: "Hiver", icon: "/image_icone/Flocon.svg" }
        : { name: "Phase Menstruelle", icon: "/image_Design-SOREA/Hiver.svg" };
    }
    const ovStart = cLength - 14;
    const ovEnd = cLength - 12;
    if (currentDay < ovStart) {
      return isDiscret
        ? { name: "Printemps", icon: "/image_icone/Printemps.svg" }
        : { name: "Phase Folliculaire", icon: "/image_icone/Printemps.svg" };
    }
    if (currentDay >= ovStart && currentDay <= ovEnd) {
      return isDiscret
        ? { name: "Été", icon: "/image_icone/Été.svg" }
        : { name: "Phase Ovulatoire", icon: "/image_icone/Été.svg" };
    }
    return isDiscret
      ? { name: "Automne", icon: "/image_icone/Automne.svg" }
      : { name: "Phase Lutéale", icon: "/image_icone/Automne.svg" };
  };

  // Charger les synthèses sauvegardées au démarrage de la page
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSummaries = localStorage.getItem('sorea_saved_summaries');
      if (savedSummaries) {
        try {
          setSummaries(JSON.parse(savedSummaries));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  // Écouter l'enregistrement d'une nouvelle synthèse
  useEffect(() => {
    const checkSummary = () => {
      if (typeof window !== 'undefined') {
        const isSaved = localStorage.getItem('sorea_show_summary') === 'true';
        if (isSaved) {
          const now = new Date();
          const dateStr = now.toLocaleDateString("fr-FR");
          const timeStr = now.toLocaleTimeString("fr-FR", { hour: '2-digit', minute: '2-digit' });
          
          // Récupère la date sélectionnée s'il y en a une, sinon la date actuelle
          const targetDateStr = (typeof window !== 'undefined' && localStorage.getItem('sorea_selected_date')) || dateStr;
          const calculatedPhase = getPhaseInfo(targetDateStr);
          
          const newItem = { id: Date.now().toString(), date: targetDateStr, time: timeStr, phase: calculatedPhase.name, icon: calculatedPhase.icon };
          
          setSummaries(prev => {
            const updated = [newItem, ...prev];
            localStorage.setItem('sorea_saved_summaries', JSON.stringify(updated));
            return updated;
          });
          
          localStorage.removeItem('sorea_show_summary');
        }
      }
    };

    window.addEventListener('sorea_summary_update', checkSummary);
    return () => {
      window.removeEventListener('sorea_summary_update', checkSummary);
    };
  }, []);

  // Fonction de téléchargement / impression PDF au format A4 pour une carte spécifique
  const handleDownloadPDF = (item: { date: string; time: string }) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <title>Synthese_Suivi_Menstruel_${item.date.replace(/\//g, "-")}</title>
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
            color: #B9ADB4;
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
            ${item.date} à ${item.time}
          </div>
        </div>

        ${(() => {
          const phaseInfo = getPhaseInfo(item.date);
          return `
            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 25px; font-size: 16px; font-weight: bold;">
              <img src="${phaseInfo.icon}" alt="Icône phase" width="24" height="24" style="object-fit: contain;" />
              <span>${phaseInfo.name}</span>
            </div>
          `;
        })()}

        <div class="content-box">
          <div class="section-title">Résumé du Journal</div>
          <p>Symptômes et observations enregistrés avec succès dans le calendrier menstruel SOREA.</p>
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
    <div className="space-y-6 pt-20 px-4 max-w-2xl mx-auto pb-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black section-title">Suivi Menstruel</h1>
          <p className="text-foreground/60 mt-2">
            Retrouvez l'historique de vos synthèses enregistrées.
          </p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-white border border-[#8B47FF] rounded-full p-1.5 shadow-xs">
              {(["Liste", "Par date"] as const).map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`relative px-8 py-2.5 rounded-full text-base font-medium whitespace-nowrap transition-all duration-300 cursor-pointer ${
                      isActive
                        ? "text-gray-900 font-semibold"
                        : "text-gray-700 hover:text-purple-600"
                    }`}
                  >
                    {isActive && (
                      <span className="absolute inset-0 bg-[#E3D5FF] rounded-full blur-[2px] opacity-90 -z-0 transition-all duration-300" />
                    )}
                    <span className="relative z-10">{tab}</span>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setSortOrder(prev => prev === "Croissant" ? "Décroissant" : "Croissant")}
              className="w-12 h-12 bg-white border border-[#8B47FF] rounded-full hover:bg-[#F4EBFF] transition-all shadow-xs cursor-pointer flex items-center justify-center shrink-0"
              title="Changer le sens de tri"
            >
              <img 
                src="/image_icone/Filter.svg" 
                alt="Filtrer" 
                className="w-7 h-7 object-contain" 
              />
            </button>
          </div>
          <span className="text-sm font-medium text-gray-700 pr-2">{sortOrder}</span>
        </div>
      </header>

      {/* Affichage conditionnel selon l'onglet actif : Liste ou Par date */}
      {activeTab === "Liste" ? (
        summaries.map((item) => {
          const phaseInfo = getPhaseInfo(item.date);
          return (
            <div key={item.id} className="w-full bg-white rounded-xl border-2 border-[#8B47FF] p-6 shadow-sm flex flex-col gap-4 transition-all animate-in fade-in duration-300 mb-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-[#8B47FF]">Prénom NOM</h3>
                  <p className="text-sm font-semibold text-gray-800">Synthèse Suivi menstruel</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <button
                    type="button"
                    onClick={() => handleDownloadPDF(item)}
                    className="text-[#E256B3] hover:text-[#c73e99] hover:scale-110 transition-all cursor-pointer p-2"
                    title="Télécharger la synthèse (PDF A4)"
                  >
                    <Download className="w-6 h-6" />
                  </button>
                  <span className="text-xs text-gray-500">
                    {item.date} à {item.time}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 py-1">
                <img src={getPhaseInfo(item.date).icon} alt={getPhaseInfo(item.date).name} className="w-6 h-6 object-contain" />
                <span className="text-sm font-bold text-gray-900">{getPhaseInfo(item.date).name}</span>
              </div>

            </div>
          );
        })
      ) : (
        (() => {
          // Grouper les synthèses par mois et année (ex: "Novembre 2026")
          const grouped: Record<string, { timestamp: number; items: Array<{ id: string; date: string; time: string }> }> = {};
          
          summaries.forEach((item) => {
            const parts = item.date.split('/');
            if (parts.length === 3) {
              const day = parseInt(parts[0], 10);
              const monthIndex = parseInt(parts[1], 10) - 1;
              const year = parseInt(parts[2], 10);
              const d = new Date(year, monthIndex, day);
              const monthYearStr = d.toLocaleDateString("fr-FR", { month: 'long', year: 'numeric' });
              const capitalized = monthYearStr.charAt(0).toUpperCase() + monthYearStr.slice(1);
              
              if (!grouped[capitalized]) {
                grouped[capitalized] = { timestamp: new Date(year, monthIndex, 1).getTime(), items: [] };
              }
              grouped[capitalized].items.push(item);
            } else {
              if (!grouped["Autres"]) {
                grouped["Autres"] = { timestamp: 0, items: [] };
              }
              grouped["Autres"].items.push(item);
            }
          });

          // Trier les mois de manière stable (les mois restent fixes dans le carrousel)
          const sortedEntries = Object.entries(grouped).sort((a, b) => b[1].timestamp - a[1].timestamp);

          if (sortedEntries.length === 0) {
            return (
              <div className="text-center py-8 text-gray-500">
                Aucune synthèse enregistrée.
              </div>
            );
          }

          // Ajuster l'index s'il dépasse le nombre total de mois
          const safeIndex = Math.min(Math.max(currentMonthIndex, 0), sortedEntries.length - 1);
          const [currentMonthYear, currentGroupData] = sortedEntries[safeIndex];

          // Trier les cartes du mois sélectionné par date calendaire (sans tenir compte de l'heure)
          const sortedItems = [...currentGroupData.items].sort((a, b) => {
            const partsA = a.date.split('/');
            const partsB = b.date.split('/');
            const dateA = partsA.length === 3 ? new Date(parseInt(partsA[2], 10), parseInt(partsA[1], 10) - 1, parseInt(partsA[0], 10)).getTime() : 0;
            const dateB = partsB.length === 3 ? new Date(parseInt(partsB[2], 10), parseInt(partsB[1], 10) - 1, parseInt(partsB[0], 10)).getTime() : 0;
            return sortOrder === "Croissant" ? dateB - dateA : dateA - dateB;
          });

          return (
            <div className="space-y-6">
              {/* En-tête avec titre du mois à gauche et flèches de navigation à droite */}
              <div className="flex items-center justify-between pt-2">
                <h2 className="text-2xl font-bold text-[#8B47FF]">{currentMonthYear}</h2>
                
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setCurrentMonthIndex((prev) => Math.min(prev + 1, sortedEntries.length - 1))}
                    disabled={safeIndex >= sortedEntries.length - 1}
                    className="p-1 transition-all cursor-pointer disabled:opacity-50 hover:scale-110"
                    title="Mois précédent"
                  >
                    <img 
                      src="/image_icone/FlècheCarrousel.svg" 
                      alt="Précédent" 
                      className={`w-6 h-6 object-contain transition-opacity ${safeIndex >= sortedEntries.length - 1 ? 'opacity-30' : 'opacity-100'}`} 
                    />
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrentMonthIndex((prev) => Math.max(prev - 1, 0))}
                    disabled={safeIndex === 0}
                    className="p-1 transition-all cursor-pointer disabled:opacity-50 hover:scale-110"
                    title="Mois suivant"
                  >
                    <img 
                      src="/image_icone/FlècheCarrousel.svg" 
                      alt="Suivant" 
                      className={`w-6 h-6 object-contain rotate-180 transition-opacity ${safeIndex === 0 ? 'opacity-30' : 'opacity-100'}`} 
                    />
                  </button>
                </div>
              </div>

              {/* Liste des cartes de synthèses pour le mois sélectionné */}
              {sortedItems.map((item) => {
                const phaseInfo = getPhaseInfo(item.date);
                return (
                  <div key={item.id} className="w-full bg-white rounded-xl border-2 border-[#8B47FF] p-6 shadow-sm flex flex-col gap-4 transition-all animate-in fade-in duration-300 mb-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h3 className="text-xl font-bold text-[#8B47FF]">Prénom NOM</h3>
                        <p className="text-sm font-semibold text-gray-800">Synthèse Suivi menstruel</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleDownloadPDF(item)}
                          className="text-[#E256B3] hover:text-[#c73e99] hover:scale-110 transition-all cursor-pointer p-2"
                          title="Télécharger la synthèse (PDF A4)"
                        >
                          <Download className="w-6 h-6" />
                        </button>
                        <span className="text-xs text-gray-500">
                          {item.date}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 py-1">
                      <img src={phaseInfo.icon} alt={phaseInfo.name} className="w-6 h-6 object-contain" />
                      <span className="text-sm font-bold text-gray-900">{phaseInfo.name}</span>
                    </div>

                    <div className="pt-3 border-t border-gray-100 text-[11px] text-gray-500 italic text-center">
                      Ces informations sont fournies à titre purement indicatif. Pour obtenir un diagnostic ou un avis médical, consultez un professionnel.
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })()
      )}

      </div>
  );
}