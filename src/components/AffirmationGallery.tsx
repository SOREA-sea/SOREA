"use client";

import React, { useState } from "react";
import { X, Plus, Edit2, Trash2 } from "lucide-react";

interface AffirmationCard {
  id: string;
  title: string; // Ajout du titre
  text: string;  // La citation
}

interface AffirmationGalleryProps {}

export default function AffirmationGallery({}: AffirmationGalleryProps) {
  const [affirmations, setAffirmations] = React.useState<AffirmationCard[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sorea_affirmations");
      if (saved) return JSON.parse(saved);
    }
    return [
      { id: "1", title: "Confiance en soi", text: "● Je suis confiant(e)" },
      { id: "2", title: "Paix intérieure", text: "● Je cultive la paix" }
    ];
  });

  const [trash, setTrash] = React.useState<AffirmationCard[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sorea_affirmations_trash");
      if (saved) return JSON.parse(saved);
    }
    return [];
  });

  // Sauvegarde automatique dans le localStorage
  React.useEffect(() => {
    localStorage.setItem("sorea_affirmations", JSON.stringify(affirmations));
    localStorage.setItem("sorea_affirmations_trash", JSON.stringify(trash));
  }, [affirmations, trash]);

  const [isOpen, setIsOpen] = useState(false); // Gère l'ouverture de la modale globale

  const [previewTab, setPreviewTab] = useState<"galerie" | "corbeille">("galerie"); // Onglet de l'aperçu
  const [activeTab, setActiveTab] = useState<"galerie" | "corbeille">("galerie"); // Onglet dans la modale

  // NOUVEL ÉTAT : Permet de stocker l'ID de la carte dont on veut voir la citation dans l'aperçu
  const [selectedPreviewId, setSelectedPreviewId] = useState<string | null>(null);
  
  const [isAdding, setIsAdding] = useState(false);
  const [currentTitle, setCurrentTitle] = useState(""); // Nouvel état pour le titre
  const [currentText, setCurrentText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTitle.trim() || !currentText.trim()) return;

    if (editingId) {
      setAffirmations(affirmations.map(item => item.id === editingId ? { ...item, title: currentTitle, text: currentText } : item));
      setEditingId(null);
    } else {
      setAffirmations([...affirmations, { id: Date.now().toString(), title: currentTitle, text: currentText }]);
    }

    setCurrentTitle("");
    setCurrentText("");
    setIsAdding(false);
  };

  const startEdit = (card: AffirmationCard) => {
    setEditingId(card.id);
    setCurrentTitle(card.title || "");
    setCurrentText(card.text);
    setIsAdding(true);
    setActiveMenuId(null);
  };
  // FONCTION : Gère automatiquement les puces à chaque saut de ligne
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      
      // Insère un saut de ligne et un rond
      const newValue = currentText.substring(0, start) + "\n● " + currentText.substring(end);
      setCurrentText(newValue);

      // Repositionne le curseur juste après le rond inséré
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 3;
      }, 0);
    }
  };

  const deleteCard = (id: string) => {
    const cardToDelete = affirmations.find(card => card.id === id);
    if (cardToDelete) {
      setTrash([...trash, cardToDelete]);
      setAffirmations(affirmations.filter(card => card.id !== id));
    }
    setActiveMenuId(null);
  };

  const restoreCard = (id: string) => {
    const cardToRestore = trash.find(card => card.id === id);
    if (cardToRestore) {
      setAffirmations([...affirmations, cardToRestore]);
      setTrash(trash.filter(card => card.id !== id));
    }
    setActiveMenuId(null);
  };
  // NOUVELLE FONCTION : Supprime définitivement de la corbeille
  const permanentDeleteCard = (id: string) => {
    setTrash(trash.filter(card => card.id !== id));
    setActiveMenuId(null);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-6 w-full lg:w-auto">
      
      {/* BOUTON D'OUVERTURE DE LA MODALE */}
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-[#8B47FF] text-white font-bold px-8 py-4 rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer"
      >
        Personnaliser mes affirmations
      </button>

      {/* BLOC APERÇU SUR LA PAGE D'ACCUEIL */}
      <div className="bg-white rounded-[32px] p-6 shadow-sm border border-purple-100 w-full max-w-[400px] flex flex-col gap-6">
        <div className="flex gap-6 border-b border-purple-100 pb-3 text-sm">
          <button 
            type="button"
            onClick={() => setPreviewTab("galerie")}
            className={`font-bold pb-2 -mb-[13px] cursor-pointer transition-colors ${previewTab === "galerie" ? "text-[#8B47FF] border-b-2 border-[#8B47FF]" : "text-gray-400 hover:text-gray-600"}`}
          >
            Galerie
          </button>
          <button 
            type="button"
            onClick={() => setPreviewTab("corbeille")}
            className={`font-bold pb-2 -mb-[13px] cursor-pointer transition-colors ${previewTab === "corbeille" ? "text-[#8B47FF] border-b-2 border-[#8B47FF]" : "text-gray-400 hover:text-gray-600"}`}
          >
            Corbeille
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {previewTab === "galerie" ? (
              <>
                {affirmations.slice(0, 4).map((card) => {
                  const isSelected = selectedPreviewId === card.id;
                  return (
                    <div 
                      key={card.id} 
                      onClick={() => setSelectedPreviewId(isSelected ? null : card.id)}
                      className="aspect-square rounded-2xl overflow-hidden shadow-sm border border-purple-100 bg-purple-50 flex flex-col items-center justify-center p-3 text-center cursor-pointer hover:bg-purple-100 transition-all"
                    >
                      <span className="text-xs font-bold text-purple-900">{card.title}</span>
                      
                      {/* Le texte s'affiche uniquement si cette carte est cliquée */}
                      {isSelected && (
                        <span className="text-[11px] text-purple-800 italic mt-2 animate-fade-in">
                          &quot;{card.text}&quot;
                        </span>
                      )}
                    </div>
                  );
                })}

              {affirmations.length < 4 && (
                <button 
                  onClick={() => setIsOpen(true)}
                  className="aspect-square bg-[#FAF5FF] border-2 border-dashed border-purple-200 rounded-2xl flex items-center justify-center text-purple-300 hover:bg-purple-50 transition-colors cursor-pointer"
                >
                  <span className="text-4xl font-light">+</span>
                </button>
              )}
            </>
            
          ) : (
            trash.length === 0 ? (
              <p className="col-span-2 text-gray-400 text-xs py-4 italic text-center">La corbeille est vide.</p>
            ) : (
              <>
                {trash.slice(0, 4).map((card) => {
                  const isSelected = selectedPreviewId === card.id;
                  return (
                    <div 
                      key={card.id} 
                      onClick={() => setSelectedPreviewId(isSelected ? null : card.id)}
                      className="aspect-square rounded-2xl overflow-hidden shadow-sm border border-gray-100 bg-purple-50/50 flex flex-col items-center justify-center p-3 text-center cursor-pointer hover:bg-purple-100 transition-all opacity-75"
                    >
                      <span className="text-xs font-bold text-gray-700">{card.title}</span>
                      
                      {isSelected && (
                        <span className="text-[11px] text-gray-600 italic mt-2 animate-fade-in">
                          &quot;{card.text}&quot;
                        </span>
                      )}
                    </div>
                  );
                })}
                {trash.length === 3 && (
                  <div className="aspect-square pointer-events-none opacity-0" aria-hidden="true" />
                )}
              </>
            )
          )}

        </div>
      </div>

      {/* MODALE DE GESTION GLOBALE (S'ouvre au clic) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white w-full max-w-4xl shadow-2xl border border-purple-100 flex flex-col gap-6 relative max-h-[90vh] overflow-y-auto">
            
            {/* EN-TÊTE FIXE LORS DU SCROLL */}
            <div className="sticky top-0 bg-white z-20 flex flex-col gap-4 border-b border-purple-100 pt-8 px-8 pb-4">
              
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Personnalise tes Affirmations</h2>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-900 cursor-pointer"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex gap-6 text-sm z-10 relative">
                <button 
                  type="button"
                  onClick={() => setActiveTab("galerie")}
                  className={`font-bold pb-1 cursor-pointer transition-colors ${activeTab === "galerie" ? "text-[#8B47FF] border-b-2 border-[#8B47FF]" : "text-gray-400 hover:text-gray-600"}`}
                >
                  Galerie
                </button>
                <button 
                  type="button"
                  onClick={() => setActiveTab("corbeille")}
                  className={`font-bold pb-1 cursor-pointer transition-colors ${activeTab === "corbeille" ? "text-[#8B47FF] border-b-2 border-[#8B47FF]" : "text-gray-400 hover:text-gray-600"}`}
                >
                  Corbeille
                </button>
              </div>
            </div> 

            {isAdding && (
              <div className="px-8 mt-2">
              <form onSubmit={handleSave} className="bg-purple-50/80 p-6 rounded-2xl border border-purple-200 flex flex-col gap-4">
                
                <h3 className="text-lg font-bold text-purple-950">
                  {editingId ? "Modifier l'affirmation" : "Créer une nouvelle affirmation"}
                </h3>
                <input 
                  type="text"
                  value={currentTitle}
                  onChange={(e) => setCurrentTitle(e.target.value)}
                  placeholder="Titre de l'affirmation (ex: Confiance en soi)..."
                  className="w-full bg-white border border-purple-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#8B47FF]"
                  autoFocus
                />
                <textarea 
                  value={currentText}
                  onFocus={() => { if (!currentText) setCurrentText("● "); }}
                  onKeyDown={handleKeyDown}
                  onChange={(e) => setCurrentText(e.target.value)}
                  placeholder="Entrez vos affirmations... (Appuyez sur Entrée pour passer à la ligne)"
                  className="w-full bg-white border border-purple-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#8B47FF] h-28 resize-none whitespace-pre-line"
                />

                <div className="flex justify-end gap-3">
                  <button 
                    type="button" 
                    onClick={() => setIsAdding(false)}
                    className="px-5 py-2 rounded-xl text-gray-600 hover:bg-gray-200 font-semibold transition-colors"
                  >
                    Annuler
                  </button>
                  <button 
                    type="submit"
                    className="bg-[#8B47FF] text-white px-6 py-2 rounded-xl font-bold shadow-md hover:bg-[#7535e6] transition-colors"
                  >
                    {editingId ? "Mettre à jour" : "Ajouter"}
                  </button>
                </div>
              </form>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-8 pt-4 w-full">
              {activeTab === "galerie" ? (
                <>
                  {affirmations.map((card) => (
                    <div key={card.id} className="relative">
                      <div 
                        onClick={() => setActiveMenuId(activeMenuId === card.id ? null : card.id)}
                        className="w-48 h-48 rounded-2xl bg-purple-50 border border-purple-200 p-4 flex flex-col items-center justify-center text-center shadow-sm cursor-pointer hover:bg-purple-100 transition-all relative gap-2"
                      >
                        <span className="text-sm font-bold text-purple-950">{card.title}</span>
                        <span className="text-xs font-medium text-purple-800 italic line-clamp-3 whitespace-pre-line text-left w-full px-2">&quot;{card.text}&quot;</span>
                      </div>

                      {activeMenuId === card.id && (
                        <div className="absolute top-2 right-2 bg-white rounded-xl shadow-xl border border-purple-100 p-2 flex flex-col gap-1 z-20 w-32 animate-scale-up">
                          <button 
                            onClick={() => startEdit(card)}
                            className="flex items-center gap-2 text-xs font-semibold text-gray-700 hover:text-[#8B47FF] hover:bg-purple-50 p-2 rounded-lg transition-colors text-left"
                          >
                            <Edit2 size={14} /> Modifier
                          </button>
                          <button 
                            onClick={() => deleteCard(card.id)}
                            className="flex items-center gap-2 text-xs font-semibold text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors text-left"
                          >
                            <Trash2 size={14} /> Supprimer
                          </button>
                        </div>
                      )}
                    </div>
                  ))}

                  <button 
                    onClick={() => { setIsAdding(true); setEditingId(null); setCurrentText(""); }}
                    className="w-48 h-48 rounded-2xl border-2 border-dashed border-purple-300 bg-[#FAF5FF] hover:bg-purple-50 transition-colors flex flex-col items-center justify-center text-purple-400 gap-2 cursor-pointer shadow-sm"
                  >
                    <Plus size={32} />
                    <span className="text-xs font-bold">Ajouter</span>
                  </button>
                </>
              ) : (
                trash.length === 0 ? (
                  <p className="text-gray-400 text-sm py-8 italic w-full text-center">La corbeille est vide.</p>
                ) : (
                  trash.map((card) => (
                    <div key={card.id} className="relative">
                      <div 
                        onClick={() => setActiveMenuId(activeMenuId === card.id ? null : card.id)}
                        className="w-48 h-48 rounded-2xl bg-gray-50 border border-gray-200 p-4 flex items-center justify-center text-center text-sm font-medium text-gray-600 shadow-sm cursor-pointer hover:bg-gray-100 transition-all relative"
                      >
                        &quot;{card.text}&quot;
                      </div>

                      {activeMenuId === card.id && (
                        <div className="absolute top-2 right-2 bg-white rounded-xl shadow-xl border border-gray-200 p-2 flex flex-col gap-1 z-20 w-40 animate-scale-up">
                          <button 
                            onClick={() => restoreCard(card.id)}
                            className="flex items-center gap-2 text-xs font-semibold text-purple-700 hover:bg-purple-50 p-2 rounded-lg transition-colors text-left cursor-pointer"
                          >
                            Restaurer
                          </button>
                          <button 
                            onClick={() => permanentDeleteCard(card.id)}
                            className="flex items-center gap-2 text-xs font-semibold text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors text-left cursor-pointer"
                          >
                            <Trash2 size={14} /> Supprimer définitivement
                          </button>
                        </div>
                      )}

                    </div>
                  ))
                )
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}