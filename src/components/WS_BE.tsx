import React, { useEffect, useRef } from 'react';

// Structure de données pour les icônes (facile à maintenir ou à passer en props)
const ICONS = [
  { src: 'images/image_WS_Bien-être/Introspection.png', alt: 'Introspection', angle: 18 },
  { src: 'images/image_WS_Bien-être/Gratitude.png', alt: 'Gratitude', angle: 54 },
  { src: 'images/image_WS_Bien-être/Pleine_conscience.png', alt: 'Pleine conscience', angle: 90 },
  { src: 'images/image_WS_Bien-être/Intelligence_émotionnelle.png', alt: 'Intelligence émotionnlle', angle: 126 },
  { src: 'images/image_WS_Bien-être/Action_&_Défis_de_confiance.png', alt: 'Action', angle: 162 },
  { src: 'images/image_WS_Bien-être/Maîtrise de soi.png', alt: 'Maîtrise de soi', angle: 198 },
  { src: 'images/image_WS_Bien-être/Inspiration.png', alt: 'Inspiration', angle: 234 },
  { src: 'images/image_WS_Bien-être/Reconnexion_à_soi.png', alt: 'Reconnexion', angle: 270 },
  { src: 'images/image_WS_Bien-être/Vision_&_Projection.png', alt: 'Vision', angle: 306 },
  { src: 'images/image_WS_Bien-être/Lâcher-prise & Libération.png', alt: 'Lâcher-prise', angle: 342 },
];

// Configuration des pastilles (dots)
const DOTS = [
  { angle: 0, y: -159, color: 'yellow' },
  { angle: 36, y: -159, color: 'purple' },
  { angle: 72, y: -159, color: 'yellow' },
  { angle: 108, y: -159, color: 'purple' },
  { angle: 144, y: -158, color: 'yellow' },
  { angle: 180, y: -158, color: 'purple' },
  { angle: 216, y: -158, color: 'yellow' },
  { angle: 252, y: -158, color: 'purple' },
  { angle: 288, y: -158, color: 'yellow' },
  { angle: 324, y: -158, color: 'purple' },
];

