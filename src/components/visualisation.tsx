"use client";

import React, { useState, useRef, useEffect } from "react";
// Link est importé mais inutilisé dans ce composant, tu peux le garder si besoin.
import Link from "next/link";

interface VisualImage {
  id: string;
  colorClass?: string;
  imageUrl?: string;
  scale?: number;
  offsetX?: number;
  offsetY?: number;
  dateAdded?: string; 
}

type TabType = 'galerie' | 'archives' | 'trash';

const DEFAULT_GALERIE: VisualImage[] = [
  { id: "1", colorClass: "bg-[#FBCFE8]", dateAdded: "10/06/2026" }, 
  { id: "2", colorClass: "bg-[#A855F7]", dateAdded: "11/06/2026" }, 
  { id: "3", colorClass: "bg-[#C4B5FD]", dateAdded: "11/06/2026" }, 
  { id: "4", colorClass: "bg-[#5EEAD4]", dateAdded: "12/06/2026" }, 
  { id: "5", colorClass: "bg-[#FEF08A]", dateAdded: "13/06/2026" }, 
  { id: "6", colorClass: "bg-[#A8A29E]", dateAdded: "14/06/2026" }, 
  { id: "7", colorClass: "bg-[#FFFFFF]", dateAdded: "15/06/2026" }, 
];

