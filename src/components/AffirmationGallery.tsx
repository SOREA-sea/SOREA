"use client";

import React, { useState } from "react";
import { X, Plus, Edit2, Trash2 } from "lucide-react";

interface AffirmationCard {
  id: string;
  title: string;
  text: string;
}

interface AffirmationGalleryProps {
  externalIsOpen?: boolean;
  setExternalIsOpen?: (open: boolean) => void;
}

export default function AffirmationGallery({ 
  externalIsOpen, 
  setExternalIsOpen 
}: AffirmationGalleryProps) {
  const [affirmations, setAffirmations] = React.useState<AffirmationCard[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sorea_affirmations");
      if (saved) return JSON.parse(saved);
    }
    return [
      { 
        id: "1", 
        title: "Mon Bien-être", 
        text: "✓ Je m’accepte tel(le) que je suis et j’ai de la valeur.\n✓ Mon esprit est calme et apaisé\n✓ Je prend soin de mon corps et de mon état d’esprit \n✓ Je m’entoure des bonnes personnes et je mérite d’être bien entouré(e)\n✓ Je reconnais les efforts que je fais, même lorsqu'ils sont invisibles.\n✓ J’accueille mon chemin parcouru avec fierté\n✓ Je vis pleinement chaque moment de ma vie.\n✓ Je compare mon parcours rien qu’à mon parcours passé.\n✓ Je crois en mon potentiel et j’ai du potentiel\n✓ Je cultive la sérénité au quotidien\n✓ Je surmonte mes défis et je grandis à travers eux.\n✓ Je mérite d’être heureux(se) et épanoui(e) dans ma vie et je le suis."
      },
      { 
        id: "2", 
        title: "Projet & Objectifs", 
        text: "✓ Je fixe mes objectifs avec clarté et j'ai la capacité de les atteindre.\n✓ Je crois en la réussite de mes projets et en mes capacités à les concrétiser.\n✓ J'ai la discipline nécessaire pour concrétiser mes ambitions.\n✓ J'avance vers ce qui me tient à cœur.\n✓ Mes projets se développent de manière fluide et harmonieuse.\n✓ Je surmonte les obstacles avec confiance et persévérance.\n✓ J'attire les bonnes ressources et les bonnes personnes pour faire grandir mes projets.\n✓ Je reste concentré(e) et déterminé(e) face à mes priorités.\n✓ Je suis capable de dépasser mes doutes et de passer à l'action.\n✓ Je transforme mes idées en action.\n✓ Je suis fier(ère) du chemin parcouru et de ce que je construis chaque jour.\n✓ Je lâche prise et j’avance sereinement\n✓ Je mérite d'atteindre tous les objectifs que je me fixe." 
      }
    ];
  });

  const [trash, setTrash] = React.useState<AffirmationCard[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sorea_affirmations_trash");
      if (saved) return JSON.parse(saved);
    }
    return [];
  });

  React.useEffect(() => {
    localStorage.setItem("sorea_affirmations", JSON.stringify(affirmations));
    localStorage.setItem("sorea_affirmations_trash", JSON.stringify(trash));
  }, [affirmations, trash]);

  const [internalIsOpen, setInternalIsOpen] = useState(false);

  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen = (val: boolean | ((prev: boolean) => boolean)) => {
    const resolvedVal = typeof val === "function" ? val(isOpen) : val;
    if (setExternalIsOpen) {
      setExternalIsOpen(resolvedVal);
    }
    setInternalIsOpen(resolvedVal);
  };

  const [previewTab, setPreviewTab] = useState<"galerie" | "corbeille">("galerie");
  const [activeTab, setActiveTab] = useState<"galerie" | "corbeille">("galerie");
  
  const [isAdding, setIsAdding] = useState(false);
  const [currentTitle, setCurrentTitle] = useState("");
  const [currentText, setCurrentText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Ferme le menu contextuel si on clique en dehors
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // On ferme uniquement si le clic n'est pas à l'intérieur d'un menu ou d'une carte active
      setActiveMenuId(null);
    };
    if (activeMenuId !== null) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [activeMenuId]);

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

  const selectForMirror = (card: AffirmationCard) => {
    // 1. Sauvegarde la carte sélectionnée et active le mode personnalisées
    localStorage.setItem("sorea_active_custom_affirmation", JSON.stringify(card));
    localStorage.setItem("sorea_active_mode", "custom");
    localStorage.setItem("sorea_custom_index", "0"); // Réinitialise l'index au début de la liste
    // 2. Notifie l'application en cas d'utilisation sur la même page
    window.dispatchEvent(new Event("customAffirmationChanged"));
    setActiveMenuId(null);
    if (setExternalIsOpen) setExternalIsOpen(false);

    // 3. Redirige automatiquement vers la page du miroir
    window.location.href = "/mirror/miroir"; // Ajuste le chemin si ta route exacte est "/mirror/miroir"
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      
      const newValue = currentText.substring(0, start) + "\n✓ " + currentText.substring(end);
      setCurrentText(newValue);

      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 3;
        target.scrollTop = target.scrollHeight; // Fait défiler le texte jusqu'en bas
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

  const permanentDeleteCard = (id: string) => {
    setTrash(trash.filter(card => card.id !== id));
    setActiveMenuId(null);
  };

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  return (
    <>
      {externalIsOpen === undefined && (
        <div className="flex flex-col items-center justify-center gap-6 w-full lg:w-auto">
          <button 
            onClick={() => setIsOpen(true)}
            className="bg-[#8B47FF] text-white font-bold px-8 py-4 rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer"
          >
            Personnaliser mes affirmations
          </button>

          <div className="bg-white rounded-[20px] p-6 shadow-sm border border-purple-100 w-full max-w-[400px] flex flex-col gap-6">
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
                  {affirmations.slice(0, 3).map((card) => {
                    return (
                      <div 
                        key={card.id} 
                        className="aspect-square rounded-2xl overflow-hidden shadow-sm border border-purple-100 bg-purple-50 flex flex-col items-center justify-center p-3 text-center"
                      >
                        <span className="text-xs font-bold text-purple-900">{card.title}</span>
                      </div>
                    );
                  })}

                  {/* Le bouton + reste toujours visible et bloque l'affichage à 3 affirmations max dans l'aperçu */}
                  <button 
                    onClick={() => setIsOpen(true)}
                    className="aspect-square bg-[#FAF5FF] border-2 border-dashed border-purple-200 rounded-2xl flex items-center justify-center text-purple-300 hover:bg-purple-50 hover:border-[#7F4DC5] hover:text-[#7F4DC5] transition-colors cursor-pointer group"
                  >
                    <span className="text-4xl font-light group-hover:text-[#7F4DC5]">+</span>
                  </button>
                </>
              ) : (
                trash.length === 0 ? (
                  <p className="col-span-2 text-gray-400 text-xs py-4 italic text-center justify-center">La corbeille est vide.</p>
                ) : (
                  <>
                    {trash.slice(0, 4).map((card) => {
                      return (
                        <div 
                          key={card.id} 
                          className="aspect-square rounded-2xl overflow-hidden shadow-sm border border-gray-100 bg-purple-50/50 flex flex-col items-center justify-center p-3 text-center opacity-75"
                        >
                          <span className="text-xs font-bold text-gray-700">{card.title}</span>
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
        </div>
      )}

      {/* MODALE DE GESTION GLOBALE */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white w-full max-w-4xl shadow-2xl border border-purple-100 flex flex-col gap-6 relative max-h-[90vh] overflow-y-auto">
            
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
                    {editingId ? "Modifier ton affirmation" : "Créer ta nouvelle affirmation"}
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
                    onFocus={() => { if (!currentText) setCurrentText("✓ "); }}
                    onKeyDown={handleKeyDown}
                    onChange={(e) => setCurrentText(e.target.value)}
                    placeholder="Entrez vos affirmations... (Appuyez sur Entrée pour passer à la ligne)"
                    className="w-full bg-white border border-purple-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#8B47FF] h-28 resize-none whitespace-pre-line overflow-y-auto"
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
                  {affirmations.map((card, index) => (
                    <div 
                      key={card.id} 
                      draggable
                      onDragStart={() => setDraggedIndex(index)}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragOverIndex(index);
                      }}
                      onDrop={() => {
                        if (draggedIndex === null || draggedIndex === index) return;
                        const updated = [...affirmations];
                        const [movedItem] = updated.splice(draggedIndex, 1);
                        updated.splice(index, 0, movedItem);
                        setAffirmations(updated);
                        setDraggedIndex(null);
                        setDragOverIndex(null);
                      }}
                      onDragEnd={() => {
                        setDraggedIndex(null);
                        setDragOverIndex(null);
                      }}
                      className={`relative transition-all ${dragOverIndex === index ? "border-l-4 border-[#7F4DC5] pl-1" : ""}`}
                    >
                      <div 
                        onClick={() => setActiveMenuId(activeMenuId === card.id ? null : card.id)}
                        className="w-48 h-48 rounded-2xl bg-purple-50 border border-purple-200 p-4 flex flex-col items-center justify-center text-center shadow-sm cursor-grab active:cursor-grabbing hover:bg-purple-100 transition-all relative gap-2"
                      >
                        <span className="text-sm font-bold text-purple-950">{card.title}</span>
                        <span className="text-xs font-medium text-purple-800 italic line-clamp-3 whitespace-pre-line text-left w-full px-2">
                          &quot;{card.text}&quot;
                        </span>
                      </div>

                      {activeMenuId === card.id && (
                        <div 
                          onClick={(e) => e.stopPropagation()}
                          className="absolute top-2 right-2 bg-white rounded-xl shadow-xl border border-purple-100 p-2 flex flex-col gap-1 z-20 w-44 animate-scale-up"
                        >

                          <button 
                            onClick={() => selectForMirror(card)}
                            className="flex items-center gap-2 text-xs font-semibold text-[#8B47FF] hover:bg-purple-50 p-2 rounded-lg transition-colors text-left cursor-pointer"
                          >
                            🪞 M'affirmer
                          </button>
                          <button 
                            onClick={() => startEdit(card)}
                            className="flex items-center gap-2 text-xs font-semibold text-gray-700 hover:text-[#8B47FF] hover:bg-purple-50 p-2 rounded-lg transition-colors text-left cursor-pointer"
                          >
                            <Edit2 size={14} /> Modifier
                          </button>
                          <button 
                            onClick={() => deleteCard(card.id)}
                            className="flex items-center gap-2 text-xs font-semibold text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors text-left cursor-pointer"
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
    </>
  );
}