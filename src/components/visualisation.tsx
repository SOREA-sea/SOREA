"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

interface VisualImage {
  id: string;
  colorClass?: string;
  imageUrl?: string;
  scale?: number;
  offsetX?: number;
  offsetY?: number;
  dateAdded?: string;
}

type TabType = "galerie" | "archives" | "trash";

const MAX_FREE_IMAGES = 5;
const DEFAULT_GALERIE: VisualImage[] = [];

const compressImageToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_SIZE = 1080;
        let { width, height } = img;

        if (width > height && width > MAX_SIZE) {
          height *= MAX_SIZE / width;
          width = MAX_SIZE;
        } else if (height > MAX_SIZE) {
          width *= MAX_SIZE / height;
          height = MAX_SIZE;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");

        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", 0.7));
        } else {
          resolve(event.target?.result as string);
        }
      };

      img.onerror = (error) => reject(error);
    };

    reader.onerror = (error) => reject(error);
  });
};

export default function Visualisation() {
  const [isPremium] = useState(false);
  const [galerie, setGalerie] = useState<VisualImage[]>([]);
  const [archives, setArchives] = useState<VisualImage[]>([]);
  const [trash, setTrash] = useState<VisualImage[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const [activeTab, setActiveTab] = useState<TabType>("galerie");
  const [zoomedImage, setZoomedImage] = useState<VisualImage | null>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editScale, setEditScale] = useState(1);
  const [editX, setEditX] = useState(0);
  const [editY, setEditY] = useState(0);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // ÉTATS POUR LE PLEIN ÉCRAN
  const [isFullscreenPellicule, setIsFullscreenPellicule] = useState(false);
  const [isFullscreenImage, setIsFullscreenImage] = useState(false);

  const [toastMessage, setToastMessage] = useState<{
    text: string;
    type: "success" | "info" | "error" | "premium";
  } | null>(null);

  const [showConfetti, setShowConfetti] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const totalUsedImages = galerie.length + archives.length;

  const getListMethods = (tab: TabType) => {
    switch (tab) {
      case "galerie":
        return { list: galerie, set: setGalerie };
      case "archives":
        return { list: archives, set: setArchives };
      case "trash":
        return { list: trash, set: setTrash };
    }
  };

  const currentImages = getListMethods(activeTab).list;

  useEffect(() => {
    const savedGalerie = localStorage.getItem("sorea_visualisation_galerie");
    const savedArchives = localStorage.getItem("sorea_visualisation_archives");
    const savedTrash = localStorage.getItem("sorea_visualisation_trash");

    setGalerie(savedGalerie ? JSON.parse(savedGalerie) : DEFAULT_GALERIE);
    if (savedArchives) setArchives(JSON.parse(savedArchives));
    if (savedTrash) setTrash(JSON.parse(savedTrash));
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem("sorea_visualisation_galerie", JSON.stringify(galerie));
        localStorage.setItem("sorea_visualisation_archives", JSON.stringify(archives));
        localStorage.setItem("sorea_visualisation_trash", JSON.stringify(trash));
      } catch (e) {
        triggerToast("Le stockage de votre navigateur est saturé !", "error");
      }
    }
  }, [galerie, archives, trash, isLoaded]);

  // --- GESTION DU CLAVIER (Échap, Flèche Haut, Flèche Bas) ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      
      if (e.key === "Escape") {
        setIsFullscreenImage(false);
        setIsFullscreenPellicule(false);
      }
      
      
      if (isFullscreenPellicule && galerie.length > 0) {
        if (e.key === "ArrowUp") {
          e.preventDefault(); // Empêche le scroll de la page
          setCarouselIndex((prev) => (prev - 1 + galerie.length) % galerie.length);
        } else if (e.key === "ArrowDown") {
          e.preventDefault(); // Empêche le scroll de la page
          setCarouselIndex((prev) => (prev + 1 + galerie.length) % galerie.length);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreenPellicule, galerie.length]);

  const triggerToast = (text: string, type: "success" | "info" | "error" | "premium") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const closeZoom = () => {
    setZoomedImage(null);
    setIsEditing(false);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isPremium && totalUsedImages >= MAX_FREE_IMAGES) {
      triggerToast("Limite atteinte (5/5). Passez Premium pour débloquer plus d'espace !", "premium");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const file = e.target.files?.[0];

    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        triggerToast("L'image est trop lourde (max 10Mo)", "error");
        return;
      }

      try {
        const compressedBase64 = await compressImageToBase64(file);
        setGalerie([
          ...galerie,
          {
            id: Date.now().toString(),
            imageUrl: compressedBase64,
            scale: 1,
            offsetX: 0,
            offsetY: 0,
            dateAdded: new Date().toLocaleDateString("fr-FR"),
          },
        ]);
        triggerToast("Image importée avec succès !", "success");
      } catch (error) {
        triggerToast("Erreur lors de la lecture de l'image", "error");
      }
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleArchive = (img: VisualImage) => {
    getListMethods(activeTab).set((prev) => prev.filter((i) => i.id !== img.id));
    setArchives([...archives, img]);
    closeZoom();
    setShowConfetti(true);
    triggerToast("Félicitations ! Vœu accompli et archivé", "success");
    setTimeout(() => setShowConfetti(false), 4000);
  };

  const handleDelete = (img: VisualImage) => {
    getListMethods(activeTab).set((prev) => prev.filter((i) => i.id !== img.id));

    if (activeTab === "trash") {
      triggerToast("Image supprimée définitivement", "error");
    } else {
      setTrash([...trash, img]);
      triggerToast("Image placée dans la corbeille", "info");
    }

    closeZoom();
  };

  const handleRestore = (img: VisualImage) => {
    if (!isPremium && activeTab === "trash" && totalUsedImages >= MAX_FREE_IMAGES) {
      triggerToast("Impossible de restaurer : limite globale de 5 images atteinte.", "premium");
      return;
    }

    getListMethods(activeTab).set((prev) => prev.filter((i) => i.id !== img.id));
    setGalerie([...galerie, img]);
    closeZoom();
    triggerToast("Image replacée dans la galerie", "info");
  };

  const changeSlide = (dir: 1 | -1) => {
    if (galerie.length > 0) {
      setCarouselIndex((prev) => (prev + dir + galerie.length) % galerie.length);
    }
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedId || draggedId === targetId) return;

    const { list, set } = getListMethods(activeTab);
    const oldIndex = list.findIndex((img) => img.id === draggedId);
    const newIndex = list.findIndex((img) => img.id === targetId);

    if (oldIndex !== -1 && newIndex !== -1) {
      const newList = [...list];
      const [movedItem] = newList.splice(oldIndex, 1);
      newList.splice(newIndex, 0, movedItem);
      set(newList);
    }

    setDraggedId(null);
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
    const { set } = getListMethods(activeTab);

    set((prev) =>
      prev.map((img) =>
        img.id === zoomedImage.id
          ? { ...img, scale: editScale, offsetX: editX, offsetY: editY }
          : img
      )
    );

    setZoomedImage({ ...zoomedImage, scale: editScale, offsetX: editX, offsetY: editY });
    setIsEditing(false);
    triggerToast("Recadrage sauvegardé", "success");
  };

  const handlePan = (e: React.MouseEvent, type: "start" | "move" | "end") => {
    if (!isEditing) return;

    if (type === "start") {
      e.preventDefault();
      setIsPanning(true);
      setPanStart({ x: e.clientX - editX, y: e.clientY - editY });
    }

    if (type === "move" && isPanning) {
      e.preventDefault();
      setEditX(e.clientX - panStart.x);
      setEditY(e.clientY - panStart.y);
    }

    if (type === "end") setIsPanning(false);
  };

  if (!isLoaded) return null;

  const TABS_CONFIG = [
    {
      id: "galerie" as TabType,
      label: "Mes images",
      icon: <GridIcon />,
      activeClass: "bg-[#FDF2F8] text-[#8B47FF]",
      inactiveClass: "text-gray-400 hover:bg-gray-50",
    },
    {
      id: "archives" as TabType,
      label: "Accomplissements",
      icon: <ArchiveIcon />,
      activeClass: "bg-[#FDF2F8] text-[#8B47FF]",
      inactiveClass: "bg-[#A855F7] text-white hover:bg-purple-700 shadow-sm",
    },
    {
      id: "trash" as TabType,
      label: "Supprimés",
      icon: <TrashIcon />,
      activeClass: "bg-[#FDF2F8] text-[#8B47FF]",
      inactiveClass: "bg-[#5EEAD4] text-white hover:bg-teal-400 shadow-sm",
    },
  ];

  return (
    <div className="w-full flex flex-col items-center gap-16 z-10 font-sans pb-20 relative">
      <style>{`
        @keyframes slideDown {
          0% { transform: translateY(-100%); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-down { animation: slideDown 0.4s ease-out forwards; }
        @keyframes fall {
          0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
        .animate-fall { animation: fall linear forwards; }
      `}</style>

      {/* OVERLAY: IMAGE PLEIN ÉCRAN (TELEPORTÉ DANS LE BODY POUR PASSER SUR LA NAVBAR) */}
      {isLoaded && isFullscreenImage && zoomedImage && createPortal(
        <div className="fixed inset-0 z-[99999] bg-black/95 flex items-center justify-center animate-in fade-in duration-300">
          <button
            onClick={() => setIsFullscreenImage(false)}
            className="absolute top-6 right-8 text-white/70 hover:text-white transition-colors z-[100000]"
          >
            <CloseIcon />
          </button>
          <div className="w-full h-full p-4 flex items-center justify-center">
            {zoomedImage.imageUrl ? (
              <img
                src={zoomedImage.imageUrl}
                alt="Zoom Fullscreen"
                className="w-full h-full object-contain pointer-events-none"
              />
            ) : (
              <div className={`w-full h-full max-w-5xl max-h-[80vh] rounded-3xl ${zoomedImage.colorClass}`}></div>
            )}
          </div>
        </div>,
        document.body
      )}

      {/* OVERLAY: PELLICULE PLEIN ÉCRAN (TELEPORTÉ DANS LE BODY POUR PASSER SUR LA NAVBAR) */}
      {isLoaded && isFullscreenPellicule && createPortal(
        <div className="fixed inset-0 z-[99999] bg-gradient-to-b from-purple-50 to-[#f9f5fa] flex items-center justify-center animate-in fade-in duration-300">
          <button
            onClick={() => setIsFullscreenPellicule(false)}
            className="absolute top-6 right-8 text-[#592592] hover:text-[#8B47FF] transition-colors z-[100000]"
          >
            <CloseIcon />
          </button>

          <div className="flex items-center justify-center gap-8 md:gap-16 w-full h-[100vh]">
            <div className="h-[100vh] aspect-square overflow-hidden relative drop-shadow-2xl">
              {galerie.length > 0 ? (
                <div
                  className="absolute top-0 left-0 w-full flex flex-col transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateY(calc(-${carouselIndex} * 100vh))` }}
                >
                  {galerie.map((img) => (
                    <div key={img.id} className="w-full h-[100vh] flex-shrink-0 relative">
                      <img
                        src="/image_Design-SOREA/Pellicule.svg"
                        alt="Cadre Pellicule"
                        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
                      />
                      <div className="absolute z-10 w-[69.1%] h-[69.1%] overflow-hidden flex items-center justify-center bg-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        {img.imageUrl ? (
                          <img
                            src={img.imageUrl}
                            alt="Photo"
                            draggable={false}
                            className="w-full h-full object-cover pointer-events-none select-none"
                            style={{
                              objectPosition: `calc(50% + ${img.offsetX || 0}px) calc(50% + ${img.offsetY || 0}px)`,
                              transform: `scale(${img.scale || 1})`,
                            }}
                          />
                        ) : (
                          <div className={`w-full h-full ${img.colorClass}`}></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="w-full h-full flex-shrink-0 relative">
                  <img
                    src="/image_visualisation/Pellicule.svg"
                    alt="Cadre Pellicule Vide"
                    className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
                  />
                  <div className="absolute z-10 w-[69.1%] h-[69.1%] overflow-hidden flex items-center justify-center bg-gray-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <span className="text-gray-400 font-medium text-xl">Vide</span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex flex-col gap-12 z-[100000]">
              <button onClick={() => changeSlide(-1)} className="hover:scale-110 active:scale-95 transition-transform bg-white p-2 rounded-xl shadow-md border border-purple-100">
                <img src="/image_icone/Flèche_carré_haute.svg" alt="Haut" className="w-16 h-16" />
              </button>
              <button onClick={() => changeSlide(1)} className="hover:scale-110 active:scale-95 transition-transform bg-white p-2 rounded-xl shadow-md border border-purple-100">
                <img src="/image_icone/Flèche_carré_basse.svg" alt="Bas" className="w-16 h-16" />
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* NOTIFICATION */}
      {toastMessage && (
        <div className="fixed top-8 z-50 animate-slide-down flex justify-center w-full pointer-events-none">
          <div
            className={`px-6 py-3 rounded-full shadow-xl font-bold flex items-center gap-2 ${
              toastMessage.type === "success"
                ? "bg-[#FF7EB3] text-white"
                : toastMessage.type === "error"
                ? "bg-red-400 text-white"
                : toastMessage.type === "premium"
                ? "bg-[#FFD700] text-black ring-4 ring-yellow-200"
                : "bg-[#8B47FF] text-white"
            }`}
          >
            {toastMessage.text}
          </div>
        </div>
      )}

      {/* CONFETTIS */}
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
                fontSize: `${1 + Math.random() * 1.5}rem`,
              }}
            >
              {["🌸", "✨", "🎉", "🎊", "💜"][Math.floor(Math.random() * 5)]}
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
        Visualisation de <br /> projection
      </h1>

      {/* PELLICULE CLASSIQUE */}
      <div className="w-full flex justify-center mt-8">
        <div className="flex items-center gap-16">
          <div 
            onClick={() => setIsFullscreenPellicule(true)}
            title="Appuyer pour voir en plein écran"
            className="w-[550px] h-[550px] overflow-hidden relative rounded-2xl cursor-pointer hover:shadow-[0_0_40px_rgba(139,71,255,0.2)] hover:scale-[1.02] transition-all group"
          >
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors z-50 flex items-center justify-center">
              <div className="bg-white/90 p-4 rounded-full opacity-0 group-hover:opacity-100 transition-all transform scale-75 group-hover:scale-100 shadow-xl text-[#8B47FF]">
                <FullscreenIcon />
              </div>
            </div>

            {galerie.length > 0 ? (
              <div
                className="absolute top-0 left-0 w-full flex flex-col transition-transform duration-500 ease-in-out"
                style={{ transform: `translateY(-${carouselIndex * 550}px)` }}
              >
                {galerie.map((img) => (
                  <div key={img.id} className="w-[550px] h-[550px] flex-shrink-0 relative">
                    <img
                      src="/image_Design-SOREA/Pellicule.svg"
                      alt="Cadre Pellicule"
                      className="absolute inset-0 w-full h-full object-cover z-0 drop-shadow-xl pointer-events-none"
                    />

                    <div className="absolute z-10 w-[380px] h-[380px] overflow-hidden flex items-center justify-center bg-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      {img.imageUrl ? (
                        <img
                          src={img.imageUrl}
                          alt="Photo"
                          draggable={false}
                          className="w-full h-full object-cover pointer-events-none select-none"
                          style={{
                            objectPosition: `calc(50% + ${img.offsetX || 0}px) calc(50% + ${img.offsetY || 0}px)`,
                            transform: `scale(${img.scale || 1})`,
                          }}
                        />
                      ) : (
                        <div className={`w-full h-full ${img.colorClass}`}></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-[550px] h-[550px] flex-shrink-0 relative">
                <img
                  src="/image_visualisation/Pellicule.svg"
                  alt="Cadre Pellicule Vide"
                  className="absolute inset-0 w-full h-full object-cover z-0 drop-shadow-xl pointer-events-none"
                />

                <div className="absolute z-10 w-[380px] h-[380px] overflow-hidden flex items-center justify-center bg-gray-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <span className="text-gray-400 font-medium text-sm">Vide</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-8">
            <button onClick={() => changeSlide(-1)} className="hover:scale-110 active:scale-95 transition-transform">
              <img src="/image_icone/Flèche_carré_haute.svg" alt="Haut" className="w-16 h-16 drop-shadow-md" />
            </button>

            <button onClick={() => changeSlide(1)} className="hover:scale-110 active:scale-95 transition-transform">
              <img src="/image_icone/Flèche_carré_basse.svg" alt="Bas" className="w-16 h-16 drop-shadow-md" />
            </button>
          </div>
        </div>
      </div>

      {/* GRAND PLAN */}
      {zoomedImage && (
        <div className="w-full max-w-4xl flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500 mt-8 bg-[#F3F4F6] p-10 rounded-xl shadow-inner relative">
          {isEditing ? (
            <div
              className="w-[400px] h-[400px] shadow-lg transition-all duration-300 rounded-xl overflow-hidden flex items-center justify-center bg-white relative ring-4 ring-[#5EEAD4] cursor-move select-none touch-none"
              onMouseDown={(e) => handlePan(e, "start")}
              onMouseMove={(e) => handlePan(e, "move")}
              onMouseUp={(e) => handlePan(e, "end")}
              onMouseLeave={(e) => handlePan(e, "end")}
            >
              {zoomedImage.imageUrl ? (
                <img
                  src={zoomedImage.imageUrl}
                  alt="Zoom"
                  draggable={false}
                  className="w-full h-full object-cover pointer-events-none select-none"
                  style={{
                    objectPosition: `calc(50% + ${editX}px) calc(50% + ${editY}px)`,
                    transform: `scale(${editScale})`,
                    transition: isPanning ? "none" : "transform 0.1s ease-out",
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
                  <img src={zoomedImage.imageUrl} alt="Zoom Entier" className="w-auto max-w-full max-h-[500px] object-contain rounded-lg" />
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
                    type="range"
                    min="1"
                    max="3"
                    step="0.05"
                    value={editScale}
                    onChange={(e) => setEditScale(parseFloat(e.target.value))}
                    className="flex-1 accent-[#8B47FF]"
                  />
                </div>

                <span className="text-sm text-gray-500 italic">
                  Glissez l'image avec la souris pour la recadrer
                </span>

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
                  <button 
                    onClick={() => setIsFullscreenImage(true)} 
                    className="text-[#8B47FF] hover:scale-110 transition-transform bg-white px-4 py-2 rounded-full shadow-sm flex items-center gap-2"
                  >
                    <FullscreenIcon />
                    <span className="text-sm font-bold text-gray-700">Plein écran</span>
                  </button>

                  {zoomedImage.imageUrl && (
                    <button onClick={startEditing} className="text-[#5EEAD4] hover:scale-110 transition-transform bg-white px-4 py-2 rounded-full shadow-sm flex items-center gap-2">
                      <CropIcon />
                      <span className="text-sm font-bold text-gray-700">Ajuster le cadrage</span>
                    </button>
                  )}

                  {activeTab !== "galerie" && (
                    <button onClick={() => handleRestore(zoomedImage)} className="text-[#8B47FF] hover:scale-110 transition-transform bg-white p-3 rounded-full shadow-sm" title="Remettre dans la galerie">
                      <RestoreIcon />
                    </button>
                  )}
                </div>

                <div className="flex gap-4">
                  {activeTab !== "archives" && (
                    <button onClick={() => handleArchive(zoomedImage)} className="text-[#8B47FF] hover:scale-110 transition-transform bg-white p-3 rounded-full shadow-sm" title="Archiver">
                      <ArchiveIcon />
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(zoomedImage)}
                    className="text-[#8B47FF] hover:scale-110 transition-transform hover:text-red-500 bg-white p-3 rounded-full shadow-sm"
                    title={activeTab === "trash" ? "Supprimer définitivement" : "Placer dans la corbeille"}
                  >
                    <TrashIcon />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* GALERIE */}
      <div className="w-full max-w-4xl flex flex-col mt-8">
        <div className="flex gap-3 mb-8 items-end justify-between w-full">
          <div className="flex gap-3 items-center">
            {TABS_CONFIG.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  closeZoom();
                }}
                className={`flex items-center gap-2 px-6 py-3 font-bold text-lg rounded-t-xl transition-colors ${
                  activeTab === tab.id ? tab.activeClass : tab.inactiveClass
                }`}
              >
                {tab.icon}
                {tab.id === "galerie" || activeTab === tab.id ? tab.label : ""}
              </button>
            ))}

            {!isPremium && (activeTab === "galerie" || activeTab === "archives") && (
              <span
                className={`ml-4 text-sm font-bold px-3 py-1 rounded-full ${
                  totalUsedImages >= MAX_FREE_IMAGES ? "bg-red-100 text-red-600" : "bg-purple-100 text-[#8B47FF]"
                }`}
              >
                {totalUsedImages} / {MAX_FREE_IMAGES} images globales
              </span>
            )}
          </div>

          <span className="text-sm text-gray-400 italic flex items-center gap-2 mb-3">
            Maintenez le clic pour réorganiser
          </span>
        </div>

        <div className="grid grid-cols-4 gap-6">
          {currentImages.map((img) => (
            <div
              key={img.id}
              draggable={!isEditing}
              onDragStart={(e) => handleDragStart(e, img.id)}
              onDragEnd={() => setDraggedId(null)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, img.id)}
              onClick={() => {
                setZoomedImage(img);
                setIsEditing(false);
              }}
              className={`w-full aspect-square shadow-sm cursor-grab active:cursor-grabbing transition-transform duration-200 hover:scale-105 rounded-xl overflow-hidden bg-white relative ${
                zoomedImage?.id === img.id && !isEditing ? "ring-4 ring-[#8B47FF] ring-offset-2" : ""
              } ${draggedId === img.id ? "opacity-40 border-2 border-dashed border-[#8B47FF]" : ""}`}
            >
              {img.imageUrl ? (
                <img
                  src={img.imageUrl}
                  alt="Miniature"
                  className="w-full h-full object-cover pointer-events-none"
                  style={{
                    objectPosition: `calc(50% + ${img.offsetX || 0}px) calc(50% + ${img.offsetY || 0}px)`,
                    transform: `scale(${img.scale || 1})`,
                  }}
                />
              ) : (
                <div className={`w-full h-full ${img.colorClass}`}></div>
              )}
            </div>
          ))}

          {activeTab === "galerie" && (
            <div
              onClick={() =>
                !isPremium && totalUsedImages >= MAX_FREE_IMAGES
                  ? triggerToast("Débloquez SOREA Premium pour ajouter plus d'images !", "premium")
                  : fileInputRef.current?.click()
              }
              className={`w-full aspect-square flex flex-col items-center justify-center border-2 border-dashed rounded-xl transition-all ${
                !isPremium && totalUsedImages >= MAX_FREE_IMAGES
                  ? "bg-purple-50 border-purple-200 cursor-not-allowed hover:bg-purple-100"
                  : "bg-gray-50 border-gray-300 cursor-pointer hover:bg-gray-100"
              }`}
            >
              {!isPremium && totalUsedImages >= MAX_FREE_IMAGES ? (
                <>
                  <span className="text-3xl mb-2">🔒</span>
                  <span className="text-xs text-center font-bold text-[#8B47FF] px-2 uppercase tracking-wider">
                    Passer Premium
                  </span>
                </>
              ) : (
                <span className="text-4xl text-gray-400 font-light">+</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- ICONS ---
const GridIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <circle cx="8.5" cy="8.5" r="1.5"></circle>
    <polyline points="21 15 16 10 5 21"></polyline>
  </svg>
);

const ArchiveIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 8v13H3V8M1 3h22v5H1zM10 12l2 2 2-2M12 10v4" />
  </svg>
);

const TrashIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2-2v2"></path>
  </svg>
);

const RestoreIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
    <circle cx="12" cy="13" r="4"></circle>
  </svg>
);

const CropIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6.13 1L6 16a2 2 0 0 0 2 2h15"></path>
    <path d="M1 6.13L16 6a2 2 0 0 1 2 2v15"></path>
  </svg>
);

const FullscreenIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
  </svg>
);

const CloseIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);