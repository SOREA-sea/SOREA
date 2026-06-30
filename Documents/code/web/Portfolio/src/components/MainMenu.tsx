"use client";

import { useMenu } from '@/context/MenuContext';
import { useState } from 'react';

export default function MainMenu() {
    const { setActiveMenu } = useMenu();
    // On stocke l'index de l'élément survolé pour appliquer des effets dynamiques
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    // Définition de tes choix de menu typés "NFSU"
    const menuItems = [
        { label: 'MON PARCOURS', action: () => setActiveMenu('ABOUT') },
        { label: 'COMPÉTENCES', action: () => setActiveMenu('SKILLS') },
        { label: 'MES PROJETS', action: () => setActiveMenu('PROJECTS') },
        { label: 'ME CONTACTER', action: () => setActiveMenu('CONTACT') },
    ];

    return (
        <div className="flex flex-col items-end gap-2 select-none">

            {/* Petit entête de section discret style HUD de jeu */}
            <div className="text-xs font-mono tracking-widest text-cyan-500/60 mb-4 font-bold">
                [ SELECT MODE ] ------------------
            </div>

            <div className="flex flex-col gap-4 w-full">
                {menuItems.map((item, index) => {
                    const isHovered = hoveredIndex === index;

                    return (
                        <button
                            key={index}
                            onClick={item.action}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            className="relative text-right w-full focus:outline-none group"
                        >
                            {/* Le texte du bouton */}
                            <span
                                className={`block text-4xl font-black tracking-tighter uppercase transition-all duration-150 ease-out origin-right italic
                  ${isHovered
                                        ? 'text-white scale-105 translate-x-[-16px] drop-shadow-[0_0_12px_rgba(34,211,238,0.8)]'
                                        : 'text-cyan-200/40'
                                    }`}
                                style={{
                                    // Un léger effet penché supplémentaire typique des menus de course
                                    transform: isHovered ? 'skewX(-10deg) scale(1.05)' : 'skewX(-10deg)',
                                }}
                            >
                                {item.label}
                            </span>

                            {/* Petite barre de sélection "Néon" qui s'allume à gauche du texte quand on survole */}
                            <div
                                className={`absolute right-0 top-1/2 -translate-y-1/2 h-1 bg-cyan-400 shadow-[0_0_15px_#22d3ee] transition-all duration-150 ease-out rounded-full
                  ${isHovered ? 'w-8 opacity-100' : 'w-0 opacity-0'}`}
                            />
                        </button>
                    );
                })}
            </div>

            {/* Description dynamique en bas du menu (Style NFSU) */}
            <div className="mt-8 text-xs font-mono text-neutral-500 text-right max-w-xs h-8 transition-all duration-200">
                {hoveredIndex === 0 && "Parcours scolaire, expériences professionnelles et formation SLAM."}
                {hoveredIndex === 1 && "Tableau de synthèse avec 5 compétences majeures en développement web."}
                {hoveredIndex === 2 && "Projets menés chez SOREA et technologies utilisées."}
                {hoveredIndex === 3 && "Télécharger mon CV ou me contacter pour discuter d'opportunités."}
                {hoveredIndex === null && "Utiliser la souris pour naviguer dans mon portfolio..."}
            </div>

        </div>
    );
}