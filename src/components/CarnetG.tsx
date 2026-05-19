"use client"
import { useState } from "react";

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

  /* BOOK */
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
    margin-bottom: 10px;
    font-family: 'Lora', Georgia, serif;
  }

  .sorea-savez-expanded p {
    font-size: 12.5px;
    line-height: 1.65;
    color: #2D2D2D;
    margin-bottom: 9px;
    font-family: 'Lora', Georgia, serif;
  }
  .sorea-savez-expanded p:last-child { margin-bottom: 0; }

  /* RIGHT PAGE */
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

  .sorea-gratitude.active  { background: #C4B5E8; color: #3A1A7A; }
  .sorea-journaling.active { background: #F5DEC8; color: #7A4010; }
  .sorea-libre.active      { background: #7DE8E8; color: #0A5050; }
`;

export default function CarnetG({ onClose }: { onClose?: () => void }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSavez = () => setIsOpen((prev) => !prev);

  return (
    <>
      <style>{styles}</style>

      <div className="sorea-wrap">
        {/* Sidebar */}
        <div className="sorea-sidebar">
          <button className="sorea-btn-retour btn-retour" onClick={onClose}>
            ← Retour
          </button>
          <button className="sorea-btn-commander btn-commander">
            Commander mon<br />Carnet Gratitude
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
              <div className="sorea-page-title">Bonjour Prénom :-)</div>

              <div className="sorea-savez-box" onClick={toggleSavez}>
                {/* Blur background (collapsed only) */}
                {!isOpen && <div className="sorea-blur-bg" />}

                {/* Collapsed view */}
                {!isOpen && (
                  <div className="sorea-savez-collapsed">
                    <span className="sorea-savez-collapsed-text">
                      <u>Le saviez-vous</u> ?
                    </span>
                  </div>
                )}

                {/* Expanded view */}
                {isOpen && (
                  <div className="sorea-savez-expanded">
                    <div className="sorea-savez-expanded-title">
                      <u>Le saviez-vous</u> ?
                    </div>
                    <p>
                      Pratiquer la gratitude chaque jour réduit le stress,
                      améliore la qualité du sommeil et augmente le sentiment
                      de bonheur.
                    </p>
                    <p>
                      En cultivant cette attitude du bien-être, vous stimulez
                      naturellement votre sérotonine, cette précieuse molécule
                      du bonheur qui éclaire l&apos;esprit et apaise le coeur.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Page */}
            <div className="sorea-page-right">
              <div
                className={`sorea-cat-card sorea-gratitude ${isOpen ? "active" : "inactive"}`}
              >
                Gratitude
              </div>
              <div
                className={`sorea-cat-card sorea-journaling ${isOpen ? "active" : "inactive"}`}
              >
                Journaling
              </div>
              <div
                className={`sorea-cat-card sorea-libre ${isOpen ? "active" : "inactive"}`}
              >
                Libre
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
