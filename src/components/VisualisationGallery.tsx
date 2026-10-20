"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  X, 
  Plus, 
  Edit2, 
  Trash2, 
  Upload, 
  Search, 
  HardDrive, 
  Image as ImageIcon, 
  Camera, 
  Link as LinkIcon, 
  ChevronDown 
} from "lucide-react";

interface VisualisationCard {
  id: string;
  title: string;
  images: string[];
}

interface VisualisationGalleryProps {
  externalIsOpen?: boolean;
  setExternalIsOpen?: (open: boolean) => void;
}

export default function VisualisationGallery({
  externalIsOpen,
  setExternalIsOpen,
}: VisualisationGalleryProps) {
  const [pellicules, setPellicules] = useState<VisualisationCard[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sorea_visualisation_pellicules");
      if (saved) return JSON.parse(saved);
    }
    return [//J'en proposerai qu'un seul et non 2
      {
        id: "1",
        title: "Mon Bien-être",
        images: [
          "/image_photo/PelliculeAmitié.svg",
          "/image_photo/PelliculeVoyage.svg",
          "/image_photo/PelliculeNourritureSaine.svg",
        ],
      },
      {
        id: "2",
        title: "Projet & Objectifs",
        images: [
          "/image_photo/PelliculeDiplome.svg",
          "/image_photo/PelliculeBusiness.svg",
          "/image_photo/PelliculeLiberté.svg",
        ],
      },
    ];
  });

  const [trash, setTrash] = useState<VisualisationCard[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sorea_visualisation_trash");
      if (saved) return JSON.parse(saved);
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem("sorea_visualisation_pellicules", JSON.stringify(pellicules));
    localStorage.setItem("sorea_visualisation_trash", JSON.stringify(trash));
  }, [pellicules, trash]);

  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen = (val: boolean | ((prev: boolean) => boolean)) => {
    const resolvedVal = typeof val === "function" ? val(isOpen) : val;
    if (setExternalIsOpen) {
      setExternalIsOpen(resolvedVal);
    }
    setInternalIsOpen(resolvedVal);
  };

  const [previewTab, setPreviewTab] = useState<"galerie" | "boutique" | "corbeille">("galerie");
  const [activeTab, setActiveTab] = useState<"galerie" | "boutique" | "corbeille">("galerie");

  const [isAdding, setIsAdding] = useState(false);
  const [currentTitle, setCurrentTitle] = useState("");
  const [currentImages, setCurrentImages] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Menu d'insertion d'image style Google Docs
  const [showInsertMenu, setShowInsertMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = () => setActiveMenuId(null);
    if (activeMenuId !== null) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => document.removeEventListener("click", handleClickOutside);
  }, [activeMenuId]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTitle.trim()) return;

    if (editingId) {
      setPellicules(
        pellicules.map((item) =>
          item.id === editingId
            ? { ...item, title: currentTitle, images: currentImages }
            : item
        )
      );
      setEditingId(null);
    } else {
      setPellicules([
        ...pellicules,
        { id: Date.now().toString(), title: currentTitle, images: currentImages },
      ]);
    }

    setCurrentTitle("");
    setCurrentImages([]);
    setIsAdding(false);
  };

  const startEdit = (card: VisualisationCard) => {
    setEditingId(card.id);
    setCurrentTitle(card.title || "");
    setCurrentImages(card.images || []);
    setIsAdding(true);
    setActiveMenuId(null);
  };

  const selectForProjection = (card: VisualisationCard) => {
    localStorage.setItem("sorea_active_visualisation_pellicule", JSON.stringify(card));
    window.dispatchEvent(new Event("visualisationPelliculeChanged"));
    setActiveMenuId(null);
    if (setExternalIsOpen) setExternalIsOpen(false);
  };

  const deleteCard = (id: string) => {
    const cardToDelete = pellicules.find((card) => card.id === id);
    if (cardToDelete) {
      setTrash([...trash, cardToDelete]);
      setPellicules(pellicules.filter((card) => card.id !== id));
    }
    setActiveMenuId(null);
  };

  const restoreCard = (id: string) => {
    const cardToRestore = trash.find((card) => card.id === id);
    if (cardToRestore) {
      setPellicules([...pellicules, cardToRestore]);
      setTrash(trash.filter((card) => card.id !== id));
    }
    setActiveMenuId(null);
  };

  const permanentDeleteCard = (id: string) => {
    setTrash(trash.filter((card) => card.id !== id));
    setActiveMenuId(null);
  };

  // Gestion des fichiers importés (Ordinateur)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setCurrentImages([...currentImages, imageUrl]);
      setShowInsertMenu(false);
    }
  };

  // Ajout par URL Web
  const handleAddByUrl = () => {
    const url = prompt("Entrez l'URL de l'image :");
    if (url && url.trim()) {
      setCurrentImages([...currentImages, url.trim()]);
      setShowInsertMenu(false);
    }
  };

  const removeImageFromPellicule = (index: number) => {
    setCurrentImages(currentImages.filter((_, i) => i !== index));
  };

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden"
      />

      {externalIsOpen === undefined && (
        <div className="flex flex-col items-center justify-center gap-6 w-full lg:w-auto">
          <button
            onClick={() => setIsOpen(true)}
            className="bg-[#8B47FF] text-white font-bold px-8 py-4 rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer"
          >
            Personnaliser mes projections
          </button>

          <div className="bg-white rounded-[20px] p-6 shadow-sm border border-purple-100 w-full max-w-[400px] flex flex-col gap-6">
            <div className="flex gap-6 border-b border-purple-100 pb-3 text-sm">
              <button
                type="button"
                onClick={() => setPreviewTab("galerie")}
                className={`font-bold pb-2 -mb-[13px] cursor-pointer transition-colors ${
                  previewTab === "galerie"
                    ? "text-[#8B47FF] border-b-2 border-[#8B47FF]"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                Galerie
              </button>
              <button
                type="button"
                onClick={() => setPreviewTab("boutique")}
                className={`font-bold pb-2 -mb-[13px] cursor-pointer transition-colors ${
                  previewTab === "boutique"
                    ? "text-[#8B47FF] border-b-2 border-[#8B47FF]"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                Boutique
              </button>
              <button
                type="button"
                onClick={() => setPreviewTab("corbeille")}
                className={`font-bold pb-2 -mb-[13px] cursor-pointer transition-colors ${
                  previewTab === "corbeille"
                    ? "text-[#8B47FF] border-b-2 border-[#8B47FF]"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                Corbeille
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {previewTab === "galerie" ? (
                <>
                  {pellicules.slice(0, 3).map((card) => (
                    <div
                      key={card.id}
                      onClick={() => setIsOpen(true)}
                      className="relative w-full h-40 flex flex-col items-center justify-start cursor-pointer hover:scale-105 transition-transform"
                    >
                      <span className="text-xs font-bold text-purple-950 mb-1 text-center">
                        {card.title}
                      </span>

                      {/* Illustration Pellicule.svg avec aperçu des images */}
                      <div className="relative w-full h-32 flex items-center justify-center">
                        {/* Support Pellicule en dessous (z-10) */}
                        <img
                          src="/image_Design-SOREA/Pellicule.svg"
                          alt="Pellicule"
                          className="absolute inset-0 w-full h-full object-contain z-10"
                        />
                        {/* Photo au-dessus (z-20) */}
                        <div className="relative z-20 w-[68%] h-[68%] overflow-hidden">
                          {card.images.length > 0 && (
                            <img
                              src={card.images[0]}
                              alt={card.title}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={() => setIsOpen(true)}
                    className="aspect-square bg-[#FAF5FF] border-2 border-dashed border-purple-200 rounded-2xl flex items-center justify-center text-purple-300 hover:bg-purple-50 hover:border-[#7F4DC5] hover:text-[#7F4DC5] transition-colors cursor-pointer group"
                  >
                    <span className="text-4xl font-light group-hover:text-[#7F4DC5]">+</span>
                  </button>
                </>
              ) : previewTab === "boutique" ? (
                <div className="col-span-2 py-6 text-center text-xs text-gray-400 italic">
                  Aucun thème dans la boutique pour le moment.
                </div>
              ) : trash.length === 0 ? (
                <p className="col-span-2 text-gray-400 text-xs py-4 italic text-center justify-center">
                  La corbeille est vide.
                </p>
              ) : (
                trash.slice(0, 4).map((card) => (
                  <div
                    key={card.id}
                    className="aspect-square rounded-2xl overflow-hidden shadow-sm border border-gray-100 bg-purple-50/50 flex flex-col items-center justify-center p-3 text-center opacity-75"
                  >
                    <span className="text-xs font-bold text-gray-700">{card.title}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODALE DE GESTION GLOBALE */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white w-full max-w-4xl shadow-2xl border border-purple-100 flex flex-col gap-6 relative max-h-[90vh] overflow-y-auto rounded-3xl">
            <div className="sticky top-0 bg-white z-20 flex flex-col gap-4 border-b border-purple-100 pt-8 px-8 pb-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  Personnalise tes Pellicules de Visualisation
                </h2>
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
                  className={`font-bold pb-1 cursor-pointer transition-colors ${
                    activeTab === "galerie"
                      ? "text-[#8B47FF] border-b-2 border-[#8B47FF]"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  Galerie
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("boutique")}
                  className={`font-bold pb-1 cursor-pointer transition-colors ${
                    activeTab === "boutique"
                      ? "text-[#8B47FF] border-b-2 border-[#8B47FF]"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  Boutique
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("corbeille")}
                  className={`font-bold pb-1 cursor-pointer transition-colors ${
                    activeTab === "corbeille"
                      ? "text-[#8B47FF] border-b-2 border-[#8B47FF]"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  Corbeille
                </button>
              </div>
            </div>

            {/* FORMULAIRE D'AJOUT / ÉDITION DE PELLICULE */}
            {isAdding && (
              <div className="px-8 mt-2">
                <form
                  onSubmit={handleSave}
                  className="bg-purple-50/80 p-6 rounded-2xl border border-purple-200 flex flex-col gap-4"
                >
                  <h3 className="text-lg font-bold text-purple-950">
                    {editingId ? "Modifier la pellicule" : "Créer une nouvelle pellicule"}
                  </h3>

                  <input
                    type="text"
                    value={currentTitle}
                    onChange={(e) => setCurrentTitle(e.target.value)}
                    placeholder="Titre de la pellicule (ex: Voyage de rêve, Projets 2026)..."
                    className="w-full bg-white border border-purple-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#8B47FF]"
                    autoFocus
                  />

                  {/* BOUTON ET MENU DE SÉLECTION DE RESSOURCES STYLE GOOGLE DOCS */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowInsertMenu(!showInsertMenu)}
                      className="flex items-center gap-2 bg-white border border-purple-300 text-purple-900 font-semibold px-4 py-2.5 rounded-xl hover:bg-purple-100/50 transition-colors cursor-pointer text-sm"
                    >
                      <Plus size={18} />
                      Insérer une image
                      <ChevronDown size={16} />
                    </button>

                    {/* MENU DÉROULANT STYLE GOOGLE DOCS */}
                    {showInsertMenu && (
                      <div className="absolute top-12 left-0 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 w-64 z-30 flex flex-col gap-0.5 animate-scale-up">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-purple-50 hover:text-[#8B47FF] transition-colors text-left"
                        >
                          <Upload size={16} /> Importer depuis l'ordinateur
                        </button>
                        <button
                          type="button"
                          onClick={handleAddByUrl}
                          className="flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-purple-50 hover:text-[#8B47FF] transition-colors text-left"
                        >
                          <Search size={16} /> Rechercher sur le Web
                        </button>
                        <hr className="my-1 border-gray-100" />
                        <button
                          type="button"
                          onClick={handleAddByUrl}
                          className="flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-purple-50 hover:text-[#8B47FF] transition-colors text-left"
                        >
                          <HardDrive size={16} /> Drive
                        </button>
                        <button
                          type="button"
                          onClick={handleAddByUrl}
                          className="flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-purple-50 hover:text-[#8B47FF] transition-colors text-left"
                        >
                          <ImageIcon size={16} /> Photos
                        </button>
                        <button
                          type="button"
                          onClick={handleAddByUrl}
                          className="flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-purple-50 hover:text-[#8B47FF] transition-colors text-left"
                        >
                          <Camera size={16} /> Appareil photo
                        </button>
                        <button
                          type="button"
                          onClick={handleAddByUrl}
                          className="flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-purple-50 hover:text-[#8B47FF] transition-colors text-left"
                        >
                          <LinkIcon size={16} /> À partir d'une URL
                        </button>
                      </div>
                    )}
                  </div>

                  {/* APERÇU DES IMAGES AJOUTÉES À LA PELLICULE */}
                  {currentImages.length > 0 && (
                    <div className="flex gap-3 overflow-x-auto py-2">
                      {currentImages.map((img, idx) => (
                        <div
                          key={idx}
                          className="relative w-24 h-24 shrink-0 rounded-xl overflow-hidden border border-purple-200 group"
                        >
                          <img
                            src={img}
                            alt="Aperçu"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeImageFromPellicule(idx)}
                            className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex justify-end gap-3 mt-2">
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

            {/* GRILLE DES PELLICULES */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-8 pt-4 w-full">
              {activeTab === "galerie" ? (
                <>
                  {pellicules.map((card, index) => (
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
                        const updated = [...pellicules];
                        const [movedItem] = updated.splice(draggedIndex, 1);
                        updated.splice(index, 0, movedItem);
                        setPellicules(updated);
                        setDraggedIndex(null);
                        setDragOverIndex(null);
                      }}
                      onDragEnd={() => {
                        setDraggedIndex(null);
                        setDragOverIndex(null);
                      }}
                      className={`relative transition-all ${
                        dragOverIndex === index ? "border-l-4 border-[#7F4DC5] pl-1" : ""
                      }`}
                    >
                      {/* PELLICULE DE VISUALISATION (Directement comme carte) */}
                      <div
                        onClick={() =>
                          setActiveMenuId(activeMenuId === card.id ? null : card.id)
                        }
                        className="relative w-48 h-56 flex flex-col items-center justify-start cursor-pointer hover:scale-105 transition-transform group"
                      >
                        {/* Titre au-dessus de la pellicule */}
                        <span className="text-sm font-bold text-purple-950 mb-2 text-center z-10">
                          {card.title}
                        </span>

                        {/* Conteneur de la Pellicule SVG */}
                        <div className="relative w-full h-44 flex items-center justify-center">
                          {/* 1. L'image de la pellicule SVG en fond (z-10) */}
                          <img
                            src="/image_Design-SOREA/Pellicule.svg"
                            alt="Pellicule support"
                            className="absolute inset-0 w-full h-full object-contain z-10 drop-shadow-md"
                          />

                          {/* 2. L'image miniature affichée PAR-DESSUS la pellicule (z-20) */}
                          <div className="relative z-20 w-[68%] h-[68%] overflow-hidden flex items-center justify-center">
                            {card.images.length > 0 ? (
                              <img
                                src={card.images[0]}
                                alt={card.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-purple-100/60 flex items-center justify-center text-[10px] text-purple-400 font-semibold">
                                Vide
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* MENU CONTEXTUEL (Projection, Modifier, Supprimer) */}
                      {activeMenuId === card.id && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="absolute top-2 right-2 bg-white rounded-xl shadow-xl border border-purple-100 p-2 flex flex-col gap-1 z-20 w-44 animate-scale-up"
                        >
                          <button
                            onClick={() => selectForProjection(card)}
                            className="flex items-center gap-2 text-xs font-semibold text-[#8B47FF] hover:bg-purple-50 p-2 rounded-lg transition-colors text-left cursor-pointer"
                          >
                            🎬 Projeter
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
                    onClick={() => {
                      setIsAdding(true);
                      setEditingId(null);
                      setCurrentTitle("");
                      setCurrentImages([]);
                    }}
                    className="w-48 h-48 rounded-2xl border-2 border-dashed border-purple-300 bg-[#FAF5FF] hover:bg-purple-50 transition-colors flex flex-col items-center justify-center text-purple-400 gap-2 cursor-pointer shadow-sm"
                  >
                    <Plus size={32} />
                    <span className="text-xs font-bold">Ajouter</span>
                  </button>
                </>
              ) : activeTab === "boutique" ? (
                <div className="col-span-full py-12 text-center text-gray-500 text-sm italic">
                  La boutique des visualisations sera bientôt disponible.
                </div>
              ) : trash.length === 0 ? (
                <p className="col-span-full py-12 text-center txt-gray-500 text-sm italic">
                  La corbeille est vide.
                </p>
              ) : (
                trash.map((card) => (
                  <div key={card.id} className="relative">
                    <div
                      onClick={() =>
                        setActiveMenuId(activeMenuId === card.id ? null : card.id)
                      }
                      className="w-48 h-48 rounded-2xl bg-gray-50 border border-gray-200 p-4 flex flex-col items-center justify-center text-center text-sm font-medium text-gray-600 shadow-sm cursor-pointer hover:bg-gray-100 transition-all relative"
                    >
                      <span>{card.title}</span>
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
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}