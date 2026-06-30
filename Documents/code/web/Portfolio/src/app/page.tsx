"use client";

import { useMenu } from '@/context/MenuContext';
import MainMenu from '@/components/MainMenu';
import ProjectsMenu from '@/components/ProjectsMenu';
import AboutComponent from '@/components/AboutComponent';
import SkillsComponent from '@/components/SkillsComponent';
import ProjectsComponent from '@/components/ProjectsComponent';
import CVComponent from '@/components/CVComponent';

export default function GaragePortfolio() {
    const { activeMenu } = useMenu();

    return (
        <div className="relative h-screen w-screen bg-black text-white overflow-hidden font-sans select-none">

            {/* 📺 1. BUFFER VIDÉO D'ARRIÈRE-PLAN */}
            <div className="absolute inset-0 z-0 w-full h-full pointer-events-none">
                <video
                    key={activeMenu}
                    autoPlayq
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover object-center"
                >
                    <source src={activeMenu === 'HOME' ? '/videos/menu-home.mp4' : '/videos/menu-projects.mp4'} type="video/mp4" />
                </video>
            </div>

            {/* 🟦 2. LE CADRE BLEU TRANSLUCIDE GLOBAL (Fidèle à l'original) */}
            {/* Cet overlay donne la teinte bleutée en dégradé sur tout le jeu pour lier l'UI au décor */}
            <div className="absolute inset-0 z-10 bg-gradient-to-br from-cyan-950/40 via-transparent to-neutral-950/80 pointer-events-none" />

            {/* 🏁 3. L'INTERFACE HUD COMPLET (Z-index 20 pour passer devant le fond) */}
            <div className="relative z-20 h-full flex flex-col justify-between">

                {/* ── BANDEAU SUPÉRIEUR ── */}
                <div className="w-full flex items-stretch h-16 bg-gradient-to-r from-cyan-950/80 via-cyan-900/40 to-transparent border-b border-cyan-500/30">
                    {/* Logo Underground incliné à gauche */}
                    <div className="flex items-center bg-cyan-950/90 px-12 border-r border-cyan-400/40 relative skew-x-[-12deg] -translate-x-3">
                        <div className="scale-110 skew-x-[12deg] font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                            NEED FOR SPEED <span className="text-cyan-400 block text-xs tracking-widest not-italic font-mono -mt-1">UNDERGROUND</span>
                        </div>
                    </div>

                    {/* Zone vide au centre qui laisse respirer le haut du garage */}
                    <div className="flex-1" />
                </div>

                {/* ── ZONE CENTRALE (Contenu des menus injecté à droite) ── */}
                <div className="flex-1 flex justify-end items-center pr-16 lg:pr-24 overflow-y-auto max-h-[calc(100vh-128px)]">
                    <div className="w-[450px] bg-gradient-to-l from-black/50 via-black/20 to-transparent p-6 rounded-r-md">
                        {activeMenu === 'HOME' && <MainMenu />}
                        {activeMenu === 'ABOUT' && <AboutComponent />}
                        {activeMenu === 'SKILLS' && <SkillsComponent />}
                        {activeMenu === 'PROJECTS' && <ProjectsComponent />}
                        {activeMenu === 'CV' && <CVComponent />}
                        {activeMenu === 'CONTACT' && <ProjectsMenu />}
                    </div>
                </div>

                {/* ── BARRE DE NAVIGATION INFÉRIEURE (HUD BAS) ── */}
                {/* Recrée la ligne rouge/bleue fine et les contrôles d'actions du lecteur */}
                <div className="w-full flex flex-col font-mono text-xs text-cyan-400/90">

                    {/* La fine ligne de délimitation typique */}
                    <div className="w-full h-[2px] bg-gradient-to-r from-cyan-500 via-cyan-500/40 to-transparent shadow-[0_0_8px_#06b6d4]" />

                    {/* Les boutons de touches de contrôle */}
                    <div className="bg-black/80 backdrop-blur-sm px-12 py-3 flex justify-between items-center border-t border-cyan-950">

                        {/* Commandes de navigation de gauche */}
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2 group cursor-pointer">
                                <span className="bg-cyan-950 border border-cyan-400/60 px-1.5 py-0.5 rounded text-[10px] font-bold text-white shadow-[0_0_6px_rgba(34,211,238,0.2)]">
                                    ↲
                                </span>
                                <span className="text-neutral-400 uppercase font-bold tracking-wider group-hover:text-white transition-colors">Select</span>
                            </div>

                            <div className="flex items-center gap-2 group cursor-pointer">
                                <span className="bg-cyan-950 border border-cyan-400/60 px-1 py-0.5 rounded text-[10px] font-bold text-white shadow-[0_0_6px_rgba(34,211,238,0.2)]">
                                    Esc
                                </span>
                                <span className="text-neutral-400 uppercase font-bold tracking-wider group-hover:text-white transition-colors">Back</span>
                            </div>
                        </div>

                        {/* Liens externes intégrés comme des options système à droite */}
                        <div className="flex items-center gap-8">
                            <a
                                href="https://github.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-white hover:drop-shadow-[0_0_6px_#22d3ee] transition-all tracking-widest uppercase font-bold"
                            >
                // [ GITHUB_REPOSITORY ]
                            </a>
                            <a
                                href="https://linkedin.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-white hover:drop-shadow-[0_0_6px_#22d3ee] transition-all tracking-widest uppercase font-bold"
                            >
                // [ LINKEDIN_PROFILE ]
                            </a>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}