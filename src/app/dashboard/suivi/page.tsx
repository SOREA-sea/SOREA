"use client";

import { useState, useEffect } from "react";
import { Download } from "lucide-react";
import {
  getCyclePositionForDay,
  localDay,
  addDays,
  dayDiff,
  entryPeriodLength,
  type PeriodEntry,
} from "@/lib/cycleCalc";

// Une synthèse quotidienne = ce que l'utilisatrice a enregistré pour un jour (table SymptomLog)
type JourSynthese = {
  id: number;
  day: string; // "AAAA-MM-JJ"
  flow: string | null;
  mood: string | null;
  physicalSymptoms: string | null;
  note: string | null; // « Comment s'est passé ta période ? »
  updatedAt: string;
};

// Un cycle = du 1er jour des règles à la veille des règles suivantes
type Cycle = {
  key: string;
  start: string;
  end: string | null; // null = cycle en cours
  enCours: boolean;
  avantSuivi: boolean; // synthèses enregistrées avant les premières règles connues
  dureeCycle: number | null; // en jours, seulement pour un cycle terminé
  dureeRegles: number | null;
  reglesEstimees: boolean; // fin des règles non renseignée : durée moyenne du profil
  jours: JourSynthese[];
  titre?: string; // groupes hors cycle (grossesse, ménopause, post-partum) : titre et détail imposés
  detail?: string;
};

// Situation choisie dans le calendrier (modale « Vous êtes... »), mémorisée dans le navigateur
type SituationSuivi = { type: string; ddr: string; accouchement: string; allaitement: boolean };
const SITUATION_PAR_DEFAUT: SituationSuivi = { type: "reglee", ddr: "", accouchement: "", allaitement: false };
const lireSituation = (): SituationSuivi => {
  try {
    return {
      type: localStorage.getItem("sorea_situation_suivi") || "reglee",
      ddr: localStorage.getItem("sorea_grossesse_ddr") || "",
      accouchement: localStorage.getItem("sorea_accouchement_date") || "",
      allaitement: localStorage.getItem("sorea_allaitement") === "oui",
    };
  } catch {
    return SITUATION_PAR_DEFAUT;
  }
};
// Situations où il n'y a pas de cycle menstruel à regrouper
const SITUATIONS_SANS_CYCLE = ["enceinte", "menopausee", "postpartum"];
// Titre de la page et des PDF, cohérent avec l'en-tête du calendrier
const titreSuivi = (type: string) =>
  type === "enceinte" ? "Suivi de grossesse" : type === "menopausee" ? "Suivi ménopause" : type === "postpartum" ? "Suivi post-partum" : "Suivi Menstruel";

