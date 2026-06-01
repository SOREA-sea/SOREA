"use client";
import { useState } from "react";

// Structure d'une entrée de journal
interface Note {
    id: string;
    texte: string;
    date: string;
    humeurEmoji?: string;
    humeurLabel?: string;
    tag?: string;
}

export default function JournalBlocNotes() {
    // --- ÉTATS ---
    const [noteEnCours, setNoteEnCours] = useState("");
    const [notes, setNotes] = useState<Note[]>([
        // Exemples par défaut correspondants à tes captures
        {
            id: "1",
            texte: "Bonjour tous le monde ! bienvenue dans l'univers SOREA",
            date: "ven. 24 oct.",
            humeurEmoji: "🥳",
            humeurLabel: "Humeur",
            tag: "rapide",
        },
        {
            id: "2",
            texte: "La gratitude me rend plus optimiste !",
            date: "ven. 24 oct.",
            humeurEmoji: "🤩",
            humeurLabel: "Humeur",
            tag: "rapide",
        },
    ]);
    const [recherche, setRecherche] = useState("");

    // --- ACTIONS ---
    const ajouterAuJournal = () => {
        if (!noteEnCours.trim()) return;

        const nouvelleNote: Note = {
            id: Date.now().toString(),
            texte: noteEnCours,
            date: "ven. 24 oct.", // Tu pourras dynamiser avec un format de date JS plus tard
            humeurEmoji: "😊",
            humeurLabel: "Humeur",
            tag: "rapide",
        };

        setNotes([nouvelleNote, ...notes]); // Ajoute la note au début de la liste
        setNoteEnCours(""); // Vide le textarea
    };

    const effacerBlocNotes = () => {
        setNoteEnCours("");
    };

    const supprimerNote = (id: string) => {
        setNotes(notes.filter((note) => note.id !== id));
    };

    // Filtrer les notes selon la recherche
    const notesFiltrees = notes.filter((note) =>
        note.texte.toLowerCase().includes(recherche.toLowerCase()) ||
        (note.tag && note.tag.toLowerCase().includes(recherche.toLowerCase()))
    );

    return (
        <div className="max-w-2xl mx-auto space-y-6 p-4 bg-[#f3edf7] min-h-screen font-sans text-gray-800">

            {/* ========================================================= */}
            {/* 1. BLOC-NOTES RAPIDE                                      */}
            {/* ========================================================= */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                {/* Header */}
                <div className="flex items-start gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-[#9d4edd] flex items-center justify-center text-white text-sm">
                        📝
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 text-base">Bloc-notes rapide</h3>
                        <p className="text-xs text-gray-500">Écrivez pendant 5 minutes. Tout est enregistré localement.</p>
                    </div>
                </div>

                {/* Textarea */}
                <textarea
                    value={noteEnCours}
                    onChange={(e) => setNoteEnCours(e.target.value)}
                    placeholder="Idées, gratitude, respiration, étirements..."
                    className="w-full h-32 p-4 text-sm bg-white border border-gray-200 rounded-2xl outline-none focus:border-black transition resize-none placeholder-gray-400"
                />

                {/* Boutons d'action */}
                <div className="flex justify-between items-center mt-4">
                    <button
                        onClick={effacerBlocNotes}
                        className="px-4 py-1.5 text-xs font-semibold text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                    >
                        Effacer
                    </button>
                    <button
                        onClick={ajouterAuJournal}
                        className="px-4 py-1.5 text-xs font-semibold text-white bg-[#9d4edd] hover:bg-[#7b2fbf] rounded-lg shadow-sm transition flex items-center gap-1 cursor-pointer"
                    >
                        <span>+</span> Ajouter au journal
                    </button>
                </div>
            </div>

            {/* ========================================================= */}
            {/* 2. MON JOURNAL                                            */}
            {/* ========================================================= */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                {/* Header */}
                <div className="flex items-start gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-[#7b2fbf] flex items-center justify-center text-white text-sm">
                        📓
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-gray-900 text-base">Mon journal</h3>
                        <p className="text-xs text-gray-500">Entrées triables, filtrables, supprimables</p>
                    </div>
                </div>

                {/* Barre de Recherche et Bouton Nouvelle Entrée */}
                <div className="flex gap-2 items-center mb-6">
                    <div className="relative flex-1">
                        <span className="absolute left-3 top-2.5 text-gray-400 text-xs">🔍</span>
                        <input
                            type="text"
                            value={recherche}
                            onChange={(e) => setRecherche(e.target.value)}
                            placeholder="Rechercher une note ou un tag"
                            className="w-full pl-8 pr-4 py-1.5 text-xs bg-white border border-gray-200 rounded-full outline-none focus:border-gray-400 placeholder-gray-400"
                        />
                    </div>
                    <button className="whitespace-nowrap px-3 py-1.5 text-xs font-semibold text-[#7b2fbf] border border-gray-100 rounded-full bg-purple-50/50 hover:bg-purple-50 transition flex items-center gap-1 cursor-pointer">
                        <span>+</span> Nouvelle entrée
                    </button>
                </div>

                {/* Liste des entrées de journal */}
                <div className="space-y-4">
                    {notesFiltrees.length === 0 ? (
                        <div className="text-center py-8 text-xs text-gray-400 border border-dashed border-gray-200 rounded-2xl bg-gray-50/30">
                            Aucune note pour le moment.
                        </div>
                    ) : (
                        notesFiltrees.map((note) => (
                            <div key={note.id} className="p-4 bg-gray-50/40 rounded-2xl border border-gray-100/70 space-y-3">
                                {/* Meta Données (Humeur, Date, Supprimer) */}
                                <div className="flex justify-between items-center text-[11px]">
                                    <div className="flex items-center gap-1.5 font-medium text-[#7b2fbf]">
                                        <span>{note.humeurEmoji}</span>
                                        <span className="underline decoration-dotted">{note.humeurLabel}</span>
                                        <span className="text-gray-400 font-normal">• {note.date}</span>
                                    </div>
                                    <button
                                        onClick={() => supprimerNote(note.id)}
                                        className="text-gray-400 hover:text-red-500 transition underline cursor-pointer"
                                    >
                                        Supprimer
                                    </button>
                                </div>

                                {/* Contenu du texte */}
                                <p className="text-xs text-gray-800 leading-relaxed font-normal whitespace-pre-wrap">
                                    {note.texte}
                                </p>

                                {/* Badge Tag */}
                                {note.tag && (
                                    <div className="pt-1">
                                        <span className="text-[10px] px-2 py-0.5 bg-[#fef3c7] text-[#d97706] rounded font-medium">
                                            📌 {note.tag}
                                        </span>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>

            </div>

        </div>
    );
}