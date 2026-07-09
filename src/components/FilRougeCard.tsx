"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Trash2, Pencil, Star, Play } from "lucide-react";
import { FilRougeItem, getFeature } from "../lib/favorites-store";

interface Props {
  item: FilRougeItem;
  readOnly?: boolean;
  onDelete?: () => void;
  onEdit?: () => void;
  onToggleFavori?: () => void;
}

export default function FilRougeCard({ item, readOnly = false, onDelete, onEdit, onToggleFavori }: Props) {
  const router = useRouter();

  const handlePlayDirect = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.steps.length > 0) {
      router.push(getFeature(item.steps[0]).href);
    }
  };

  return (
    <div className="group relative bg-white rounded-[28px] border border-purple-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 hover:shadow-lg transition-shadow">
      {!readOnly && (
        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.();
            }}
            className="p-2 rounded-full bg-purple-50 hover:bg-purple-100 text-[#592592]"
            title="Modifier"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.();
            }}
            className="p-2 rounded-full bg-red-50 hover:bg-red-100 text-red-500"
            title="Supprimer"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )}

      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavori?.();
        }}
        disabled={readOnly}
        className="absolute top-4 left-4 p-2 rounded-full hover:bg-purple-50 z-20 disabled:cursor-default"
        title={item.favori ? "Retirer des favoris" : "Ajouter aux favoris"}
      >
        <Star size={20} className={item.favori ? "fill-[#8B47FF] text-[#8B47FF]" : "text-purple-200"} />
      </button>

      <h2 className="text-xl font-bold text-[#592592] text-center mb-8">{item.title || "Sans titre"}</h2>

      <div className="flex items-center justify-center gap-2 flex-wrap">
        {item.steps.map((key, index) => {
          const feature = getFeature(key);
          return (
            <React.Fragment key={key}>
              {index > 0 && (
                <div
                  className="w-10 h-4 bg-contain bg-center bg-no-repeat opacity-60 shrink-0"
                  style={{ backgroundImage: "url('/image_icone/Fil-rouge.svg')" }}
                />
              )}
              <div className="relative shrink-0" style={{ width: feature.width, height: feature.height }}>
                <Image
                  src={feature.src}
                  alt={feature.alt}
                  fill
                  sizes={`${feature.width}px`}
                  className="object-contain drop-shadow-md"
                  draggable={false}
                />
              </div>
            </React.Fragment>
          );
        })}
        {item.steps.length === 0 && <span className="text-purple-300 italic text-sm">Aucune étape définie</span>}
      </div>

      <div className="flex items-center justify-between mt-8 min-h-[40px]">
        <div className="text-sm text-gray-500 italic">{item.objectif ? `Objectif : ${item.objectif}` : ""}</div>
        {(item.favori || readOnly) && item.steps.length > 0 && (
          <button
            onClick={handlePlayDirect}
            className="flex items-center gap-2 bg-[#8B47FF] text-white font-bold text-sm px-5 py-2 rounded-full shadow hover:-translate-y-0.5 transition-transform z-20 ml-auto"
          >
            <Play size={14} /> Jouer directement
          </button>
        )}
      </div>
    </div>
  );
}