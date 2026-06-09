"use client";

import React, { useRef, useState, useEffect } from "react";
import confetti from "canvas-confetti";

const listeDeTaches = [
    { text: "Écrire 3 phrases positives sur une feuille" },
    { text: "Prendre 5 minutes pour méditer" },
    { text: "Boire un grand verre d'eau" },
    { text: "Faire quelques étirements doux" },
    { text: "Écouter ta musique préférée" },
    { text: "Faire un compliment à quelqu'un" },
    { text: "Prendre 10 grandes respirations" },
    { text: "Lire quelques pages d'un livre" },
    { text: "Écrire dans ton journal" },
    { text: "Faire une pause sans écran" },
];

// On utilise "offset" pour redresser uniquement les fichiers SVG dessinés de travers
const listeImages = [
    { url: "/image_wheel/checklist 1.svg", offset: 0 },
    { url: "/image_wheel/dna 1.svg", offset: 45 },
    { url: "/image_wheel/hearts 1.svg", offset: 0 },
    { url: "/image_wheel/hug 1.svg", offset: 0 },
    { url: "/image_wheel/light-bulb 1.svg", offset: 0 },
    { url: "/image_wheel/lightning 1.svg", offset: 40 }, // Correction de l'éclair
    { url: "/image_wheel/lotus 1.svg", offset: 0 },
    { url: "/image_wheel/mirror 1.png", offset: 0 },
    { url: "/image_wheel/notebook 1.svg", offset: 45 }, // Correction du livre
    { url: "/image_wheel/sun 1.svg", offset: 0 },
];

const nombreDeCases = 10;
const centreX = 151.5;
const centreY = 151.5;
const rayonRoue = 140;

const raisonsIndisponibilite = [
    "J'ai du mal à me lancer aujourd'hui",
    "Ce défi ne correspond pas à mon énergie du moment",
];

type ThemeCouleurs = {
    clair: string;
    fonce: string;
    bordure: string;
    pointeur: string;
    particules: string[];
};

const themes: Record<string, ThemeCouleurs> = {
    original: {
        clair: "#FEF0F9",
        fonce: "#BA98F4",
        bordure: "#DBCEEF",
        pointeur: "#BA98F4",
        particules: ["#BA98F4", "#DBCEEF", "#ffffff", "#f9c6e8", "#c084fc", "#e879f9"]
    },
    sorea_dark: {
        clair: "#FEF0F9",
        fonce: "#5A37AC",
        bordure: "#BA98F4",
        pointeur: "#5A37AC",
        particules: ["#5A37AC", "#BA98F4", "#ffffff", "#FEF0F9", "#DBCEEF"]
    }
};

function effetRalentissement(progression: number) {
    return 1 - Math.pow(1 - progression, 4);
}

function dessinerUneCase(index: number) {
    const angleParCase = (2 * Math.PI) / nombreDeCases;
    const angleDepart = index * angleParCase - Math.PI / 2;
    const angleFin = angleDepart + angleParCase;
    const pointX1 = centreX + rayonRoue * Math.cos(angleDepart);
    const pointY1 = centreY + rayonRoue * Math.sin(angleDepart);
    const pointX2 = centreX + rayonRoue * Math.cos(angleFin);
    const pointY2 = centreY + rayonRoue * Math.sin(angleFin);
    return `M ${centreX} ${centreY} L ${pointX1} ${pointY1} A ${rayonRoue} ${rayonRoue} 0 0 1 ${pointX2} ${pointY2} Z`;
}

function calculerPositionImage(index: number) {
    const angleParCase = (2 * Math.PI) / nombreDeCases;
    const angleMilieu = index * angleParCase - Math.PI / 2 + angleParCase / 2;
    const distanceCentre = rayonRoue * 0.65;
    return {
        x: Math.round(centreX + distanceCentre * Math.cos(angleMilieu)),
        y: Math.round(centreY + distanceCentre * Math.sin(angleMilieu)),
    };
}

