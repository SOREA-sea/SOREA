"use client";

import { portfolioData, generateSkillsCSV } from '@/data/portfolio';
import { useState } from 'react';

export default function SkillsComponent() {
    const [expandedSkill, setExpandedSkill] = useState<number | null>(0);
    const [showDocuments, setShowDocuments] = useState(false);

    const downloadSkillsAsCSV = () => {
        const csv = generateSkillsCSV();
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'Tableau_Synthese_Competences.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const openSkillsViewer = () => {
        // Crée une page pour visualiser le tableau
        const newWindow = window.open('', '_blank');
        if (newWindow) {
            const csv = generateSkillsCSV();
            const html = `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Tableau de Synthèse - Compétences</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; background: #0f172a; color: #e0f2fe; }
                        h1 { color: #06b6d4; }
                        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                        th, td { padding: 12px; text-align: left; border: 1px solid #164e63; }
                        th { background: #0c4a6e; color: #06b6d4; }
                        tr:nth-child(even) { background: #082f49; }
                        .button-container { margin-bottom: 20px; }
                        button { padding: 10px 20px; margin-right: 10px; background: #06b6d4; color: #000; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; }
                        button:hover { background: #22d3ee; }
                    </style>
                </head>
                <body>
                    <h1>📊 Tableau de Synthèse - Compétences Majeures</h1>
                    <div class="button-container">
                        <button onclick="window.print()">🖨️ Imprimer</button>
                        <button onclick="downloadCSV()">📥 Télécharger CSV</button>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Compétence</th>
                                <th>Catégorie</th>
                                <th>Description</th>
                                <th>Technologies</th>
                                <th>Impact</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${portfolioData.skills.map(skill => `
                                <tr>
                                    <td><strong>${skill.name}</strong></td>
                                    <td>${skill.category}</td>
                                    <td>${skill.description}</td>
                                    <td>${skill.technologies.join(', ')}</td>
                                    <td>${skill.impact}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    <script>
                        function downloadCSV() {
                            const csv = \`${csv}\`;
                            const blob = new Blob([csv], { type: 'text/csv' });
                            const url = URL.createObjectURL(blob);
                            const link = document.createElement('a');
                            link.href = url;
                            link.download = 'Tableau_Synthese_Competences.csv';
                            link.click();
                        }
                    </script>
                </body>
                </html>
            `;
            newWindow.document.write(html);
            newWindow.document.close();
        }
    };

    return (
        <div className="flex flex-col gap-6 select-none">
            <div className="text-xs font-mono tracking-widest text-cyan-500/60 mb-2 font-bold">
                [ TABLEAU DE SYNTHÈSE ] ---
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 flex-wrap">
                <button
                    onClick={downloadSkillsAsCSV}
                    className="flex items-center gap-2 bg-cyan-900/40 hover:bg-cyan-800/60 border border-cyan-500/50 text-cyan-300 text-xs px-3 py-2 rounded transition-all"
                >
                    📥 TÉLÉCHARGER
                </button>
                <button
                    onClick={openSkillsViewer}
                    className="flex items-center gap-2 bg-cyan-900/40 hover:bg-cyan-800/60 border border-cyan-500/50 text-cyan-300 text-xs px-3 py-2 rounded transition-all"
                >
                    👁️ OUVRIR
                </button>
            </div>

            {/* Skills List */}
            <div className="space-y-3">
                {portfolioData.skills.map((skill, idx) => (
                    <div
                        key={idx}
                        className="bg-cyan-950/20 border border-cyan-500/20 p-4 rounded cursor-pointer hover:border-cyan-500/40 transition-all"
                        onClick={() => setExpandedSkill(expandedSkill === idx ? null : idx)}
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-cyan-300 font-bold text-sm">{skill.name}</h3>
                                <p className="text-cyan-500/70 text-xs font-mono">{skill.category}</p>
                            </div>
                            <span className="text-cyan-400 text-lg">
                                {expandedSkill === idx ? '▼' : '▶'}
                            </span>
                        </div>

                        {expandedSkill === idx && (
                            <div className="mt-3 pt-3 border-t border-cyan-500/20 space-y-2">
                                <p className="text-cyan-200/70 text-xs">{skill.description}</p>
                                <div className="flex flex-wrap gap-1">
                                    {skill.technologies.map((tech, i) => (
                                        <span key={i} className="bg-cyan-500/20 text-cyan-300 text-xs px-2 py-1 rounded">
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                                <p className="text-cyan-400/60 text-xs font-mono">💡 {skill.impact}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
