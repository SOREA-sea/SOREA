"use client";

import React from "react";

// Tableau associant chaque image à son message personnalisé
const encouragementData = [
  { image: "/image_photo/Encouragement1.png", message: "Chaque petit défi compte. Tu avances déjà." },
  { image: "/image_photo/Encouragement2.png", message: "Prends un instant pour respirer et célébrer tes progrès." },
  { image: "/image_photo/Encouragement3.png", message: "Ta force intérieure est plus grande que tes obstacles." },
  { image: "/image_photo/Encouragement4.png", message: "Ose briller et faire résonner ta propre voix." },
  { image: "/image_photo/Encouragement5.png", message: "Un pas après l'autre, tu construis ton équilibre." },
  { image: "/image_photo/Encouragement6.png", message: "Accueille ta journée avec douceur et confiance." },
  { image: "/image_photo/Encouragement7.png", message: "Tu es capable de grandes choses, crois en ton potentiel." },
  { image: "/image_photo/Encouragement8.png", message: "Cultive la bienveillance envers toi-même aujourd'hui." },
  { image: "/image_photo/Encouragement9.png", message: "Tes efforts d'aujourd'hui façonnent ton bien-être de demain." },
  { image: "/image_photo/Encouragement10.png", message: "Laisse s'exprimer la magnifique énergie qui est en toi." },
  { image: "/image_photo/Encouragement11.png", message: "Chaque jour est une nouvelle chance d'évoluer." },
  { image: "/image_photo/Encouragement12.png", message: "Fis-toi à ton intuition, tu es exactement là où tu dois être." },
  { image: "/image_photo/Encouragement13.png", message: "Entoure toi de bonnes personnes." },
];

export default function DailyEncouragement() {
  // Calcul basé sur le nombre de jours écoulés depuis le 1er janvier 2026 (change à minuit précis)
  const getDailyIndex = () => {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const diffDays = Math.floor((now.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays % encouragementData.length;
  };

  const currentItem = encouragementData[getDailyIndex()];

  return (
    <section 
      className="relative w-full max-w-[1228px] h-[110px] mx-auto rounded-2xl overflow-hidden px-6 text-center bg-cover bg-center shadow-md transition-all duration-500 flex items-center justify-center"
      style={{ backgroundImage: `url('${currentItem.image}')` }}
    >
      <p className="relative z-10 text-xl font-bold text-white drop-shadow-sm">
        {currentItem.message}
      </p>
    </section>
  );
}