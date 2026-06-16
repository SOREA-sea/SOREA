"use client";
import { useState, useEffect } from "react";
import Carnet_bn from "./Carnet_bn";
import Carnet_planning from "./Carnet_planning";
import Carnet_journal from "./Carnet_journal";

interface SavezVousText {
  title: string;
  paragraphs: string[];
}

const FALLBACK: SavezVousText = {
  title: "Le saviez-vous ?",
  paragraphs: [
    "Pratiquer la gratitude chaque jour réduit le stress et améliore la qualité du sommeil.",
    "En cultivant cette attitude, vous stimulez naturellement votre sérotonine, la molécule du bonheur.",
  ],
};

function getSecondsUntilMidnight(): number {
  const now = new Date();
  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0);
  return Math.floor((midnight.getTime() - now.getTime()) / 1000);
}

function formatCountdown(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

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

  .sorea-savez-box {
    flex: 1;
    background: #FDF3E3;
    border-radius: 10px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    user-select: none;
  }

  .sorea-blur-bg {
    position: absolute;
    inset: 0;
    background: rgba(210, 195, 235, 0.30);
    backdrop-filter: blur(4px);
    border-radius: 10px;
    z-index: 1;
  }

  .sorea-savez-collapsed {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
  }

  .sorea-savez-collapsed-text {
    font-weight: 700;
    font-size: 15px;
    color: #1A1A2E;
    font-family: 'Lora', Georgia, serif;
    text-align: center;
  }

  .sorea-savez-expanded {
    position: absolute;
    inset: 0;
    padding: 16px;
    display: flex;
    flex-direction: column;
    z-index: 2;
  }

  .sorea-savez-expanded-title {
    font-weight: 700;
    font-size: 14px;
    color: #1A1A2E;
    margin-bottom: 6px;
    font-family: 'Lora', Georgia, serif;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .sorea-savez-expanded p {
    font-size: 12.5px;
    line-height: 1.65;
    color: #2D2D2D;
    margin-bottom: 9px;
    font-family: 'Lora', Georgia, serif;
  }
  .sorea-savez-expanded p:last-child { margin-bottom: 0; }

  .sorea-progress-bar-bg {
    height: 3px;
    background: #E0D8F0;
    border-radius: 4px;
    margin-bottom: 10px;
    flex-shrink: 0;
  }

  .sorea-countdown-label {
    font-size: 10px;
    color: #9B7DD4;
    font-family: 'Lora', Georgia, serif;
    font-weight: 600;
    letter-spacing: 0.3px;
  }

  .sorea-loading {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
  }

  .sorea-loading-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #9B7DD4;
    margin: 0 3px;
    animation: sorea-bounce 1.2s infinite ease-in-out;
  }
  .sorea-loading-dot:nth-child(2) { animation-delay: 0.2s; }
  .sorea-loading-dot:nth-child(3) { animation-delay: 0.4s; }

  @keyframes sorea-bounce {
    0%, 80%, 100% { transform: scale(0.7); opacity: 0.4; }
    40% { transform: scale(1); opacity: 1; }
  }

  .sorea-page-right {
    flex: 1;
    padding: 24px 24px 20px 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 14px;
  }

  .sorea-cat-card {
    border-radius: 10px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 72px;
    font-size: 14px;
    font-weight: 700;
    font-family: 'Lora', Georgia, serif;
    border: none;
    cursor: default;
    transition: background 0.35s, color 0.35s, filter 0.35s, transform 0.15s;
    flex-shrink: 0;
  }

  .sorea-cat-card:disabled {
    background: #D8D8D8;
    color: #aaa;
    filter: blur(1.5px);
    cursor: not-allowed;
  }

  .sorea-cat-card:not(:disabled) { cursor: pointer; filter: none; }
  .sorea-cat-card:not(:disabled):hover { transform: scale(1.02); }

  .sorea-gratitude:not(:disabled) { background: #C4B5E8; color: #3A1A7A; }
  .sorea-journaling:not(:disabled) { background: #F5DEC8; color: #7A4010; }
  .sorea-libre:not(:disabled) { background: #C8E8C4; color: #1A5A1A; }

  .sorea-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    z-index: 999;
  }

  .sorea-overlay-inner {
    position: relative;
    max-width: 760px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100px;
  }

  .sorea-overlay-close {
    position: absolute;
    top: -12px;
    right: -12px;
    width: 38px;
    height: 38px;
    border-radius: 999px;
    border: none;
    background: white;
    color: #7c3aed;
    font-size: 24px;
    line-height: 1;
    cursor: pointer;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.12);
  }
`;

export default function CarnetG({ onClose }: { onClose?: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [openedComponent, setOpenedComponent] = useState<string | null>(null);
  const [currentText, setCurrentText] = useState<SavezVousText>(FALLBACK);
  const [loading, setLoading] = useState(true);
  const [secondsLeft, setSecondsLeft] = useState(getSecondsUntilMidnight());

  // Fetch citation bien-être du jour
  useEffect(() => {
    fetch("/api/savez-vous")
      .then((r) => r.json())
      .then((data) => setCurrentText(data))
      .catch(() => setCurrentText(FALLBACK))
      .finally(() => setLoading(false));
  }, []);

  // Chronomètre jusqu'à minuit
  useEffect(() => {
    const timer = setInterval(() => {
      const secs = getSecondsUntilMidnight();
      setSecondsLeft(secs);
      if (secs === 0) {
        setLoading(true);
        fetch("/api/savez-vous")
          .then((r) => r.json())
          .then((data) => setCurrentText(data))
          .catch(() => setCurrentText(FALLBACK))
          .finally(() => setLoading(false));
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const totalSecondsInDay = 24 * 60 * 60;
  const progressPercent =
    ((totalSecondsInDay - secondsLeft) / totalSecondsInDay) * 100;
  const toggleSavez = () => setIsOpen((prev) => !prev);

  if (openedComponent) {
    return (
      <>
        <style>{styles}</style>
        <div className="sorea-overlay" onClick={() => setOpenedComponent(null)}>
          <div
            className="sorea-overlay-inner"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="sorea-overlay-close"
              onClick={() => setOpenedComponent(null)}
              aria-label="Fermer"
            >
              ×
            </button>

            {/* ── Gratitude ── */}
            {openedComponent === "gratitude" && <Carnet_planning />}

            {/* ── Journaling ── */}
            {openedComponent === "journaling" && (
              <Carnet_journal
                recherche=""
                setRecherche={() => {}}
                notesFiltrees={[]}
                onSupprimerNote={() => {}}
              />
            )}

            {/* ── Libre ── remplace Carnet_bn par le composant approprié dans ton projet */}
            {openedComponent === "libre" && <Carnet_bn />}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>

      <div className="sorea-wrap">
        <div className="sorea-sidebar">
          <button className="sorea-btn-retour" onClick={onClose}>
            ← Retour
          </button>
          <button className="sorea-btn-commander">
            Commander mon
            <br />
            Carnet Gratitude
          </button>
        </div>

        <div className="sorea-book">
          <div className="sorea-book-bg" />
          <div className="sorea-book-curl" />
          <div className="sorea-book-spine" />
          <div className="sorea-book-bump" />

          <div className="sorea-book-inner">
            {/* ── Page gauche ── */}
            <div className="sorea-page-left">
              <div className="sorea-page-title">Bonjour Prénom :-)</div>

              <div
                className="sorea-savez-box"
                onClick={!loading ? toggleSavez : undefined}
              >
                {!isOpen && <div className="sorea-blur-bg" />}

                {/* Loading */}
                {loading && (
                  <div className="sorea-loading">
                    <div className="sorea-loading-dot" />
                    <div className="sorea-loading-dot" />
                    <div className="sorea-loading-dot" />
                  </div>
                )}

                {/* Collapsed */}
                {!loading && !isOpen && (
                  <div className="sorea-savez-collapsed">
                    <span className="sorea-savez-collapsed-text">
                      <u>{currentText.title}</u>
                      <span
                        style={{
                          display: "block",
                          fontSize: "10px",
                          color: "#9B7DD4",
                          marginTop: 6,
                        }}
                      >
                        Prochain dans {formatCountdown(secondsLeft)}
                      </span>
                    </span>
                  </div>
                )}

                {/* Expanded */}
                {!loading && isOpen && (
                  <div className="sorea-savez-expanded">
                    <div className="sorea-savez-expanded-title">
                      <u>{currentText.title}</u>
                      <span className="sorea-countdown-label">
                        Prochain dans {formatCountdown(secondsLeft)}
                      </span>
                    </div>
                    <div className="sorea-progress-bar-bg">
                      <div
                        style={{
                          height: "100%",
                          background: "#7B4FC8",
                          borderRadius: 4,
                          width: `${progressPercent}%`,
                          transition: "width 1s linear",
                        }}
                      />
                    </div>
                    {currentText.paragraphs.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ── Page droite ── */}
            <div className="sorea-page-right">
              <button
                onClick={() => setOpenedComponent("gratitude")}
                className="sorea-cat-card sorea-gratitude"
                disabled={!isOpen}
              >
                Gratitude
              </button>
              <button
                onClick={() => setOpenedComponent("journaling")}
                className="sorea-cat-card sorea-journaling"
                disabled={!isOpen}
              >
                Journaling
              </button>
              <button
                onClick={() => setOpenedComponent("libre")}
                className="sorea-cat-card sorea-libre"
                disabled={!isOpen}
              >
                Libre
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}