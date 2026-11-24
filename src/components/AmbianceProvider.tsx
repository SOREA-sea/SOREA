"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

// Les fichiers sont dans public/sons/ : « id » = nom du fichier sans « .mp3 »
export const SONS = [
  { id: "Droplet", titre: "Gouttes de pluie" },
  { id: "Rain", titre: "Pluie douce" },
  { id: "Fireplace", titre: "Feu de cheminée" },
  { id: "CalmZenMusic", titre: "Musique zen & calme" },
  { id: "Birdsong", titre: "Chants d'oiseaux apaisants" },
  { id: "VacuumCleaner", titre: "Aspirateur" },
  { id: "ShimmeringGlitter", titre: "Paillettes scintillantes" },
  { id: "KalimbaLullaby", titre: "Berceuse kalimba" },
  { id: "Space", titre: "Ambiance espace" },
  { id: "432Hz", titre: "Musique 432 Hz" },
];

const CLE_SONS = "sorea_ambiance_sons"; // sons actifs et leur volume, ex : {"Rain":0.7,"Fireplace":0.4}
const VOLUME_PAR_DEFAUT = 0.7;
const PAUSE_ENTRE_LECTURES_MS = 3000; // pause avant de relancer un son terminé

type Volumes = Record<string, number>;

interface AmbianceContextType {
  sonsActifs: Volumes; // id du son → son volume (0 à 1) ; un son absent n'est pas en cours
  erreur: string | null;
  basculer: (id: string) => void;
  arreter: () => void; // arrête tous les sons
  changerVolume: (id: string, v: number) => void;
}

const AmbianceContext = createContext<AmbianceContextType | null>(null);

export function useAmbiance() {
  const ctx = useContext(AmbianceContext);
  if (!ctx) throw new Error("useAmbiance doit être utilisé à l'intérieur de <AmbianceProvider>");
  return ctx;
}

// À placer dans le layout racine : il n'est jamais démonté quand on change de page,
// donc les sons continuent de jouer pendant toute la navigation.
export function AmbianceProvider({ children }: { children: React.ReactNode }) {
  const audiosRef = useRef<Map<string, HTMLAudioElement>>(new Map());
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  const volumesRef = useRef<Volumes>({});

  const [sonsActifs, setSonsActifs] = useState<Volumes>({});
  const [erreur, setErreur] = useState<string | null>(null);

  const sauvegarder = useCallback(() => {
    try {
      localStorage.setItem(CLE_SONS, JSON.stringify(volumesRef.current));
    } catch {}
  }, []);

  const effacerTimer = useCallback((id: string) => {
    const t = timersRef.current.get(id);
    if (t) clearTimeout(t);
    timersRef.current.delete(id);
  }, []);

  // Arrête un son et le retire de la liste des sons actifs
  const retirer = useCallback(
    (id: string, sauver = true) => {
      effacerTimer(id);
      audiosRef.current.get(id)?.pause();
      audiosRef.current.delete(id);
      delete volumesRef.current[id];
      setSonsActifs({ ...volumesRef.current });
      if (sauver) sauvegarder();
    },
    [effacerTimer, sauvegarder]
  );

  // Le navigateur refuse de lancer un son sans action de l'utilisateur (ex : après un rechargement) :
  // on attend alors le premier clic / la première touche pour le démarrer.
  const attendreInteraction = useCallback((audio: HTMLAudioElement, id: string) => {
    const reprendre = () => {
      window.removeEventListener("pointerdown", reprendre);
      window.removeEventListener("keydown", reprendre);
      if (audiosRef.current.get(id) === audio) audio.play().catch(() => {});
    };
    window.addEventListener("pointerdown", reprendre);
    window.addEventListener("keydown", reprendre);
  }, []);

  const jouer = useCallback(
    (audio: HTMLAudioElement, id: string) => {
      audio.play().catch((e) => {
        if (audiosRef.current.get(id) !== audio) return;
        if (e && e.name === "NotAllowedError") {
          attendreInteraction(audio, id);
          return;
        }
        console.error("Lecture impossible :", e);
        retirer(id);
        setErreur(`Impossible de lire ce son. Vérifie que le fichier /sons/${id}.mp3 existe.`);
      });
    },
    [attendreInteraction, retirer]
  );

  const lancer = useCallback(
    (id: string, volume: number) => {
      effacerTimer(id);
      audiosRef.current.get(id)?.pause();

      const audio = new Audio(`/sons/${id}.mp3`);
      audio.volume = volume;
      // Quand le son se termine : 3 secondes de pause, puis il recommence
      audio.onended = () => {
        if (audiosRef.current.get(id) !== audio) return;
        timersRef.current.set(
          id,
          setTimeout(() => {
            if (audiosRef.current.get(id) !== audio) return;
            audio.currentTime = 0;
            jouer(audio, id);
          }, PAUSE_ENTRE_LECTURES_MS)
        );
      };
      audiosRef.current.set(id, audio);
      jouer(audio, id);
    },
    [effacerTimer, jouer]
  );

  const basculer = useCallback(
    (id: string) => {
      setErreur(null);
      // Re-clic sur un son en cours : on l'arrête (les autres continuent)
      if (volumesRef.current[id] !== undefined) {
        retirer(id);
        return;
      }
      volumesRef.current[id] = VOLUME_PAR_DEFAUT;
      setSonsActifs({ ...volumesRef.current });
      sauvegarder();
      lancer(id, VOLUME_PAR_DEFAUT);
    },
    [retirer, sauvegarder, lancer]
  );

  const arreter = useCallback(() => {
    Object.keys(volumesRef.current).forEach((id) => retirer(id, false));
    sauvegarder();
  }, [retirer, sauvegarder]);

  const changerVolume = useCallback(
    (id: string, v: number) => {
      if (volumesRef.current[id] === undefined) return;
      volumesRef.current[id] = v;
      const audio = audiosRef.current.get(id);
      if (audio) audio.volume = v;
      setSonsActifs({ ...volumesRef.current });
      sauvegarder();
    },
    [sauvegarder]
  );

  // Au chargement de l'application : on retrouve les sons et leurs volumes (même après déconnexion / reconnexion)
  useEffect(() => {
    try {
      let enregistres: Volumes = {};
      const brut = localStorage.getItem(CLE_SONS);
      if (brut) {
        enregistres = JSON.parse(brut);
      } else {
        // Ancien format (un seul son) : on le reprend une fois
        const ancienSon = localStorage.getItem("sorea_ambiance_son");
        if (ancienSon) {
          const ancienVolume = parseFloat(localStorage.getItem("sorea_ambiance_volume") ?? "");
          enregistres = { [ancienSon]: Number.isNaN(ancienVolume) ? VOLUME_PAR_DEFAUT : ancienVolume };
        }
      }

      const restaures: Volumes = {};
      SONS.forEach((s) => {
        const v = enregistres[s.id];
        if (typeof v === "number" && v >= 0 && v <= 1) restaures[s.id] = v;
      });
      volumesRef.current = restaures;
      setSonsActifs({ ...restaures });
      Object.entries(restaures).forEach(([id, v]) => lancer(id, v));
    } catch {}

    const audios = audiosRef.current;
    const timers = timersRef.current;
    return () => {
      timers.forEach((t) => clearTimeout(t));
      timers.clear();
      audios.forEach((a) => a.pause());
      audios.clear();
    };
  }, [lancer]);

  return (
    <AmbianceContext.Provider value={{ sonsActifs, erreur, basculer, arreter, changerVolume }}>
      {children}
    </AmbianceContext.Provider>
  );
}