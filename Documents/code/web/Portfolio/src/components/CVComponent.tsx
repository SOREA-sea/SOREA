"use client";

import { portfolioData } from '@/data/portfolio';

export default function CVComponent() {
    const generateCVHTML = () => {
        return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>CV - Développeur Full-Stack SOREA</title>
    <style>
        * { margin: 0; padding: 0; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #fff; }
        .container { max-width: 210mm; height: 297mm; margin: 20px auto; padding: 40px; background: white; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
        header { border-bottom: 3px solid #06b6d4; padding-bottom: 20px; margin-bottom: 30px; }
        h1 { font-size: 32px; color: #0c4a6e; margin-bottom: 5px; }
        .contact { font-size: 12px; color: #666; }
        section { margin-bottom: 30px; }
        h2 { font-size: 16px; color: #0c4a6e; border-bottom: 2px solid #06b6d4; padding-bottom: 8px; margin-bottom: 15px; }
        .entry { margin-bottom: 15px; }
        .entry-title { font-weight: bold; color: #0c4a6e; }
        .entry-meta { font-size: 12px; color: #666; font-style: italic; }
        .entry-desc { font-size: 13px; color: #333; margin-top: 5px; line-height: 1.5; }
        ul { margin-left: 20px; font-size: 13px; color: #333; line-height: 1.6; }
        li { margin-bottom: 5px; }
        .skills { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        .skill-group { font-size: 13px; }
        .skill-group strong { color: #0c4a6e; }
        .tech-badges { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }
        .badge { background: #e0f2fe; color: #0c4a6e; padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; }
        @media print { body { margin: 0; } .no-print { display: none; } }
    </style>
</head>
<body>
    <div class="no-print" style="text-align: center; padding: 20px; background: #f0f9ff;">
        <button onclick="window.print()" style="padding: 10px 20px; background: #06b6d4; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; margin-right: 10px;">
            🖨️ Imprimer
        </button>
        <button onclick="downloadPDF()" style="padding: 10px 20px; background: #0c4a6e; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">
            📥 Télécharger PDF
        </button>
    </div>

    <div class="container">
        <header>
            <h1>Développeur Full-Stack</h1>
            <p class="contact">📧 email@example.com | 📱 +33 6 XX XX XX XX | 📍 Localité</p>
            <p class="contact">💼 Spécialisé en Web (React, Next.js) | Backend (Node.js) | Base de données (Prisma)</p>
        </header>

        <section>
            <h2>👤 PROFIL</h2>
            <p class="entry-desc">
                Développeur Full-Stack passionné par la création de solutions web modernes et performantes. 
                Expérience concrète chez SOREA sur le développement d'une plateforme de bien-être gamifiée avec 
                architecture complète (front-end React/Next.js, back-end Node.js, base de données Prisma).
            </p>
        </section>

        <section>
            <h2>🎓 FORMATION</h2>
            ${portfolioData.education.map(edu => `
                <div class="entry">
                    <p class="entry-title">${edu.institution}</p>
                    <p class="entry-meta">${edu.field} | ${edu.period}</p>
                    <p class="entry-desc">${edu.description}</p>
                </div>
            `).join('')}
        </section>

        <section>
            <h2>💼 EXPÉRIENCE PROFESSIONNELLE</h2>
            ${portfolioData.experiences.map(exp => `
                <div class="entry">
                    <p class="entry-title">${exp.position} @ ${exp.company}</p>
                    <p class="entry-meta">${exp.duration}</p>
                    <p class="entry-desc">${exp.description}</p>
                    <ul>
                        ${exp.responsibilities.map(resp => `<li>${resp}</li>`).join('')}
                    </ul>
                </div>
            `).join('')}
        </section>

        <section>
            <h2>🛠️ TECHNOLOGIES & COMPÉTENCES</h2>
            <div class="skills">
                <div class="skill-group">
                    <strong>Front-End</strong>
                    <div class="tech-badges">
                        <span class="badge">React</span>
                        <span class="badge">Next.js</span>
                        <span class="badge">TypeScript</span>
                        <span class="badge">Tailwind CSS</span>
                    </div>
                </div>
                <div class="skill-group">
                    <strong>Back-End</strong>
                    <div class="tech-badges">
                        <span class="badge">Node.js</span>
                        <span class="badge">API REST</span>
                        <span class="badge">Authentification</span>
                    </div>
                </div>
                <div class="skill-group">
                    <strong>Base de Données</strong>
                    <div class="tech-badges">
                        <span class="badge">Prisma ORM</span>
                        <span class="badge">PostgreSQL</span>
                        <span class="badge">Sécurité</span>
                    </div>
                </div>
                <div class="skill-group">
                    <strong>Outils & Pratiques</strong>
                    <div class="tech-badges">
                        <span class="badge">Git</span>
                        <span class="badge">Agile</span>
                        <span class="badge">Architecture</span>
                    </div>
                </div>
            </div>
        </section>

        <section>
            <h2>📌 POINTS CLÉS</h2>
            <ul>
                <li>✅ Plateforme SOREA : 5+ outils interactifs gamifiés</li>
                <li>✅ Architecture complète Full-Stack depuis la conception à la production</li>
                <li>✅ 10,000+ utilisateurs en base de données sécurisée</li>
                <li>✅ Augmentation de 40% des réservations de coaching</li>
                <li>✅ E-commerce multiplié par 3 en chiffre d'affaires</li>
            </ul>
        </section>
    </div>

    <script>
        function downloadPDF() {
            // Utilise l'API print avec l'option PDF
            window.print();
            // Après impression, l'utilisateur peut sauvegarder en PDF
        }
    </script>
</body>
</html>
        `;
    };

    const downloadCV = () => {
        const html = generateCVHTML();
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'CV_Developpeur_Full-Stack.html';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const openCVViewer = () => {
        const html = generateCVHTML();
        const newWindow = window.open('', '_blank');
        if (newWindow) {
            newWindow.document.write(html);
            newWindow.document.close();
        }
    };

    return (
        <div className="flex flex-col gap-6 select-none">
            <div className="text-xs font-mono tracking-widest text-cyan-500/60 mb-2 font-bold">
                [ MON CV ] ---
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 flex-wrap">
                <button
                    onClick={downloadCV}
                    className="flex items-center gap-2 bg-cyan-900/40 hover:bg-cyan-800/60 border border-cyan-500/50 text-cyan-300 text-xs px-3 py-2 rounded transition-all"
                >
                    📥 TÉLÉCHARGER
                </button>
                <button
                    onClick={openCVViewer}
                    className="flex items-center gap-2 bg-cyan-900/40 hover:bg-cyan-800/60 border border-cyan-500/50 text-cyan-300 text-xs px-3 py-2 rounded transition-all"
                >
                    👁️ OUVRIR
                </button>
            </div>

            {/* Quick Summary */}
            <div className="bg-cyan-950/20 border border-cyan-500/20 p-4 rounded">
                <h3 className="text-cyan-300 font-bold text-sm mb-2">Développeur Full-Stack</h3>
                <p className="text-cyan-200/70 text-xs mb-3">
                    Spécialisé dans la création de solutions web modernes et performantes avec React, Next.js et Node.js.
                </p>

                <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-cyan-950/40 p-2 rounded border border-cyan-500/10">
                        <p className="text-cyan-400/80 font-mono font-bold mb-1">FRONT-END</p>
                        <p className="text-cyan-200/60">React • Next.js • TypeScript</p>
                    </div>
                    <div className="bg-cyan-950/40 p-2 rounded border border-cyan-500/10">
                        <p className="text-cyan-400/80 font-mono font-bold mb-1">BACK-END</p>
                        <p className="text-cyan-200/60">Node.js • API REST • Auth</p>
                    </div>
                    <div className="bg-cyan-950/40 p-2 rounded border border-cyan-500/10">
                        <p className="text-cyan-400/80 font-mono font-bold mb-1">BASE DE DONNÉES</p>
                        <p className="text-cyan-200/60">Prisma • PostgreSQL</p>
                    </div>
                    <div className="bg-cyan-950/40 p-2 rounded border border-cyan-500/10">
                        <p className="text-cyan-400/80 font-mono font-bold mb-1">OUTILS</p>
                        <p className="text-cyan-200/60">Git • Agile • Architecture</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
