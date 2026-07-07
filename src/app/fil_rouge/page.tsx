"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Sparkles, Plus, X } from "lucide-react";
import {
  getAllFilRouges,
  toggleFavori,
  deleteFilRouge,
  upsertFilRouge,
  allFeatures,
  getFeature,
  FilRougeItem,
} from "../../lib/fil-rouge-store";
import FilRougeCard from "../../components/FilRougeCard";

type View = "choice" | "existing";

export default function FilRougeDiscoverPage() {
  const router = useRouter();
  const [view, setView] = useState<View>("choice");
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
        onClick={() => {
          if (view === "choice") router.push("/challenge");
          else setView("choice");
        }}
        className="mb-8 flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600"
      >
        ← Retour
      </button>

      {view === "choice" && (
        <div className="grid md:grid-cols-2 gap-6">
          <button
            onClick={() => setView("existing")}
            className="bg-white rounded-[28px] border border-purple-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-10 flex flex-col items-center gap-4 hover:shadow-lg hover:-translate-y-1 transition-all"
          >
            <div className="w-16 h-16 rounded-full bg-purple-50 flex items-center justify-center">
              <Sparkles size={28} className="text-[#8B47FF]" />
            </div>
            <span className="font-bold text-lg text-[#592592]">Choisir un Fil Rouge existant</span>
            <span className="text-sm text-gray-500 text-center">
              Le Fil Rouge conseillé ou une routine spéciale déjà prête
            </span>
          </button>

          <button
            onClick={() => {
              setView("existing");
              setShowCreate(true);
            }}
            className="bg-white rounded-[28px] border border-purple-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-10 flex flex-col items-center gap-4 hover:shadow-lg hover:-translate-y-1 transition-all"
          >
            <div className="w-16 h-16 rounded-full bg-purple-50 flex items-center justify-center">
              <Plus size={28} className="text-[#8B47FF]" />
            </div>
            <span className="font-bold text-lg text-[#592592]">Créer mon propre Fil Rouge</span>
            <span className="text-sm text-gray-500 text-center">Choisis tes étapes, ton titre et ton objectif</span>
          </button>
        </div>
      )}

      {view === "existing" && (
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
      )}
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

  return (
    <div className="bg-white rounded-[28px] border-2 border-[#8B47FF]/30 shadow-lg p-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-[#592592]">{initial.title ? "Modifier le Fil Rouge" : "Nouveau Fil Rouge"}</h3>
        <button onClick={onCancel} className="p-1 rounded-full hover:bg-purple-50 text-gray-400">
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

      <p className="text-sm font-semibold text-[#592592] mb-2">Choisis tes étapes (dans l'ordre voulu) :</p>
      <div className="flex gap-3 flex-wrap mb-6">
        {allFeatures.map((f) => (
          <button
            key={f.key}
            onClick={() => toggleStep(f.key)}
            className={`p-2 rounded-xl border transition-colors ${
              steps.includes(f.key) ? "border-[#8B47FF] bg-purple-50" : "border-purple-100 hover:bg-purple-50"
            }`}
          >
            <div className="relative w-10 h-10">
              <Image src={f.src} alt={f.alt} fill sizes="40px" className="object-contain" draggable={false} />
            </div>
          </button>
        ))}
      </div>

      {steps.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap mb-6">
          {steps.map((key, index) => {
            const feature = getFeature(key);
            return (
              <div key={key} className="flex flex-col items-center gap-1">
                <div className="relative w-10 h-10">
                  <Image src={feature.src} alt={feature.alt} fill sizes="40px" className="object-contain" draggable={false} />
                </div>
                <div className="flex gap-1">
                  <button onClick={() => moveStep(index, -1)} className="text-xs text-purple-400 hover:text-purple-600">
                    ◀
                  </button>
                  <button onClick={() => moveStep(index, 1)} className="text-xs text-purple-400 hover:text-purple-600">
                    ▶
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex justify-end gap-3">
        <button onClick={onCancel} className="px-5 py-2 rounded-full text-gray-500 hover:bg-gray-50">
          Annuler
        </button>
        <button
          onClick={() => onSave({ ...initial, title, objectif, steps })}
          disabled={!title || steps.length === 0}
          className="bg-[#8B47FF] text-white font-bold px-6 py-2 rounded-full disabled:opacity-40"
        >
          Enregistrer
        </button>
      </div>
    </div>
  );
}