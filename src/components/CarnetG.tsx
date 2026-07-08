"use client";
import { useState, useEffect, useInsertionEffect } from "react";
import { useRouter } from "next/navigation";
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

type Section = "gratitude" | "journaling" | "libre" | null;

const SECTION_LABELS: Record<string, string> = {
  gratitude: "Gratitude",
  journaling: "Journaling",
  libre: "Libre",
};

const STYLE_ID = "carnet-g-styles";
const styles = `
  .sorea-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Lora', Georgia, serif;
    position: relative;
    width: 100%;
  }

  /* En mode normal (widget embarqué) : dimensions compactes */
  .sorea-wrap:not(.sorea-dedicated) {
    min-height: 520px;
    padding: 32px 40px;
  }

  /* En mode dédié (page /carnet/2) : le livre prend toute la largeur du conteneur blanc */
  .sorea-wrap.sorea-dedicated {
    padding: 0;
  }

  .sorea-sidebar {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-right: 20px;
    align-items: flex-start;
    flex-shrink: 0;
  }

  /* Sidebar cachée en mode dédié : la page a déjà son propre bouton retour */
  .sorea-dedicated .sorea-sidebar {
    display: none;
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
  }
  .sorea-btn-retour:hover { text-decoration: underline; }

  /*.sorea-btn-commander {

pointer-vents: non;
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
  }
  .sorea-btn-commander:hover { background: #F3EEFF; }*/

  /* ── BOOK – mode normal ── */
  .sorea-book {
    position: relative;
    flex-shrink: 0;
  }

  .sorea-wrap:not(.sorea-dedicated) .sorea-book {
    width: 640px;
    height: 420px;
  }

  /* ── BOOK – mode dédié : grand, occupe toute la largeur disponible ── */
  .sorea-wrap.sorea-dedicated .sorea-book {
    width: 100%;
    height: 620px;
  }

  .sorea-book-bg {
    position: absolute;
    inset: 0;
    background: #B49DD4;
    border-radius: 16px;
  }

  .sorea-book-curl {
    position: absolute;
    top: 0; left: 50%; transform: translateX(-50%);
    width: 68px; height: 14px;
    background: #C4B0E0;
    border-radius: 0 0 34px 34px;
    z-index: 5;
  }

  .sorea-book-spine {
    position: absolute;
    left: 50%; top: 8px;
    width: 3px;
    background: #A890CC;
    z-index: 4;
    transform: translateX(-50%);
  }

  .sorea-wrap:not(.sorea-dedicated) .sorea-book-spine { height: 412px; }
  .sorea-wrap.sorea-dedicated        .sorea-book-spine { height: 612px; }

  .sorea-book-bump {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    width: 52px; height: 13px;
    background: #B49DD4;
    border-radius: 0 0 9px 9px;
    z-index: 4;
  }

  .sorea-wrap:not(.sorea-dedicated) .sorea-book-bump { top: 413px; }
  .sorea-wrap.sorea-dedicated        .sorea-book-bump { top: 613px; }

  .sorea-book-inner {
    position: absolute;
    top: 8px; left: 8px; right: 8px; bottom: 6px;
    background: white;
    border-radius: 10px;
    display: flex;
    overflow: hidden;
    z-index: 2;
  }

  /* ── PAGE GAUCHE ── */
  .sorea-page-left {
    width: 50%;
    flex-shrink: 0;
    padding: 24px 20px 20px 24px;
    border-right: 1.5px solid #E0D8F0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .sorea-page-title {
    font-weight: 800;
    color: #1A1A2E;
    margin-bottom: 14px;
    flex-shrink: 0;
  }

  .sorea-wrap:not(.sorea-dedicated) .sorea-page-title { font-size: 17px; }
  .sorea-wrap.sorea-dedicated        .sorea-page-title { font-size: 22px; }

  .sorea-savez-box {
    flex: 1;
    background: #FDF3E3;
    border-radius: 10px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    user-select: none;
    display: flex;
    flex-direction: column;
    padding: 14px;
  }

  .sorea-blur-bg {
    position: absolute;
    inset: 0;
    background: rgba(210, 195, 235, 0.30);
    backdrop-filter: blur(4px);
    border-radius: 10px;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 4px;
  }

  .sorea-savez-collapsed-text {
    font-weight: 700;
    font-size: 15px;
    color: #1A1A2E;
    font-family: 'Lora', Georgia, serif;
    text-align: center;
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
    flex-shrink: 0;
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
    width: 6px; height: 6px;
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

  /* ── PAGE DROITE ── */
  .sorea-page-right {
    width: 50%;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;
  }

  .sorea-tabs-row {
    flex-shrink: 0;
    display: flex;
    flex-direction: row;
    align-items: stretch;
    gap: 3px;
    padding: 6px 10px 0;
    background: white;
    border-bottom: 1.5px solid #E0D8F0;
    max-height: 0;
    overflow: hidden;
    opacity: 0;
    transition: max-height 0.2s ease, opacity 0.2s ease;
  }

  .sorea-tabs-row.sorea-tabs-visible {
    max-height: 40px;
    opacity: 1;
  }

  .sorea-tab {
    font-size: 11px;
    font-weight: 700;
    font-family: 'Lora', Georgia, serif;
    padding: 5px 14px;
    border-radius: 7px 7px 0 0;
    border: none;
    cursor: pointer;
    transition: all 0.15s;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.55;
  }

  .sorea-tab-gratitude  { background: #C4B5E8; color: #3A1A7A; }
  .sorea-tab-journaling { background: #F5DEC8; color: #7A4010; }
  .sorea-tab-libre      { background: #C8E8C4; color: #1A5A1A; }

  .sorea-tab-active { opacity: 1; box-shadow: inset 0 -2px 0 rgba(0,0,0,0.15); }
  .sorea-tab:hover:not(.sorea-tab-active) { opacity: 0.8; }

  /* ── CONTENU PAGE DROITE ── */
  .sorea-right-content {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .sorea-cards-view {
    flex: 1;
    padding: 20px 20px 20px 16px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 12px;
  }

  .sorea-cat-card {
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-family: 'Lora', Georgia, serif;
    border: none;
    transition: opacity 0.2s, transform 0.2s;
    flex-shrink: 0;
  }

  .sorea-wrap:not(.sorea-dedicated) .sorea-cat-card { height: 72px;  font-size: 14px; }
  .sorea-wrap.sorea-dedicated        .sorea-cat-card { height: 110px; font-size: 18px; }

  .sorea-cat-card:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
  .sorea-cat-card:not(:disabled) { cursor: pointer; }
  .sorea-cat-card:not(:disabled):hover { transform: scale(1.02); }

  .sorea-gratitude  { background: #C4B5E8; color: #3A1A7A; }
  .sorea-journaling { background: #F5DEC8; color: #7A4010; }
  .sorea-libre      { background: #C8E8C4; color: #1A5A1A; }

  .sorea-section-view {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .sorea-section-header {
    padding: 10px 16px 8px;
    border-bottom: 1px solid #E0D8F0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
  }

  .sorea-section-title {
    font-weight: 700;
    font-size: 14px;
    color: #1A1A2E;
    font-family: 'Lora', Georgia, serif;
  }

  .sorea-section-back {
    background: none;
    border: none;
    cursor: pointer;
    color: #7B4FC8;
    font-size: 11px;
    font-weight: 700;
    font-family: 'Lora', Georgia, serif;
  }
  .sorea-section-back:hover { text-decoration: underline; }

  .sorea-child-wrapper {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .sorea-child-wrapper > * {
    min-height: 0 !important;
    max-width: 100% !important;
    width: 100% !important;
    background: transparent !important;
    padding: 8px !important;
    margin: 0 !important;
  }
`;

