"use client";

import { useState, useEffect } from "react";

interface Note {
    id: string;
    texte: string;
    date: string;
    humeurEmoji?: string;
    humeurLabel?: string;
    tag?: string;
}

interface MonJournalProps {
    recherche?: string;
    setRecherche?: (val: string) => void;
    notesFiltrees?: Note[];
    onSupprimerNote?: (id: string) => void;
    onAjouterNote?: (texte: string) => void;
}

function formatDateFr(iso: string) {
    return new Date(iso).toLocaleDateString("fr-FR", {
        weekday: "short",
        day: "numeric",
        month: "short",
    });
}

export default function MonJournal({
    recherche: rechercheProp = "",
    setRecherche,
    notesFiltrees,
    onSupprimerNote,
    onAjouterNote,
}: MonJournalProps) {
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [nouveauTexte, setNouveauTexte] = useState("");
    const [rechercheLocale, setRechercheLocale] = useState("");
    const [notesPersistantes, setNotesPersistantes] = useState<Note[]>([]);
    const [chargement, setChargement] = useState(true);

    // Mode autonome : pas de onAjouterNote fourni par le parent
    // → le composant charge/sauvegarde lui-même via l'API
    const modeAutonome = !onAjouterNote;

    const recherche = setRecherche ? rechercheProp : rechercheLocale;

    const handleRechercheChange = (val: string) => {
        if (setRecherche) setRecherche(val);
        else setRechercheLocale(val);
    };

    useEffect(() => {
        if (!modeAutonome) {
            setChargement(false);
            return;
        }
        fetch("/api/carnet/journal")
            .then((r) => r.json())
            .then((res) => {
                const notes: Note[] = (res.data || []).map((n: any) => ({
                    id: String(n.id),
                    texte: n.texte,
                    date: formatDateFr(n.createdAt),
                    humeurEmoji: n.humeurEmoji,
                    humeurLabel: n.humeurLabel,
                    tag: n.tag,
                }));
                setNotesPersistantes(notes);
            })
            .catch((err) => console.error("Erreur chargement journal:", err))
            .finally(() => setChargement(false));
    }, [modeAutonome]);

    const baseNotes = modeAutonome ? notesPersistantes : (notesFiltrees || []);

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

    const handleAjouterNote = async () => {
        const texteNettoye = nouveauTexte.trim();
        if (!texteNettoye) return;

        if (!modeAutonome) {
            onAjouterNote?.(texteNettoye);
            setNouveauTexte("");
            setIsFormVisible(false);
            return;
        }

        const noteTemp: Note = {
            id: `temp-${Date.now()}`,
            texte: texteNettoye,
            date: formatDateFr(new Date().toISOString()),
            humeurEmoji: "😊",
            humeurLabel: "Humeur",
            tag: "rapide",
        };
        setNotesPersistantes((prev) => [noteTemp, ...prev]);
        setNouveauTexte("");
        setIsFormVisible(false);

        try {
            const res = await fetch("/api/carnet/journal", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    texte: texteNettoye,
                    humeurEmoji: "😊",
                    humeurLabel: "Humeur",
                    tag: "rapide",
                }),
            });
            if (!res.ok) throw new Error("Échec sauvegarde");
            const data = await res.json();
            setNotesPersistantes((prev) =>
                prev.map((n) =>
                    n.id === noteTemp.id
                        ? {
                              id: String(data.data.id),
                              texte: data.data.texte,
                              date: formatDateFr(data.data.createdAt),
                              humeurEmoji: data.data.humeurEmoji,
                              humeurLabel: data.data.humeurLabel,
                              tag: data.data.tag,
                          }
                        : n
                )
            );
        } catch (err) {
            console.error(err);
            setNotesPersistantes((prev) => prev.filter((n) => n.id !== noteTemp.id));
        }
    };

    const handleSupprimerNote = async (id: string) => {
        if (!modeAutonome) {
            onSupprimerNote?.(id);
            return;
        }
        const ancien = notesPersistantes;
        setNotesPersistantes((prev) => prev.filter((n) => n.id !== id));
        try {
            const res = await fetch(`/api/carnet/journal?id=${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Échec suppression");
        } catch (err) {
            console.error(err);
            setNotesPersistantes(ancien);
        }
    };

    if (modeAutonome && chargement) {
        return (
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 text-center text-xs text-gray-400">
                Chargement de votre journal…
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-[#7b2fbf] flex items-center justify-center text-white text-sm">
                    📓
                </div>
                <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-base">Mon journal</h3>
                    <p className="text-xs text-gray-500">Entrées triables, filtrables, supprimables</p>
                </div>
            </div>

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

            <div className="space-y-4">
                {notesAffichees.length === 0 ? (
                    <div className="text-center py-8 text-xs text-gray-400 border border-dashed border-gray-200 rounded-2xl bg-gray-50/30">
                        {recherche ? `Aucun résultat pour "${recherche}"` : "Aucune note pour le moment."}
                    </div>
                ) : (
                    notesAffichees.map((note) => (
                        <div key={note.id} className="p-4 bg-gray-50/40 rounded-2xl border border-gray-100/70 space-y-3">
                            <div className="flex justify-between items-center text-[11px]">
                                <div className="flex items-center gap-1.5 font-medium text-[#7b2fbf]">
                                    <span>{note.humeurEmoji}</span>
                                    <span className="underline decoration-dotted">{note.humeurLabel}</span>
                                    <span className="text-gray-400 font-normal">• {note.date}</span>
                                </div>
                                <button
                                    onClick={() => handleSupprimerNote(note.id)}
                                    className="text-gray-400 hover:text-red-500 transition underline cursor-pointer"
                                >
                                    Supprimer
                                </button>
                            </div>
                            <p className="text-xs text-gray-800 leading-relaxed font-normal whitespace-pre-wrap">
                                {note.texte}
                            </p>
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