import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Heart, Star, Video } from 'lucide-react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma'; // Assumes prisma is set up in lib/prisma.ts

export default async function CoachProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const coachId = parseInt(resolvedParams.id, 10);
  
  if (isNaN(coachId)) {
    return notFound();
  }

  const coach = await prisma.coachProfile.findUnique({
    where: { id: coachId },
    include: {
      user: true,
      _count: {
        select: { coachReviews: true }
      }
    }
  });

  if (!coach || !coach.user) {
    return notFound();
  }

  const { user } = coach;
  const rating = coach.averageRating ?? 0;
  const avisCount = coach._count?.coachReviews || 0;
  const avatarSrc = user.avatarUrl || "/images/placeholder-coach.jpg";
  const name = user.firstName;
  // logic to show full stars and half stars
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#eadef5] to-[#f9f5fa] flex flex-col font-sans text-gray-800">
      <Navbar />

      <main className="flex-grow w-full max-w-6xl mx-auto px-4 py-8 relative">
        {/* Icône Favori en haut à droite */}
        <div className="absolute top-8 right-8 text-[#9876c6] cursor-pointer hover:scale-110 transition-transform">
          <Heart fill="currentColor" size={32} />
        </div>

        {/* En-tête du Coach */}
        <div className="flex flex-col items-center mt-12 mb-10">
          <h1 className="text-3xl font-semibold tracking-wide text-gray-900 mb-2">{name}</h1>
          <p className="text-xl text-gray-700 font-medium tracking-wider mb-8">{coach.specialty || "Coach certifié"}</p>

          {/* Photo Hexagonale */}
          <div className="relative mb-4">
            <div 
              className="w-56 h-64 overflow-hidden relative shadow-lg"
              style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
            >
              <Image 
                src={avatarSrc}
                alt={`${name}, Coach`} 
                fill
                className="object-cover"
                unoptimized
              />
              <div className="absolute inset-0 bg-black/10"></div>
            </div>
            {/* Petit badge superposé */}
            <div className="absolute top-2 -right-4 bg-[#b599d1] text-white rounded-full p-2 shadow-md">
              <Star size={16} fill="white" />
            </div>
          </div>

          {/* Étoiles et Évaluations */}
          <div className="flex flex-col items-center mb-6">
            <div className="flex text-gray-600 gap-1 mb-1">
              {[...Array(fullStars)].map((_, i) => <Star key={`full-${i}`} size={15} fill="currentColor" stroke="none" />)}
              {hasHalfStar && <Star size={15} fill="currentColor" className="opacity-50" stroke="none" />}
              {[...Array(emptyStars)].map((_, i) => <Star key={`empty-${i}`} size={15} fill="none" stroke="currentColor" className="opacity-30" />)}
            </div>
            <span className="text-xs text-gray-500 tracking-wide">{avisCount} évaluation{avisCount !== 1 ? 's' : ''}</span>
          </div>

          {/* Infos clés : Prix, Format, Élèves */}
          <div className="flex gap-12 text-sm font-medium text-[#4a2377]">
            <span>{coach.hourlyRate ? `${coach.hourlyRate}€/heure` : "Sur devis"}</span>
            <span className="flex items-center gap-2">
              <Video size={16} /> Webcam
            </span>
            <span>Élèves : 50+</span>
          </div>
        </div>

        {/* Section Contenu (À propos & Tarifs/Vidéo) */}
        <div className="flex flex-col md:flex-row gap-8 max-w-5xl mx-auto items-stretch">
          
          {/* Colonne Gauche - À propos */}
          <div className="flex-1 bg-white/60 p-10 shadow-sm relative overflow-hidden flex flex-col justify-start">
             {/* Léger dégradé interne */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/90 to-transparent"></div>
            
            <div className="relative z-10 text-center">
              <h2 className="text-2xl font-semibold text-[#4a2377] mb-8 tracking-widest">À propos</h2>
              
              <div className="space-y-6 text-sm leading-relaxed text-gray-700 text-left font-medium">
                {coach.bio ? (
                  <p className="whitespace-pre-line">{coach.bio}</p>
                ) : (
                  <p>Aucune description fournie pour le moment.</p>
                )}
              </div>
            </div>
          </div>

          {/* Colonne Droite - Tarifs & Vidéo */}
          <div className="flex-[0.8] flex flex-col gap-8">
            
            {/* Boîte Tarifs */}
            <div className="bg-white/70 shadow-sm p-10 flex flex-col items-center text-center justify-center flex-1">
              <h2 className="text-2xl font-semibold text-[#4a2377] mb-8 tracking-widest">Tarifs</h2>
              
              <div className="mb-6">
                <p className="text-sm font-semibold text-gray-600 mb-1">Tarif</p>
                <p className="text-lg font-medium text-gray-800">{coach.hourlyRate ? `${coach.hourlyRate}€` : "Sur devis"}</p>
              </div>
              
              {coach.hourlyRate && (
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-2">Tarifs packs</p>
                  <p className="text-sm font-medium text-gray-800">5h : {coach.hourlyRate * 5}€</p>
                  <p className="text-sm font-medium text-gray-800">10h : {coach.hourlyRate * 10}€</p>
                </div>
              )}
            </div>

            {/* Boîte Vidéo */}
            <div className="bg-gradient-to-br from-[#c8a9c2] to-[#dfc4d5] shadow-sm flex flex-col items-center justify-center flex-1 min-h-[220px] relative group cursor-pointer">
              <div className="bg-red-600 text-white rounded-xl py-3 px-5 shadow-lg group-hover:scale-105 transition-transform duration-300">
                 {/* Bouton de lecture style YouTube */}
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
