"use client";

/* ── IMPORTATIONS ── */
import React, { useRef, useState } from "react";
import confetti from "canvas-confetti";

/* ── DONNÉES & CONSTANTES ── */
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

const listeImages = [
    "/image_wheel/checklist 1.svg",
    "/image_wheel/dna 1.svg",
    "/image_wheel/hearts 1.svg",
    "/image_wheel/hug 1.svg",
    "/image_wheel/light-bulb 1.svg",
    "/image_wheel/lightning 1.svg",
    "/image_wheel/lotus 1.svg",
    "/image_wheel/mirror 1.png",
    "/image_wheel/notebook 1.svg",
    "/image_wheel/sun 1.svg",
];

const nombreDeCases = 10;
const centreX = 151.5;
const centreY = 151.5;
const rayonRoue = 140;
const couleursCases = ["#FEF0F9", "#BA98F4"];

/* ── FONCTIONS UTILITAIRES ── */
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

function lancerConfettis() {
    const couleursConfettis = ["#BA98F4", "#DBCEEF", "#ffffff", "#f9c6e8", "#c084fc", "#e879f9"];

    confetti({
        particleCount: 80,
        angle: 60,
        spread: 70,
        origin: { x: 0, y: 0.6 },
        colors: couleursConfettis,
        scalar: 1.1,
        zIndex: 9999,
    });

    confetti({
        particleCount: 80,
        angle: 120,
        spread: 70,
        origin: { x: 1, y: 0.6 },
        colors: couleursConfettis,
        scalar: 1.1,
        zIndex: 9999,
    });

    confetti({
        particleCount: 60,
        spread: 90,
        origin: { x: 0.5, y: 0.5 },
        colors: couleursConfettis,
        scalar: 0.9,
        zIndex: 9999,
    });

    setTimeout(() => {
        confetti({
            particleCount: 50,
            angle: 75,
            spread: 60,
            origin: { x: 0.1, y: 0.5 },
            colors: couleursConfettis,
            scalar: 1.2,
            zIndex: 9999,
        });
        confetti({
            particleCount: 50,
            angle: 105,
            spread: 60,
            origin: { x: 0.9, y: 0.5 },
            colors: couleursConfettis,
            scalar: 1.2,
            zIndex: 9999,
        });
    }, 300);

    setTimeout(() => {
        confetti({
            particleCount: 40,
            spread: 100,
            origin: { x: 0.5, y: 0.4 },
            colors: couleursConfettis,
            startVelocity: 20,
            gravity: 0.6,
            scalar: 0.8,
            zIndex: 9999,
        });
    }, 600);
}

