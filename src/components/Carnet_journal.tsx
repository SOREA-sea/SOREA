"use client";

import { useState } from "react";

// On réutilise la même interface pour rester raccord
interface Note {
    id: string;
    texte: string;
    date: string;
    humeurEmoji?: string;
    humeurLabel?: string;
    tag?: string;
}

// Définition des props attendues par le Journal
interface MonJournalProps {
    recherche?: string;
    setRecherche?: (val: string) => void;
    notesFiltrees: Note[];
    onSupprimerNote: (id: string) => void;
    onAjouterNote?: (texte: string) => void;
}

export default function MonJournal({ recherche: rechercheProp = "", setRecherche, notesFiltrees, onSupprimerNote, onAjouterNote }: MonJournalProps) {
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [nouveauTexte, setNouveauTexte] = useState("");
    const [notesInternes, setNotesInternes] = useState<Note[]>([]);
    const [rechercheLocale, setRechercheLocale] = useState("");

    const recherche = setRecherche ? rechercheProp : rechercheLocale;

    const handleRechercheChange = (val: string) => {
        if (setRecherche) {
            setRecherche(val);
        } else {
            setRechercheLocale(val);
        }
    };

    // 1. On détermine d'abord la base des notes à utiliser
    const baseNotes = onAjouterNote ? notesFiltrees : [...notesInternes, ...notesFiltrees];

    // 2. LOGIQUE DE RECHERCHE TEXTE GLOBALE
    const notesAffichees = baseNotes.filter((note) => {
        const rechercheFormatee = recherche.toLowerCase();
        if (!rechercheFormatee) return true;

        const texteFormate = note.texte.toLowerCase();
        const tagFormate = note.tag?.toLowerCase() ?? "";
        const humeurFormatee = note.humeurLabel?.toLowerCase() ?? "";
        const dateFormatee = note.date.toLowerCase();

        return (
            texteFormate.includes(rechercheFormatee) ||
            tagFormate.includes(rechercheFormatee) ||
            humeurFormatee.includes(rechercheFormatee) ||
            dateFormatee.includes(rechercheFormatee)
        );
    });

    const handleAjouterNote = () => {
        const texteNettoye = nouveauTexte.trim();
        if (!texteNettoye) return;

        const nouvelleNote: Note = {
            id: Date.now().toString(),
            texte: texteNettoye,
            date: new Date().toLocaleDateString("fr-FR", {
                weekday: "short",
                day: "numeric",
                month: "short",
            }),
            humeurEmoji: "😊",
            humeurLabel: "Humeur",
            tag: "rapide",
        };

        if (onAjouterNote) {
            onAjouterNote(texteNettoye);
        } else {
            setNotesInternes((prev) => [nouvelleNote, ...prev]);
        }

        setNouveauTexte("");
        setIsFormVisible(false);
    };

    return (
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
            <div className="flex gap-2 items-center mb-4">
                <div className="relative flex-1">
                    <span className="absolute left-3 top-2.5 text-gray-400 text-xs">🔍</span>
                    <input
                        type="text"
                        value={recherche}
                        onChange={(e) => handleRechercheChange(e.target.value)}
                        placeholder="Rechercher une note ou un tag"
                        className="w-full pl-8 pr-4 py-1.5 text-xs bg-white border border-gray-200 rounded-full outline-none focus:border-gray-400 placeholder-gray-400"
                    />
                </div>
                <button
                    type="button"
                    onClick={() => setIsFormVisible((prev) => !prev)}
                    className="whitespace-nowrap px-3 py-1.5 text-xs font-semibold text-[#7b2fbf] border border-gray-100 rounded-full bg-purple-50/50 hover:bg-purple-50 transition flex items-center gap-1 cursor-pointer"
                >
                    <span>{isFormVisible ? "−" : "+"}</span>
                    {isFormVisible ? "Masquer" : "Ajouter une entrée"}
                </button>
            </div>

            {isFormVisible && (
                <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-3xl">
                    <textarea
                        value={nouveauTexte}
                        onChange={(e) => setNouveauTexte(e.target.value)}
                        placeholder="Écris ton entrée de journal ici..."
                        className="w-full min-h-[108px] p-3 text-xs bg-white border border-gray-200 rounded-2xl outline-none focus:border-gray-400 resize-none"
                    />
                    <div className="flex justify-between items-center gap-2 mt-3">
                        <button
                            type="button"
                            onClick={() => {
                                setNouveauTexte("");
                                setIsFormVisible(false);
                            }}
                            className="px-4 py-2 text-xs font-semibold text-gray-700 bg-gray-100 border border-gray-200 rounded-xl hover:bg-gray-200 transition"
                        >
                            Annuler
                        </button>
                        <button
                            type="button"
                            onClick={handleAjouterNote}
                            disabled={!nouveauTexte.trim()}
                            className="px-4 py-2 text-xs font-semibold text-white bg-[#7b2fbf] disabled:bg-gray-300 rounded-xl hover:bg-[#6a24b8] transition"
                        >
                            Ajouter au journal
                        </button>
                    </div>
                </div>
            )}

            {/* Liste des entrées de journal */}
            <div className="space-y-4">
                {notesAffichees.length === 0 ? (
                    <div className="text-center py-8 text-xs text-gray-400 border border-dashed border-gray-200 rounded-2xl bg-gray-50/30">
                        {recherche ? `Aucun résultat pour "${recherche}"` : "Aucune note pour le moment."}
                    </div>
                ) : (
                    notesAffichees.map((note) => (
                        <div key={note.id} className="p-4 bg-gray-50/40 rounded-2xl border border-gray-100/70 space-y-3">
                            {/* Meta Données (Humeur, Date, Supprimer) */}
                            <div className="flex justify-between items-center text-[11px]">
                                <div className="flex items-center gap-1.5 font-medium text-[#7b2fbf]">
                                    <span>{note.humeurEmoji}</span>
                                    <span className="underline decoration-dotted">{note.humeurLabel}</span>
                                    <span className="text-gray-400 font-normal">• {note.date}</span>
                                </div>
                                <button
                                    onClick={() => onSupprimerNote(note.id)}
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
    );
}