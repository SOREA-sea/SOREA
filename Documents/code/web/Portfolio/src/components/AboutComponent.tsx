"use client";

import { portfolioData } from '@/data/portfolio';
import { useState } from 'react';

export default function AboutComponent() {
    const [activeTab, setActiveTab] = useState<'education' | 'experience'>('education');

    return (
        <div className="flex flex-col gap-6 select-none">
            <div className="text-xs font-mono tracking-widest text-cyan-500/60 mb-2 font-bold">
                [ PARCOURS & EXPÉRIENCES ] ---
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-cyan-500/30">
                <button
                    onClick={() => setActiveTab('education')}
                    className={`pb-2 px-4 font-mono text-sm transition-all ${activeTab === 'education'
                            ? 'text-cyan-400 border-b-2 border-cyan-400'
                            : 'text-cyan-500/50 hover:text-cyan-300'
                        }`}
                >
                    FORMATION
                </button>
                <button
                    onClick={() => setActiveTab('experience')}
                    className={`pb-2 px-4 font-mono text-sm transition-all ${activeTab === 'experience'
                            ? 'text-cyan-400 border-b-2 border-cyan-400'
                            : 'text-cyan-500/50 hover:text-cyan-300'
                        }`}
                >
                    EXPÉRIENCE PRO
                </button>
            </div>

            {/* Content */}
            <div className="space-y-4">
                {activeTab === 'education' && (
                    <div className="space-y-3">
                        {portfolioData.education.map((edu, idx) => (
                            <div key={idx} className="bg-cyan-950/20 border border-cyan-500/20 p-4 rounded">
                                <h3 className="text-cyan-300 font-bold text-sm">{edu.institution}</h3>
                                <p className="text-cyan-500/70 text-xs font-mono">{edu.field}</p>
                                <p className="text-cyan-400/50 text-xs mt-1">{edu.period}</p>
                                <p className="text-cyan-200/60 text-xs mt-2">{edu.description}</p>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'experience' && (
                    <div className="space-y-3">
                        {portfolioData.experiences.map((exp, idx) => (
                            <div key={idx} className="bg-cyan-950/20 border border-cyan-500/20 p-4 rounded">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="text-cyan-300 font-bold text-sm">{exp.position}</h3>
                                        <p className="text-cyan-500/70 text-xs font-mono">{exp.company}</p>
                                    </div>
                                    <p className="text-cyan-400/50 text-xs">{exp.duration}</p>
                                </div>
                                <p className="text-cyan-200/60 text-xs mb-3">{exp.description}</p>
                                <ul className="text-cyan-200/50 text-xs space-y-1">
                                    {exp.responsibilities.map((resp, i) => (
                                        <li key={i} className="flex items-start gap-2">
                                            <span className="text-cyan-400 mt-0.5">▸</span>
                                            <span>{resp}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
