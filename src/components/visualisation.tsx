"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";

interface VisualImage {
  id: string;
  colorClass?: string;
  imageUrl?: string;
}

type TabType = 'galerie' | 'archives' | 'trash';

export default function Visualisation() {
  const [galerie, setGalerie] = useState<VisualImage[]>([
    { id: "1", colorClass: "bg-[#FBCFE8]" }, 
    { id: "2", colorClass: "bg-[#A855F7]" }, 
    { id: "3", colorClass: "bg-[#C4B5FD]" }, 
    { id: "4", colorClass: "bg-[#5EEAD4]" }, 
    { id: "5", colorClass: "bg-[#FEF08A]" }, 
    { id: "6", colorClass: "bg-[#A8A29E]" }, 
    { id: "7", colorClass: "bg-[#FFFFFF]" }, 
  ]);
  const [archives, setArchives] = useState<VisualImage[]>([]);
  const [trash, setTrash] = useState<VisualImage[]>([]);

  const [activeTab, setActiveTab] = useState<TabType>('galerie');
  const [zoomedImage, setZoomedImage] = useState<VisualImage | null>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  
  
  const [draggedId, setDraggedId] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentImages = activeTab === 'galerie' ? galerie : activeTab === 'archives' ? archives : trash;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      const newImg: VisualImage = { id: Date.now().toString(), imageUrl };
      setGalerie([...galerie, newImg]);
    }
  };

  const handleArchive = (img: VisualImage) => {
    if (activeTab === 'galerie') {
      setGalerie(galerie.filter(i => i.id !== img.id));
    } else if (activeTab === 'trash') {
      setTrash(trash.filter(i => i.id !== img.id));
    }
    setArchives([...archives, img]);
    setZoomedImage(null);
  };

  const handleDelete = (img: VisualImage) => {
    if (activeTab === 'galerie') {
      setGalerie(galerie.filter(i => i.id !== img.id));
    } else if (activeTab === 'archives') {
      setArchives(archives.filter(i => i.id !== img.id));
    }
    
    if (activeTab === 'trash') {
      setTrash(trash.filter(i => i.id !== img.id));
    } else {
      setTrash([...trash, img]);
    }
    setZoomedImage(null);
  };

  const handleRestore = (img: VisualImage) => {
    if (activeTab === 'archives') {
      setArchives(archives.filter(i => i.id !== img.id));
    } else if (activeTab === 'trash') {
      setTrash(trash.filter(i => i.id !== img.id));
    }
    setGalerie([...galerie, img]);
    setZoomedImage(null);
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

  const handleDragEnd = () => {
    setDraggedId(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Nécessaire pour autoriser le "drop"
    e.dataTransfer.dropEffect = 'move';
  };

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

  return (
    <div className="w-full flex flex-col items-center gap-16 z-10 font-sans pb-20">
      
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

      <div className="w-full flex justify-center mt-8">
        
        <div className="flex items-center gap-16">
          
          <div className="relative flex items-center justify-center">
            <img 
              src="/image_visualisation/Pellicule.svg" 
              alt="Pellicule" 
              className="w-[480px] h-auto relative z-0 drop-shadow-xl pointer-events-none" 
            />

            <div className="absolute z-10 w-[320px] h-[320px] overflow-hidden flex items-center justify-center bg-white/50">
              {galerie.length > 0 ? (
                <div 
                  className="flex flex-col w-full h-full transition-transform duration-500 ease-in-out" 
                  style={{ transform: `translateY(-${carouselIndex * 100}%)` }}
                >
                  {galerie.map(img => (
                    <div key={img.id} className="w-full h-full flex-shrink-0 flex items-center justify-center bg-white">
                      {img.imageUrl ? (
                        <img src={img.imageUrl} alt="Pellicule" className="w-full h-full object-cover" />
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

      <div className="w-full max-w-4xl flex flex-col mt-8">
        
        <div className="flex gap-3 mb-8 items-end justify-between w-full">
          <div className="flex gap-3">
            <button 
              onClick={() => { setActiveTab('galerie'); setZoomedImage(null); }}
              className={`flex items-center gap-2 px-6 py-3 font-bold text-lg rounded-t-xl transition-colors ${activeTab === 'galerie' ? 'bg-[#FDF2F8] text-[#8B47FF]' : 'text-gray-400 hover:bg-gray-50'}`}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
              Mes images
            </button>
            
            <button 
              onClick={() => { setActiveTab('archives'); setZoomedImage(null); }}
              className={`flex items-center gap-2 px-6 py-3 font-bold text-lg rounded-t-xl transition-colors ${activeTab === 'archives' ? 'bg-[#FDF2F8] text-[#8B47FF]' : 'bg-[#A855F7] text-white hover:bg-purple-700'} shadow-sm`}
              title="Mes accomplissements"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 8v13H3V8M1 3h22v5H1zM10 12l2 2 2-2M12 10v4"/></svg>
              {activeTab === 'archives' && " Accomplissements"}
            </button>
            
            <button 
              onClick={() => { setActiveTab('trash'); setZoomedImage(null); }}
              className={`flex items-center gap-2 px-6 py-3 font-bold text-lg rounded-t-xl transition-colors ${activeTab === 'trash' ? 'bg-[#FDF2F8] text-[#8B47FF]' : 'bg-[#5EEAD4] text-white hover:bg-teal-400'} shadow-sm`}
              title="Corbeille"
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
              draggable={true} // Rend l'élément déplaçable
              onDragStart={(e) => handleDragStart(e, img.id)}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, img.id)}
              onClick={() => setZoomedImage(img)}
              className={`w-full aspect-square shadow-sm cursor-grab active:cursor-grabbing transition-transform duration-200 hover:scale-105 rounded-xl overflow-hidden ${zoomedImage?.id === img.id ? 'ring-4 ring-[#8B47FF] ring-offset-2' : ''} ${img.colorClass || 'bg-gray-100'} ${draggedId === img.id ? 'opacity-40 border-2 border-dashed border-[#8B47FF]' : ''}`}
            >
              {img.imageUrl && <img src={img.imageUrl} alt="Miniature" className="w-full h-full object-cover pointer-events-none" />}
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

      {zoomedImage && (
        <div className="w-full max-w-4xl flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500 mt-8 bg-[#F3F4F6] p-10 rounded-xl">
          
          <div className={`w-full aspect-video shadow-md transition-all duration-300 rounded-xl overflow-hidden flex items-center justify-center ${zoomedImage.colorClass || 'bg-black/5'}`}>
             {zoomedImage.imageUrl && <img src={zoomedImage.imageUrl} alt="Zoom" className="w-full h-full object-contain" />}
          </div>
          
          <div className="flex justify-between items-center w-full mt-6 px-4">
            
            <div className="flex gap-4">
              {activeTab !== 'galerie' && (
                <button 
                  onClick={() => handleRestore(zoomedImage)}
                  className="text-[#8B47FF] hover:scale-110 transition-transform bg-white p-2 rounded-full shadow-sm"
                  title="Remettre dans la galerie"
                >
                   <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
                </button>
              )}
            </div>
            
            <div className="flex gap-4">
              {activeTab !== 'archives' && (
                <button 
                  onClick={() => handleArchive(zoomedImage)}
                  className="text-[#8B47FF] hover:scale-110 transition-transform bg-white p-2 rounded-full shadow-sm"
                  title="Archiver (Accomplissement)"
                >
                   <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 8v13H3V8M1 3h22v5H1zM10 12l2 2 2-2M12 10v4"/></svg>
                </button>
              )}
              <button 
                onClick={() => handleDelete(zoomedImage)}
                className="text-[#8B47FF] hover:scale-110 transition-transform hover:text-red-500 bg-white p-2 rounded-full shadow-sm"
                title={activeTab === 'trash' ? "Supprimer définitivement" : "Placer dans la corbeille"}
              >
                 <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              </button>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
}