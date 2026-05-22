"use client"
import { useState, memo } from "react";

const styles = `
  .sorea-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Lora', Georgia, serif;
    position: relative;
    min-height: 520px;
    padding: 32px 40px;
  }

  .sorea-sidebar {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-right: 20px;
    align-items: flex-start;
  }

  .sorea-btn-retour {
    background: none;
    border: none;
    cursor: pointer;
    color: #7B4FC8;
    font-weight: 700;
    font-size: 14px;
    font-family: 'Lora', Georgia, serif;
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 0;
    transition: text-decoration 0.15s;
  }
  .sorea-btn-retour:hover { text-decoration: underline; }

  .sorea-btn-commander {
    background: white;
    border: 2.5px solid #7B4FC8;
    border-radius: 12px;
    color: #4A1A8C;
    font-weight: 700;
    font-size: 11.5px;
    font-family: 'Lora', Georgia, serif;
    padding: 9px 12px;
    cursor: pointer;
    line-height: 1.5;
    text-align: center;
    width: 130px;
    transition: background 0.2s;
  }
  .sorea-btn-commander:hover { background: #F3EEFF; }

  .sorea-book {
    width: 640px;
    height: 420px;
    position: relative;
    flex-shrink: 0;
  }

  .sorea-book-bg {
    position: absolute;
    inset: 0;
    background: #B49DD4;
    border-radius: 16px;
  }

  .sorea-book-curl {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 68px;
    height: 14px;
    background: #C4B0E0;
    border-radius: 0 0 34px 34px;
    z-index: 5;
  }

  .sorea-book-spine {
    position: absolute;
    left: 50%;
    top: 8px;
    bottom: 0;
    width: 3px;
    background: #A890CC;
    z-index: 4;
    transform: translateX(-50%);
  }

  .sorea-book-bump {
    position: absolute;
    bottom: -7px;
    left: 50%;
    transform: translateX(-50%);
    width: 52px;
    height: 13px;
    background: #B49DD4;
    border-radius: 0 0 9px 9px;
    z-index: 4;
  }

  .sorea-book-inner {
    position: absolute;
    top: 8px;
    left: 8px;
    right: 8px;
    bottom: 6px;
    background: white;
    border-radius: 10px;
    display: flex;
    overflow: hidden;
    z-index: 2;
  }

  /* LEFT PAGE */
  .sorea-page-left {
    flex: 1;
    padding: 24px 20px 20px 24px;
    border-right: 1.5px solid #E0D8F0;
    display: flex;
    flex-direction: column;
  }

  .sorea-page-title {
    font-weight: 800;
    font-size: 17px;
    color: #1A1A2E;
    margin-bottom: 14px;
    flex-shrink: 0;
  }

  /* MOOD BUBBLES */
  .sorea-moods-area {
    flex: 1;
    position: relative;
  }

  .sorea-mood-btn {
    position: absolute;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    font-size: 13px;
    font-weight: 700;
    font-family: 'Lora', Georgia, serif;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px;
    line-height: 1.3;
    width: 84px;
    height: 84px;
    transition: transform 0.15s ease;
  }
  .sorea-mood-btn:hover { transform: translate(-50%, -50%) scale(1.08); }

  .sorea-heart-area {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    cursor: pointer;
  }

  .sorea-heart-label {
    font-size: 14px;
    font-weight: 700;
    font-family: 'Lora', Georgia, serif;
    margin-top: -8px;
  }

  /* RIGHT PAGE */
  .sorea-page-right {
    flex: 1;
    padding: 24px 24px 20px 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 24px;
  }

  .sorea-cat-card {
    border-radius: 10px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 60px;
    font-size: 13px;
    font-weight: 700;
    font-family: 'Lora', Georgia, serif;
    border: none;
    cursor: default;
    transition: background 0.35s, color 0.35s, filter 0.35s, transform 0.15s;
    flex-shrink: 0;
  }

  .sorea-cat-card.inactive {
    background: #D8D8D8;
    color: #aaa;
    filter: blur(1.5px);
  }

  .sorea-cat-card.active {
    cursor: pointer;
    filter: none;
  }
  .sorea-cat-card.active:hover { transform: scale(1.02); }

  .sorea-challenge.active   { background: #C4B5E8; color: #3A1A7A; }
  .sorea-blocnote.active    { background: #7DE8E8; color: #0A5050; }
  .sorea-divertissement.active { background: #F5DEC8; color: #7A4010; }
`;

