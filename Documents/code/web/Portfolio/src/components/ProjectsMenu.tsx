"use client";

import { useMenu } from '@/context/MenuContext';
import { useState } from 'react';

export default function ProjectsMenu() {
    const { setActiveMenu } = useMenu();
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    // Liste de tes projets/missions (ajoute ou modifie les noms ici)
    const projects = [
        { name: 'MISSION SOREA', desc: "Application web et gestion de base de données développée durant mon stage de BTS SIO." },
        { name: 'MINECRAFT MODDING', desc: "Configuration de serveurs, gestion d'inventaires et développement d'outils d'administration." },
        { name: 'SHOWDOWN VGC ANALYZER', desc: "Outil d'analyse stratégique et de centralisation pour les combats compétitifs Pokémon." },
        { name: 'VIDEO RENDERING TOOL', desc: "Scripts d'optimisation de bitrates et de flux de travail pour les clips en 1440p." },
    ];

    return (
        <div className="relative w-full flex flex-col items-end select-none">

            {/* 💰 COMPTEUR "BANK" STYLE NFSU (Placé tout en haut à droite de l'écran) */}
            {/* En CSS absolu pour se positionner exactement au même endroit que sur le screen original */}
            <div className="absolute -top-[520px] right-0 bg-black/60 border border-cyan-900/50 px-6 py-1 font-mono text-sm tracking-wider rounded-sm shadow-[0_0_10px_rgba(6,182,212,0.15)]">
                <span className="text-cyan-500 font-bold">COMMITS:</span> <span className="text-white font-black">9962915</span>
            </div>

            {/* 🏷️ TITRE DU SOUS-MENU */}
            <div className="text-xl font-black italic tracking-wider text-cyan-400 uppercase opacity-90 mb-6 bg-gradient-to-l from-cyan-950/40 to-transparent px-4 py-1 border-r-2 border-cyan-500">
                UNDERGROUND MENU
            </div>

            {/* 📋 LISTE DES PROJETS */}
            <div className="flex flex-col gap-3 w-full">
                {projects.map((project, index) => {
                    const isSelected = hoveredIndex === index;

                    return (
                        <button
                            key={index}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            className="relative w-full text-right focus:outline-none group"
                        >
                            {/* Fond de ligne en surbrillance comme dans le jeu */}
                            <div
                                className={`absolute inset-y-0 right-0 bg-gradient-to-l from-cyan-500/20 via-cyan-950/10 to-transparent transition-all duration-150 rounded-sm
                  ${isSelected ? 'w-full opacity-100 border-r-4 border-cyan-400' : 'w-0 opacity-0'}`}
                            />

                            {/* Texte du projet */}
                            <span
                                className={`relative block text-2xl font-black tracking-tight uppercase pr-4 py-1 transition-all duration-150 origin-right
                  ${isSelected
                                        ? 'text-white translate-x-[-8px] drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]'
                                        : 'text-cyan-200/30'
                                    }`}
                                style={{ transform: 'skewX(-10deg)' }}
                            >
                                {project.name}
                            </span>
                        </button>
                    );
                })}

                {/* � ACCÈS AU CV */}
                <button
                    onClick={() => setActiveMenu('CV')}
                    onMouseEnter={() => setHoveredIndex(projects.length)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className="relative w-full text-right focus:outline-none mt-6 pt-4 border-t border-cyan-950/40"
                >
                    <span
                        className={`block text-lg font-bold tracking-wide uppercase transition-all duration-150 origin-right
              ${hoveredIndex === projects.length ? 'text-cyan-400 translate-x-[-8px]' : 'text-neutral-500'}`}
                        style={{ transform: 'skewX(-10deg)' }}
                    >
                        [ TÉLÉCHARGER CV ]
                    </span>
                </button>

                {/* 🔙 BOUTON RETOUR */}
                <button
                    onClick={() => setActiveMenu('HOME')}
                    onMouseEnter={() => setHoveredIndex(projects.length + 1)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className="relative w-full text-right focus:outline-none mt-4"
                >
                    <span
                        className={`block text-lg font-bold tracking-wide uppercase transition-all duration-150 origin-right
              ${hoveredIndex === projects.length + 1 ? 'text-red-400 translate-x-[-8px]' : 'text-neutral-500'}`}
                        style={{ transform: 'skewX(-10deg)' }}
                    >
                        [ RETOUR AU GARAGE ]
                    </span>
                </button>
            </div>

            {/* 📝 DESCRIPTION DYNAMIQUE (Zone du bas) */}
            <div className="mt-12 w-full text-right h-12">
                <p
                    className="text-xs font-mono text-cyan-200/50 italic tracking-wide transition-all duration-200 max-w-sm ml-auto"
                    style={{ textShadow: '0 0 4px rgba(6,182,212,0.2)' }}
                >
                    {hoveredIndex !== null && hoveredIndex < projects.length
                        ? projects[hoveredIndex].desc
                        : hoveredIndex === projects.length
                            ? "Accéder à mon CV complet avec téléchargement et aperçu."
                            : hoveredIndex === projects.length + 1
                                ? "Retourner à l'écran de sélection principal du garage."
                                : "Sélectionner un projet pour afficher ses détails..."
                    }
                </p>
            </div>

        </div>
    );
}