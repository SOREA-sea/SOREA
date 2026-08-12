"use client";
import { useState, useEffect } from "react";

interface QuickNote {
    id: string;
    texte: string;
}

export default function JournalBlocNotes() {
    const [noteEnCours, setNoteEnCours] = useState("");
    const [notesRapides, setNotesRapides] = useState<QuickNote[]>([]);
    const [chargement, setChargement] = useState(true);

    useEffect(() => {
        fetch("/api/carnet/bloc-notes")
            .then((r) => r.json())
            .then((res) => {
                const notes = (res.data || []).map((n: any) => ({
                    id: String(n.id),
                    texte: n.texte,
                }));
                setNotesRapides(notes);
            })
            .catch((err) => console.error("Erreur chargement bloc-notes:", err))
            .finally(() => setChargement(false));
    }, []);

    const enregistrerBlocNote = async () => {
        const texte = noteEnCours.trim();
        if (!texte) return;

        const noteTemp: QuickNote = { id: `temp-${Date.now()}`, texte };
        setNotesRapides((prev) => [noteTemp, ...prev]);
        setNoteEnCours("");

        try {
            const res = await fetch("/api/carnet/bloc-notes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ texte }),
            });
            if (!res.ok) throw new Error("Échec sauvegarde");
            const data = await res.json();
            setNotesRapides((prev) =>
                prev.map((n) =>
                    n.id === noteTemp.id ? { id: String(data.data.id), texte: data.data.texte } : n
                )
            );
        } catch (err) {
            console.error(err);
            setNotesRapides((prev) => prev.filter((n) => n.id !== noteTemp.id));
        }
    };

    const effacerBlocNotes = () => {
        setNoteEnCours("");
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6 p-4 bg-[#f3edf7] min-h-screen font-sans text-gray-800">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex items-start gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-[#9d4edd] flex items-center justify-center text-white text-sm">
                        📝
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 text-base">Bloc-notes rapide</h3>
                        <p className="text-xs text-gray-500">Écrivez pendant 5 minutes. Tout est enregistré.</p>
                    </div>
                </div>
                <textarea
                    value={noteEnCours}
                    onChange={(e) => setNoteEnCours(e.target.value)}
                    placeholder="Idées, gratitude, respiration, étirements..."
                    className="w-full h-32 p-4 text-sm bg-white border border-gray-200 rounded-2xl outline-none focus:border-black transition resize-none placeholder-gray-400"
                />
                <div className="flex justify-between items-center mt-4">
                    <button
                        onClick={effacerBlocNotes}
                        className="px-4 py-1.5 text-xs font-semibold text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                    >
                        Effacer
                    </button>
                    <button
                        onClick={enregistrerBlocNote}
                        className="px-4 py-1.5 text-xs font-semibold text-white bg-[#9d4edd] hover:bg-[#7b2fbf] rounded-lg shadow-sm transition flex items-center gap-1 cursor-pointer"
                    >
                        <span>+</span> Enregistrer
                    </button>
                </div>
            </div>

            {!chargement && notesRapides.length > 0 && (
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
                    <div className="flex items-start gap-3 mb-4">
                        <div className="w-8 h-8 rounded-lg bg-[#9d4edd] flex items-center justify-center text-white text-sm">
                            📌
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 text-base">Notes sauvegardées</h3>
                            <p className="text-xs text-gray-500">Vos entrées récentes apparaissent ici.</p>
                        </div>
                    </div>
                    <div className="space-y-3">
                        {notesRapides.map((note) => (
                            <div key={note.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 text-xs text-gray-700">
                                {note.texte}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}