const moods = [
  { label: "Très bien",    color: "#F5E18A", textColor: "#7A6010", top: "12%",  left: "52%" },
  { label: "Bien",         color: "#A8D9B8", textColor: "#2E6B47", top: "38%",  left: "22%" },
  { label: "Pas mal…",     color: "#C8B8E8", textColor: "#5A3D8A", top: "38%",  left: "72%" },
  { label: "Mal",          color: "#F4A09A", textColor: "#8B2E2A", top: "72%",  left: "32%" },
  { label: "Pas terrible", color: "#A8D0F0", textColor: "#1A5A8B", top: "72%",  left: "70%" },
];

const Heart = memo(({ color, text, textColor }: { color: string; text?: string; textColor?: string }) => (
  <svg viewBox="0 0 100 90" width="150" height="150" xmlns="http://www.w3.org/2000/svg" role="img" aria-label={text ?? 'coeur'}>
    <path
      d="M50 85 C50 85 5 55 5 28 C5 13 17 3 30 3 C39 3 47 8 50 15 C53 8 61 3 70 3 C83 3 95 13 95 28 C95 55 50 85 50 85Z"
      fill={color}
    />
    {text && (
      <text
        x="50%"
        y="53%"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="'Lora', Georgia, serif"
        fontWeight={700}
        fontSize={10}
        fill={textColor || '#000'}
        style={{ pointerEvents: 'none' }}
      >
        {text}
      </text>
    )}
  </svg>
));
Heart.displayName = 'Heart';

export default function CarnetC({ onClose }: { onClose?: () => void }) {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const mood = moods.find((m) => m.label === selectedMood) ?? null;
  const moodSelected = selectedMood !== null;

  return (
    <>
      <style>{styles}</style>
      <div className="sorea-wrap">
        {/* Sidebar */}
        <div className="sorea-sidebar">
          <button className="sorea-btn-retour" onClick={onClose}>
            ← Retour
          </button>
          <button className="sorea-btn-commander">
            Commander mon<br />Carnet Challenge
          </button>
        </div>

        {/* Book */}
        <div className="sorea-book">
          <div className="sorea-book-bg" />
          <div className="sorea-book-curl" />
          <div className="sorea-book-spine" />
          <div className="sorea-book-bump" />

          <div className="sorea-book-inner">
            {/* Left Page */}
            <div className="sorea-page-left">
              <div className="sorea-page-title">
                Bonjour Prénom :-)<br />Comment te sens-tu ?
              </div>

              <div className="sorea-moods-area">
                {!moodSelected && moods.map((m) => (
                  <button
                    key={m.label}
                    className="sorea-mood-btn"
                    style={{
                      top: m.top,
                      left: m.left,
                      transform: "translate(-50%, -50%)",
                      backgroundColor: m.color,
                      color: m.textColor,
                    }}
                    onClick={() => setSelectedMood(m.label)}
                  >
                    {m.label}
                  </button>
                ))}

                {moodSelected && mood && (
                  <div
                    className="sorea-heart-area"
                    onClick={() => setSelectedMood(null)}
                    title="Changer d'humeur"
                  >
                    <Heart
                      color={mood.color}
                      text={mood.label === 'Mal' ? undefined : mood.label}
                      textColor={'#000'}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Right Page */}
            <div className="sorea-page-right">
              <div className={`sorea-cat-card sorea-challenge ${moodSelected ? "active" : "inactive"}`}>
                Challenge-list
              </div>
              <div className={`sorea-cat-card sorea-blocnote ${moodSelected ? "active" : "inactive"}`}>
                Bloc-note libre
              </div>
              <div className={`sorea-cat-card sorea-divertissement ${moodSelected ? "active" : "inactive"}`}>
                Divertissement
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}