export default function WheelSpinner() {
  const wheelGroupRef = useRef<HTMLDivElement>(null);
  const angleRef = useRef(0);

  useEffect(() => {
    let animationId: number;

    const faireTournerDoucement = () => {
      angleRef.current += 0.15;
      if (wheelGroupRef.current) {
        wheelGroupRef.current.style.transform = `rotate(${angleRef.current}deg)`;
      }
      animationId = requestAnimationFrame(faireTournerDoucement);
    };

    animationId = requestAnimationFrame(faireTournerDoucement);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="flex items-center justify-center relative w-full h-screen bg-[#f5f5f7]">
      {/* --- LE GROUPE INDICATEUR (Triangle + Trapèze) --- */}
      <div className="absolute top-[25%] left-1/2 -translate-x-1/2 z-0 flex flex-col items-center justify-center">
        {/* Triangle Isocèle */}
        <div
          className="relative w-[161.93px] h-[311px] bg-[#DBCEEF] flex justify-center items-end pb-[10px] box-border text-[#7A7385] font-sans text-[24px] font-semibold"
          style={{
            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
            filter: 'drop-shadow(0px 38px 26px rgba(0, 0, 0, 0.25))',
            letterSpacing: '10px',
            textIndent: '6px',
            WebkitTextStroke: '2px #FFFFFF',
            paintOrder: 'stroke fill',
            textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
          }}
        >
          SOREA
          {/* Ombre interne du triangle */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, transparent 40%)',
            }}
          />
        </div>

        {/* Trapèze */}
        <div
          className="w-[210px] h-[35px] bg-[#DBCEEF] relative"
          style={{
            clipPath: 'polygon(7% 0%, 93% 0%, 100% 100%, 0% 100%)',
            boxShadow: 'inset 0px 5px 15px rgba(0, 0, 0, 0.25)',
          }}
        />
      </div>

      {/* --- CONTENEUR DE LA ROUE --- */}
      <div className="relative w-[340px] h-[340px] flex justify-center items-center -mt-[55px]">
        {/* Le Tore */}
        <div 
          className="w-[330px] h-[330px] relative flex justify-center items-center"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Tore ::after overlay */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, transparent 65%, #DBCEEF 65%)',
              filter: 'drop-shadow(0px 8px 15px #000000)',
              zIndex: 2,
              transform: 'translateZ(2px)',
            }}
          />

          {/* GROUPE EN ROTATION (Roue + Icônes + Pastilles) */}
          <div
            ref={wheelGroupRef}
            className="absolute inset-0 flex justify-center items-center will-change-transform z-[3]"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* La Roue Bicolore */}
            <div
              className="w-[330px] h-[330px] rounded-full absolute z-[1] flex justify-center items-center"
              style={{
                background: `conic-gradient(
                  #C0ACFF 0deg 36deg,
                  #FEF0F9 36deg 72deg,
                  #C0ACFF 72deg 108deg,
                  #FEF0F9 108deg 144deg,
                  #C0ACFF 144deg 180deg,
                  #FEF0F9 180deg 216deg,
                  #C0ACFF 216deg 252deg,
                  #FEF0F9 252deg 288deg,
                  #C0ACFF 288deg 324deg,
                  #FEF0F9 324deg 360deg
                )`,
                transform: 'translateZ(1px)',
              }}
            >
              {/* Icônes */}
              {ICONS.map((icon, index) => (
                <div
                  key={index}
                  className="absolute w-[25px] h-[25px] flex justify-center items-center"
                  style={{
                    transform: `rotate(${icon.angle}deg) translateY(-115px)`,
                  }}
                >
                  <img
                    src={icon.src}
                    alt={icon.alt}
                    className="w-full h-full object-contain"
                  />
                </div>
              ))}
            </div>

            {/* Les Petites Pastilles (Dots) */}
            {DOTS.map((dot, index) => {
              const bgGradient =
                dot.color === 'yellow'
                  ? 'radial-gradient(circle, #FFFFFF 0%, #FDCF5A 100%)'
                  : 'radial-gradient(circle, #FFFFFF 0%, #7F4DC5 100%)';
              return (
                <div
                  key={index}
                  className="absolute w-[8px] h-[8px] rounded-full z-[3] origin-center"
                  style={{
                    background: bgGradient,
                    transform: `rotate(${dot.angle}deg) translateY(${dot.y}px) translateZ(3px)`,
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* --- ÉLÉMENTS FIXES (NON TOURNANTS) --- */}
        <div className="absolute inset-0 z-[5]">
          {/* Pointeur / Épingle */}
          <div
            className="absolute -top-[10px] left-1/2 -translate-x-1/2 w-[37px] h-[50px] z-[5]"
            style={{ filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))' }}
          >
            <svg
              className="w-full h-full block"
              viewBox="0 0 37 50"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="sorea-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FEF0F9" />
                  <stop offset="100%" stopColor="#C0ACFF" />
                </linearGradient>
              </defs>
              <path
                d="M18.5 0C8.28 0 0 8.28 0 18.5C0 29.5 18.5 50 18.5 50C18.5 50 37 29.5 37 18.5C37 8.28 28.72 0 18.5 0Z"
                fill="url(#sorea-grad)"
              />
            </svg>
            <div className="absolute top-[14px] left-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center w-[16px] h-[16px]">
              <div
                className="w-[16px] h-[16px] rounded-full bg-[#B596FF] flex justify-center items-center"
                style={{ boxShadow: 'inset 0px 4px 4px rgba(0, 0, 0, 0.25)' }}
              >
                <div
                  className="w-[8px] h-[8px] rounded-full"
                  style={{
                    background: 'radial-gradient(circle, #FFFFFF 0%, #8B47FF 100%)',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Bouton/Point Central */}
          <div
            className="w-[21.99px] h-[21.99px] bg-[#C0ACFF] rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[10]"
            style={{
              boxShadow:
                'inset 0px 5px 4px rgba(75, 85, 99, 0.70), 0px 0px 20px rgba(0, 0, 0, 1)',
            }}
          />
        </div>
      </div>
    </div>
  );
}