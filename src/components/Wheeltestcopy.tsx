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
const raisonsIndisponibilite = [
    "Je manque de temps aujourd'hui",
    "Je ne me sens pas assez en forme",
    "Ce défi ne correspond pas à mon énergie du moment",
];

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
    confetti({ particleCount: 80, angle: 60, spread: 70, origin: { x: 0, y: 0.6 }, colors: couleursConfettis, scalar: 1.1, zIndex: 9999 });
    confetti({ particleCount: 80, angle: 120, spread: 70, origin: { x: 1, y: 0.6 }, colors: couleursConfettis, scalar: 1.1, zIndex: 9999 });
    confetti({ particleCount: 60, spread: 90, origin: { x: 0.5, y: 0.5 }, colors: couleursConfettis, scalar: 0.9, zIndex: 9999 });
}

/* ── COMPOSANT PRINCIPAL ── */
export default function RoueDuBienEtre() {
    
    const referenceRoue = useRef<HTMLDivElement>(null);
    const referencePointeur = useRef<HTMLDivElement>(null);
    
    const [estEnTrainDeTourner, setEstEnTrainDeTourner] = useState(false);
    const [afficherFenetreResultat, setAfficherFenetreResultat] = useState(false);
    const [tacheGagnante, setTacheGagnante] = useState<{ text: string, icon: string } | null>(null);
    const [raisonSelectionnee, setRaisonSelectionnee] = useState("");
    const [raisonPersonnalisee, setRaisonPersonnalisee] = useState("");
    const [indexMiseEnValeur, setIndexMiseEnValeur] = useState<number | null>(null);
    
    // État pour gérer le choix de l'utilisateur sur la carte
    const [choixUtilisateur, setChoixUtilisateur] = useState<'attente' | 'oui' | 'non'>('attente');

    const angleActuel = useRef(0);
    const minuteurAnimationRebond = useRef<ReturnType<typeof setTimeout> | null>(null);

    const tournerLaRoue = () => {
        if (estEnTrainDeTourner) return;
        
        setEstEnTrainDeTourner(true);
        setAfficherFenetreResultat(false);
        setRaisonSelectionnee("");
        setRaisonPersonnalisee("");
        setIndexMiseEnValeur(null);
        setChoixUtilisateur('attente'); // Réinitialiser le choix

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
                
                let rotationReelle = angleActuel.current % 360;
                if (rotationReelle < 0) rotationReelle += 360; 
                
                const indexGagnant = Math.floor((360 - rotationReelle) / (360 / nombreDeCases)) % nombreDeCases;
                
                // Mettre en gris les autres cases
                setIndexMiseEnValeur(indexGagnant);
                
                setTimeout(() => {
                    setTacheGagnante({
                        text: listeDeTaches[indexGagnant].text,
                        icon: listeImages[indexGagnant]
                    });
                    setAfficherFenetreResultat(true);
                    lancerConfettis();
                }, 1000);
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
        <div className="w-full flex flex-col items-center py-12 overflow-x-hidden" style={{ fontFamily: "'Poppins', sans-serif" }}>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400&family=Poppins:wght@400;600;700&display=swap" rel="stylesheet" />

            <style>{`
                .pointer-wrap { position: absolute; top: -24px; left: 50%; margin-left: -12px; width: 24px; height: 54px; z-index: 20; transform-origin: 12px 8px; transition: transform 0.05s ease-out; }
                .pointer-wrap.bump { transform: rotate(-28deg); }
                .pointer-circle { width: 16px; height: 16px; background: #DBCEEF; border-radius: 50%; margin: 0 auto; border: 3px solid #fff; box-shadow: 0 2px 6px rgba(0,0,0,0.2); position: relative; z-index: 2; }
                .pointer-tri { width: 0; height: 0; border-left: 10px solid transparent; border-right: 10px solid transparent; border-top: 26px solid #BA98F4; margin: -4px auto 0; filter: drop-shadow(0 2px 3px rgba(0,0,0,0.15)); }
                
                @keyframes slideInRight { 
                    0% { transform: translateX(50px); opacity: 0; } 
                    100% { transform: translateX(0); opacity: 1; } 
                }
                .card-resultat {
                    animation: slideInRight 0.5s cubic-bezier(0.17,0.67,0.1,1) forwards;
                }
            `}</style>

            {/* Grille pour garder la roue au centre parfait, et la carte à droite */}
            <div className="w-full max-w-[1100px] grid grid-cols-3 items-center">
                
                {/* Colonne gauche vide pour équilibrer */}
                <div className="col-span-1"></div>

                {/* Colonne centrale : La Roue et le Socle */}
                <div className="col-span-1 flex flex-col items-center justify-center">
                    
                    {/* ── BLOC ROUE ── */}
                    <div style={{ position: "relative", zIndex: 10 }}>
                        <div className="pointer-wrap" ref={referencePointeur}>
                            <div className="pointer-circle" />
                            <div className="pointer-tri" />
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
                                }}
                            >
                                <svg width="303" height="303" style={{ position: "absolute", top: 0, left: 0 }}>
                                    {Array.from({ length: nombreDeCases }).map((_, i) => {
                                        const estAssombri = indexMiseEnValeur !== null && indexMiseEnValeur !== i;
                                        return (
                                            <path 
                                                key={i} 
                                                d={dessinerUneCase(i)} 
                                                fill={couleursCases[i % 2]}
                                                style={{
                                                    transition: "all 0.6s ease",
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

                                {listeImages.map((cheminImage, i) => {
                                    const { x, y } = calculerPositionImage(i);
                                    const estAssombri = indexMiseEnValeur !== null && indexMiseEnValeur !== i;
                                    return (
                                        <img
                                            key={i}
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
                                                transition: "all 0.6s ease",
                                                opacity: estAssombri ? 0.2 : 1,
                                                filter: estAssombri ? "grayscale(100%)" : "none",
                                                transform: indexMiseEnValeur === i ? "scale(1.2)" : "scale(1)"
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
                                border: "18px solid #DBCEEF",
                                boxSizing: "border-box",
                                zIndex: 3,
                                boxShadow: "0 0 0 2px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.3), inset 0 0 10px rgba(0,0,0,0.08)",
                            }} />
                            
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
                            backgroundColor: "#DBCEEF",
                            boxShadow: "inset 0px 6px 10px rgba(0,0,0,0.18), inset 6px 0px 8px rgba(0,0,0,0.1), inset -6px 0px 8px rgba(0,0,0,0.1)",
                        }} />
                    </div>

                    
                </div>

                {/* Colonne droite : La Carte de résultat  */}
                <div className="col-span-1 flex justify-start pl-8 relative z-20">
                    {afficherFenetreResultat && tacheGagnante && (
                        <div className="card-resultat bg-white p-8 rounded-3xl text-center shadow-[0_12px_40px_rgba(186,152,244,0.3)] border-2 border-[#e9d5ff] w-[340px]">
                            
                           
                            <div className="flex flex-col items-center mb-6">
                                <div className="w-16 h-16 bg-[#FEF0F9] rounded-full flex items-center justify-center mb-4 shadow-sm border border-[#e9d5ff]">
                                    <img src={tacheGagnante.icon} alt="Thème" className="w-8 h-8 object-contain" />
                                </div>
                                <h2 style={{ color: "#BA98F4", fontSize: 20, fontWeight: 700, margin: 0 }}>
                                    Défi Bien-être
                                </h2>
                            </div>
                            
                            {/* Texte du défi */}
                            <p style={{ color: "#4b3b5c", fontSize: 17, fontWeight: 600, margin: "0 0 28px", lineHeight: 1.5 }}>
                                {tacheGagnante.text}
                            </p>
                            
                            {/* Logique des boutons de choix */}
                            {choixUtilisateur === 'attente' && (
                                <div className="flex flex-col gap-4">
                                    <button
                                        onClick={() => setChoixUtilisateur('oui')}
                                        style={{
                                            background: "linear-gradient(135deg, #DBCEEF, #BA98F4)",
                                            color: "#fff",
                                            border: "none",
                                            borderRadius: 50,
                                            padding: "12px 24px",
                                            fontSize: 14,
                                            fontWeight: 700,
                                            cursor: "pointer",
                                            boxShadow: "0 4px 14px rgba(186,152,244,0.35)",
                                        }}
                                    >
                                        {"C'est parti"}
                                    </button>
                                    <button
                                        onClick={() => setChoixUtilisateur('non')}
                                        style={{
                                            background: "transparent",
                                            color: "#BA98F4",
                                            border: "2px solid #DBCEEF",
                                            borderRadius: 50,
                                            padding: "10px 24px",
                                            fontSize: 14,
                                            fontWeight: 700,
                                            cursor: "pointer",
                                            transition: "all 0.2s ease"
                                        }}
                                        onMouseOver={(e) => e.currentTarget.style.background = "#FEF0F9"}
                                        onMouseOut={(e) => e.currentTarget.style.background = "transparent"}
                                    >
                                        Je ne peux pas le faire
                                    </button>
                                </div>
                            )}

                            {choixUtilisateur === 'non' && (
                                <div className="flex flex-col gap-3 animate-fade-in text-left">
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
                                                style={{
                                                    background: raisonSelectionnee === raison ? "#FEF0F9" : "#fff",
                                                    color: "#4b3b5c",
                                                    border: raisonSelectionnee === raison ? "2px solid #BA98F4" : "1px solid #DBCEEF",
                                                }}
                                            >
                                                {raison}
                                            </button>
                                        ))}
                                    </div>
                                    <textarea 
                                        value={raisonPersonnalisee}
                                        onChange={(event) => setRaisonPersonnalisee(event.target.value)}
                                        className="w-full border-2 border-[#e9d5ff] rounded-xl p-3 text-sm focus:outline-none focus:border-[#BA98F4] resize-none"
                                        rows={4}
                                        placeholder="Écris ici pourquoi tu ne peux pas le faire..."
                                    ></textarea>
                                    <button
                                        onClick={() => {
                                            setRaisonSelectionnee("");
                                            setRaisonPersonnalisee("");
                                            reinitialiserJeu();
                                        }}
                                        style={{
                                            background: "#4b3b5c",
                                            color: "#fff",
                                            border: "none",
                                            borderRadius: 50,
                                            padding: "10px",
                                            fontSize: 14,
                                            fontWeight: 700,
                                            cursor: "pointer",
                                            marginTop: "8px"
                                        }}
                                    >
                                        Valider
                                    </button>
                                </div>
                            )}

                            {choixUtilisateur === 'oui' && (
                                <div className="flex flex-col gap-4 animate-fade-in">
                                    <p className="text-[#BA98F4] font-bold text-lg">Super ! Bon défi 🎉</p>
                                    <button
                                        onClick={reinitialiserJeu}
                                        style={{
                                            background: "transparent",
                                            color: "#4b3b5c",
                                            textDecoration: "underline",
                                            border: "none",
                                            fontSize: 14,
                                            fontWeight: 600,
                                            cursor: "pointer",
                                        }}
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
