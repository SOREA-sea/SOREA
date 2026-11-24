"use client";

import { SONS, useAmbiance } from "@/components/AmbianceProvider";

export default function AmbiancePage() {
  const { sonsActifs, erreur, basculer, arreter, changerVolume } = useAmbiance();
  const nombreActifs = Object.keys(sonsActifs).length;

  return (
    <div className="space-y-6 pt-20 px-4 max-w-2xl mx-auto pb-12">
      <header>
        <h1 className="text-3xl font-black section-title">Ambiance</h1>
        <p className="text-foreground/60 mt-2">
          Choisissez un son pour vous accompagner pendant votre moment de détente.
        </p>
      </header>

      {/* Sons en cours + arrêt général */}
      <div className="glass-panel rounded-3xl p-5 flex items-center justify-between gap-4">
        <span className="text-sm font-semibold text-foreground/70">
          {nombreActifs === 0
            ? "Aucun son en cours"
            : nombreActifs === 1
              ? "1 son en cours"
              : `${nombreActifs} sons en cours`}
        </span>
        <button
          type="button"
          onClick={arreter}
          disabled={nombreActifs === 0}
          className="px-4 py-2 rounded-full text-sm font-semibold border border-[#8B47FF] text-[#8B47FF] hover:bg-[#F4EBFF] transition-all cursor-pointer disabled:opacity-40 disabled:cursor-default shrink-0"
        >
          Tout arrêter
        </button>
      </div>

      {erreur && (
        <p className="text-sm text-red-600 bg-red-50 rounded-2xl px-4 py-3">{erreur}</p>
      )}

      {/* Liste des sons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {SONS.map((son) => {
          const volumeSon = sonsActifs[son.id];
          const actif = volumeSon !== undefined;
          return (
            <div
              key={son.id}
              className={`rounded-2xl border-2 transition-all ${
                actif
                  ? "bg-[#E3D5FF] border-[#8B47FF] shadow-sm"
                  : "bg-white border-transparent hover:border-[#8B47FF]/40 hover:shadow-sm"
              }`}
            >
              <button
                type="button"
                onClick={() => basculer(son.id)}
                className="flex items-center gap-4 text-left p-4 w-full cursor-pointer"
                aria-pressed={actif}
              >
                <span
                  className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${
                    actif ? "bg-[#8B47FF] text-white" : "bg-purple-100 text-purple-600"
                  }`}
                >
                  {actif ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </span>
                <span className="flex-1 font-semibold text-foreground">{son.titre}</span>
              </button>

              {/* Volume propre à ce son (visible seulement quand il est en cours) */}
              {actif && (
                <div className="flex items-center gap-3 px-4 pb-4">
                  <span className="text-xs font-semibold text-foreground/60 shrink-0">Volume</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={volumeSon}
                    onChange={(e) => changerVolume(son.id, parseFloat(e.target.value))}
                    className="flex-1 accent-[#8B47FF] cursor-pointer"
                    aria-label={`Volume : ${son.titre}`}
                  />
                  <span className="text-xs font-bold text-[#7F4DC5] w-9 text-right">
                    {Math.round(volumeSon * 100)}%
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}