/* ── COMPOSANT PRINCIPAL ── */
export default function RoueDuBienEtre() {
    
    /* ── ÉTATS ET RÉFÉRENCES ── */
    const referenceRoue = useRef<HTMLDivElement>(null);
    const referencePointeur = useRef<HTMLDivElement>(null);
    
    const [estEnTrainDeTourner, setEstEnTrainDeTourner] = useState(false);
    const [afficherFenetreResultat, setAfficherFenetreResultat] = useState(false);
    const [tacheGagnante, setTacheGagnante] = useState<{ text: string } | null>(null);

    const angleActuel = useRef(0);
    const minuteurAnimationRebond = useRef<ReturnType<typeof setTimeout> | null>(null);

    /* ── LOGIQUE D'ANIMATION ── */
    const tournerLaRoue = () => {
        if (estEnTrainDeTourner) return;
        
        setEstEnTrainDeTourner(true);
        setAfficherFenetreResultat(false);

        const degresTotaux = (5 + Math.random() * 5) * 360 + Math.random() * 360;
        const degresDeDepart = angleActuel.current;
        const degresCibles = degresDeDepart + degresTotaux;
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
                
                const degreFinalModifie = angleActuel.current % 360;
                let angleEnHaut = (270 - degreFinalModifie) % 360;
                if (angleEnHaut < 0) angleEnHaut += 360;
                
                const indexGagnant = Math.floor(angleEnHaut / (360 / nombreDeCases)) % nombreDeCases;
                
                setTimeout(() => {
                    setTacheGagnante(listeDeTaches[indexGagnant]);
                    setAfficherFenetreResultat(true);
                    lancerConfettis();
                }, 400);
            }
        };

        requestAnimationFrame(animerLaRoue);
    };

    /* ── RENDU VISUEL ── */
    return (
        <div className="w-full flex flex-col items-center py-12" style={{ fontFamily: "'Poppins', sans-serif" }}>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400&family=Poppins:wght@400;600;700&display=swap" rel="stylesheet" />

            {/* ── STYLES GLOBAUX ── */}
            <style>{`
                .pointer-wrap { position: absolute; top: -24px; left: 50%; margin-left: -12px; width: 24px; height: 54px; z-index: 20; transform-origin: 12px 8px; transition: transform 0.05s ease-out; }
                .pointer-wrap.bump { transform: rotate(-28deg); }
                .pointer-circle { width: 16px; height: 16px; background: #DBCEEF; border-radius: 50%; margin: 0 auto; border: 3px solid #fff; box-shadow: 0 2px 6px rgba(0,0,0,0.2); position: relative; z-index: 2; }
                .pointer-tri { width: 0; height: 0; border-left: 10px solid transparent; border-right: 10px solid transparent; border-top: 26px solid #BA98F4; margin: -4px auto 0; filter: drop-shadow(0 2px 3px rgba(0,0,0,0.15)); }
                .modal-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-color: rgba(255,255,255,0.78); backdrop-filter: blur(6px); z-index: 1000; display: flex; justify-content: center; align-items: center; }
                .modal-box { background: #fff; padding: 44px 40px; border-radius: 20px; text-align: center; box-shadow: 0 12px 40px rgba(186,152,244,0.3); border: 2px solid #e9d5ff; max-width: 380px; animation: popIn 0.3s cubic-bezier(0.17,0.67,0.1,1); }
                @keyframes popIn { 0% { transform: scale(0.8); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
                .wheel-ring {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    border: 18px solid #DBCEEF;
                    box-sizing: border-box;
                    z-index: 3;
                    box-shadow:
                        0 0 0 2px rgba(0,0,0,0.08),
                        0 4px 12px rgba(0,0,0,0.3),
                        0 8px 24px rgba(0,0,0,0.2),
                        0 12px 36px rgba(0,0,0,0.12),
                        inset 0 0 10px rgba(0,0,0,0.08);
                }
                .wheel-shadow-wrapper {
                    border-radius: 50%;
                    box-shadow:
                        0 6px 18px rgba(0,0,0,0.32),
                        0 2px 6px rgba(0,0,0,0.18);
                }
            `}</style>

            {/* ── BLOC ROUE GLOBALE ── */}
            <div style={{ position: "relative", zIndex: 10 }}>
                
                {/* ── POINTEUR HAUT ── */}
                <div className="pointer-wrap" ref={referencePointeur}>
                    <div className="pointer-circle" />
                    <div className="pointer-tri" />
                </div>

                {/* ── SUPPORT ROTATIF OMBRÉ ── */}
                <div className="wheel-shadow-wrapper">
                    
                    {/* ── CERCLE DE LA ROUE ── */}
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
                        }}
                    >
                        {/* ── PARTS DE LA ROUE ── */}
                        <svg width="303" height="303" style={{ position: "absolute", top: 0, left: 0 }}>
                            {Array.from({ length: nombreDeCases }).map((_, i) => (
                                <path key={i} d={dessinerUneCase(i)} fill={couleursCases[i % 2]} />
                            ))}
                        </svg>

                        {/* ── DÉGRADÉ CENTRAL ── */}
                        <svg width="303" height="303" style={{ position: "absolute", top: 0, left: 0, zIndex: 1 }}>
                            <defs>
                                <radialGradient id="innerShadow" cx="50%" cy="50%" r="50%">
                                    <stop offset="70%" stopColor="transparent" />
                                    <stop offset="100%" stopColor="rgba(80,40,120,0.3)" />
                                </radialGradient>
                            </defs>
                            <circle cx="151.5" cy="151.5" r="133" fill="url(#innerShadow)" />
                        </svg>

                        {/* ── ICÔNES DES PARTS ── */}
                        {listeImages.map((cheminImage, index) => {
                            const { x, y } = calculerPositionImage(index);
                            return (
                                <img
                                    key={index}
                                    src={cheminImage}
                                    alt=""
                                    style={{
                                        position: "absolute",
                                        width: "28px",
                                        height: "28px",
                                        left: `${x - 14}px`,
                                        top: `${y - 14}px`,
                                        zIndex: 2,
                                        objectFit: "contain" as const,
                                    }}
                                />
                            );
                        })}
                    </div>
                </div>

                {/* ── ELEMENTS FIXES SUR LA ROUE ── */}
                <div style={{ position: "absolute", top: 0, left: 0, width: "303px", height: "303px", pointerEvents: "none" }}>
                    
                    {/* ── ANNEAU EXTERIEUR ── */}
                    <div className="wheel-ring" />
                    
                    {/* ── RIVETS AUTOUR DE L'ANNEAU ── */}
                    {Array.from({ length: nombreDeCases }).map((_, i) => {
                        const angle = (i * 360) / nombreDeCases;
                        const radians = (angle * Math.PI) / 180;
                        const x = Math.round(centreX + 145 * Math.sin(radians) - 4);
                        const y = Math.round(centreY - 145 * Math.cos(radians) - 4);
                        return (
                            <div
                                key={i}
                                style={{
                                    position: "absolute",
                                    width: "8px",
                                    height: "8px",
                                    borderRadius: "50%",
                                    border: "1px solid #9d6bf5",
                                    background: "radial-gradient(circle, #ffffff, #8B47FF)",
                                    boxSizing: "border-box",
                                    left: `${x}px`,
                                    top: `${y}px`,
                                    zIndex: 4,
                                }}
                            />
                        );
                    })}

                    {/* ── BOUTON CENTRAL DÉCORATIF ── */}
                    <div style={{
                        position: "absolute",
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        background: "radial-gradient(circle, #ffffff, #BA98F4)",
                        border: "2px solid #fff",
                        boxShadow: "0 0 6px rgba(0,0,0,0.2)",
                        left: `${centreX - 10}px`,
                        top: `${centreY - 10}px`,
                        zIndex: 5,
                    }} />
                </div>
            </div>

            {/* ── SOCLE ── */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "-65px", zIndex: 1, position: "relative" }}>
                
                {/* ── TRAPÈZE DU SOCLE ── */}
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
                        <polygon points="55,0 107,0 162,150 0,150" fill="#DBCEEF" />
                        <polygon points="55,0 107,0 162,150 0,150" fill="url(#shadowLeft)" />
                        <polygon points="55,0 107,0 162,150 0,150" fill="url(#shadowRight)" />
                    </svg>

                    {/* ── TEXTE DU SOCLE ── */}
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

                {/* ── BASE DU SOCLE ── */}
                <div style={{
                    width: "168px",
                    height: "27px",
                    backgroundColor: "#DBCEEF",
                    boxShadow: "inset 0px 6px 10px rgba(0,0,0,0.18), inset 6px 0px 8px rgba(0,0,0,0.1), inset -6px 0px 8px rgba(0,0,0,0.1)",
                }} />
            </div>

            {/* ── BOUTON D'ACTION ── */}
            <button
                onClick={tournerLaRoue}
                disabled={estEnTrainDeTourner}
                style={{
                    marginTop: "40px",
                    background: "linear-gradient(135deg, #DBCEEF, #BA98F4)",
                    color: "#fff",
                    border: "none",
                    borderRadius: 50,
                    padding: "14px 44px",
                    fontSize: 16,
                    fontWeight: 700,
                    letterSpacing: 3,
                    textTransform: "uppercase",
                    cursor: estEnTrainDeTourner ? "default" : "pointer",
                    opacity: estEnTrainDeTourner ? 0.6 : 1,
                    boxShadow: "0 6px 20px rgba(186,152,244,0.45)",
                    fontFamily: "'Poppins', sans-serif",
                }}
            >
                Tourner la roue
            </button>

            {/* ── MODAL DE RÉSULTAT ── */}
            {afficherFenetreResultat && tacheGagnante && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        
                        {/* ── TITRE MODAL ── */}
                        <h2 style={{ color: "#BA98F4", fontSize: 22, fontWeight: 700, margin: "0 0 12px" }}>
                            Votre tâche bien-être
                        </h2>
                        
                        {/* ── TEXTE GAGNANT ── */}
                        <p style={{ color: "#4b3b5c", fontSize: 17, fontWeight: 600, margin: "0 0 28px", lineHeight: 1.5 }}>
                            {tacheGagnante.text}
                        </p>
                        
                        {/* ── BOUTON FERMER MODAL ── */}
                        <button
                            onClick={() => setAfficherFenetreResultat(false)}
                            style={{
                                background: "linear-gradient(135deg, #DBCEEF, #BA98F4)",
                                color: "#fff",
                                border: "none",
                                borderRadius: 50,
                                padding: "12px 36px",
                                fontSize: 15,
                                fontWeight: 700,
                                cursor: "pointer",
                                fontFamily: "'Poppins', sans-serif",
                                boxShadow: "0 4px 14px rgba(186,152,244,0.35)",
                            }}
                        >
                            C'est parti !
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}