// Fonction utilitaire pour convertir un fichier en Base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export default function Visualisation() {
  const [galerie, setGalerie] = useState<VisualImage[]>([]);
  const [archives, setArchives] = useState<VisualImage[]>([]);
  const [trash, setTrash] = useState<VisualImage[]>([]);
  const [isLoaded, setIsLoaded] = useState(false); // Gère l'hydratation Next.js

  const [activeTab, setActiveTab] = useState<TabType>('galerie');
  const [zoomedImage, setZoomedImage] = useState<VisualImage | null>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editScale, setEditScale] = useState(1);
  const [editX, setEditX] = useState(0);
  const [editY, setEditY] = useState(0);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  const [toastMessage, setToastMessage] = useState<{ text: string, type: 'success' | 'info' | 'error' } | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentImages = activeTab === 'galerie' ? galerie : activeTab === 'archives' ? archives : trash;

  // 1. CHARGEMENT INITIAL (depuis le localStorage)
  useEffect(() => {
    const savedGalerie = localStorage.getItem('sorea_visualisation_galerie');
    const savedArchives = localStorage.getItem('sorea_visualisation_archives');
    const savedTrash = localStorage.getItem('sorea_visualisation_trash');

    if (savedGalerie) setGalerie(JSON.parse(savedGalerie));
    else setGalerie(DEFAULT_GALERIE);

    if (savedArchives) setArchives(JSON.parse(savedArchives));
    if (savedTrash) setTrash(JSON.parse(savedTrash));

    setIsLoaded(true);
  }, []);

  // 2. SAUVEGARDE AUTOMATIQUE (vers le localStorage à chaque changement)
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('sorea_visualisation_galerie', JSON.stringify(galerie));
      localStorage.setItem('sorea_visualisation_archives', JSON.stringify(archives));
      localStorage.setItem('sorea_visualisation_trash', JSON.stringify(trash));
    }
  }, [galerie, archives, trash, isLoaded]);


  const triggerToast = (text: string, type: 'success' | 'info' | 'error') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 3. GESTION DE L'UPLOAD EN BASE64
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Vérification de la taille pour préserver le localStorage (ex: limite à 2Mo)
      if (file.size > 2 * 1024 * 1024) {
        triggerToast("L'image est trop lourde (max 2Mo)", "error");
        return;
      }

      try {
        const base64Image = await fileToBase64(file);
        const today = new Date().toLocaleDateString('fr-FR');
        const newImg: VisualImage = { 
          id: Date.now().toString(), 
          imageUrl: base64Image, 
          scale: 1, 
          offsetX: 0, 
          offsetY: 0,
          dateAdded: today
        };
        setGalerie([...galerie, newImg]);
        triggerToast("Image importée avec succès ! 📸", "success");
      } catch (error) {
        triggerToast("Erreur lors de la lecture de l'image", "error");
      }
    }
    // Réinitialise l'input pour pouvoir importer la même image plusieurs fois si besoin
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleArchive = (img: VisualImage) => {
    if (activeTab === 'galerie') setGalerie(galerie.filter(i => i.id !== img.id));
    else if (activeTab === 'trash') setTrash(trash.filter(i => i.id !== img.id));
    setArchives([...archives, img]);
    setZoomedImage(null);
    setIsEditing(false);
    
    setShowConfetti(true);
    triggerToast("Félicitations ! Vœu accompli et archivé 🌟", "success");
    setTimeout(() => setShowConfetti(false), 4000);
  };

  const handleDelete = (img: VisualImage) => {
    if (activeTab === 'galerie') setGalerie(galerie.filter(i => i.id !== img.id));
    else if (activeTab === 'archives') setArchives(archives.filter(i => i.id !== img.id));
    
    if (activeTab === 'trash') {
      setTrash(trash.filter(i => i.id !== img.id));
      triggerToast("Image supprimée définitivement 🗑️", "error");
    } else {
      setTrash([...trash, img]);
      triggerToast("Image placée dans la corbeille", "info");
    }
    setZoomedImage(null);
    setIsEditing(false);
  };

  const handleRestore = (img: VisualImage) => {
    if (activeTab === 'archives') setArchives(archives.filter(i => i.id !== img.id));
    else if (activeTab === 'trash') setTrash(trash.filter(i => i.id !== img.id));
    setGalerie([...galerie, img]);
    setZoomedImage(null);
    setIsEditing(false);
    triggerToast("Image replacée dans la galerie 📁", "info");
  };

  const nextCarouselSlide = () => {
    if (galerie.length > 0) setCarouselIndex((prev) => (prev + 1) % galerie.length);
  };
  
  const prevCarouselSlide = () => {
    if (galerie.length > 0) setCarouselIndex((prev) => (prev - 1 + galerie.length) % galerie.length);
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
  };
  const handleDragEnd = () => setDraggedId(null);
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetId: string) => {
    e.preventDefault();
    if (!draggedId || draggedId === targetId) return;

    const activeList = activeTab === 'galerie' ? galerie : activeTab === 'archives' ? archives : trash;
    const setList = activeTab === 'galerie' ? setGalerie : activeTab === 'archives' ? setArchives : setTrash;

    const oldIndex = activeList.findIndex(img => img.id === draggedId);
    const newIndex = activeList.findIndex(img => img.id === targetId);

    if (oldIndex !== -1 && newIndex !== -1) {
      const newList = [...activeList];
      const [movedItem] = newList.splice(oldIndex, 1);
      newList.splice(newIndex, 0, movedItem);
      setList(newList);
    }
  };

  const startEditing = () => {
    if (!zoomedImage) return;
    setEditScale(zoomedImage.scale || 1);
    setEditX(zoomedImage.offsetX || 0);
    setEditY(zoomedImage.offsetY || 0);
    setIsEditing(true);
  };

  const saveCrop = () => {
    if (!zoomedImage) return;
    const updateList = (list: VisualImage[], setList: any) => {
      setList(list.map(img => img.id === zoomedImage.id ? { ...img, scale: editScale, offsetX: editX, offsetY: editY } : img));
    };

    if (activeTab === 'galerie') updateList(galerie, setGalerie);
    else if (activeTab === 'archives') updateList(archives, setArchives);
    else if (activeTab === 'trash') updateList(trash, setTrash);

    setZoomedImage({ ...zoomedImage, scale: editScale, offsetX: editX, offsetY: editY });
    setIsEditing(false);
    triggerToast("Recadrage sauvegardé ✂️", "success");
  };

  const handlePanStart = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isEditing) return;
    setIsPanning(true);
    setPanStart({ x: e.clientX - editX, y: e.clientY - editY });
  };

  const handlePanMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isPanning || !isEditing) return;
    setEditX(e.clientX - panStart.x);
    setEditY(e.clientY - panStart.y);
  };

  const handlePanEnd = () => {
    if (isPanning) setIsPanning(false);
  };

  // Empêche le rendu de l'interface avant la récupération du localStorage pour éviter un flash ou une erreur d'hydratation
  if (!isLoaded) return null;

  return (
    <div className="w-full flex flex-col items-center gap-16 z-10 font-sans pb-20 relative">
      
      {/* STYLE CSS INTÉGRÉ POUR LES CONFETTIS */}
      <style>{`
        @keyframes fall {
          0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
        .animate-fall { animation: fall linear forwards; }
        @keyframes slideDown {
          0% { transform: translateY(-100%); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-down { animation: slideDown 0.4s ease-out forwards; }
      `}</style>

      {/* POP-UP NOTIFICATION */}
      {toastMessage && (
        <div className="fixed top-8 z-50 animate-slide-down flex justify-center w-full pointer-events-none">
          <div className={`px-6 py-3 rounded-full shadow-xl font-bold text-white flex items-center gap-2 
            ${toastMessage.type === 'success' ? 'bg-[#FF7EB3]' : 
              toastMessage.type === 'error' ? 'bg-red-400' : 'bg-[#8B47FF]'}`}
          >
            {toastMessage.text}
          </div>
        </div>
      )}

      {/* PLUIE DE CONFETTIS */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 flex justify-center items-start overflow-hidden">
          {Array.from({ length: 40 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-fall"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
                fontSize: `${1 + Math.random() * 1.5}rem`
              }}
            >
              {['🌸', '✨', '🎉', '🎊', '💜'][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>
      )}

      <input 
        type="file" 
        accept="image/png, image/jpeg, image/jpg" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
      />

      <h1 className="text-4xl md:text-5xl font-bold tracking-widest text-black text-center mt-4">
        Visualisation de <br/> projection
      </h1>

      {/* PELLICULE */}
      <div className="w-full flex justify-center mt-8">
        <div className="flex items-center gap-16">
          <div className="relative flex items-center justify-center">
            
            <img 
              src="/image_visualisation/Pellicule.svg" 
              alt="Cadre Pellicule" 
              className="w-[550px] h-auto relative z-0 drop-shadow-xl pointer-events-none" 
            />

            <div className="absolute z-10 w-[380px] h-[380px] overflow-hidden flex items-center justify-center bg-white">
              {galerie.length > 0 ? (
                <div 
                  className="flex flex-col w-full h-full transition-transform duration-500 ease-in-out" 
                  style={{ transform: `translateY(-${carouselIndex * 100}%)` }}
                >
                  {galerie.map(img => (
                    <div key={img.id} className="w-full h-full flex-shrink-0 flex items-center justify-center overflow-hidden bg-gray-50">
                      {img.imageUrl ? (
                        <img 
                          src={img.imageUrl} 
                          alt="Photo" 
                          className="w-full h-full object-cover pointer-events-none" 
                          style={{ 
                            objectPosition: `calc(50% + ${img.offsetX || 0}px) calc(50% + ${img.offsetY || 0}px)`,
                            transform: `scale(${img.scale || 1})` 
                          }}
                        />
                      ) : (
                        <div className={`w-full h-full ${img.colorClass}`}></div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <span className="text-gray-400 font-medium text-sm">Vide</span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-8">
            <button onClick={prevCarouselSlide} className="hover:scale-110 active:scale-95 transition-transform">
              <img src="/image_visualisation/Flèche_carré_bas.svg" alt="Haut" className="w-16 h-16 rotate-180 drop-shadow-md" />
            </button>
            <button onClick={nextCarouselSlide} className="hover:scale-110 active:scale-95 transition-transform">
              <img src="/image_visualisation/Flèche_carré_bas.svg" alt="Bas" className="w-16 h-16 drop-shadow-md" />
            </button>
          </div>
        </div>
      </div>

      {/* GALERIE */}
      <div className="w-full max-w-4xl flex flex-col mt-8">
        <div className="flex gap-3 mb-8 items-end justify-between w-full">
          <div className="flex gap-3">
            <button 
              onClick={() => { setActiveTab('galerie'); setZoomedImage(null); setIsEditing(false); }}
              className={`flex items-center gap-2 px-6 py-3 font-bold text-lg rounded-t-xl transition-colors ${activeTab === 'galerie' ? 'bg-[#FDF2F8] text-[#8B47FF]' : 'text-gray-400 hover:bg-gray-50'}`}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
              Mes images
            </button>
            <button 
              onClick={() => { setActiveTab('archives'); setZoomedImage(null); setIsEditing(false); }}
              className={`flex items-center gap-2 px-6 py-3 font-bold text-lg rounded-t-xl transition-colors ${activeTab === 'archives' ? 'bg-[#FDF2F8] text-[#8B47FF]' : 'bg-[#A855F7] text-white hover:bg-purple-700'} shadow-sm`}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 8v13H3V8M1 3h22v5H1zM10 12l2 2 2-2M12 10v4"/></svg>
              {activeTab === 'archives' && " Accomplissements"}
            </button>
            <button 
              onClick={() => { setActiveTab('trash'); setZoomedImage(null); setIsEditing(false); }}
              className={`flex items-center gap-2 px-6 py-3 font-bold text-lg rounded-t-xl transition-colors ${activeTab === 'trash' ? 'bg-[#FDF2F8] text-[#8B47FF]' : 'bg-[#5EEAD4] text-white hover:bg-teal-400'} shadow-sm`}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              {activeTab === 'trash' && " Supprimés"}
            </button>
          </div>
          <span className="text-sm text-gray-400 italic flex items-center gap-2 mb-3">
            💡 Maintenez le clic pour réorganiser
          </span>
        </div>

        <div className="grid grid-cols-4 gap-6">
          {currentImages.map((img) => (
            <div 
              key={img.id} 
              draggable={!isEditing} 
              onDragStart={(e) => handleDragStart(e, img.id)}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, img.id)}
              onClick={() => { setZoomedImage(img); setIsEditing(false); }}
              className={`w-full aspect-square shadow-sm cursor-grab active:cursor-grabbing transition-transform duration-200 hover:scale-105 rounded-xl overflow-hidden bg-white relative ${zoomedImage?.id === img.id && !isEditing ? 'ring-4 ring-[#8B47FF] ring-offset-2' : ''} ${draggedId === img.id ? 'opacity-40 border-2 border-dashed border-[#8B47FF]' : ''}`}
            >
              {img.imageUrl ? (
                <img 
                  src={img.imageUrl} 
                  alt="Miniature" 
                  className="w-full h-full object-cover pointer-events-none" 
                  style={{ 
                    objectPosition: `calc(50% + ${img.offsetX || 0}px) calc(50% + ${img.offsetY || 0}px)`,
                    transform: `scale(${img.scale || 1})`
                  }}
                />
              ) : (
                <div className={`w-full h-full ${img.colorClass}`}></div>
              )}
            </div>
          ))}
          
          {activeTab === 'galerie' && (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-full aspect-square flex items-center justify-center bg-gray-50 border-2 border-dashed border-gray-300 cursor-pointer hover:bg-gray-100 transition-colors rounded-xl"
            >
              <span className="text-4xl text-gray-400 font-light">+</span>
            </div>
          )}
        </div>
      </div>

      {/* VUE ZOOMÉE */}
      {zoomedImage && (
        <div className="w-full max-w-4xl flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500 mt-8 bg-[#F3F4F6] p-10 rounded-xl shadow-inner relative">
          
          {isEditing ? (
            <div 
              className="w-[400px] h-[400px] shadow-lg transition-all duration-300 rounded-xl overflow-hidden flex items-center justify-center bg-white relative ring-4 ring-[#5EEAD4] cursor-move"
              onMouseDown={handlePanStart}
              onMouseMove={handlePanMove}
              onMouseUp={handlePanEnd}
              onMouseLeave={handlePanEnd}
            >
              {zoomedImage.imageUrl ? (
                <img 
                  src={zoomedImage.imageUrl} 
                  alt="Zoom" 
                  className="w-full h-full object-cover pointer-events-none"
                  style={{ 
                    objectPosition: `calc(50% + ${editX}px) calc(50% + ${editY}px)`,
                    transform: `scale(${editScale})`,
                    transition: isPanning ? 'none' : 'transform 0.1s ease-out'
                  }}
                />
              ) : (
                <div className={`w-full h-full ${zoomedImage.colorClass}`}></div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="w-auto max-w-full shadow-md transition-all duration-300 rounded-xl flex items-center justify-center bg-white p-2">
                {zoomedImage.imageUrl ? (
                  <img 
                    src={zoomedImage.imageUrl} 
                    alt="Zoom Entier" 
                    className="w-auto max-w-full max-h-[500px] object-contain rounded-lg" 
                  />
                ) : (
                  <div className={`w-[400px] h-[400px] rounded-lg ${zoomedImage.colorClass}`}></div>
                )}
              </div>
              
              {zoomedImage.dateAdded && (
                <span className="text-gray-400 italic text-sm">
                  Ajouté le {zoomedImage.dateAdded}
                </span>
              )}
            </div>
          )}
          
          <div className="flex justify-between items-center w-full mt-6 px-4">
            {isEditing ? (
              <div className="flex flex-col w-full gap-4 items-center animate-in fade-in">
                <div className="flex items-center gap-4 w-[400px]">
                  <span className="text-sm font-bold text-[#4b3b5c]">Zoom</span>
                  <input 
                    type="range" min="1" max="3" step="0.05" 
                    value={editScale} 
                    onChange={(e) => setEditScale(parseFloat(e.target.value))} 
                    className="flex-1 accent-[#8B47FF]"
                  />
                </div>
                <span className="text-sm text-gray-500 italic">💡 Glissez l'image avec la souris pour la recadrer</span>
                
                <div className="flex gap-4 mt-2">
                  <button onClick={() => setIsEditing(false)} className="px-6 py-2 rounded-full border-2 border-gray-300 text-gray-600 font-bold hover:bg-white transition-colors">
                    Annuler
                  </button>
                  <button onClick={saveCrop} className="px-6 py-2 rounded-full bg-[#8B47FF] text-white font-bold hover:bg-purple-700 transition-colors shadow-sm">
                    Valider le recadrage
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex gap-4 items-center">
                  {zoomedImage.imageUrl && (
                    <button 
                      onClick={startEditing}
                      className="text-[#5EEAD4] hover:scale-110 transition-transform bg-white px-4 py-2 rounded-full shadow-sm flex items-center gap-2"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6.13 1L6 16a2 2 0 0 0 2 2h15"></path><path d="M1 6.13L16 6a2 2 0 0 1 2 2v15"></path></svg>
                      <span className="text-sm font-bold text-gray-700">Ajuster le cadrage</span>
                    </button>
                  )}
                  {activeTab !== 'galerie' && (
                    <button 
                      onClick={() => handleRestore(zoomedImage)}
                      className="text-[#8B47FF] hover:scale-110 transition-transform bg-white p-3 rounded-full shadow-sm"
                      title="Remettre dans la galerie"
                    >
                       <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
                    </button>
                  )}
                </div>
                
                <div className="flex gap-4">
                  {activeTab !== 'archives' && (
                    <button 
                      onClick={() => handleArchive(zoomedImage)}
                      className="text-[#8B47FF] hover:scale-110 transition-transform bg-white p-3 rounded-full shadow-sm"
                      title="Archiver (Accomplissement)"
                    >
                       <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 8v13H3V8M1 3h22v5H1zM10 12l2 2 2-2M12 10v4"/></svg>
                    </button>
                  )}
                  <button 
                    onClick={() => handleDelete(zoomedImage)}
                    className="text-[#8B47FF] hover:scale-110 transition-transform hover:text-red-500 bg-white p-3 rounded-full shadow-sm"
                    title={activeTab === 'trash' ? "Supprimer définitivement" : "Placer dans la corbeille"}
                  >
                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      
    </div>
  );
}