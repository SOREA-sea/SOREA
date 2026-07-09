"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";
import {
  getAllFilRouges,
  toggleFavori,
  deleteFilRouge,
  upsertFilRouge,
  allFeatures,
  getFeature,
  FilRougeItem,
} from "../../lib/favorites-store";
import FilRougeCard from "../../components/FilRougeCard";

export default function FilRougeDiscoverPage() {
  const router = useRouter();
  
  const [filRouges, setFilRougesState] = useState<FilRougeItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setFilRougesState(getAllFilRouges());
    setIsLoaded(true);
  }, []);

  const refresh = () => setFilRougesState([...getAllFilRouges()]);

  const handleToggleFavori = (id: string) => {
    toggleFavori(id);
    refresh();
  };

  const handleDelete = (id: string) => {
    deleteFilRouge(id);
    refresh();
  };

  const handleSave = (item: FilRougeItem) => {
    upsertFilRouge(item);
    refresh();
    setEditingId(null);
    setShowCreate(false);
  };

  if (!isLoaded) return <div className="text-center py-20 text-purple-400">Chargement...</div>;

  return (
    <div className="mx-auto w-full max-w-[1200px] px-4 py-10">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-black tracking-wide text-[#592592]">Découvrir un Fil Rouge</h1>
        <p className="text-lg font-medium text-[#7d53b2] mt-2">Choisis ta prochaine routine</p>
      </div>

      <button
        onClick={() => router.push("/challenge")}
        className="mb-8 flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 transition-colors"
      >
        ← Retour
      </button>

      <div className="flex flex-col gap-8">
        {filRouges.map((item) =>
          editingId === item.id ? (
            <FilRougeEditor key={item.id} initial={item} onCancel={() => setEditingId(null)} onSave={handleSave} />
          ) : (
            <FilRougeCard
              key={item.id}
              item={item}
              onDelete={() => handleDelete(item.id)}
              onEdit={() => setEditingId(item.id)}
              onToggleFavori={() => handleToggleFavori(item.id)}
            />
          )
        )}

        {showCreate ? (
          <FilRougeEditor
            initial={{ id: `custom-${Date.now()}`, title: "", objectif: "", favori: false, steps: [] }}
            onCancel={() => setShowCreate(false)}
            onSave={handleSave}
          />
        ) : (
          <button
            onClick={() => setShowCreate(true)}
            className="border-2 border-dashed border-purple-200 rounded-[28px] py-10 flex flex-col items-center justify-center gap-2 text-[#7d53b2] hover:bg-purple-50 transition-colors"
          >
            <Plus size={32} />
            <span className="font-bold">Créer mon Fil Rouge</span>
          </button>
        )}
      </div>
    </div>
  );
}

function FilRougeEditor({
  initial,
  onCancel,
  onSave,
}: {
  initial: FilRougeItem;
  onCancel: () => void;
  onSave: (item: FilRougeItem) => void;
}) {
  const [title, setTitle] = useState(initial.title);
  const [objectif, setObjectif] = useState(initial.objectif || "");
  const [steps, setSteps] = useState<string[]>(initial.steps);

  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  const toggleStep = (key: string) => {
    setSteps((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  };

  const moveStep = (index: number, direction: -1 | 1) => {
    setSteps((prev) => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return next;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const handleDragStart = (index: number) => {
    dragItem.current = index;
  };

  const handleDragEnter = (index: number) => {
    dragOverItem.current = index;
  };

  const handleDragEnd = () => {
    if (dragItem.current !== null && dragOverItem.current !== null && dragItem.current !== dragOverItem.current) {
      const newSteps = [...steps];
      const draggedItemContent = newSteps[dragItem.current];
      newSteps.splice(dragItem.current, 1);
      newSteps.splice(dragOverItem.current, 0, draggedItemContent);
      setSteps(newSteps);
    }
    dragItem.current = null;
    dragOverItem.current = null;
  };

  return (
    <div className="bg-white rounded-[28px] border-2 border-[#8B47FF]/30 shadow-lg p-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-[#592592]">{initial.title ? "Modifier le Fil Rouge" : "Nouveau Fil Rouge"}</h3>
        <button onClick={onCancel} className="p-1 rounded-full hover:bg-purple-50 text-gray-400 transition-colors">
          <X size={20} />
        </button>
      </div>

      <div className="flex flex-col gap-4 mb-6">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Titre du Fil Rouge"
          className="border border-purple-100 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-200"
        />
        <input
          type="text"
          value={objectif}
          onChange={(e) => setObjectif(e.target.value)}
          placeholder="Objectif souhaité (optionnel)"
          className="border border-purple-100 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-200"
        />
      </div>

      <p className="text-sm font-semibold text-[#592592] mb-2">Choisis tes étapes en cliquant dessus :</p>
      <div className="flex gap-3 flex-wrap mb-8">
        {allFeatures.map((f) => (
          <button
            key={f.key}
            onClick={() => toggleStep(f.key)}
            className={`p-2 rounded-xl border transition-colors ${
              steps.includes(f.key) ? "border-[#8B47FF] bg-purple-50" : "border-purple-100 hover:bg-purple-50"
            }`}
          >
            <div className="relative w-10 h-10 pointer-events-none">
              <Image src={f.src} alt={f.alt} fill sizes="40px" className="object-contain" draggable={false} />
            </div>
          </button>
        ))}
      </div>

      {steps.length > 0 && (
        <div className="mb-6">
          <p className="text-sm text-gray-400 italic mb-4 font-medium text-center">
            Maintenez et glissez les icônes ci-dessous ou utilisez les flèches pour changer leur ordre.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            {steps.map((key, index) => {
              const feature = getFeature(key);
              return (
                <div
                  key={key}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragEnter={() => handleDragEnter(index)}
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => e.preventDefault()}
                  className="cursor-grab active:cursor-grabbing flex flex-col items-center gap-1 hover:scale-105 transition-transform"
                  title="Glisser pour réorganiser"
                >
                  <div className="relative w-10 h-10 pointer-events-none">
                    <Image src={feature.src} alt={feature.alt} fill sizes="40px" className="object-contain" draggable={false} />
                  </div>
                  <div className="flex gap-2 mt-1">
                    <button 
                      type="button"
                      onClick={(e) => { e.stopPropagation(); moveStep(index, -1); }} 
                      className="text-xs text-[#8B47FF] hover:text-purple-700 font-bold px-1"
                    >
                      ◀
                    </button>
                    <button 
                      type="button"
                      onClick={(e) => { e.stopPropagation(); moveStep(index, 1); }} 
                      className="text-xs text-[#8B47FF] hover:text-purple-700 font-bold px-1"
                    >
                      ▶
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex justify-end gap-3 mt-4">
        <button onClick={onCancel} className="px-5 py-2 rounded-full text-gray-500 hover:bg-gray-50 transition-colors">
          Annuler
        </button>
        <button
          onClick={() => onSave({ ...initial, title, objectif, steps })}
          disabled={!title || steps.length === 0}
          className="bg-[#8B47FF] text-white font-bold px-6 py-2 rounded-full disabled:opacity-40 hover:shadow-md transition-all"
        >
          Enregistrer
        </button>
      </div>
    </div>
  );
}