// ── Petits utilitaires de dates ("AAAA-MM-JJ") ────────────────────────────────
const enDate = (day: string) => {
  const [y, m, d] = day.split("-").map(Number);
  return new Date(y, m - 1, d);
};
const formatJour = (day: string) => {
  const [y, m, d] = day.split("-");
  return `${d}/${m}/${y}`;
};
const formatJourCourt = (day: string) => {
  const [, m, d] = day.split("-");
  return `${d}/${m}`;
};
const majuscule = (texte: string) => texte.charAt(0).toUpperCase() + texte.slice(1);
const formatJourLong = (day: string) =>
  majuscule(enDate(day).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" }));
const debutMois = (day: string) => `${day.slice(0, 7)}-01`;
const finMois = (day: string) => {
  const [y, m] = day.split("-").map(Number);
  return localDay(new Date(y, m, 0));
};
const decalerMois = (day: string, n: number) => {
  const [y, m] = day.split("-").map(Number);
  return localDay(new Date(y, m - 1 + n, 1));
};

// ── Utilitaires de contenu ───────────────────────────────────────────────────
const listeValeurs = (valeur: string | null) =>
  valeur ? valeur.split(",").map((v) => v.trim()).filter(Boolean) : [];

// Échappe le texte saisi par l'utilisatrice avant de l'écrire dans le document PDF
const esc = (valeur: unknown) =>
  String(valeur ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string
  );

// Nombre de jours où chaque valeur (symptôme, humeur, flux) apparaît, du plus fréquent au moins fréquent
const compter = (jours: JourSynthese[], champ: "mood" | "physicalSymptoms" | "flow") => {
  const totaux = new Map<string, number>();
  jours.forEach((j) => {
    new Set(listeValeurs(j[champ])).forEach((v) => totaux.set(v, (totaux.get(v) ?? 0) + 1));
  });
  return [...totaux.entries()].sort((a, b) => b[1] - a[1]);
};

const moyenne = (valeurs: number[]) =>
  valeurs.length ? Math.round((valeurs.reduce((s, v) => s + v, 0) / valeurs.length) * 10) / 10 : null;

const AVERTISSEMENT =
  "Ces informations sont fournies à titre purement indicatif. Pour obtenir un diagnostic ou un avis médical, consultez un professionnel.";

export default function SuiviPage() {
  const [jours, setJours] = useState<JourSynthese[]>([]);
  const [nomComplet, setNomComplet] = useState("");
  const [chargement, setChargement] = useState(true);
  const [activeTab, setActiveTab] = useState<"Liste" | "Par date">("Liste");
  const [profile, setProfile] = useState<{ cycleLength: number; periodLength: number; lastPeriodStartDate: string | null } | null>(null);
  const [history, setHistory] = useState<PeriodEntry[]>([]);
  const [sortOrder, setSortOrder] = useState<"Plus récents" | "Plus anciens">("Plus récents");
  const [cyclesOuverts, setCyclesOuverts] = useState<string[]>([]);
  const [nbCyclesRapport, setNbCyclesRapport] = useState<3 | 6 | 12>(3);
  const [situation, setSituation] = useState<SituationSuivi>(SITUATION_PAR_DEFAUT);
  const modeSansCycle = SITUATIONS_SANS_CYCLE.includes(situation.type);

  const aujourdhui = localDay(new Date());
  const [periodeDu, setPeriodeDu] = useState(debutMois(aujourdhui));
  const [periodeAu, setPeriodeAu] = useState(finMois(aujourdhui));

  // Charger le profil menstruel (durées, historique des règles) pour les cycles et les phases
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/menstrual-profile");
        if (res.ok) {
          const data = await res.json();
          setProfile(data.profile);
          setHistory(data.history ?? []);
        }
      } catch (e) {
        console.error(e);
      }
    }
    fetchProfile();
  }, []);

  // Synthèses quotidiennes : lues en base, propres au compte connecté
  useEffect(() => {
    let actif = true;
    const chargerSyntheses = () => {
      fetch("/api/symptoms/history")
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (!actif || !data) return;
          setSituation(lireSituation());
          // Anciennes fiches de synthèse du navigateur : remplacées par la base, plus utilisées
          localStorage.removeItem("sorea_saved_summaries");
          setJours(data.logs ?? []);
          if (data.user) {
            setNomComplet(`${data.user.firstName ?? ""} ${String(data.user.lastName ?? "").toUpperCase()}`.trim());
          }
        })
        .catch((e) => console.error(e))
        .finally(() => {
          if (actif) setChargement(false);
        });
    };

    chargerSyntheses();
    // Situation changée dans le calendrier (autre onglet ou retour sur cet onglet) : on la relit
    const relireSituation = () => {
      if (actif) setSituation(lireSituation());
    };
    const surStockage = (e: StorageEvent) => {
      if (e.key === null || e.key.startsWith("sorea_situation") || e.key.startsWith("sorea_grossesse") || e.key.startsWith("sorea_accouchement") || e.key === "sorea_allaitement") relireSituation();
    };
    // Le bouton « Enregistrer les symptômes » du calendrier prévient la page après l'enregistrement
    window.addEventListener("sorea_summary_update", chargerSyntheses);
    window.addEventListener("storage", surStockage);
    window.addEventListener("focus", relireSituation);
    return () => {
      actif = false;
      window.removeEventListener("sorea_summary_update", chargerSyntheses);
      window.removeEventListener("storage", surStockage);
      window.removeEventListener("focus", relireSituation);
    };
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

        // Même calcul que le calendrier, les roues et le serveur (src/lib/cycleCalc.ts)
    const position = getCyclePositionForDay(
      localDay(date),
      { cycleLength: profile.cycleLength || 28, periodLength: profile.periodLength || 5 },
      history.length > 0
        ? history
        : [{ startDate: String(profile.lastPeriodStartDate).slice(0, 10), endDate: null }]
    );
    const phase = position ? position.phase : "Hiver";

    if (phase === "Hiver") {
      return isDiscret
        ? { name: "Hiver", icon: "/image_icone/Flocon.svg" }
        : { name: "Phase Menstruelle", icon: "/image_Design-SOREA/Hiver.svg" };
    }
    if (phase === "Printemps") {
      return isDiscret
        ? { name: "Printemps", icon: "/image_icone/Printemps.svg" }
        : { name: "Phase Folliculaire", icon: "/image_icone/Printemps.svg" };
    }
    if (phase === "Été") {
      return isDiscret
        ? { name: "Été", icon: "/image_icone/Été.svg" }
        : { name: "Phase Ovulatoire", icon: "/image_icone/Été.svg" };
    }
    return isDiscret
      ? { name: "Automne", icon: "/image_icone/Automne.svg" }
      : { name: "Phase Lutéale", icon: "/image_icone/Automne.svg" };
  };

  const phaseDuJour = (day: string) => getPhaseInfo(formatJour(day));

  // ── Regroupement des synthèses par cycle ──────────────────────────────────
  const construireCycles = (): Cycle[] => {
    const debuts: PeriodEntry[] = [];
    [...history]
      .filter((h) => h.startDate)
      .map((h) => ({ startDate: String(h.startDate).slice(0, 10), endDate: h.endDate ? String(h.endDate).slice(0, 10) : null }))
      .sort((a, b) => a.startDate.localeCompare(b.startDate))
      .forEach((h) => {
        if (debuts[debuts.length - 1]?.startDate !== h.startDate) debuts.push(h);
      });
    if (debuts.length === 0 && profile?.lastPeriodStartDate) {
      debuts.push({ startDate: String(profile.lastPeriodStartDate).slice(0, 10), endDate: null });
    }

    const cycles: Cycle[] = [];
    const vide = { enCours: false, dureeCycle: null, dureeRegles: null, reglesEstimees: false };

    // Aucune date de règles connue : toutes les synthèses dans un seul groupe
    if (debuts.length === 0) {
      if (jours.length > 0) {
        cycles.push({ ...vide, key: "sans-cycle", start: jours[0].day, end: jours[jours.length - 1].day, avantSuivi: true, jours: [...jours] });
      }
      return cycles;
    }

    const avant = jours.filter((j) => j.day < debuts[0].startDate);
    if (avant.length > 0) {
      cycles.push({ ...vide, key: "avant", start: avant[0].day, end: addDays(debuts[0].startDate, -1), avantSuivi: true, jours: avant });
    }

    debuts.forEach((entree, i) => {
      const suivant = debuts[i + 1];
      const end = suivant ? addDays(suivant.startDate, -1) : null;
      cycles.push({
        key: entree.startDate,
        start: entree.startDate,
        end,
        enCours: !suivant,
        avantSuivi: false,
        dureeCycle: suivant ? dayDiff(entree.startDate, suivant.startDate) : null,
        dureeRegles: entryPeriodLength(entree, profile?.periodLength || 5),
        reglesEstimees: !entree.endDate,
        jours: jours.filter((j) => j.day >= entree.startDate && (end === null || j.day <= end)),
      });
    });
    return cycles;
  };

  // ── Grossesse, ménopause, post-partum : regroupement sans cycle ──────────────
  const groupe = (key: string, start: string, end: string, liste: JourSynthese[], titre: string, detail: string, avantSuivi = false): Cycle => ({
    key, start, end, enCours: false, avantSuivi, dureeCycle: null, dureeRegles: null, reglesEstimees: false,
    jours: liste, titre, detail,
  });

  const nbJoursTexte = (n: number) => `${n} jour${n > 1 ? "s" : ""}`;

  // Un groupe par mois calendaire
  const groupesParMois = (liste: JourSynthese[]): Cycle[] => {
    const parMois = new Map<string, JourSynthese[]>();
    liste.forEach((j) => parMois.set(j.day.slice(0, 7), [...(parMois.get(j.day.slice(0, 7)) ?? []), j]));
    return [...parMois.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([mois, joursDuMois]) => {
        const debut = `${mois}-01`;
        return groupe(
          `mois-${mois}`,
          debut,
          finMois(debut),
          joursDuMois,
          majuscule(enDate(debut).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })),
          `Du ${formatJour(debut)} au ${formatJour(finMois(debut))}`
        );
      });
  };

  const construireGroupesSansCycle = (): Cycle[] => {
    // Enceinte : un groupe par trimestre (à partir du 1er jour des dernières règles, la DDR)
    if (situation.type === "enceinte" && situation.ddr) {
      const ddr = situation.ddr;
      const avant = jours.filter((j) => j.day < ddr);
      const groupes: Cycle[] = [];
      if (avant.length > 0) {
        groupes.push(groupe("avant-grossesse", avant[0].day, addDays(ddr, -1), avant, "Avant la grossesse", `Jusqu’au ${formatJour(addDays(ddr, -1))}`, true));
      }
      [
        { numero: 1, debut: 0, fin: 97 },
        { numero: 2, debut: 98, fin: 195 },
        { numero: 3, debut: 196, fin: 294 },
      ].forEach(({ numero, debut, fin }) => {
        const start = addDays(ddr, debut);
        const end = addDays(ddr, fin);
        if (start > aujourdhui) return;
        groupes.push(
          groupe(
            `trimestre-${numero}`,
            start,
            end,
            jours.filter((j) => j.day >= start && j.day <= end),
            `${numero}${numero === 1 ? "er" : "e"} trimestre`,
            `Du ${formatJour(start)} au ${formatJour(end)} · ${Math.floor(debut / 7)} à ${Math.floor(fin / 7)} SA`
          )
        );
      });
      return [...groupes, ...groupesParMois(jours.filter((j) => j.day > addDays(ddr, 294)))];
    }

    // Post-partum : avant l'accouchement à part, puis un groupe par mois
    if (situation.type === "postpartum" && situation.accouchement) {
      const acc = situation.accouchement;
      const avant = jours.filter((j) => j.day < acc);
      return [
        ...(avant.length > 0
          ? [groupe("avant-accouchement", avant[0].day, addDays(acc, -1), avant, "Avant l’accouchement", `Jusqu’au ${formatJour(addDays(acc, -1))}`, true)]
          : []),
        ...groupesParMois(jours.filter((j) => j.day >= acc)),
      ];
    }

    // Ménopause (ou date manquante) : un groupe par mois
    return groupesParMois(jours);
  };

  const cycles = modeSansCycle ? construireGroupesSansCycle() : construireCycles();

  const cycleDuJour = (day: string) =>
    cycles.find((c) => !c.avantSuivi && day >= c.start && (c.end === null || day <= c.end));

  const jourDuCycle = (day: string) => {
    if (modeSansCycle) return null;
    const cycle = cycleDuJour(day);
    return cycle ? dayDiff(cycle.start, day) + 1 : null;
  };

  // Repère affiché sous la date d'une synthèse : jour du cycle, semaine de grossesse, semaines après l'accouchement
  const repereJour = (day: string): string | null => {
    if (situation.type === "enceinte" && situation.ddr) {
      const ecart = dayDiff(situation.ddr, day);
      if (ecart < 0 || ecart > 294) return null;
      const trimestre = ecart < 98 ? 1 : ecart < 196 ? 2 : 3;
      return `${Math.floor(ecart / 7)} SA · ${trimestre}${trimestre === 1 ? "er" : "e"} trimestre`;
    }
    if (situation.type === "postpartum" && situation.accouchement) {
      const ecart = dayDiff(situation.accouchement, day);
      if (ecart < 0) return null;
      const semaines = Math.floor(ecart / 7);
      return semaines === 0 ? "Semaine de l’accouchement" : `${semaines} semaine${semaines > 1 ? "s" : ""} après l’accouchement`;
    }
    if (modeSansCycle) return null;
    const numero = jourDuCycle(day);
    return numero !== null ? `Jour ${numero} du cycle` : null;
  };

  const titreCycle = (cycle: Cycle) => {
    if (cycle.titre) return cycle.titre;
    if (cycle.key === "sans-cycle") return "Mes synthèses";
    if (cycle.avantSuivi) return "Avant le suivi des règles";
    if (cycle.enCours) return "Cycle en cours";
    return `Cycle du ${formatJourCourt(cycle.start)} au ${formatJour(cycle.end!)}`;
  };

  const detailCycle = (cycle: Cycle) => {
    if (cycle.detail) return cycle.detail;
    if (cycle.avantSuivi) return `Du ${formatJour(cycle.start)} au ${formatJour(cycle.end!)}`;
    const regles = cycle.dureeRegles
      ? ` · règles ${cycle.dureeRegles} jour${cycle.dureeRegles > 1 ? "s" : ""}${cycle.reglesEstimees ? " (estimé)" : ""}`
      : "";
    if (cycle.enCours) {
      const jourActuel = dayDiff(cycle.start, aujourdhui) + 1;
      const finPrevue = addDays(cycle.start, (profile?.cycleLength || 28) - 1);
      return `Depuis le ${formatJour(cycle.start)} · jour ${jourActuel} · fin prévue vers le ${formatJourCourt(finPrevue)}${regles}`;
    }
    return `${cycle.dureeCycle} jours${regles}`;
  };

  // Ordre d'affichage : le libellé dit ce qui est affiché en premier
  const trierJours = (liste: JourSynthese[]) =>
    [...liste].sort((a, b) => (sortOrder === "Plus récents" ? b.day.localeCompare(a.day) : a.day.localeCompare(b.day)));
  const cyclesAffiches = sortOrder === "Plus récents" ? [...cycles].reverse() : cycles;

  const basculerCycle = (key: string) =>
    setCyclesOuverts((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));

  // ── Documents PDF (impression A4) ─────────────────────────────────────────
  // Le nom du fichier (titre du document) ne contient jamais le nom de l'utilisatrice
  const ouvrirDocument = (nomFichier: string, sousTitre: string, corps: string) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    const maintenant = new Date();

    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <title>${esc(nomFichier)}</title>
        <style>
          @page { size: A4 portrait; margin: 20mm; }
          body { font-family: Arial, sans-serif; color: #212121; margin: 0; padding: 0; background-color: #ffffff; font-size: 12px; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #8B47FF; padding-bottom: 15px; margin-bottom: 20px; }
          .logo { font-size: 24px; font-weight: bold; color: #8B47FF; }
          .subtitle { font-size: 14px; color: #7F6674; }
          .date-info { text-align: right; font-size: 12px; color: #B9ADB4; }
          .patient { font-size: 15px; font-weight: bold; color: #212121; margin-bottom: 4px; }
          .periode { font-size: 13px; color: #7F6674; margin-bottom: 20px; }
          .content-box { border: 1px solid #E2DBEF; border-radius: 12px; padding: 16px 20px; background-color: #FAF8FC; margin-bottom: 20px; }
          .section-title { font-size: 15px; font-weight: bold; color: #8B47FF; margin: 0 0 10px 0; }
          .stats { display: flex; flex-wrap: wrap; gap: 24px; }
          .stat-valeur { font-size: 20px; font-weight: bold; color: #E256B3; }
          .stat-label { font-size: 11px; color: #7F6674; }
          table { width: 100%; border-collapse: collapse; }
          th { text-align: left; font-size: 11px; color: #7F4DC5; border-bottom: 1px solid #E2DBEF; padding: 6px 4px; }
          td { font-size: 11px; border-bottom: 1px solid #F0EBF7; padding: 6px 4px; vertical-align: top; }
          tr { page-break-inside: avoid; }
          ul { margin: 0; padding-left: 18px; }
          li { margin-bottom: 3px; }
          .vide { color: #B9ADB4; font-style: italic; }
          .avertissement { font-size: 10px; color: #7F6674; font-style: italic; text-align: center; border-top: 1px solid #E2DBEF; padding-top: 10px; margin-top: 24px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="logo">SOREA</div>
            <div class="subtitle">${esc(sousTitre)}</div>
          </div>
          <div class="date-info">
            <strong>Généré le :</strong><br/>
            ${maintenant.toLocaleDateString("fr-FR")} à ${maintenant.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
          </div>
        </div>
        ${nomComplet ? `<div class="patient">${esc(nomComplet)}</div>` : ""}
        ${corps}
        <div class="avertissement">${esc(AVERTISSEMENT)}</div>
        <script>
          window.onload = function() { window.print(); };
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Tableau jour par jour
  const tableauJours = (liste: JourSynthese[]) => {
    if (liste.length === 0) return `<p class="vide">Aucune synthèse enregistrée sur cette période.</p>`;
    const lignes = [...liste]
      .sort((a, b) => a.day.localeCompare(b.day))
      .map((j) => {
        const numero = jourDuCycle(j.day);
        const reperes = modeSansCycle
          ? `<td>${esc(repereJour(j.day) ?? "–")}</td>`
          : `<td>${numero ?? "–"}</td><td>${esc(phaseDuJour(j.day).name)}</td>`;
        return `<tr>
          <td>${formatJour(j.day)}</td>
          ${reperes}
          <td>${esc(j.flow || "–")}</td>
          <td>${esc(j.mood || "–")}</td>
          <td>${esc(j.physicalSymptoms || "–")}</td>
          <td>${esc(j.note || "–")}</td>
        </tr>`;
      })
      .join("");
    const enTetesReperes = modeSansCycle ? "<th>Repère</th>" : "<th>Jour du cycle</th><th>Phase</th>";
    return `<table>
      <thead><tr><th>Date</th>${enTetesReperes}<th>Flux</th><th>Humeur</th><th>Symptômes physiques</th><th>Ressenti</th></tr></thead>
      <tbody>${lignes}</tbody>
    </table>`;
  };

  // Valeurs les plus fréquentes (symptômes, humeurs, flux)
  const blocFrequences = (liste: JourSynthese[]) => {
    const rubrique = (titre: string, valeurs: [string, number][]) =>
      `<div style="flex: 1; min-width: 150px;">
        <div style="font-weight: bold; color: #7F4DC5; margin-bottom: 6px;">${titre}</div>
        ${
          valeurs.length
            ? `<ul>${valeurs
                .slice(0, 8)
                .map(([v, n]) => `<li>${esc(v)} : ${n} jour${n > 1 ? "s" : ""}</li>`)
                .join("")}</ul>`
            : `<span class="vide">Rien de renseigné</span>`
        }
      </div>`;
    return `<div class="content-box">
      <div class="section-title">Ce qui revient le plus souvent</div>
      <div class="stats" style="align-items: flex-start;">
        ${rubrique("Symptômes physiques", compter(liste, "physicalSymptoms"))}
        ${rubrique("Humeur", compter(liste, "mood"))}
        ${rubrique("Flux", compter(liste, "flow"))}
      </div>
    </div>`;
  };

  const telechargerCycle = (cycle: Cycle) => {
    const corps = `
      <div class="periode">${esc(titreCycle(cycle))} — ${esc(detailCycle(cycle))}</div>
      ${blocFrequences(cycle.jours)}
      <div class="section-title">Détail jour par jour</div>
      ${tableauJours(cycle.jours)}
    `;
    ouvrirDocument(
      modeSansCycle ? `SOREA_Synthese_${cycle.start}` : `SOREA_Synthese_cycle_${cycle.start}`,
      modeSansCycle ? "Synthèse du suivi" : "Synthèse de cycle",
      corps
    );
  };

  // Rapport médecin hors cycle (grossesse, ménopause, post-partum) : les 3, 6 ou 12 derniers mois
  const telechargerRapportSansCycle = () => {
    const debut = decalerMois(debutMois(aujourdhui), -(nbCyclesRapport - 1));
    const joursRapport = jours.filter((j) => j.day >= debut && j.day <= aujourdhui);

    const lignesSituation: string[] = [];
    if (situation.type === "enceinte") {
      lignesSituation.push("Situation : enceinte");
      if (situation.ddr) {
        const ecart = dayDiff(situation.ddr, aujourdhui);
        lignesSituation.push(`Date des dernières règles (DDR) : ${formatJour(situation.ddr)}`);
        lignesSituation.push(`Terme prévu : ${formatJour(addDays(situation.ddr, 280))}`);
        if (ecart >= 0 && ecart <= 294) lignesSituation.push(`Aujourd’hui : ${Math.floor(ecart / 7)} SA`);
      }
    } else if (situation.type === "postpartum") {
      lignesSituation.push("Situation : post-partum");
      if (situation.accouchement) lignesSituation.push(`Date de l’accouchement : ${formatJour(situation.accouchement)}`);
      lignesSituation.push(`Allaitement : ${situation.allaitement ? "oui" : "non"}`);
    } else {
      lignesSituation.push("Situation : ménopausée");
    }

    const lignesMois = groupesParMois(joursRapport)
      .map((g) => {
        const principaux = compter(g.jours, "physicalSymptoms").slice(0, 3).map(([v]) => esc(v)).join(", ");
        return `<tr><td>${esc(g.titre)}</td><td>${g.jours.length}</td><td>${principaux || "–"}</td></tr>`;
      })
      .join("");

    const corps = `
      <div class="periode">Du ${formatJour(debut)} au ${formatJour(aujourdhui)} · ${joursRapport.length} synthèse${joursRapport.length > 1 ? "s" : ""}</div>
      <div class="content-box">
        <div class="section-title">Situation</div>
        <ul>${lignesSituation.map((l) => `<li>${esc(l)}</li>`).join("")}</ul>
      </div>
      <div class="section-title">Mois par mois</div>
      ${
        lignesMois
          ? `<table style="margin-bottom: 20px;">
              <thead><tr><th>Mois</th><th>Jours renseignés</th><th>Symptômes physiques les plus fréquents</th></tr></thead>
              <tbody>${lignesMois}</tbody>
            </table>`
          : `<p class="vide">Aucune synthèse enregistrée sur cette période.</p>`
      }
      ${blocFrequences(joursRapport)}
    `;
    ouvrirDocument(`SOREA_Rapport_medecin_${aujourdhui}`, "Rapport de suivi pour le médecin", corps);
  };

  const telechargerPeriode = (liste: JourSynthese[]) => {
    const corps = `
      <div class="periode">Du ${formatJour(periodeDu)} au ${formatJour(periodeAu)} · ${liste.length} synthèse${liste.length > 1 ? "s" : ""}</div>
      ${blocFrequences(liste)}
      <div class="section-title">Détail jour par jour</div>
      ${tableauJours(liste)}
    `;
    ouvrirDocument(`SOREA_Synthese_${periodeDu}_${periodeAu}`, `Synthèse du ${titreSuivi(situation.type).replace("Suivi", "suivi")}`, corps);
  };

  const telechargerRapportMedecin = () => {
    if (modeSansCycle) {
      telechargerRapportSansCycle();
      return;
    }
    const cyclesReels = cycles.filter((c) => !c.avantSuivi);
    const termines = cyclesReels.filter((c) => !c.enCours);
    const retenus = termines.slice(-nbCyclesRapport);
    const enCours = cyclesReels.find((c) => c.enCours);

    const durees = retenus.map((c) => c.dureeCycle!).filter((n) => n > 0);
    const regles = retenus.map((c) => c.dureeRegles!).filter((n) => n > 0);
    const reglesReelles = retenus.filter((c) => !c.reglesEstimees).length;
    const joursRapport = [...retenus, ...(enCours ? [enCours] : [])].flatMap((c) => c.jours);

    const stat = (valeur: string, label: string) =>
      `<div><div class="stat-valeur">${valeur}</div><div class="stat-label">${label}</div></div>`;

    const resume = retenus.length
      ? `<div class="content-box">
          <div class="section-title">En résumé</div>
          <div class="stats">
            ${stat(`${moyenne(durees)} j`, "Durée moyenne du cycle")}
            ${stat(`${Math.min(...durees)} – ${Math.max(...durees)} j`, "Cycle le plus court – le plus long")}
            ${stat(`${Math.max(...durees) - Math.min(...durees)} j`, "Écart entre les cycles")}
            ${stat(`${moyenne(regles)} j`, `Durée moyenne des règles${reglesReelles < retenus.length ? " (en partie estimée)" : ""}`)}
          </div>
        </div>`
      : `<div class="content-box"><p class="vide">Pas encore de cycle terminé enregistré : les moyennes apparaîtront après les prochaines règles.</p></div>`;

    const lignesCycles = [...retenus, ...(enCours ? [enCours] : [])]
      .map(
        (c) => `<tr>
          <td>${formatJour(c.start)}</td>
          <td>${c.enCours ? "en cours" : formatJour(c.end!)}</td>
          <td>${c.enCours ? `${dayDiff(c.start, aujourdhui) + 1} j (en cours)` : `${c.dureeCycle} j`}</td>
          <td>${c.dureeRegles ? `${c.dureeRegles} j${c.reglesEstimees ? " (estimé)" : ""}` : "–"}</td>
          <td>${c.jours.length}</td>
        </tr>`
      )
      .join("");

    const corps = `
      <div class="periode">
        ${retenus.length} cycle${retenus.length > 1 ? "s" : ""} terminé${retenus.length > 1 ? "s" : ""}
        ${retenus.length < nbCyclesRapport ? ` (sur les ${nbCyclesRapport} demandés : historique plus court)` : ""}
        ${enCours ? " + le cycle en cours" : ""}
      </div>
      ${resume}
      <div class="section-title">Cycles</div>
      ${
        lignesCycles
          ? `<table style="margin-bottom: 20px;">
              <thead><tr><th>Début des règles</th><th>Fin du cycle</th><th>Durée du cycle</th><th>Durée des règles</th><th>Jours renseignés</th></tr></thead>
              <tbody>${lignesCycles}</tbody>
            </table>`
          : `<p class="vide">Aucun cycle enregistré.</p>`
      }
      ${blocFrequences(joursRapport)}
    `;
    ouvrirDocument(`SOREA_Rapport_medecin_${aujourdhui}`, "Rapport de suivi menstruel pour le médecin", corps);
  };

  // ── Affichage ──────────────────────────────────────────────────────────────
  const carteJour = (j: JourSynthese) => {
    // Hors cycle (grossesse, ménopause, post-partum) : pas de phase menstruelle
    const phase = modeSansCycle ? null : phaseDuJour(j.day);
    const repere = repereJour(j.day);
    const vide = !j.flow && !j.mood && !j.physicalSymptoms && !j.note;
    return (
      <div key={j.id} className="rounded-2xl border border-[#E2DBEF] bg-[#FAF8FC] p-4 flex flex-col gap-3 min-w-0 break-words">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-bold text-gray-900">{formatJourLong(j.day)}</p>
            {repere && <p className="text-xs text-gray-500">{repere}</p>}
          </div>
          {phase && (
            <div className="flex items-center gap-2 shrink-0">
              <img src={phase.icon} alt={phase.name} className="w-5 h-5 object-contain" />
              <span className="text-xs font-bold text-gray-900">{phase.name}</span>
            </div>
          )}
        </div>
        {vide ? (
          <p className="text-xs italic text-gray-400">Aucun symptôme renseigné ce jour-là.</p>
        ) : (
          <div className="flex flex-col gap-1 text-sm">
            {j.flow && (
              <p>
                <span className="font-bold text-[#7F6674]">Flux : </span>
                <span className="text-[#E256B3]">{j.flow}</span>
              </p>
            )}
            {j.mood && (
              <p>
                <span className="font-bold text-[#7F6674]">Humeur : </span>
                <span className="text-gray-800">{j.mood}</span>
              </p>
            )}
            {j.physicalSymptoms && (
              <p>
                <span className="font-bold text-[#7F6674]">Symptômes : </span>
                <span className="text-gray-800">{j.physicalSymptoms}</span>
              </p>
            )}
            {j.note && (
              <p>
                <span className="font-bold text-[#7F6674]">Ressenti : </span>
                <span className="text-gray-800 whitespace-pre-line">{j.note}</span>
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  const boutonTelecharger = (onClick: () => void, title: string) => (
    <button
      type="button"
      onClick={onClick}
      className="text-[#E256B3] hover:text-[#c73e99] hover:scale-110 transition-all cursor-pointer p-2"
      title={title}
    >
      <Download className="w-6 h-6" />
    </button>
  );

  const nbCyclesTermines = cycles.filter((c) => !c.avantSuivi && !c.enCours).length;

  return (
    <div className="space-y-6 pt-20 px-4 max-w-2xl mx-auto pb-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black section-title">{titreSuivi(situation.type)}</h1>
          <p className="text-foreground/60 mt-2">
            {situation.type === "enceinte" && situation.ddr
              ? "Retrouvez l’historique de vos synthèses, trimestre par trimestre."
              : modeSansCycle
              ? "Retrouvez l’historique de vos synthèses, mois par mois."
              : "Retrouvez l’historique de vos synthèses, cycle par cycle."}
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
              onClick={() => setSortOrder(prev => prev === "Plus récents" ? "Plus anciens" : "Plus récents")}
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
          <span className="text-sm font-medium text-gray-700 pr-2">{sortOrder} d&apos;abord</span>
        </div>
      </header>

      {/* Rapport pour le médecin : synthèse des derniers cycles */}
      <div className="w-full bg-[#FAF8FC] rounded-xl border border-[#8B47FF] p-6 shadow-sm flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-[#8B47FF]">Rapport pour le médecin</h3>
            <p className="text-sm text-gray-700">
              {modeSansCycle
                ? "Votre situation, vos synthèses mois par mois et les symptômes fréquents sur vos derniers mois."
                : "Durées de vos cycles et de vos règles, écarts et symptômes fréquents sur vos derniers cycles."}
            </p>
          </div>
          {boutonTelecharger(telechargerRapportMedecin, "Télécharger le rapport (PDF A4)")}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-white border border-[#8B47FF] rounded-full p-1 shadow-xs">
            {([3, 6, 12] as const).map((nb) => {
              const isActive = nbCyclesRapport === nb;
              return (
                <button
                  key={nb}
                  type="button"
                  onClick={() => setNbCyclesRapport(nb)}
                  className={`relative px-5 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 cursor-pointer ${
                    isActive ? "text-gray-900 font-semibold" : "text-gray-700 hover:text-purple-600"
                  }`}
                >
                  {isActive && (
                    <span className="absolute inset-0 bg-[#E3D5FF] rounded-full blur-[2px] opacity-90 -z-0 transition-all duration-300" />
                  )}
                  <span className="relative z-10">{nb} {modeSansCycle ? "mois" : "cycles"}</span>
                </button>
              );
            })}
          </div>
          <span className="text-xs text-gray-500">
            {modeSansCycle
              ? `${jours.length} synthèse${jours.length > 1 ? "s" : ""} enregistrée${jours.length > 1 ? "s" : ""}`
              : `${nbCyclesTermines} cycle${nbCyclesTermines > 1 ? "s" : ""} terminé${nbCyclesTermines > 1 ? "s" : ""} enregistré${nbCyclesTermines > 1 ? "s" : ""}`}
          </span>
        </div>
      </div>

      {chargement ? (
        <div className="text-center py-8 text-gray-500">Chargement de vos synthèses...</div>
      ) : activeTab === "Liste" ? (
        cyclesAffiches.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Aucune synthèse enregistrée. Enregistrez vos symptômes depuis le calendrier pour les retrouver ici.
          </div>
        ) : (
          <div className="space-y-4">
            {cyclesAffiches.map((cycle) => {
              const ouvert = cyclesOuverts.includes(cycle.key);
              const phaseDebut = !cycle.avantSuivi && !modeSansCycle ? phaseDuJour(cycle.start) : null;
              // Rappel : tant que la fin des règles n'est pas indiquée, leur durée est estimée.
              // « Mes règles sont finies » n'est disponible que pendant les règles, à partir du 2e jour.
              const joursDepuisDebut = dayDiff(cycle.start, aujourdhui);
              const rappelFinRegles =
                !modeSansCycle && cycle.enCours && cycle.reglesEstimees && joursDepuisDebut >= 1 &&
                joursDepuisDebut < (cycle.dureeRegles ?? profile?.periodLength ?? 5);
              return (
                <div key={cycle.key} className="w-full bg-white rounded-xl border-2 border-[#8B47FF] p-6 shadow-sm flex flex-col gap-4 transition-all animate-in fade-in duration-300">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <h3 className="text-xl font-bold text-[#8B47FF]">{titreCycle(cycle)}</h3>
                      <p className="text-sm font-semibold text-gray-800">{detailCycle(cycle)}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      {boutonTelecharger(
                        () => telechargerCycle(cycle),
                        modeSansCycle ? "Télécharger la synthèse (PDF A4)" : "Télécharger la synthèse du cycle (PDF A4)"
                      )}
                      <span className="text-xs text-gray-500">
                        {cycle.jours.length} synthèse{cycle.jours.length > 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3">
                    {phaseDebut ? (
                      <div className="flex items-center gap-3 py-1">
                        <img src={phaseDebut.icon} alt={phaseDebut.name} className="w-6 h-6 object-contain" />
                        <span className="text-sm font-bold text-gray-900">Début : {phaseDebut.name}</span>
                      </div>
                    ) : (
                      <span />
                    )}
                    {cycle.jours.length > 0 && (
                      <button
                        type="button"
                        onClick={() => basculerCycle(cycle.key)}
                        className="flex items-center gap-2 text-sm font-semibold text-[#8B47FF] hover:text-[#7535e6] transition-colors cursor-pointer"
                      >
                        {ouvert ? "Masquer les jours" : `Voir les ${cycle.jours.length} jour${cycle.jours.length > 1 ? "s" : ""}`}
                        <img
                          src="/image_icone/ArrowCarousel.svg"
                          alt=""
                          style={{ rotate: ouvert ? "180deg" : "0deg" }}
                          className="w-4 h-4 object-contain transition-all"
                        />
                      </button>
                    )}
                  </div>

                  {rappelFinRegles && (
                    <p className="text-xs text-[#7F6674] bg-[#FAF8FC] border border-[#E2DBEF] rounded-xl p-3">
                      La durée de vos règles est estimée. Le jour où elles s’arrêtent, cliquez sur
                      <span className="font-bold text-[#8B47FF]"> « Mes règles sont finies » </span>
                      dans le calendrier (onglet Paramètre du jour) : vos synthèses et votre rapport seront plus précis.
                    </p>
                  )}

                  {ouvert && (
                    <div className="flex flex-col gap-3 pt-3 border-t border-gray-100">
                      {trierJours(cycle.jours).map(carteJour)}
                    </div>
                  )}
                </div>
              );
            })}
            <div className="text-[11px] text-gray-500 italic text-center">{AVERTISSEMENT}</div>
          </div>
        )
      ) : (
        (() => {
          // Onglet « Par date » : une période du … au … (les flèches avancent ou reculent d'un mois)
          const periodeValide = periodeDu <= periodeAu;
          const joursPeriode = periodeValide ? jours.filter((j) => j.day >= periodeDu && j.day <= periodeAu) : [];
          const moisComplet = periodeDu === debutMois(periodeDu) && periodeAu === finMois(periodeDu);
          const titrePeriode = moisComplet
            ? majuscule(enDate(periodeDu).toLocaleDateString("fr-FR", { month: "long", year: "numeric" }))
            : `Du ${formatJour(periodeDu)} au ${formatJour(periodeAu)}`;
          const changerMois = (n: number) => {
            const debut = decalerMois(periodeDu, n);
            setPeriodeDu(debut);
            setPeriodeAu(finMois(debut));
          };

          return (
            <div className="space-y-6">
              <div className="flex items-center justify-between pt-2">
                <h2 className="text-2xl font-bold text-[#8B47FF]">{titrePeriode}</h2>

                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => changerMois(-1)}
                    className="p-1 transition-all cursor-pointer hover:scale-110"
                    title="Mois précédent"
                  >
                    <img
                      src="/image_icone/ArrowCarousel.svg"
                      alt="Précédent"
                      style={{ rotate: "90deg" }}
                      className="w-6 h-6 object-contain"
                    />
                  </button>

                  <button
                    type="button"
                    onClick={() => changerMois(1)}
                    className="p-1 transition-all cursor-pointer hover:scale-110"
                    title="Mois suivant"
                  >
                    <img
                      src="/image_icone/ArrowCarousel.svg"
                      alt="Suivant"
                      className="w-6 h-6 object-contain -rotate-90"
                    />
                  </button>
                </div>
              </div>

              {/* Choix libre de la période */}
              <div className="w-full bg-white rounded-xl border-2 border-[#8B47FF] p-6 shadow-sm flex flex-col gap-4">
                <div className="flex flex-wrap items-end gap-4">
                  <label className="flex flex-col gap-1 text-sm font-bold text-[#7F6674]">
                    Du
                    <input
                      type="date"
                      value={periodeDu}
                      max={periodeAu}
                      onChange={(e) => e.target.value && setPeriodeDu(e.target.value)}
                      className="px-4 py-2 rounded-full border border-[#8B47FF] bg-white text-sm font-medium text-gray-800 outline-none focus:bg-[#F4EBFF] cursor-pointer"
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-sm font-bold text-[#7F6674]">
                    Au
                    <input
                      type="date"
                      value={periodeAu}
                      min={periodeDu}
                      onChange={(e) => e.target.value && setPeriodeAu(e.target.value)}
                      className="px-4 py-2 rounded-full border border-[#8B47FF] bg-white text-sm font-medium text-gray-800 outline-none focus:bg-[#F4EBFF] cursor-pointer"
                    />
                  </label>
                  <div className="flex items-center gap-2 ml-auto">
                    <span className="text-xs text-gray-500">
                      {joursPeriode.length} synthèse{joursPeriode.length > 1 ? "s" : ""}
                    </span>
                    {boutonTelecharger(() => telechargerPeriode(joursPeriode), "Télécharger la période (PDF A4)")}
                  </div>
                </div>
                {!periodeValide && (
                  <p className="text-sm text-[#E256B3]">La date de début doit être avant la date de fin.</p>
                )}
              </div>

              {joursPeriode.length === 0 ? (
                <div className="text-center py-8 text-gray-500">Aucune synthèse enregistrée sur cette période.</div>
              ) : (
                <div className="flex flex-col gap-3">{trierJours(joursPeriode).map(carteJour)}</div>
              )}

              <div className="text-[11px] text-gray-500 italic text-center">{AVERTISSEMENT}</div>
            </div>
          );
        })()
      )}
    </div>
  );
}
