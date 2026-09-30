"use client";

import React, { useState } from "react";
import { X, Plus, Edit2, Trash2 } from "lucide-react";


interface AffirmationCard {
  id: string;
  text: string;
}

interface AffirmationGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  affirmations: AffirmationCard[];
  setAffirmations: React.Dispatch<React.SetStateAction<AffirmationCard[]>>;
  trash: AffirmationCard[];
  setTrash: React.Dispatch<React.SetStateAction<AffirmationCard[]>>;
}

export default function AffirmationGallery({ 
  isOpen, 
  onClose, 
  affirmations, 
  setAffirmations, 
  trash, 
  setTrash 
}: AffirmationGalleryProps) {
  const [activeTab, setActiveTab] = useState<"galerie" | "corbeille">("galerie");
  
  const [isAdding, setIsAdding] = useState(false);
  const [currentText, setCurrentText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  // État pour gérer le menu contextuel (petite frame) d'une carte spécifique
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentText.trim()) return;

    if (editingId) {
      setAffirmations(affirmations.map(item => item.id === editingId ? { ...item, text: currentText } : item));
      setEditingId(null);
    } else {
      setAffirmations([...affirmations, { id: Date.now().toString(), text: currentText }]);
    }

    setCurrentText("");
    setIsAdding(false);
  };

  const startEdit = (card: AffirmationCard) => {
    setEditingId(card.id);
    setCurrentText(card.text);
    setIsAdding(true);
    setActiveMenuId(null);
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
      
      {/* Grande Frame principale */}
      <div className="bg-white rounded-[32px] w-full max-w-4xl p-8 shadow-2xl border border-purple-100 flex flex-col gap-6 relative max-h-[90vh] overflow-y-auto">
        
        {/* En-tête avec titre, fermeture et onglets Galerie / Corbeille */}
        <div className="flex flex-col gap-4 border-b border-purple-100 pb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Personnalise tes Affirmations</h2>
            <button 
              onClick={onClose}
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

        {/* Formulaire d'ajout / modification (s'affiche si on clique sur + ou modifier) */}
        {isAdding && (
          <form onSubmit={handleSave} className="bg-purple-50/80 p-6 rounded-2xl border border-purple-200 flex flex-col gap-4 mt-2">
            <h3 className="text-lg font-bold text-purple-950">
              {editingId ? "Modifier l'affirmation" : "Créer une nouvelle affirmation"}
            </h3>
            <input 
              type="text"
              value={currentText}
              onChange={(e) => setCurrentText(e.target.value)}
              placeholder="Ex: Je réussis tout ce que j'entreprends..."
              className="w-full bg-white border border-purple-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#8B47FF]"
              autoFocus
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
        )}
 {/* Grille conditionnelle selon l'onglet actif */}
        <div className="flex flex-wrap items-start justify-start gap-4 py-4">
          
          {activeTab === "galerie" ? (
            <>
              {affirmations.map((card) => (
                <div key={card.id} className="relative">
                  <div 
                    onClick={() => setActiveMenuId(activeMenuId === card.id ? null : card.id)}
                    className="w-48 h-48 rounded-2xl bg-purple-50 border border-purple-200 p-4 flex items-center justify-center text-center text-sm font-medium text-purple-900 shadow-sm cursor-pointer hover:bg-purple-100 transition-all relative"
                  >
                    "{card.text}"
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
                    "{card.text}"
                  </div>

                  {activeMenuId === card.id && (
                    <div className="absolute top-2 right-2 bg-white rounded-xl shadow-xl border border-gray-200 p-2 flex flex-col gap-1 z-20 w-36 animate-scale-up">
                      <button 
                        onClick={() => restoreCard(card.id)}
                        className="flex items-center gap-2 text-xs font-semibold text-purple-700 hover:bg-purple-50 p-2 rounded-lg transition-colors text-left"
                      >
                        Restaurer
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
  );
}