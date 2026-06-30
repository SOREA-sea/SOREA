"use client";

import { portfolioData } from '@/data/portfolio';
import { useState } from 'react';

export default function ProjectsComponent() {
    const [expandedProject, setExpandedProject] = useState<number | null>(0);

    return (
        <div className="flex flex-col gap-6 select-none">
            <div className="text-xs font-mono tracking-widest text-cyan-500/60 mb-2 font-bold">
                [ PROJETS MENÉS EN ENTREPRISE ] ---
            </div>

            {/* Company Info Section */}
            <div className="bg-cyan-950/30 border-l-4 border-cyan-500 p-4 rounded">
                <div className="flex items-start justify-between mb-3">
                    <div>
                        <h3 className="text-cyan-300 font-bold text-base">{portfolioData.company.name}</h3>
                        <p className="text-cyan-400/70 text-xs font-mono">{portfolioData.company.description}</p>
                    </div>
                    <span className="bg-cyan-500/20 text-cyan-300 text-xs px-2 py-1 rounded font-mono">
                        {portfolioData.company.reach}
                    </span>
                </div>

                <div className="space-y-1 text-xs text-cyan-200/60">
                    <p><strong>Domaine:</strong> {portfolioData.company.domainSize}</p>
                    <p><strong>Taille:</strong> {portfolioData.company.sizeCategory}</p>
                    <p><strong>Focus:</strong> {portfolioData.company.focus}</p>
                    <div className="mt-2 pt-2 border-t border-cyan-500/20">
                        <p className="font-mono text-cyan-400/80 text-xs mb-1">Les trois piliers :</p>
                        {portfolioData.company.pillars.map((pillar, i) => (
                            <p key={i} className="flex items-start gap-2">
                                <span className="text-cyan-400">✓</span>
                                <span>{pillar}</span>
                            </p>
                        ))}
                    </div>
                </div>
            </div>

            {/* Projects List */}
            <div className="space-y-3">
                {portfolioData.projects.map((project, idx) => (
                    <div
                        key={idx}
                        className="bg-cyan-950/20 border border-cyan-500/20 p-4 rounded cursor-pointer hover:border-cyan-500/40 transition-all"
                        onClick={() => setExpandedProject(expandedProject === idx ? null : idx)}
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <h3 className="text-cyan-300 font-bold text-sm">{project.name}</h3>
                                <p className="text-cyan-400/70 text-xs mt-1">{project.objective}</p>
                            </div>
                            <span className="text-cyan-400 text-lg ml-2">
                                {expandedProject === idx ? '▼' : '▶'}
                            </span>
                        </div>

                        {expandedProject === idx && (
                            <div className="mt-3 pt-3 border-t border-cyan-500/20 space-y-3">
                                <div>
                                    <p className="text-cyan-400/80 text-xs font-mono font-bold mb-1">TECHNOLOGIES:</p>
                                    <div className="flex flex-wrap gap-1">
                                        {project.technologies.map((tech, i) => (
                                            <span key={i} className="bg-cyan-500/20 text-cyan-300 text-xs px-2 py-1 rounded">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <p className="text-cyan-400/80 text-xs font-mono font-bold mb-1">FONCTIONNALITÉS:</p>
                                    <ul className="text-cyan-200/60 text-xs space-y-1">
                                        {project.features.map((feature, i) => (
                                            <li key={i} className="flex items-start gap-2">
                                                <span className="text-cyan-400">•</span>
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="bg-cyan-950/40 p-2 rounded border border-cyan-500/10">
                                    <p className="text-cyan-400/80 text-xs font-mono font-bold mb-1">RÉSULTATS:</p>
                                    <p className="text-cyan-200/50 text-xs">✨ {project.results}</p>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