export default function CarnetG({

  onClose,
  isDedicated = false,
  initialSection = null,
}: {
  onClose?: () => void;
  isDedicated?: boolean;
  initialSection?: Section;
}) {
  const [isMounted, setIsMounted] = useState(false);

  const router = useRouter();
  //  En mode dédié, le "Saviez-vous" est ouvert par défaut (pas besoin de cliquer pour débloquer)
  const [isOpen, setIsOpen] = useState(isDedicated);
  //  initialSection pré-sélectionne la bonne section dès le montage
  const [activeSection, setActiveSection] = useState<Section>(initialSection);
  const [currentText, setCurrentText] = useState<SavezVousText>(FALLBACK);
  const [loading, setLoading] = useState(true);
  const [secondsLeft, setSecondsLeft] = useState(getSecondsUntilMidnight());

  useInsertionEffect(() => {
    if (document.getElementById(STYLE_ID)) return;
    const tag = document.createElement("style");
    tag.id = STYLE_ID;
    tag.textContent = styles;
    document.head.appendChild(tag);
  }, []);

  useEffect(() => {
    fetch("/api/savez-vous")
      .then((r) => r.json())
      .then((data) => setCurrentText(data))
      .catch(() => setCurrentText(FALLBACK))
      .finally(() => setLoading(false));
  }, []);

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

  const toggleSavez = () => {
    if (!loading) setIsOpen((prev) => !prev);
  };

  const openSection = (section: Section) => {
    if (isDedicated) {
      setActiveSection(section);
    } else {
      //  On passe la section dans l'URL pour que la page dédiée l'ouvre directement
      router.push(`/carnet/2?section=${section}`);
    }
  };

  const closeSection = () => setActiveSection(null);

  const renderSectionContent = () => {
    if (activeSection === "gratitude") return <Carnet_planning />;
    if (activeSection === "journaling")
      return (
        <Carnet_journal
          recherche=""
          setRecherche={() => {}}
          notesFiltrees={[]}
          onSupprimerNote={() => {}}
        />
      );
    if (activeSection === "libre") return <Carnet_bn />;
    return null;
  };

  return (
    <div className={`sorea-wrap${isDedicated ? " sorea-dedicated" : ""}`}>
      {/* Sidebar visible uniquement en mode widget */}
      <div className="sorea-sidebar">
        <button className="sorea-btn-retour" onClick={onClose}>
          ← Retour
        </button>
        {/*<button className="sorea-btn-commander">
          Commander mon
          <br />
          Carnet Gratitude
        </button>*/}
      </div>

      <div className="sorea-book">
        <div className="sorea-book-bg" />
        <div className="sorea-book-curl" />
        <div className="sorea-book-spine" />
        <div className="sorea-book-bump" />

        <div className="sorea-book-inner">

          {/* ── PAGE GAUCHE ── */}
          <div className="sorea-page-left">
            <div className="sorea-page-title">Bonjour Prénom :-)</div>

            <div className="sorea-savez-box" onClick={toggleSavez}>
              {!isOpen && (
                <div className="sorea-blur-bg">
                  {loading ? (
                    <div className="sorea-loading">
                      <div className="sorea-loading-dot" />
                      <div className="sorea-loading-dot" />
                      <div className="sorea-loading-dot" />
                    </div>
                  ) : (
                    <>
                      <span className="sorea-savez-collapsed-text">
                        <u>{currentText.title}</u>
                      </span>
                      <span style={{ fontSize: "10px", color: "#9B7DD4", fontFamily: "'Lora', Georgia, serif" }}>
                        Prochain dans {formatCountdown(secondsLeft)}
                      </span>
                    </>
                  )}
                </div>
              )}

              {isOpen && (
                <div className="sorea-savez-expanded">
                  <div className="sorea-savez-expanded-title">
                    <u>{currentText.title}</u>
                    {isMounted && (                    <span className="sorea-countdown-label">
                      Prochain dans {formatCountdown(secondsLeft)}
                    </span> )}
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

          {/* ── PAGE DROITE ── */}
          <div className="sorea-page-right">

            {/* Onglets */}
            <div className={`sorea-tabs-row ${activeSection ? "sorea-tabs-visible" : ""}`}>
              {(["gratitude", "journaling", "libre"] as const).map((key) => (
                <button
                  key={key}
                  onClick={() => setActiveSection(key)}
                  className={[
                    "sorea-tab",
                    `sorea-tab-${key}`,
                    activeSection === key ? "sorea-tab-active" : "",
                  ].join(" ")}
                >
                  {SECTION_LABELS[key]}
                </button>
              ))}
            </div>

            <div className="sorea-right-content">

              {!activeSection && (
                <div className="sorea-cards-view">
                  <button
                    onClick={() => openSection("gratitude")}
                    className="sorea-cat-card sorea-gratitude"
                    disabled={!isDedicated && !isOpen}
                  >
                    Gratitude
                  </button>
                  <button
                    onClick={() => openSection("journaling")}
                    className="sorea-cat-card sorea-journaling"
                    disabled={!isDedicated && !isOpen}
                  >
                    Journaling
                  </button>
                  <button
                    onClick={() => openSection("libre")}
                    className="sorea-cat-card sorea-libre"
                    disabled={!isDedicated && !isOpen}
                  >
                    Libre
                  </button>
                </div>
              )}

              {activeSection && (
                <div className="sorea-section-view">
                  <div className="sorea-section-header">
                    <span className="sorea-section-title">
                      {SECTION_LABELS[activeSection]}
                    </span>
                    <button className="sorea-section-back" onClick={closeSection}>
                      Accueil ↩
                    </button>
                  </div>
                  <div className="sorea-child-wrapper">
                    {renderSectionContent()}
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}