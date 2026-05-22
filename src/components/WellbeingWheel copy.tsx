"use client";

import React, { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";

const tasks = [
    { text: "Écrire 3 phrases positives sur une feuille", icon: "edit" },
    { text: "Prendre 5 minutes pour méditer", icon: "self_improvement" },
    { text: "Boire un grand verre d'eau", icon: "water_drop" },
    { text: "Faire quelques étirements doux", icon: "accessibility_new" },
    { text: "Écouter ta musique préférée", icon: "headphones" },
    { text: "Faire un compliment à quelqu'un", icon: "favorite" },
    { text: "Prendre 10 grandes respirations", icon: "air" },
    { text: "Lire quelques pages d'un livre", icon: "menu_book" }
];

const colors = ["#b291db", "#ffffff"];
const numSlices = tasks.length;
const sliceAngle = (2 * Math.PI) / numSlices;

function easeOutQuart(x: number) {
    return 1 - Math.pow(1 - x, 4);
}

export default function WellbeingWheel() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerRef = useRef<HTMLDivElement>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [winner, setWinner] = useState<{text: string, icon: string} | null>(null);
  
  const currentAngleRef = useRef(0);
  const bumpTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    document.fonts.ready.then(() => {
      drawWheel();
    });
    drawWheel();
  }, []);

  function drawWheel() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = canvas.width / 2 - 30;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 22, 0, 2 * Math.PI);
    ctx.fillStyle = "#e0d5f0";
    ctx.fill();
    ctx.strokeStyle = "#cbb1e6";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 18, 0, 2 * Math.PI);
    ctx.strokeStyle = "rgba(255,255,255,0.6)";
    ctx.lineWidth = 4;
    ctx.stroke();

    for (let i = 0; i < numSlices; i++) {
        const startAngle = i * sliceAngle;
        const endAngle = startAngle + sliceAngle;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.closePath();

        ctx.fillStyle = colors[i % colors.length];
        ctx.fill();
        
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + sliceAngle / 2);
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.translate(radius - 55, 0);
        ctx.rotate(Math.PI / 2);
        
        ctx.fillStyle = "#8766b4"; 
        ctx.font = "34px 'Material Symbols Outlined'"; 
        ctx.fillText(tasks[i].icon, 0, 0);
        ctx.restore();
    }
    
    for (let i = 0; i < numSlices; i++) {
        const angle = i * sliceAngle;
        const rivetX = centerX + Math.cos(angle) * (radius + 10);
        const rivetY = centerY + Math.sin(angle) * (radius + 10);
        
        ctx.beginPath();
        ctx.arc(rivetX, rivetY, 6, 0, 2 * Math.PI);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
        ctx.strokeStyle = "#9777c2";
        ctx.lineWidth = 2;
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(rivetX, rivetY, 2.5, 0, 2 * Math.PI);
        ctx.fillStyle = "#b291db";
        ctx.fill();
    }
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, 18, 0, 2 * Math.PI);
    ctx.fillStyle = "#ab8dd4";
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setShowModal(false);

    const spinSpins = 5 + Math.random() * 5; 
    const randomDegree = Math.random() * 360;
    const totalDegree = spinSpins * 360 + randomDegree;
    
    const startAngle = currentAngleRef.current;
    const targetAngle = startAngle + totalDegree;
    const duration = 6000; 
    let startTime: number | null = null;
    
    const animate = (time: number) => {
        if (!startTime) startTime = time;
        const elapsed = time - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = easeOutQuart(progress);
        
        const previousAngle = currentAngleRef.current;
        currentAngleRef.current = startAngle + (targetAngle - startAngle) * ease;
        
        if (canvasRef.current) {
            canvasRef.current.style.transform = `rotate(${currentAngleRef.current}deg)`;
        }
        
        const prevRivet = Math.floor(previousAngle / 45);
        const currRivet = Math.floor(currentAngleRef.current / 45);
        
        if (currRivet > prevRivet) {
            const pointer = pointerRef.current;
            if (pointer) {
                pointer.classList.remove("bump");
                void pointer.offsetWidth;
                pointer.classList.add("bump");
                
                if(bumpTimeoutRef.current) clearTimeout(bumpTimeoutRef.current);
                bumpTimeoutRef.current = setTimeout(() => {
                    pointer.classList.remove("bump");
                }, 50);
            }
        }
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            setIsSpinning(false);
            
            const actualDeg = currentAngleRef.current % 360;
            let topAngle = (270 - actualDeg) % 360;
            if (topAngle < 0) topAngle += 360;
            
            const sliceIndex = Math.floor(topAngle / (360 / numSlices));
            const winnerData = tasks[sliceIndex];
            
            setTimeout(() => {
                setWinner(winnerData);
                setShowModal(true);
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: colors
                });
            }, 400);
        }
    };
    
    requestAnimationFrame(animate);
  };

  return (
    <div className="w-full flex flex-col justify-center items-center py-12 relative z-10" style={{ fontFamily: "'Poppins', sans-serif" }}>
        {/* Load Icons inside Next.js safely using normal link */}
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet" />
        
        <style>{`
          .wheel-container-custom {
              display: flex;
              flex-direction: column;
              align-items: center;
              position: relative;
              margin-top: 20px;
          }
          .wheel-wrapper-custom {
              position: relative;
              width: 500px;
              height: 500px;
              filter: drop-shadow(0px 15px 30px rgba(180, 160, 220, 0.4));
              z-index: 2;
          }
          .pointer-wrapper-custom {
              position: absolute;
              top: -15px;
              left: 50%;
              margin-left: -15px;
              width: 30px;
              height: 45px;
              z-index: 10;
              transform-origin: 15px 10px;
              transition: transform 0.05s ease-out;
          }
          .pointer-wrapper-custom.bump {
              transform: rotate(-25deg);
          }
          .pointer-circle-custom {
              width: 18px;
              height: 18px;
              background: linear-gradient(135deg, #d3c0ec, #a787d5);
              border-radius: 50%;
              margin: 0 auto;
              border: 3px solid #fdfcff;
              box-shadow: 0 2px 5px rgba(0,0,0,0.2);
              position: relative;
              z-index: 2;
          }
          .pointer-triangle-custom {
              width: 0;
              height: 0;
              border-left: 12px solid transparent;
              border-right: 12px solid transparent;
              border-top: 26px solid #b397db;
              margin: -6px auto 0;
              position: relative;
              z-index: 1;
              filter: drop-shadow(0 2px 3px rgba(0,0,0,0.15));
          }
          #wheel-canvas {
              width: 100%;
              height: 100%;
              border-radius: 50%;
              cursor: pointer;
          }
          .base-shadow-custom {
              position: relative;
              filter: drop-shadow(0px 10px 15px rgba(0,0,0,0.1));
              margin-top: -30px;
              z-index: 1;
              display: flex;
              flex-direction: column;
              align-items: center;
          }
          .base-custom {
              width: 180px;
              height: 160px;
              background: 
                  radial-gradient(ellipse 150% 60px at top center, rgba(110, 75, 150, 0.3) 0%, transparent 100%),
                  linear-gradient(to bottom, #d2bee5, #c0a8d8);
              clip-path: polygon(30% 0%, 70% 0%, 95% 100%, 5% 100%);
              display: flex;
              justify-content: center;
              align-items: flex-end;
              padding-bottom: 25px;
              box-sizing: border-box;
          }
          .base-bottom-custom {
              width: 185px;
              height: 10px;
              background: linear-gradient(to right, #b49bc5, #d2bee5, #b49bc5);
              border-radius: 4px;
              margin-top: -5px;
              z-index: 2;
          }
          .base-text-custom {
              font-weight: 600;
              color: #ffffff;
              font-size: 22px;
              letter-spacing: 8px;
              text-shadow: 1px 2px 4px rgba(130, 90, 180, 0.4);
              margin-left: 8px;
              opacity: 0.8;
          }
          .custom-modal-overlay {
              position: fixed;
              top: 0; left: 0; width: 100vw; height: 100vh;
              background-color: rgba(255, 255, 255, 0.8);
              backdrop-filter: blur(5px);
              z-index: 1000;
              display: flex;
              justify-content: center;
              align-items: center;
          }
          .custom-modal-content {
              background: #ffffff;
              padding: 40px;
              border-radius: 20px;
              text-align: center;
              box-shadow: 0 15px 30px rgba(180, 160, 220, 0.4);
              border: 2px solid #e9d5ff;
              max-width: 400px;
              animation: popIn 0.3s cubic-bezier(0.17, 0.67, 0.1, 1);
          }
          @keyframes popIn {
              0% { transform: scale(0.8); opacity: 0; }
              100% { transform: scale(1); opacity: 1; }
          }
        `}</style>
        
        <div className="wheel-container-custom">
            <div className="wheel-wrapper-custom">
                <div className="pointer-wrapper-custom" ref={pointerRef}>
                    <div className="pointer-circle-custom"></div>
                    <div className="pointer-triangle-custom"></div>
                </div>
                <canvas id="wheel-canvas" ref={canvasRef} width="500" height="500" onClick={handleSpin}></canvas>
            </div>
            <div className="base-shadow-custom">
                <div className="base-custom">
                    <span className="base-text-custom">SOREA</span>
                </div>
                <div className="base-bottom-custom"></div>
            </div>
            <button
                onClick={handleSpin}
                className="mt-12 bg-gradient-to-r from-[#d2bee5] to-[#c0a8d8] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 px-10 py-4 font-bold uppercase tracking-wider text-xl hover:scale-105"
            >
                Tourner la roue
            </button>
        </div>

        {showModal && winner && (
            <div className="custom-modal-overlay">
                <div className="custom-modal-content">
                    <h2 className="text-[#a881cf] text-2xl font-bold mb-5 mt-0">Votre tâche bien-être</h2>
                    <p className="text-[#4b3b5c] text-lg mb-8 leading-relaxed flex flex-col items-center">
                        <span className="material-symbols-outlined text-[50px] block mb-4 text-[#a881cf]">{winner.icon}</span>
                        <strong>{winner.text}</strong>
                    </p>
                    <button 
                        onClick={() => setShowModal(false)}
                        className="bg-gradient-to-br from-[#c8aae6] to-[#a881cf] text-white border-none py-3 px-8 text-base rounded-full cursor-pointer font-semibold shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
                    >
                        C'est parti !
                    </button>
                </div>
            </div>
        )}
    </div>
  );
}
