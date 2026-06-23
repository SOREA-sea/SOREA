"use client";

import { useState, useEffect, ReactNode } from "react";
import { Settings, ChevronLeft, ChevronRight, X } from "lucide-react";

interface Profile {
  isActive: boolean;
  cycleLength: number;
  periodLength: number;
  lastPeriodStartDate: string | null;
}

interface CycleInfo {
  currentDay: number;
  daysUntilNext: number;
  phase: string;
  refDate: string;
}

interface SymptomLog {
  flow: string | null;
  mood: string | null;
  physicalSymptoms: string | null;
}

// Chaque phases a son icône.
const phaseIcons: { [key: string]: string } = {
  Hiver: "/image_MenstrualCalendar/Hiver.svg",
  Printemps: "/image_MenstrualCalendar/Printemps.svg",
  Été: "/image_MenstrualCalendar/Été.svg",
  Automne: "/image_MenstrualCalendar/Automne.svg",
};

export default function MenstrualCalendar() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [cycleInfo, setCycleInfo] = useState<CycleInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  // Form
  const [isActiveForm, setIsActiveForm] = useState(false);
  const [cycleLengthForm, setCycleLengthForm] = useState(28);
  const [periodLengthForm, setPeriodLengthForm] = useState(5);
  const [lastPeriodStartForm, setLastPeriodStartForm] = useState("");
  const [showSurvey, setShowSurvey] = useState(false);

  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // Symptoms
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [symptomLog, setSymptomLog] = useState<SymptomLog>({ flow: null, mood: null, physicalSymptoms: null });
  const [isSavingSymptom, setIsSavingSymptom] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/menstrual-profile");
      if (res.ok) {
        const data = await res.json();
        setProfile(data.profile);
        setCycleInfo(data.cycleInfo);

        setIsActiveForm(data.profile.isActive);
        setCycleLengthForm(data.profile.cycleLength);
        setPeriodLengthForm(data.profile.periodLength);
        if (data.profile.lastPeriodStartDate) {
          setLastPeriodStartForm(
            new Date(data.profile.lastPeriodStartDate).toISOString().split("T")[0]
          );
        } else {
          setLastPeriodStartForm(new Date().toISOString().split("T")[0]);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      const res = await fetch("/api/menstrual-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isActive: isActiveForm,
          cycleLength: cycleLengthForm,
          periodLength: periodLengthForm,
          lastPeriodStartDate: isActiveForm ? lastPeriodStartForm : null,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data.profile);
        setCycleInfo(data.cycleInfo);
        setShowSettings(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchSymptom = async (date: Date) => {
    try {
      // Need to adjust for local timezone to avoid offset issues
      const localDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
      const dateStr = localDate.toISOString().split("T")[0];
      const res = await fetch(`/api/symptoms?date=${dateStr}`);
      if (res.ok) {
        const data = await res.json();
        if (data.log) {
          setSymptomLog({
            flow: data.log.flow,
            mood: data.log.mood,
            physicalSymptoms: data.log.physicalSymptoms,
          });
        } else {
          setSymptomLog({ flow: null, mood: null, physicalSymptoms: null });
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDayClick = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    setSelectedDate(date);
    fetchSymptom(date);
  };

  const handleSymptomChange = (field: keyof SymptomLog, value: string) => {
    setSymptomLog(prev => ({ ...prev, [field]: prev[field] === value ? null : value })); // Toggle if already selected
  };

  const saveSymptom = async () => {
    if (!selectedDate) return;
    setIsSavingSymptom(true);
    try {
      const localDate = new Date(selectedDate.getTime() - (selectedDate.getTimezoneOffset() * 60000));
      const dateStr = localDate.toISOString().split("T")[0];
      await fetch("/api/symptoms", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: dateStr,
          flow: symptomLog.flow,
          mood: symptomLog.mood,
          physicalSymptoms: symptomLog.physicalSymptoms,
        }),
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsSavingSymptom(false);
    }
  };

  const getPhaseForDate = (date: Date) => {
    if (!cycleInfo || !profile) return null;

    const ref = new Date(cycleInfo.refDate);
    ref.setHours(0, 0, 0, 0);
    const target = new Date(date);
    target.setHours(0, 0, 0, 0);

    const diffTime = target.getTime() - ref.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    const cLength = profile.cycleLength || 28;
    const currentDay = (((diffDays % cLength) + cLength) % cLength) + 1;

    const pLength = profile.periodLength || 5;
    if (currentDay <= pLength) return "Hiver";
    const ovStart = cLength - 14;
    const ovEnd = cLength - 12;
    if (currentDay < ovStart) return "Printemps";
    if (currentDay >= ovStart && currentDay <= ovEnd) return "Été";
    return "Automne";
  };

  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay(); // 0 = Sunday
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1; // Start on Monday (0)

    const days = [];
    for (let i = 0; i < adjustedFirstDay; i++) {
      days.push(
        <div
          key={`empty-${i}`}
          className="h-12 sm:h-16 border-r border-b border-gray-200 bg-gray-50"
        ></div>
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const phase = getPhaseForDate(date);

      let phaseColor = "bg-white text-gray-800 hover:bg-gray-50";
      let icon = null;

      if (phase === "Hiver") {
        phaseColor = "text-[#8B47FF] hover:bg-[#E8D9FF]";
        icon = (
          <img
            src={phaseIcons[phase]}
            alt="Icône Hiver"
            className="w-6 h-6 absolute bottom-1 right-1" // Position de l'icône
          />
        );
      } else if (phase === "Printemps") {
        phaseColor = "text-[#8B47FF] hover:bg-[#E8D9FF]";
        icon = (
          <img
            src={phaseIcons[phase]}
            alt="Icône Printemps"
            className="w-6 h-6 absolute bottom-1 right-1"
          />
        );
      } else if (phase === "Été") {
        phaseColor = "text-[#8B47FF] hover:bg-[#E8D9FF]";
        icon = (
          <img
            src={phaseIcons[phase]}
            alt="Icône Été"
            className="w-6 h-6 absolute bottom-1 right-1"
          />
        );
      } else if (phase === "Automne") {
        phaseColor = " text-[#8B47FF] hover:bg-[#E8D9FF]";
        icon = (
          <img
            src={phaseIcons[phase]}
            alt="Icône Automne"
            className="w-6 h-6 absolute bottom-1 right-1"
          />
        );
      }//L'utilisation des else if (au lieu d'une suite de simples if) est importante ici pour la logique du code pour ce calendrier qui se base sur un calcul.

      const isToday = new Date().toDateString() === date.toDateString();
      const isSelected = selectedDate?.toDateString() === date.toDateString();
//Juste après la constante on ajoute une condition pour écraser la couleur de fond si isToday est vrai, en utilisant la classe Tailwind arbitraire bg-[#8D9FF]
if (isToday) {
  phaseColor = "bg-[#E8D9FF] text-[#8B47FF]";
}
if (isSelected) {
  phaseColor += " ring-2 ring-inset ring-[#8B47FF]";
}

      days.push(
        <div
          key={day}
          onClick={() => handleDayClick(day)}
          className={`h-12 sm:h-16 border-r border-b border-gray-200 flex flex-col items-center justify-center transition-colors cursor-pointer relative ${phaseColor} ${
            isToday ? "font-bold" : ""
          }`}
        >
          <span className="text-sm font-semibold">{day}</span>
          {icon} {/* Display the icon */}
        </div>
      );
    }

    return days;
  };

  if (loading) {
    return (
      <div className="animate-pulse bg-gray-200 rounded-2xl h-64 w-full"></div>
    );
  }

  return (
    <div
      className="bg-white rounded-3xl p-10 shadow-sm w-full max-w-2xl mx-auto border-2 border-[#8B47FF] relative overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at center, #FEF0F9 0%, #FFFFFF 100%)",
      }}
    >
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold underline text-black">
            Calendrier Menstruel
          </h2>
          {profile?.isActive ? (
            <p className="text-black font-medium mt-1">Suivi activé</p>
          ) : (
            <p className="text-black font-medium mt-1">
              Mode par défaut (suivi inactif)
            </p>
          )}
        </div>
        <button
          onClick={() => setShowSettings(true)}
          className="p-3 bg-white border border-[#8B47FF] text-[#8B47FF] rounded-2xl hover:bg-[#F4EBFF] transition-all duration-300 hover:scale-105 shadow-sm"
        >
          <Settings className="w-6 h-6" />
        </button>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-6 mb-8 text-sm font-medium justify-center">
        {/* Printemps : Phase Pré-Ovulatoire */}
        <div className="Printemps group relative flex items-center gap-2 cursor-pointer">
          <div className="w-5 h-5 shrink-0 flex items-center justify-center">
            <img
              src={phaseIcons["Printemps"]}
              alt="Icône Printemps"
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-black">Phase Pré-Ovulatoire</span>
          {/* Tooltip */}
          <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded p-3 w-64 z-20 shadow-lg left-1/2 transform -translate-x-1/2 pointer-events-none">
            <p className="font-bold mb-1">Le Printemps du cycle </p>
            <p className="font-normal text-gray-200">
              Le corps se prépare à libérer un ovule et l'utérus commence à
              fabriquer une nouvelle muqueuse irriguée par le sang. Durant cette
              période, l'énergie remonte doucement, favorisant un sentiment de
              dynamisme et d'optimisme.
            </p>
          </div>
        </div>

        {/* Été : Phase Ovulatoire */}
        <div className="Été group relative flex items-center gap-2 cursor-pointer">
          <div className="w-5 h-5 shrink-0 flex items-center justify-center">
            <img
              src={phaseIcons["Été"]}
              alt="Icône Été"
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-black">Phase Ovulatoire</span>
          {/* Tooltip */}
          <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded p-3 w-64 z-20 shadow-lg left-1/2 transform -translate-x-1/2 pointer-events-none">
            <p className="font-bold mb-1">L'Été du cycle </p>
            <p className="font-normal text-gray-200">
              C'est le moment où l’ovaire libère l’ovule pour la fécondation. Cette
              phase correspond généralement à un pic d'énergie maximale, facilitant
              la communication, le rayonnement et l’assurance.
            </p>
          </div>
        </div>

        {/* Automne : Phase Prémenstruelle */}
        <div className="Automne group relative flex items-center gap-2 cursor-pointer">
          <div className="w-5 h-5 shrink-0 flex items-center justify-center">
            <img
              src={phaseIcons["Automne"]}
              alt="Icône Automne"
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-black">Phase Prémenstruelle</span>
          {/* Tooltip */}
          <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded p-3 w-64 z-20 shadow-lg left-1/2 transform -translate-x-1/2 pointer-events-none">
            <p className="font-bold mb-1">L'Automne du cycle </p>
            <p className="font-normal text-gray-200">
              L'ovule libéré n'a pas été fécondé. Les niveaux d'énergie commencent
              à baisser, incitant naturellement à se tourner vers soi, et les
              premiers signes du syndrome prémenstruel (SPM) peuvent faire leur
              apparition ches certaines personnes.
            </p>
          </div>
        </div>

        {/* Hiver : Phase Menstruelle */}
        <div className="Hiver group relative flex items-center gap-2 cursor-pointer">
          <div className="w-5 h-5 shrink-0 flex items-center justify-center">
            <img
              src={phaseIcons["Hiver"]}
              alt="Icône Hiver"
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-black">Phase Menstruelle</span>
          {/* Tooltip */}
          <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded p-3 w-64 z-20 shadow-lg left-1/2 transform -translate-x-1/2 pointer-events-none">
            <p className="font-bold mb-1">L'Hiver du cycle</p>
            <p className="font-normal text-gray-200">
              Cette période correspond au début des règles et au “nettoyage” de
              l'utérus. Le corps exprime un besoin accru de repos, de douceur et
              d'un rythme plus lent pour se régénérer pleinement.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-6 px-2">
          <span className="font-bold text-2xl text-black">
            {currentMonth.toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            })}
          </span>
          <div className="flex gap-4 text-gray-400">
            <button
              onClick={() =>
                setCurrentMonth(
                  new Date(currentMonth.setMonth(currentMonth.getMonth() - 1))
                )
              }
              className="hover:text-black transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() =>
                setCurrentMonth(
                  new Date(currentMonth.setMonth(currentMonth.getMonth() + 1))
                )
              }
              className="hover:text-black transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 text-center text-xs font-semibold text-gray-500 mb-4">
          <div>Mo</div>
          <div>Tu</div>
          <div>We</div>
          <div>Th</div>
          <div>Fr</div>
          <div>Sa</div>
          <div>Su</div>
        </div>

        <div className="grid grid-cols-7 border-l border-t border-gray-200 bg-white relative">
          {renderCalendar()}
        </div>
      </div>

      {/* Symptom Tracking Section */}
      {selectedDate && (
        <div className="mt-8 bg-[#F4EBFF] rounded-2xl p-6 border border-[#8B47FF]/30">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-[#8B47FF]">
              Suivi quotidien - {selectedDate.toLocaleDateString("fr-FR", { weekday: 'long', day: 'numeric', month: 'long' })}
            </h3>
            <button onClick={() => setSelectedDate(null)} className="text-gray-500 hover:text-black">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {selectedDate.getTime() > new Date().setHours(23, 59, 59, 999) ? (
            <p className="text-gray-500 font-medium italic">Vous ne pouvez pas renseigner de symptômes pour une date future.</p>
          ) : (
            <div className="space-y-6">
              {/* Flux */}
              <div>
                <p className="text-sm font-bold text-black mb-2">Flux</p>
                <div className="flex flex-wrap gap-2">
                  {["Léger", "Moyen", "Abondant"].map((f) => (
                    <button
                      key={f}
                      onClick={() => handleSymptomChange('flow', f)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        symptomLog.flow === f ? "bg-[#8B47FF] text-white" : "bg-white text-gray-700 border border-gray-300 hover:border-[#8B47FF]"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Humeur */}
              <div>
                <p className="text-sm font-bold text-black mb-2">Humeur</p>
                <div className="flex flex-wrap gap-2">
                  {["Heureuse", "Irritable", "Fatiguée", "Anxieuse", "Déprimée"].map((m) => (
                    <button
                      key={m}
                      onClick={() => handleSymptomChange('mood', m)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        symptomLog.mood === m ? "bg-[#8B47FF] text-white" : "bg-white text-gray-700 border border-gray-300 hover:border-[#8B47FF]"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Symptômes physiques */}
              <div>
                <p className="text-sm font-bold text-black mb-2">Symptômes physiques</p>
                <div className="flex flex-wrap gap-2">
                  {["Crampes", "Maux de tête", "Acné", "Seins douloureux"].map((s) => (
                    <button
                      key={s}
                      onClick={() => handleSymptomChange('physicalSymptoms', s)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        symptomLog.physicalSymptoms === s ? "bg-[#8B47FF] text-white" : "bg-white text-gray-700 border border-gray-300 hover:border-[#8B47FF]"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={saveSymptom}
                disabled={isSavingSymptom}
                className="w-full py-3 mt-4 bg-[#8B47FF] text-white rounded-xl font-bold shadow-sm hover:opacity-90 transition-opacity"
              >
                {isSavingSymptom ? "Enregistrement..." : "Enregistrer les symptômes"}
              </button>
            </div>
          )}
        </div>
      )}

      {showSettings && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 shadow-2xl w-full max-w-md relative border-2 border-[#8B47FF]">
            <button
              onClick={() => setShowSettings(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-black transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-2xl font-bold mb-6 text-black underline">
              Paramètres
            </h3>

            <div className="space-y-6">
              <label className="flex items-center justify-between p-4 bg-[#F4EBFF] border border-[#8B47FF]/30 rounded-xl cursor-pointer hover:bg-[#E8D9FF] transition-colors">
                <span className="font-bold text-[#8B47FF]">
                  Activer le suivi
                </span>
                <input
                  type="checkbox"
                  checked={isActiveForm}
                  onChange={(e) => setIsActiveForm(e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-[#8B47FF] focus:ring-[#8B47FF]"
                />
              </label>

              {isActiveForm && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                  {/* Sondage initial au lieu du champ durée libre */}
                  {(!profile?.isActive || showSurvey) && (
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <p className="text-sm font-bold text-black mb-3">Quel est votre type de cycle habituel ?</p>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="cycleType" checked={cycleLengthForm === 24} onChange={() => setCycleLengthForm(24)} className="text-[#8B47FF] focus:ring-[#8B47FF]" />
                          <span className="text-sm text-gray-700">🔴 Plutôt courts (environ 3 semaines)</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="cycleType" checked={cycleLengthForm === 28} onChange={() => setCycleLengthForm(28)} className="text-[#8B47FF] focus:ring-[#8B47FF]" />
                          <span className="text-sm text-gray-700">🟢 Standard / Moyens (environ 4 semaines)</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="cycleType" checked={cycleLengthForm === 32} onChange={() => setCycleLengthForm(32)} className="text-[#8B47FF] focus:ring-[#8B47FF]" />
                          <span className="text-sm text-gray-700">🔵 Plutôt longs (plus de 4 semaines)</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="cycleType" checked={![24, 28, 32].includes(cycleLengthForm)} onChange={() => setCycleLengthForm(28)} className="text-[#8B47FF] focus:ring-[#8B47FF]" />
                          <span className="text-sm text-gray-700">⚫ Je ne sais pas du tout</span>
                        </label>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-bold text-black mb-2">
                      Début des dernières règles
                    </label>
                    <input
                      type="date"
                      value={lastPeriodStartForm}
                      onChange={(e) => setLastPeriodStartForm(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white text-black focus:border-[#8B47FF] outline-none transition-all"
                    />
                    <p className="text-xs text-gray-500 mt-2 italic">
                      <span className="underline">Le site applique par défaut un cycle standard théorique de 28 jours.</span>
                    </p>
                  </div>
                </div>
              )}

              <button
                onClick={saveSettings}
                className="w-full py-4 mt-6 bg-white border-2 border-[#8B47FF] text-[#8B47FF] rounded-2xl font-bold shadow-md hover:scale-105 hover:bg-[#F4EBFF] transition-all active:scale-95 text-lg"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
