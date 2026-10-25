"use client";

import { useState, useEffect } from "react";
import { Settings, ChevronLeft, ChevronRight, X, Trash2 } from "lucide-react";
import MenstrualFlux from "./MenstrualFlux";

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

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  category?: 'bien-etre' | 'sport' | 'nutrition';
}

interface SymptomLog {
  flow: string | null;
  mood: string | null;
  physicalSymptoms: string | null;
}

const phaseIcons: { [key: string]: string } = {
  Hiver: "/image_Design-SOREA/Hiver.svg",
  Printemps: "/image_icone/Printemps.svg",
  Été: "/image_icone/Été.svg",
  Automne: "/image_icone/Automne.svg",
};

export default function MenstrualCalendar() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [cycleInfo, setCycleInfo] = useState<CycleInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
const [isSnowflakeMode, setIsSnowflakeMode] = useState(false);
const [showCalendarHelpModal, setShowCalendarHelpModal] = useState(false);

  const [isActiveForm, setIsActiveForm] = useState(false);
  const [cycleLengthForm, setCycleLengthForm] = useState(28);
  const [periodLengthForm, setPeriodLengthForm] = useState(5);
  const [lastPeriodStartForm, setLastPeriodStartForm] = useState("");
  const [showSurvey, setShowSurvey] = useState(false);

  const [currentMonth, setCurrentMonth] = useState(new Date());

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [symptomLog, setSymptomLog] = useState<SymptomLog>({ flow: null, mood: null, physicalSymptoms: null });
  const [isSavingSymptom, setIsSavingSymptom] = useState(false);

  const [symptomTab, setSymptomTab] = useState<'humeur' | 'symptome' | 'rectifier' | 'flux' | 'resultat'>('humeur');
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [customMood, setCustomMood] = useState("");
  const [selectedPhysicalSymptoms, setSelectedPhysicalSymptoms] = useState<string[]>([]);
  const [customPhysical, setCustomPhysical] = useState("");
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [fluxValue, setFluxValue] = useState<number>(1); //Léger, Modéré, Abondant, Très abondant (ou plus)
  const [fluxCustom, setFluxCustom] = useState("");
  const [resultatSummary, setResultatSummary] = useState("");

  const [selectedTodoDate, setSelectedTodoDate] = useState<string | null>(null);
  const [showTodoModal, setShowTodoModal] = useState(false);
  const [todoInput, setTodoInput] = useState("");
  const [todosByDate, setTodosByDate] = useState<Record<string, TodoItem[]>>({});
  const [loggedUser, setLoggedUser] = useState<{ id: string; email: string } | null>(null);
  const [phaseFilters, setPhaseFilters] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'calendar' | 'todo'>('calendar'); // État pour pour basculer entre 'calendar' et 'todo'

  //NOUVEAU : Vérifier si la date correspond à aujourd'hui et s'il y a une notification active

      const [hasNotif, setHasNotif] = useState(false);



      useEffect(() => {

  const checkNotif = () => {

    if (typeof window !== 'undefined') {
const active = localStorage.getItem('sorea_has_notification') === 'true' || localStorage.getItem('sorea_todo_notification') === 'true';
      setHasNotif(active);
    }
  };

  checkNotif();

  window.addEventListener('sorea_notification_update', checkNotif);

  window.addEventListener('storage', checkNotif);

  return () => {

    window.removeEventListener('sorea_notification_update', checkNotif);

    window.removeEventListener('storage', checkNotif);

  };

}, []);

  useEffect(() => {
    if (!loggedUser) return;
    localStorage.setItem(`sorea_todos_${loggedUser.id}`, JSON.stringify(todosByDate));
  }, [todosByDate, loggedUser]);

  const fetchLoggedUser = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (!res.ok) return;
      const data = await res.json();
      const user = data.user;
      if (user?.id) {
        setLoggedUser({ id: user.id, email: user.email });
        const stored = localStorage.getItem(`sorea_todos_${user.id}`);
        if (stored) {
          setTodosByDate(JSON.parse(stored));
        }
      }
    } catch (e) {
      console.error("Impossible de récupérer l'utilisateur connecté", e);
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/menstrual-profile");
      if (!res.ok) return;
      const data = await res.json();
      setProfile(data.profile);
      setCycleInfo(data.cycleInfo);
      setIsActiveForm(data.profile.isActive);
      // Si le suivi de cycle est désactivé, basculer par défaut sur l'Agenda Todo-List
      if (!data.profile.isActive) {
        setActiveTab('todo');
      }
      setCycleLengthForm(data.profile.cycleLength);
      setPeriodLengthForm(data.profile.periodLength);
      if (data.profile.lastPeriodStartDate) {
        setLastPeriodStartForm(new Date(data.profile.lastPeriodStartDate).toISOString().split("T")[0]);
      } else {
        setLastPeriodStartForm(new Date().toISOString().split("T")[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Exécute les requêtes une seule fois à l'initialisation du composant
    void fetchProfile();
    void fetchLoggedUser();

    const handleStorageChange = () => {
      if (loggedUser) {
        const stored = localStorage.getItem(`sorea_todos_${loggedUser.id}`);
        if (stored) {
          setTodosByDate(JSON.parse(stored));
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []); // Dépendance vide [] pour éviter de relancer les requêtes en boucle

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
      if (!res.ok) return;
      const data = await res.json();
      setProfile(data.profile);
      setCycleInfo(data.cycleInfo);
      if (!data.profile.isActive) {
        setActiveTab('todo');
      }
      setShowSettings(false);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchSymptom = async (date: Date) => {
    try {
      const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
      const dateStr = localDate.toISOString().split("T")[0];
      const res = await fetch(`/api/symptoms?date=${dateStr}`);
      if (!res.ok) return;
      const data = await res.json();
      if (data.log) {
        setSymptomLog({
          flow: data.log.flow,
          mood: data.log.mood,
          physicalSymptoms: data.log.physicalSymptoms,
        });
        // Initialisation des états multiples si enregistrés
        setSelectedMoods(data.log.mood ? data.log.mood.split(', ') : []);
        setSelectedPhysicalSymptoms(data.log.physicalSymptoms ? data.log.physicalSymptoms.split(', ') : []);
      } else {
        setSymptomLog({ flow: null, mood: null, physicalSymptoms: null });
        setSelectedMoods([]);
        setSelectedPhysicalSymptoms([]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDayClick = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    setSelectedDate(date);
    fetchSymptom(date);
    const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    const dateKey = localDate.toISOString().split("T")[0];
    setSelectedTodoDate(dateKey);
    
    // Dès que l'utilisatrice clique sur une date dans l'onglet todo, on considère qu'elle a vu la notification et on la retire
    if (activeTab === 'todo' && hasNotif) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('sorea_todo_notification');
        localStorage.removeItem('sorea_has_notification');
        setHasNotif(false);
        window.dispatchEvent(new Event('sorea_notification_update'));
      }
    }

    // Ouverture de la modale todo sur l'onglet todo, ou de la modale de suivi quotidien sur l'onglet calendrier
    if (loggedUser && activeTab === 'todo') {
      setShowTodoModal(true);
    }
  };

  const closeTodoModal = () => {
    setShowTodoModal(false);
    setSelectedTodoDate(null);
  };

  const togglePhaseFilter = (phase: string) => {
    setPhaseFilters((prev) => (prev.includes(phase) ? prev.filter((item) => item !== phase) : [...prev, phase]));
  };

  const addTodo = () => {
    if (!selectedTodoDate) return;
    const trimmed = todoInput.trim();
    if (!trimmed) return;
    setTodosByDate((prev) => {
      const current = prev[selectedTodoDate] || [];
      return {
        ...prev,
        [selectedTodoDate]: [
          ...current,
          { id: `${selectedTodoDate}-${Date.now()}`, text: trimmed, completed: false },
        ],
      };
    });
    setTodoInput("");
  };

  const toggleTodo = (todoId: string) => {
    if (!selectedTodoDate) return;
    setTodosByDate((prev) => {
      const current = prev[selectedTodoDate] || [];
      return {
        ...prev,
        [selectedTodoDate]: current.map((todo) =>
          todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
        ),
      };
    });
  };

  const deleteTodo = (todoId: string) => {
    if (!selectedTodoDate) return;
    setTodosByDate((prev) => {
      const current = prev[selectedTodoDate] || [];
      const next = current.filter((todo) => todo.id !== todoId);
      const copy = { ...prev };
      if (next.length) {
        copy[selectedTodoDate] = next;
      } else {
        delete copy[selectedTodoDate];
      }
      return copy;
    });
  };

  const handleSymptomChange = (field: keyof SymptomLog, value: string) => {
    setSymptomLog((prev) => ({ ...prev, [field]: prev[field] === value ? null : value }));
  };

  const saveSymptom = async () => {
    if (!selectedDate) return;
    setIsSavingSymptom(true);
    try {
      const localDate = new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000);
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
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;
    const days: React.ReactNode[] = [];
    for (let i = 0; i < adjustedFirstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-12 sm:h-16 border-r border-b border-gray-200 bg-gray-50" />
      );
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const phase = getPhaseForDate(date);
      let phaseColor = "bg-white text-gray-800 hover:bg-gray-50";
      let icon: React.ReactNode = null;
      if (phase === "Hiver") {
        phaseColor = "text-[#8B47FF] hover:bg-[#E8D9FF]";
        icon = (
          <img 
            src={isSnowflakeMode ? "/image_icone/Flocon.svg" : phaseIcons[phase]} 
            alt={isSnowflakeMode ? "Icône Flocon" : "Icône Hiver"} 
            className="w-6 h-6 absolute bottom-1 right-1" 
          />
        );
      } else if (phase === "Printemps") {
        phaseColor = "text-[#8B47FF] hover:bg-[#E8D9FF]";
        icon = <img src={phaseIcons[phase]} alt="Icône Printemps" className="w-6 h-6 absolute bottom-1 right-1" />;
      } else if (phase === "Été") {
        phaseColor = "text-[#8B47FF] hover:bg-[#E8D9FF]";
        icon = <img src={phaseIcons[phase]} alt="Icône Été" className="w-6 h-6 absolute bottom-1 right-1" />;
      } else if (phase === "Automne") {
        phaseColor = "text-[#8B47FF] hover:bg-[#E8D9FF]";
        icon = <img src={phaseIcons[phase]} alt="Icône Automne" className="w-6 h-6 absolute bottom-1 right-1" />;
      }
      const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
      const dateKey = localDate.toISOString().split("T")[0];
      const isToday = new Date().toDateString() === date.toDateString();
      const isSelected = selectedDate?.toDateString() === date.toDateString();
      const phaseVisible = !phaseFilters.length || (phase && phaseFilters.includes(phase));
      const hiddenStyles = !phaseVisible ? "opacity-30" : "";
      // Masquer les icônes de phase si le suivi est désactivé OU si l'on est sur l'onglet Todo-List
      const iconVisible = profile?.isActive && activeTab === 'calendar' && phaseVisible ? icon : null;

      const dayTodos = todosByDate[dateKey] || [];
      const allTodosCompleted = dayTodos.length > 0 && dayTodos.every(todo => todo.completed);
      
      //Masquer les indicateurs de tâche quand on est sur l'onglet Calendrier Menstruel
      const showCheckmark = activeTab === 'todo' && allTodosCompleted;
      const showPurpleDot = activeTab === 'todo' && dayTodos.length > 0 && !allTodosCompleted;
      

const isTodayWithNotification = isToday && hasNotif;

      if (isToday) {
        phaseColor = "bg-[#E8D9FF] text-[#8B47FF]";
      }
      if (isSelected) {
        phaseColor = "bg-[#E8D9FF] text-[#8B47FF] ring-2 ring-[#8B47FF]";
      }
      days.push(
        <div
          key={day}
          onClick={() => handleDayClick(day)}
          className={`h-12 sm:h-16 border-r border-b border-gray-200 flex flex-col items-center justify-center transition-colors cursor-pointer relative ${phaseColor} ${isToday ? "font-bold" : ""} ${hiddenStyles}`}
        >
{/*Badge de notification sur la date du jour uniquement dans l'Agenda Todo-List */}
    {isToday && hasNotif && activeTab === 'todo' && (
      <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#00CEC9] rounded-full animate-pulse z-10" />
    )}

          {showCheckmark && (
      <img 
        src="/image_icone/Okey-Calendar.svg" 
        alt="Toutes les tâches terminées" 
        className="w-5 h-5 absolute left-1 top-1 object-contain" 
      />
    )}

          {showPurpleDot && <span className="absolute left-2 top-2 h-2.5 w-2.5 rounded-full bg-[#8B47FF] shadow-sm" />}
          <span className="text-sm font-semibold">{day}</span>
          {iconVisible}
        </div>
      );
    }
    return days;
  };

  if (loading) return <div className="animate-pulse bg-gray-200 rounded-2xl h-64 w-full" />;

  const changeMonth = (offset: number) => {
    const next = new Date(currentMonth);
    next.setMonth(next.getMonth() + offset);
    setCurrentMonth(next);
  };

return (
    <div
      className="bg-white rounded-3xl p-10 shadow-sm w-full max-w-2xl mx-auto border-2 border-[#8B47FF] relative overflow-hidden"
      style={{ background: "radial-gradient(ellipse at center, #FEF0F9 0%, #FFFFFF 100%)" }}
    >
      {/* BLOC : En-tête dynamique (change selon l'onglet actif) */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-black font-boska">
            {activeTab === 'calendar' ? 'Mon rythme' : 'Agenda Todo-List'}
          </h1>
          {activeTab === 'calendar' ? (
            profile?.isActive ? (
              <p className="text-black font-medium mt-1">Suivi activé</p>
            ) : (
              <p className="text-black font-medium mt-1">Suivi inactif</p>
            )
          ) : (
            <p className="text-black font-medium mt-1">Gérez vos tâches par date</p>
          )}
        </div>
        <div className="flex items-center gap-3">
          {/* Le mode menstrue/discret s'affiche uniquement sur l'onglet calendrier */}
          {activeTab === 'calendar' && (
            <button
              onClick={() => setIsSnowflakeMode(!isSnowflakeMode)}
              className="px-4 py-3.5 bg-white border border-[#8B47FF] text-[#8B47FF] font-bold rounded-2xl hover:bg-[#F4EBFF] transition-all duration-300 shadow-sm text-sm cursor-pointer"
            >
              Mode {isSnowflakeMode ? "❄️Discret" : "🩸Menstrue"}
            </button>
          )}

          {/* L'icône d'aide à gauche du bouton des paramètres sur l'onglet Todo-List */}
          {activeTab === 'todo' && (
            <div className="group relative flex items-center cursor-pointer mr-1">
              <img 
                src="/image_icone/Help.svg" 
                alt="Aide" 
                className="w-6 h-6 object-contain hover:scale-110 transition-transform" 
              />
              <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 absolute right-0 top-full mt-2 w-72 p-3 bg-gray-800 text-white text-xs rounded-xl shadow-xl z-30 pointer-events-none">
                Cliquez sur une date du calendrier pour ajouter ou consulter vos tâches et la to-do list associée.
              </div>
            </div>
          )}

          <button
            onClick={() => setShowSettings(true)}
            className="p-3 bg-white border border-[#8B47FF] text-[#8B47FF] rounded-2xl hover:bg-[#F4EBFF] transition-all duration-300 hover:scale-105 shadow-sm cursor-pointer"
          >
            <Settings className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* BLOC : Je filtre mes phases (Affiché uniquement si activeTab === 'calendar') */}
      {activeTab === 'calendar' && (
        <div className="w-full mb-8 flex flex-col gap-6">
          
          {/* En-tête : Titre et Icône Help cliquable */}
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-[#7F4DC5] underline underline-offset-4 font-satoshi">
              Je filtre mes phases
            </h3>

            <div 
              onClick={() => setShowCalendarHelpModal(true)} 
              className="flex items-center cursor-pointer group"
            >
              <img 
                src="/image_icone/Help.svg" 
                alt="Aide" 
                className="w-6 h-6 object-contain group-hover:scale-110 transition-transform" 
              />
            </div>
          </div>

          {/* Grille 2 x 2 des phases */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-0">

            {/* Phase Pré-Ovulatoire (Printemps) */}
            <button
              type="button"
              onClick={() => togglePhaseFilter("Printemps")}
              className={`flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-medium transition-all cursor-pointer text-left ${
                phaseFilters.includes("Printemps")
                  ? " border-[#8B47FF] shadow-sm ring-2 ring-[#8B47FF]/20"
                  : " text-gray-800 hover:bg-[#FAF4FF] hover:border-[#8B47FF]/100"
              }`}
            >
              <div className="w-6 h-6 shrink-0 flex items-center justify-center">
                <img src={phaseIcons["Printemps"]} alt="Printemps" className="w-full h-full object-contain" />
              </div>
              <span className="font-semibold">Phase Pré-Ovulatoire</span>
            </button>

            {/* Phase Prémenstruelle (Automne) */}
            <button
              type="button"
              onClick={() => togglePhaseFilter("Automne")}
              className={`flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-medium transition-all cursor-pointer text-left ${
                phaseFilters.includes("Automne")
                  ? " border-[#8B47FF] shadow-sm ring-2 ring-[#8B47FF]/20"
                  : " text-gray-800 hover:bg-[#FAF4FF] hover:border-[#8B47FF]/100"
              }`}
            >
              <div className="w-6 h-6 shrink-0 flex items-center justify-center">
                <img src={phaseIcons["Automne"]} alt="Automne" className="w-full h-full object-contain" />
              </div>
              <span className="font-semibold">Phase Prémenstruelle</span>
            </button>

            {/* Phase Ovulatoire (Été) */}
            <button
              type="button"
              onClick={() => togglePhaseFilter("Été")}
              className={`flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-medium transition-all cursor-pointer text-left ${
                phaseFilters.includes("Été")
                  ? " border-[#8B47FF] shadow-sm ring-2 ring-[#8B47FF]/20"
                  : " text-gray-800 hover:bg-[#FAF4FF] hover:border-[#8B47FF]/100"
              }`}
            >
              <div className="w-6 h-6 shrink-0 flex items-center justify-center">
                <img src={phaseIcons["Été"]} alt="Été" className="w-full h-full object-contain" />
              </div>
              <span className="font-semibold">Phase Ovulatoire</span>
            </button>

            {/* Phase Menstruelle (Hiver) */}
            <button
              type="button"
              onClick={() => togglePhaseFilter("Hiver")}
              className={`flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-medium transition-all cursor-pointer text-left ${
                phaseFilters.includes("Hiver")
                  ? " border-[#8B47FF] shadow-sm ring-2 ring-[#8B47FF]/20"
                  : " text-gray-800 hover:bg-[#FAF4FF] hover:border-[#8B47FF]/100"
              }`}
            >
              <div className="w-6 h-6 shrink-0 flex items-center justify-center">
                <img 
                  src={isSnowflakeMode ? "/image_icone/Flocon.svg" : phaseIcons["Hiver"]} 
                  alt="Hiver" 
                  className="w-full h-full object-contain" 
                />
              </div>
              <span className="font-semibold">Phase Menstruelle</span>
            </button>

          </div>

          {/* Bouton de réinitialisation si des filtres sont actifs */}
          {phaseFilters.length > 0 && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setPhaseFilters([])}
                className="text-xs font-semibold text-[#8B47FF] underline hover:text-[#6f37e6] transition-colors cursor-pointer"
              >
                Réinitialiser les filtres
              </button>
            </div>
          )}

        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
        <button
          type="button"
          onClick={() => setActiveTab('calendar')}
          className={`w-full h-[42px] px-6 rounded-[5px] border border-[#E256B3] font-semibold text-base transition-all duration-200 cursor-pointer ${
            activeTab === 'calendar' 
              ? 'bg-[#FCE7F3] text-black shadow-sm' 
              : 'bg-white text-black hover:bg-[#FCE7F3]'
          }`}
        >
          Calendrier Menstruel
        </button>

        <button
          type="button"
          onClick={() => {
            // 🌟 Le clic sert uniquement à basculer sur l'onglet sans effacer le badge
            setActiveTab('todo');
          }}
          className={`w-full h-[42px] px-6 rounded-[5px] border border-[#00CEC9] font-semibold text-base transition-all duration-200 cursor-pointer relative ${
            activeTab === 'todo' 
              ? 'bg-[#E0F2FE] text-black shadow-sm' 
              : 'bg-white text-black hover:bg-[#E0F2FE]'
          }`}
        >
          <span>Agenda Todo-List</span>

          {/* Le badge reste visible sur le bouton */}
          {hasNotif && (
            <span className="absolute top-1.5 right-2 w-2.5 h-2.5 bg-[#00CEC9] rounded-full animate-pulse pointer-events-none" />
          )}
        </button>
      </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-6 px-2">
          <span className="font-bold text-2xl text-black">
            {currentMonth.toLocaleDateString("en-US", { month: "short", year: "numeric" })}
          </span>
          <div className="flex gap-4 text-gray-400">
            <button onClick={() => changeMonth(-1)} className="hover:text-black transition-colors">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button onClick={() => changeMonth(1)} className="hover:text-black transition-colors">
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 text-center text-xs font-semibold text-gray-500 mb-4">
          <div>Lun</div>
          <div>Mar</div>
          <div>Mer</div>
          <div>Jeu</div>
          <div>Ven</div>
          <div>Sam</div>
          <div>Dim</div>
        </div>

        <div className="grid grid-cols-7 border-l border-t border-gray-200 bg-white relative">{renderCalendar()}</div>
      </div>

      {!loggedUser && (
        <div className="mt-8 rounded-3xl border border-dashed border-[#8B47FF]/40 bg-[#FAF6FF] p-6 text-center text-sm text-[#5E4DA4]">
          Connectez-vous pour activer la todo list du calendrier.
        </div>
      )}

      {loggedUser && showTodoModal && selectedTodoDate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-3xl border border-[#8B47FF] bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <p className="text-sm font-semibold text-[#5B3ABC]">
                  Tâches du {selectedTodoDate.split('-').reverse().join('/')}
                </p>
                <p className="text-2xl font-bold text-black">
                  {new Date(selectedTodoDate).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}
                </p>
              </div>
              <button
                onClick={closeTodoModal}
                className="rounded-full border border-gray-200 bg-white p-2 text-gray-600 transition hover:border-[#8B47FF] hover:text-black"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <input
                type="text"
                value={todoInput}
                onChange={(e) => setTodoInput(e.target.value)}
                placeholder="Ajouter une tâche..."
                className="flex-1 min-w-0 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-black outline-none transition-all"
              />
              <button
                onClick={addTodo}
                className="rounded-2xl bg-[#8B47FF] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#6f37e6]"
              >
                Ajouter
              </button>
            </div>

            <div className="space-y-3 max-h-[360px] overflow-y-auto pr-2 custom-scrollbar">
              {(todosByDate[selectedTodoDate] ?? []).length > 0 ? (
                (todosByDate[selectedTodoDate] ?? []).map((todo) => (
                  <div key={todo.id} className="group flex items-center justify-between gap-4 rounded-3xl border border-gray-200 bg-white px-4 py-3 transition"
                  style={{
    backgroundColor: 
      todo.category === 'bien-etre' ? 'rgba(139, 71, 255, 0.15)' : // Violet léger
      todo.category === 'sport' ? '#CEFFFD' :       // Bleu léger
      todo.category === 'nutrition' ? '#FFE8F7' :   // Rose léger
      'transparent'
  }}
  >
                    <label className="flex items-center gap-3 flex-1 cursor-pointer">
                      <span
                        className={`relative flex h-5 w-5 shrink-0 items-center justify-center rounded-[6px] border transition ${
                          todo.completed ? "border-emerald-500 bg-emerald-500" : "border-gray-300 bg-white"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={todo.completed}
                          onChange={() => toggleTodo(todo.id)}
                          className="absolute inset-0 h-full w-full opacity-0 cursor-pointer"
                        />
                        {todo.completed && (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5 text-white">
                            <path d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </span>
                      <span className={`text-sm ${todo.completed ? "text-gray-500 line-through" : "text-gray-900"}`}>{todo.text}</span>
                    </label>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="flex h-11 w-11 items-center justify-center rounded-full text-gray-400 transition hover:text-red-600"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))
              ) : (
                <p className="rounded-3xl border border-dashed border-gray-300 bg-white px-4 py-6 text-center text-sm text-gray-500">
                  Aucune tâche pour ce jour. Ajoutez-en une via le champ ci-dessus.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {selectedDate && activeTab === 'calendar' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-3xl border border-[#8B47FF] bg-white p-8 shadow-2xl relative">
            
            {/* En-tête */}
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <p className="text-sm font-semibold text-[#5B3ABC]">
                  Suivi quotidien
                </p>
                <p className="text-2xl font-bold text-black">
                  {selectedDate.toLocaleDateString("fr-FR", { weekday: 'long', day: 'numeric', month: 'long' })}
                </p>
              </div>
              <button
                onClick={() => setSelectedDate(null)}
                className="rounded-full border border-gray-200 bg-white p-2 text-gray-600 transition hover:border-[#8B47FF] hover:text-black cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Navbar des onglets */}
            <div className="flex rounded-2xl border border-purple-200 p-1 mb-8 bg-white gap-1 overflow-x-auto">
              {[
                { id: 'humeur', label: 'Humeur' },
                { id: 'symptome', label: 'Symptôme physique' },
                { id: 'rectifier', label: 'À Rectifier !' },
                { id: 'flux', label: 'Flux' },
                { id: 'resultat', label: 'Résultat' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSymptomTab(tab.id as any)}
                  className={`flex-1 py-3 px-4 text-sm font-semibold rounded-xl transition-all cursor-pointer whitespace-nowrap text-center ${
                    symptomTab === tab.id
                      ? 'bg-[#C4B5FD] text-purple-950 shadow-sm font-bold'
                      : 'text-gray-600 hover:bg-purple-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Contenu des onglets */}
            <div className="min-h-[300px] max-h-[380px] overflow-y-auto pr-1 custom-scrollbar">
              
              {/* ONGLET 1 : HUMEUR */}
              {symptomTab === 'humeur' && (
                <div className="space-y-6">
                  {/* Groupe Positif (Cadre Vert) */}
                  <div className="p-4 rounded-2xl border-2 border-emerald-300 bg-emerald-50/20">
                    <div className="flex flex-wrap gap-2">
                      {[
                        "Calme", "Confiante", "Dynamique", "Enthousiaste", "Épanouie",
                        "Euphorique", "Extravertie", "Heureuse", "Joyeuse",
                        "Mélancolique", "Motivé·e", "Optimiste", "Paisible", "Réservé·e",
                        "Sereine", "Sociable", "Vitalité"
                      ].map((m) => {
                        const isSelected = selectedMoods.includes(m);
                        return (
                          <button
                            key={m}
                            type="button"
                            onClick={() => {
                              setSelectedMoods(prev => 
                                isSelected ? prev.filter(item => item !== m) : [...prev, m]
                              );
                            }}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                              isSelected 
                                ? 'bg-[#8B47FF] text-white shadow-sm' 
                                : 'bg-white text-gray-700 border border-gray-200 hover:border-[#8B47FF]'
                            }`}
                          >
                            {m}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Groupe Négatif / Intense (Cadre Rose/Rouge) */}
                  <div className="p-4 rounded-2xl border-2 border-rose-300 bg-rose-50/20">
                    <div className="flex flex-wrap gap-2">
                      {[
                        "Anxieuse", "Apathe", "Déprimé·e", "Émotive", "Énervée",
                        "Épuisée", "Fatiguée", "Insomnie", "Inquiète", "Irritable",
                        "Léthargie", "Somnolente", "Stressée", "Triste"
                      ].map((m) => {
                        const isSelected = selectedMoods.includes(m);
                        return (
                          <button
                            key={m}
                            type="button"
                            onClick={() => {
                              setSelectedMoods(prev => 
                                isSelected ? prev.filter(item => item !== m) : [...prev, m]
                              );
                            }}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                              isSelected 
                                ? 'bg-[#8B47FF] text-white shadow-sm' 
                                : 'bg-white text-gray-700 border border-gray-200 hover:border-[#8B47FF]'
                            }`}
                          >
                            {m}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Autre : Champ de texte */}
                  <div className="p-4 rounded-2xl border border-gray-300 bg-white">
                    <input
                      type="text"
                      placeholder="Autre : ..."
                      value={customMood}
                      onChange={(e) => setCustomMood(e.target.value)}
                      className="w-full text-sm outline-none text-gray-800 placeholder-gray-400 bg-transparent"
                    />
                  </div>
                </div>
              )}

              {/* ONGLET 2 : SYMPTÔME PHYSIQUE */}
              {symptomTab === 'symptome' && (
                <div className="space-y-4">
                  {[
                    {
                      category: "Douleurs",
                      items: ["Crampes", "Maux de tête", "Migraines", "Seins douloureux", "Douleurs pelviennes", "Douleurs lombaires", "Douleurs articulaires", "Douleurs musculaires", "Tensions dans le bas-ventre"]
                    },
                    {
                      category: "Changements de peau et cheveux",
                      items: ["Acné", "Peau grasse", "Peau sèche", "Boutons", "Teint terne", "Peau lumineuse", "Cheveux gras", "Cheveux secs", "Chute de cheveux", "Points noirs"]
                    },
                    {
                      category: "Digestion et Appétit",
                      items: ["Ballonnements", "Gaz", "Nausées", "Brûlures d'estomac", "Perte d'appétit", "Appétit accru", "Fringales", "Envie de sucre", "Envie de salé"]
                    },
                    {
                      category: "Sécrétion et Intimité",
                      items: ["Pertes blanches", "Glaire cervicale", "abondante", "Glaire cervicale filante", "Sécheresse vaginale", "Saignements intermenstruels", "Spotting"]
                    },
                    {
                      category: "Selles et Transit",
                      items: ["Selles molles", "Selles dures", "Selles fréquentes", "Constipation", "Diarrhée", "Transit ralenti", "Transit accéléré"]
                    },
                    {
                      category: "Corps",
                      items: ["Rétention d'eau", "Jambes lourdes", "Gonflement abdominal", "Prise de poids temporaire", "Seins gonfiés", "Ventre dur"]
                    }
                  ].map((cat) => {
                    const isOpen = openCategory === cat.category;
                    return (
                      <div key={cat.category} className="border border-gray-300 rounded-2xl overflow-hidden bg-white shadow-sm">
                        <button
                          type="button"
                          onClick={() => setOpenCategory(isOpen ? null : cat.category)}
                          className="w-full px-5 py-4 text-left font-semibold text-gray-800 flex justify-between items-center hover:bg-purple-50 transition-colors cursor-pointer"
                        >
                          <span>{cat.category}</span>
                          <span className="text-xl font-light">{isOpen ? '−' : '+'}</span>
                        </button>
                        {isOpen && (
                          <div className="p-4 border-t border-gray-100 bg-purple-50/30 flex flex-wrap gap-2">
                            {cat.items.map((item) => {
                              const isSelected = selectedPhysicalSymptoms.includes(item);
                              return (
                                <button
                                  key={item}
                                  type="button"
                                  onClick={() => {
                                    setSelectedPhysicalSymptoms(prev =>
                                      isSelected ? prev.filter(i => i !== item) : [...prev, item]
                                    );
                                  }}
                                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                                    isSelected 
                                      ? 'bg-[#8B47FF] text-white shadow-sm' 
                                      : 'bg-white text-gray-700 border border-gray-200 hover:border-[#8B47FF]'
                                  }`}
                                >
                                  {item}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Autre : Champ de texte */}
                  <div className="p-4 rounded-2xl border border-gray-300 bg-white">
                    <input
                      type="text"
                      placeholder="Autre : ..."
                      value={customPhysical}
                      onChange={(e) => setCustomPhysical(e.target.value)}
                      className="w-full text-sm outline-none text-gray-800 placeholder-gray-400 bg-transparent"
                    />
                  </div>
                </div>
              )}

              {/* ONGLET 3 : À RECTIFIER ! */}
              {symptomTab === 'rectifier' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button type="button" className="p-4 rounded-2xl border border-gray-300 bg-white hover:border-[#8B47FF] text-sm font-semibold text-gray-800 transition-all cursor-pointer shadow-sm text-center">
                    J'ai mes règles !
                  </button>
                  <button type="button" className="p-4 rounded-2xl border border-gray-300 bg-white hover:border-[#8B47FF] text-sm font-semibold text-gray-800 transition-all cursor-pointer shadow-sm text-center">
                    Mes règles continuent
                  </button>
                  <button type="button" className="p-4 rounded-2xl border border-gray-300 bg-white hover:border-[#8B47FF] text-sm font-semibold text-gray-800 transition-all cursor-pointer shadow-sm text-center">
                    Je ne les ai pas
                  </button>
                  <button type="button" className="p-4 rounded-2xl border border-gray-300 bg-white hover:border-[#8B47FF] text-sm font-semibold text-gray-800 transition-all cursor-pointer shadow-sm text-center">
                    Je ne les ai plus
                  </button>
                  <div className="sm:col-span-2 p-4 rounded-2xl border border-gray-300 bg-white">
                    <input type="text" placeholder="Plus de précisions..." className="w-full text-sm outline-none text-gray-800 placeholder-gray-400 bg-transparent" />
                  </div>
                </div>
              )}

            {/* ONGLET 4 : FLUX */}
              {symptomTab === 'flux' && (
                <MenstrualFlux
                  fluxValue={fluxValue}
                  setFluxValue={setFluxValue}
                  fluxCustom={fluxCustom}
                  setFluxCustom={setFluxCustom}
                  isSnowflakeMode={isSnowflakeMode}
                />
              )}

              {/* ONGLET 5 : RÉSULTAT */}
              {symptomTab === 'resultat' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-bold text-[#7F4DC5] mb-3">Comment s'est passé ta période Menstruelle ?</h4>
                    <div className="p-4 rounded-2xl border border-gray-300 bg-white">
                      <textarea
                        rows={3}
                        placeholder="Ma période menstruelle s'est vu accompagné de..."
                        value={resultatSummary}
                        onChange={(e) => setResultatSummary(e.target.value)}
                        className="w-full text-sm outline-none text-gray-800 placeholder-gray-400 bg-transparent resize-none"
                      />
                    </div>
                  </div>

                  <button
                    onClick={async () => {
                      // Fusionner les sélections et textes personnalisés avant sauvegarde
                      const finalMood = [...selectedMoods, customMood].filter(Boolean).join(', ');
                      const finalPhysical = [...selectedPhysicalSymptoms, customPhysical].filter(Boolean).join(', ');
                      const finalFlux = fluxValue === 1 ? "Léger" : fluxValue === 2 ? "Moyen" : fluxValue === 3 ? "Abondant" : "Très abondant";

                      setSymptomLog({
                        flow: finalFlux,
                        mood: finalMood,
                        physicalSymptoms: finalPhysical,
                      });

                      await saveSymptom();
                      setSelectedDate(null);
                    }}
                    disabled={isSavingSymptom}
                    className="w-full py-4 bg-[#8B47FF] text-white rounded-2xl font-bold shadow-lg hover:bg-[#7535e6] transition-all cursor-pointer text-base"
                  >
                    {isSavingSymptom ? 'Enregistrement...' : 'Enregistrer les symptômes'}
                  </button>
                </div>
              )}

            </div>

          </div>
        </div>
      )}

      {showSettings && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 shadow-2xl w-full max-w-md relative border-2 border-[#8B47FF]">
            <button onClick={() => setShowSettings(false)} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-black transition-colors">
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-2xl font-bold mb-6 text-black underline">Paramètres</h3>
            <div className="space-y-6">
              <label className="flex items-center justify-between p-4 bg-[#F4EBFF] border border-[#8B47FF]/30 rounded-xl cursor-pointer hover:bg-[#E8D9FF] transition-colors">
                <span className="font-bold text-[#8B47FF]">Activer le suivi</span>
                <input
                  type="checkbox"
                  checked={isActiveForm}
                  onChange={(e) => setIsActiveForm(e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-[#8B47FF] focus:ring-[#8B47FF]"
                />
              </label>
              {isActiveForm && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
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
                          <input type="radio" name="cycleType" checked={! [24, 28, 32].includes(cycleLengthForm)} onChange={() => setCycleLengthForm(28)} className="text-[#8B47FF] focus:ring-[#8B47FF]" />
                          <span className="text-sm text-gray-700">⚫ Je ne sais pas du tout</span>
                        </label>
                      </div>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-bold text-black mb-2">Début des dernières règles</label>
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
      {/*NOUVEAU : Modale d'aide détaillée pour le Calendrier Menstruel */}
      {showCalendarHelpModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 shadow-2xl w-full max-w-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar">
            <button 
              onClick={() => setShowCalendarHelpModal(false)} 
              className="absolute top-0 right-0 p-2 text-gray-400 hover:text-black transition-colors cursor-pointer"
            >
              <X className="w-5 h-5 " />
            </button>

            <div className="space-y-4">
              {/* Consigne principale sur fond bg-gray-800 et texte blanc */}
              <div className="bg-gray-800 text-white p-4 rounded-[5px] text-sm leading-relaxed shadow-md">
                <p>→ Au-dessus de ton calendrier menstruel, clique sur une ou plusieurs phases pour filtrer l'affichage du calendrier et repérer tes périodes en un coup d'œil.</p>
                
                <p className="mt-2">→ Indique ton cycle menstruel dans les paramètres et tes symptômes directement dans les dates du calendrier.</p>
              </div>

              {/* Grille explicative des 4 phases */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0 pt-2 relative">

                {/*Ligne horizontale centrale (limitée proprement entre les cartes) */}
  <div className="absolute left-2 right-2 top-[235px] h-[2px] bg-[#7F4DC5] -translate-y-1/2 pointer-events-none hidden md:block z-10"></div>
  
  {/*Ligne verticale centrale (limitée proprement du haut en bas) */}
  <div className="absolute top-4 bottom-2 left-1/2 w-[2px] bg-[#7F4DC5] -translate-x-1/2 pointer-events-none hidden md:block z-10"></div>
                
                {/* Phase Printemps / Folliculaire */}
                <div className=" p-4 rounded-2xl flex flex-col items-center">
                  <div className="w-8 h-8 mb-2">
                    <img src={phaseIcons["Printemps"]} alt="Printemps" className="w-full h-full object-contain" />
                  </div>
                  <h4 className="font-bold text-[#7F4DC5] text-base mb-1 text-center">Phase Folliculaire <br /> <span className="block font-bold text-sm">(Le Printemps du cycle)</span></h4>
                  <p className="text-xs text-gray-700 leading-relaxed mt-2">
                    Le corps se prépare à libérer un ovule et l'utérus commence à fabriquer une nouvelle muqueuse irriguée par le sang. Durant cette période l'énergie remonte doucement, favorisant un sentiment de dynamisme.
                  </p>
                </div>

                {/* Phase Été / Ovulatoire */}
                <div className=" p-4 rounded-2xl flex flex-col items-center">
                  <div className="w-8 h-8 mb-2">
                    <img src={phaseIcons["Été"]} alt="Été" className="w-full h-full object-contain" />
                  </div>
                  <h4 className="font-bold text-[#7F4DC5] text-base mb-1 text-center">Phase Ovulatoire <br /> <span className="block font-bold text-sm">(L'Été du cycle)</span></h4>
                  <p className="text-xs text-gray-700 leading-relaxed mt-2">
                    C'est le moment où l'ovaire libère l'ovule pour la fécondation. Cette phase correspond généralement à un pic d'énergie maximale, facilitant la communication, le rayonnement et l'assurance.
                  </p>
                </div>

                {/* Phase Automne / Prémenstruelle */}
                <div className=" p-4 rounded-2xl flex flex-col items-center">
                  <div className="w-8 h-8 mb-2">
                    <img src={phaseIcons["Automne"]} alt="Automne" className="w-full h-full object-contain" />
                  </div>
                  <h4 className="font-bold text-[#7F4DC5] text-base mb-1 text-center">Phase Prémenstruelle <br /> <span className="block font-bold text-sm">(L'Automne du cycle)</span></h4>
                  <p className="text-xs text-gray-700 leading-relaxed mt-2">
                    L'ovule libéré n'a pas été fécondé. Les niveaux d'énergie commencent à baisser, incitant naturellement à se tourner vers soi. Les premiers signes du syndrome prémenstruel (SPM) peuvent faire leur apparition chez certaines personnes.
                  </p>
                </div>

                {/* Phase Hiver / Menstruelle (avec gestion dynamique de l'icône flocon selon le mode) */}
                <div className="p-4 rounded-2xl flex flex-col items-center ">
                  <div className="w-8 h-8 mb-2">
                    <img 
                      src={isSnowflakeMode ? "/image_icone/Flocon.svg" : phaseIcons["Hiver"]} 
                      alt="Hiver" 
                      className="w-full h-full object-contain" 
                    />
                  </div>
                  <h4 className="font-bold text-[#7F4DC5] text-base mb-1 text-center">Phase Menstruelle <br /> <span className="block font-bold text-sm">(L'Hiver du cycle)</span></h4>
                  <p className="text-xs text-gray-700 leading-relaxed mt-2">
                    Cette période correspond au début des règles et au "nettoyage" de l'utérus. Le corps exprime un besoin accru de repos, de douceur et d'un rythme plus lent pour se régénérer pleinement.
                  </p>
                </div>

              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}