function lancerConfettis(couleurs: string[]) {
    confetti({ particleCount: 80, angle: 60, spread: 70, origin: { x: 0, y: 0.6 }, colors: couleurs, scalar: 1.1, zIndex: 9999 });
    confetti({ particleCount: 80, angle: 120, spread: 70, origin: { x: 1, y: 0.6 }, colors: couleurs, scalar: 1.1, zIndex: 9999 });
    confetti({ particleCount: 60, spread: 90, origin: { x: 0.5, y: 0.5 }, colors: couleurs, scalar: 0.9, zIndex: 9999 });
}

export default function RoueDuBienEtre() {
    const referenceRoue = useRef<HTMLDivElement>(null);
    const referencePointeur = useRef<HTMLDivElement>(null);
    const animationAttenteRef = useRef<number | null>(null);

    const [themeActif, setThemeActif] = useState<string>("original");
    const [estEnTrainDeTourner, setEstEnTrainDeTourner] = useState(false);
    const [afficherFenetreResultat, setAfficherFenetreResultat] = useState(false);
    const [tacheGagnante, setTacheGagnante] = useState<{ text: string; icon: string } | null>(null);
    const [raisonSelectionnee, setRaisonSelectionnee] = useState("");
    const [raisonPersonnalisee, setRaisonPersonnalisee] = useState("");
    const [indexMiseEnValeur, setIndexMiseEnValeur] = useState<number | null>(null);
    const [choixUtilisateur, setChoixUtilisateur] = useState<'attente' | 'oui' | 'non'>('attente');

    const angleActuel = useRef(0);
    const minuteurAnimationRebond = useRef<ReturnType<typeof setTimeout> | null>(null);

    const theme = themes[themeActif];

    useEffect(() => {
        if (estEnTrainDeTourner || afficherFenetreResultat) {
            if (animationAttenteRef.current) cancelAnimationFrame(animationAttenteRef.current);
            return;
        }
        const faireTournerDoucement = () => {
            angleActuel.current += 0.15;
            if (referenceRoue.current) {
                referenceRoue.current.style.transform = `rotate(${angleActuel.current}deg)`;
            }
            animationAttenteRef.current = requestAnimationFrame(faireTournerDoucement);
        };
        animationAttenteRef.current = requestAnimationFrame(faireTournerDoucement);
        return () => {
            if (animationAttenteRef.current) cancelAnimationFrame(animationAttenteRef.current);
        };
    }, [estEnTrainDeTourner, afficherFenetreResultat]);

    const tournerLaRoue = () => {
        if (estEnTrainDeTourner) return;
        setEstEnTrainDeTourner(true);
        setAfficherFenetreResultat(false);
        setRaisonSelectionnee("");
        setRaisonPersonnalisee("");
        setIndexMiseEnValeur(null);
        setChoixUtilisateur('attente');

        const indexGagnantCible = Math.floor(Math.random() * nombreDeCases);
        const angleCible = 342 - (indexGagnantCible * (360 / nombreDeCases));
        const degresDeDepart = angleActuel.current;
        const moduloDepart = ((degresDeDepart % 360) + 360) % 360;
        let difference = angleCible - moduloDepart;
        if (difference <= 0) difference += 360;
        const toursSupplementaires = Math.floor(5 + Math.random() * 5) * 360;
        const degresCibles = degresDeDepart + toursSupplementaires + difference;
        const dureeAnimationEnMs = 6000;
        let tempsDebut: number | null = null;
        let ancienPointDePassage = Math.floor(degresDeDepart / (360 / nombreDeCases));

        const animerLaRoue = (tempsActuel: number) => {
            if (!tempsDebut) tempsDebut = tempsActuel;
            const tempsEcoule = tempsActuel - tempsDebut;
            const pourcentageProgression = Math.min(tempsEcoule / dureeAnimationEnMs, 1);
            const progressionRalentie = effetRalentissement(pourcentageProgression);

            angleActuel.current = degresDeDepart + (degresCibles - degresDeDepart) * progressionRalentie;

            if (referenceRoue.current) {
                referenceRoue.current.style.transform = `rotate(${angleActuel.current}deg)`;
            }

            const nouveauPointDePassage = Math.floor(angleActuel.current / (360 / nombreDeCases));
            if (nouveauPointDePassage > ancienPointDePassage) {
                const pointeur = referencePointeur.current;
                if (pointeur) {
                    pointeur.classList.remove("bump");
                    void pointeur.offsetWidth;
                    pointeur.classList.add("bump");
                    if (minuteurAnimationRebond.current) clearTimeout(minuteurAnimationRebond.current);
                    minuteurAnimationRebond.current = setTimeout(() => pointeur.classList.remove("bump"), 60);
                }
                ancienPointDePassage = nouveauPointDePassage;
            }

            if (pourcentageProgression < 1) {
                requestAnimationFrame(animerLaRoue);
            } else {
                setEstEnTrainDeTourner(false);
                setIndexMiseEnValeur(indexGagnantCible);
                setTimeout(() => {
                    setTacheGagnante({ text: listeDeTaches[indexGagnantCible].text, icon: listeImages[indexGagnantCible].url });
                    setAfficherFenetreResultat(true);
                    lancerConfettis(theme.particules);
                }, 400);
            }
        };

        requestAnimationFrame(animerLaRoue);
    };

    const reinitialiserJeu = () => {
        setAfficherFenetreResultat(false);
        setIndexMiseEnValeur(null);
        setChoixUtilisateur('attente');
    };

    return (
        <div className="w-full flex flex-col items-center py-12 mb-24 overflow-x-hidden" style={{ fontFamily: "'Poppins', sans-serif" }}>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400&family=Poppins:wght@400;600;700&display=swap" rel="stylesheet" />
            <style>{`
                .pointer-wrap { position: absolute; top: -24px; left: 50%; margin-left: -12px; width: 24px; height: 54px; z-index: 20; transform-origin: 12px 8px; transition: transform 0.05s ease-out; }
                .pointer-wrap.bump { transform: rotate(-28deg); }
                .pointer-circle { width: 16px; height: 16px; border-radius: 50%; margin: 0 auto; border: 3px solid #fff; box-shadow: 0 2px 6px rgba(0,0,0,0.2); position: relative; z-index: 2; transition: background-color 0.5s ease; }
                .pointer-tri { width: 0; height: 0; border-left: 10px solid transparent; border-right: 10px solid transparent; margin: -4px auto 0; filter: drop-shadow(0 2px 3px rgba(0,0,0,0.15)); transition: border-top-color 0.5s ease; }
                @keyframes slideInRight { 0% { transform: translateX(50px); opacity: 0; } 100% { transform: translateX(0); opacity: 1; } }
                .card-resultat { animation: slideInRight 0.5s cubic-bezier(0.17,0.67,0.1,1) forwards; }
            `}</style>

            {/* Sélecteur de thème */}
            <div className="flex gap-4 mb-8">
                <button
                    onClick={() => setThemeActif("original")}
                    className={`px-4 py-2 rounded-full font-semibold transition-all ${themeActif === "original" ? "opacity-100 scale-105 shadow-md" : "opacity-50"}`}
                    style={{ backgroundColor: themes.original.clair, color: themes.original.fonce, border: `2px solid ${themes.original.fonce}` }}
                >
                    Thème SOREA
                </button>
                <button
                    onClick={() => setThemeActif("sorea_dark")}
                    className={`px-4 py-2 rounded-full font-semibold transition-all ${themeActif === "sorea_dark" ? "opacity-100 scale-105 shadow-md" : "opacity-50"}`}
                    style={{ backgroundColor: themes.sorea_dark.clair, color: themes.sorea_dark.fonce, border: `2px solid ${themes.sorea_dark.fonce}` }}
                >
                    Thème Contrasté
                </button>
            </div>

            <div className="w-full max-w-[1100px] grid grid-cols-3 items-center">
                <div className="col-span-1" />

                <div className="col-span-1 flex flex-col items-center justify-center">
                    <div style={{ position: "relative", zIndex: 10 }}>
                        <div className="pointer-wrap" ref={referencePointeur}>
                            <div className="pointer-circle" style={{ backgroundColor: theme.bordure }} />
                            <div className="pointer-tri" style={{ borderTop: `26px solid ${theme.pointeur}` }} />
                        </div>

                        <div className="rounded-full shadow-[0_6px_18px_rgba(0,0,0,0.32),0_2px_6px_rgba(0,0,0,0.18)]">
                            <div
                                ref={referenceRoue}
                                onClick={tournerLaRoue}
                                style={{
                                    width: "303px",
                                    height: "303px",
                                    position: "relative",
                                    cursor: estEnTrainDeTourner ? "default" : "pointer",
                                    transformOrigin: "center center",
                                    willChange: "transform",
                                    borderRadius: "50%",
                                    overflow: "hidden",
                                    backgroundColor: "#ffffff",
                                }}
                            >
                                <svg width="303" height="303" style={{ position: "absolute", top: 0, left: 0 }}>
                                    {Array.from({ length: nombreDeCases }).map((_, i) => {
                                        const estAssombri = indexMiseEnValeur !== null && indexMiseEnValeur !== i;
                                        return (
                                            <path 
                                                key={i} 
                                                d={dessinerUneCase(i)} 
                                                fill={i % 2 === 0 ? theme.clair : theme.fonce}
                                                style={{
                                                    transition: "all 0.6s ease, fill 0.5s ease",
                                                    opacity: estAssombri ? 0.3 : 1,
                                                    filter: estAssombri ? "grayscale(100%)" : "none"
                                                }} 
                                            />
                                        );
                                    })}
                                </svg>

                                <svg width="303" height="303" style={{ position: "absolute", top: 0, left: 0, zIndex: 1 }}>
                                    <defs>
                                        <radialGradient id="innerShadow" cx="50%" cy="50%" r="50%">
                                            <stop offset="70%" stopColor="transparent" />
                                            <stop offset="100%" stopColor="rgba(80,40,120,0.3)" />
                                        </radialGradient>
                                    </defs>
                                    <circle cx="151.5" cy="151.5" r="133" fill="url(#innerShadow)" style={{ transition: "opacity 0.6s ease", opacity: indexMiseEnValeur !== null ? 0.5 : 1 }} />
                                </svg>

                                {listeImages.map((imageObj, i) => {
                                    const { x, y } = calculerPositionImage(i);
                                    const estAssombri = indexMiseEnValeur !== null && indexMiseEnValeur !== i;
                                    
                                    // Calcul mathématique exact vers le centre + application du décalage (offset) de l'image
                                    const angleParCase = (2 * Math.PI) / nombreDeCases;
                                    const angleMilieu = i * angleParCase - Math.PI / 2 + angleParCase / 2;
                                    const rotationDeg = (angleMilieu * 180) / Math.PI + 90 + imageObj.offset;

                                    return (
                                        <img
                                            key={i}
                                            src={imageObj.url}
                                            alt=""
                                            style={{
                                                position: "absolute",
                                                width: "28px",
                                                height: "28px",
                                                left: `${x - 14}px`,
                                                top: `${y - 14}px`,
                                                zIndex: 2,
                                                objectFit: "contain" as const,
                                                transition: "all 0.6s ease",
                                                opacity: estAssombri ? 0.2 : 1,
                                                filter: estAssombri ? "grayscale(100%)" : "none",
                                                transform: `rotate(${rotationDeg}deg) ${indexMiseEnValeur === i ? "scale(1.2)" : "scale(1)"}`
                                            }}
                                        />
                                    );
                                })}
                            </div>
                        </div>

                        <div style={{ position: "absolute", top: 0, left: 0, width: "303px", height: "303px", pointerEvents: "none" }}>
                            <div style={{
                                position: "absolute",
                                width: "100%",
                                height: "100%",
                                borderRadius: "50%",
                                border: `18px solid ${theme.bordure}`,
                                boxSizing: "border-box",
                                zIndex: 3,
                                boxShadow: "0 0 0 2px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.3), inset 0 0 10px rgba(0,0,0,0.08)",
                                transition: "border-color 0.5s ease"
                            }} />

                            {Array.from({ length: nombreDeCases }).map((_, i) => {
                                const angle = (i * 360) / nombreDeCases;
                                const radians = (angle * Math.PI) / 180;
                                const x = Math.round(centreX + 145 * Math.sin(radians) - 4);
                                const y = Math.round(centreY - 145 * Math.cos(radians) - 4);
                                return (
                                    <div key={i} style={{
                                        position: "absolute",
                                        width: "8px",
                                        height: "8px",
                                        borderRadius: "50%",
                                        border: `1px solid ${theme.pointeur}`,
                                        background: `radial-gradient(circle, #ffffff, ${theme.pointeur})`,
                                        boxSizing: "border-box",
                                        left: `${x}px`,
                                        top: `${y}px`,
                                        zIndex: 4,
                                        transition: "background 0.5s ease, border-color 0.5s ease"
                                    }} />
                                );
                            })}

                            <div style={{
                                position: "absolute",
                                width: "20px",
                                height: "20px",
                                borderRadius: "50%",
                                background: `radial-gradient(circle, #ffffff, ${theme.pointeur})`,
                                border: "2px solid #fff",
                                boxShadow: "0 0 6px rgba(0,0,0,0.2)",
                                left: `${centreX - 10}px`,
                                top: `${centreY - 10}px`,
                                zIndex: 5,
                                transition: "background 0.5s ease"
                            }} />
                        </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "-65px", zIndex: 1, position: "relative" }}>
                        <div style={{ position: "relative", width: "162px", height: "150px" }}>
                            <svg width="162" height="150" viewBox="0 0 162 150" style={{ position: "absolute", top: 0, left: 0 }}>
                                <defs>
                                    <linearGradient id="shadowLeft" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="rgba(0,0,0,0.22)" />
                                        <stop offset="45%" stopColor="rgba(0,0,0,0)" />
                                    </linearGradient>
                                    <linearGradient id="shadowRight" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="55%" stopColor="rgba(0,0,0,0)" />
                                        <stop offset="100%" stopColor="rgba(0,0,0,0.22)" />
                                    </linearGradient>
                                </defs>
                                <polygon points="55,0 107,0 162,150 0,150" fill={theme.bordure} style={{ transition: "fill 0.5s ease" }} />
                                <polygon points="55,0 107,0 162,150 0,150" fill="url(#shadowLeft)" />
                                <polygon points="55,0 107,0 162,150 0,150" fill="url(#shadowRight)" />
                            </svg>
                            <div style={{
                                position: "absolute",
                                bottom: "12px",
                                width: "100%",
                                textAlign: "center",
                                fontFamily: "'Inter', sans-serif",
                                fontSize: "20px",
                                fontWeight: 400,
                                letterSpacing: "0.44em",
                                color: "#FFFFFF",
                                WebkitTextStroke: "1px #9b93a6",
                                textShadow: "0px 2px 4px rgba(0,0,0,0.15)",
                                paddingLeft: "0.44em",
                            }}>
                                SOREA
                            </div>
                        </div>
                        <div style={{
                            width: "168px",
                            height: "27px",
                            backgroundColor: theme.bordure,
                            boxShadow: "inset 0px 6px 10px rgba(0,0,0,0.18), inset 6px 0px 8px rgba(0,0,0,0.1), inset -6px 0px 8px rgba(0,0,0,0.1)",
                            transition: "background-color 0.5s ease"
                        }} />
                    </div>
                </div>

                <div className="col-span-1 flex justify-start pl-8 relative z-20">
                    {afficherFenetreResultat && tacheGagnante && (
                        <div className="card-resultat bg-white p-8 rounded-3xl text-center shadow-[0_12px_40px_rgba(186,152,244,0.3)] border-2 w-[340px]" style={{ borderColor: theme.bordure, transition: "border-color 0.5s ease" }}>
                            <div className="flex flex-col items-center mb-6">
                                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-sm border" style={{ backgroundColor: theme.clair, borderColor: theme.bordure, transition: "all 0.5s ease" }}>
                                    <img src={tacheGagnante.icon} alt="Thème" className="w-8 h-8 object-contain" />
                                </div>
                                <h2 style={{ color: theme.pointeur, fontSize: 20, fontWeight: 700, margin: 0, transition: "color 0.5s ease" }}>
                                    Défi Bien-être
                                </h2>
                            </div>
                            <p style={{ color: "#4b3b5c", fontSize: 17, fontWeight: 600, margin: "0 0 28px", lineHeight: 1.5 }}>
                                {tacheGagnante.text}
                            </p>

                            {choixUtilisateur === 'attente' && (
                                <div className="flex flex-col gap-4">
                                    <button
                                        onClick={() => setChoixUtilisateur('oui')}
                                        style={{ background: `linear-gradient(135deg, ${theme.bordure}, ${theme.pointeur})`, color: "#fff", border: "none", borderRadius: 50, padding: "12px 24px", fontSize: 14, fontWeight: 700, cursor: "pointer", boxShadow: `0 4px 14px ${theme.bordure}` }}
                                    >
                                        {"C'est parti"}
                                    </button>
                                    <button
                                        onClick={() => setChoixUtilisateur('non')}
                                        style={{ background: "transparent", color: theme.pointeur, border: `2px solid ${theme.bordure}`, borderRadius: 50, padding: "10px 24px", fontSize: 14, fontWeight: 700, cursor: "pointer", transition: "all 0.2s ease" }}
                                        onMouseOver={(e) => e.currentTarget.style.background = theme.clair}
                                        onMouseOut={(e) => e.currentTarget.style.background = "transparent"}
                                    >
                                        Je ne peux pas le faire
                                    </button>
                                </div>
                            )}

                            {choixUtilisateur === 'non' && (
                                <div className="flex flex-col gap-3 text-left">
                                    <label className="text-[#4b3b5c] text-sm font-semibold ml-2">
                                        Tu peux choisir une raison ou écrire la tienne :
                                    </label>
                                    <div className="flex flex-col gap-2">
                                        {raisonsIndisponibilite.map((raison) => (
                                            <button
                                                key={raison}
                                                type="button"
                                                onClick={() => setRaisonSelectionnee(raison)}
                                                className="rounded-xl px-3 py-2 text-left text-sm font-semibold"
                                                style={{ background: raisonSelectionnee === raison ? theme.clair : "#fff", color: "#4b3b5c", border: raisonSelectionnee === raison ? `2px solid ${theme.pointeur}` : `1px solid ${theme.bordure}`, transition: "all 0.3s ease" }}
                                            >
                                                {raison}
                                            </button>
                                        ))}
                                    </div>
                                    <textarea
                                        value={raisonPersonnalisee}
                                        onChange={(e) => setRaisonPersonnalisee(e.target.value)}
                                        className="w-full border-2 rounded-xl p-3 text-sm focus:outline-none resize-none"
                                        style={{ borderColor: theme.bordure }}
                                        rows={4}
                                        placeholder="Écris ici pourquoi tu ne peux pas le faire..."
                                    />
                                    <button
                                        onClick={() => { setRaisonSelectionnee(""); setRaisonPersonnalisee(""); reinitialiserJeu(); }}
                                        style={{ background: "#4b3b5c", color: "#fff", border: "none", borderRadius: 50, padding: "10px", fontSize: 14, fontWeight: 700, cursor: "pointer", marginTop: "8px" }}
                                    >
                                        Valider
                                    </button>
                                </div>
                            )}

                            {choixUtilisateur === 'oui' && (
                                <div className="flex flex-col gap-4">
                                    <p style={{ color: theme.pointeur }} className="font-bold text-lg">Super ! Bon défi 🎉</p>
                                    <button
                                        onClick={reinitialiserJeu}
                                        style={{ background: "transparent", color: "#4b3b5c", textDecoration: "underline", border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
                                    >
                                        Fermer
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}