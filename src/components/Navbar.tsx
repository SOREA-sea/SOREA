"use client";

import Link from 'next/link';
import Image from 'next/image';
import CartDropdown from './CartDropdown';
import { useState, useEffect, useRef } from 'react';

export default function Navbar({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  const navItems = [
    { label: 'Boutique', href: '/#products' },
    { label: 'Séances', href: '/#sessions' },
    { label: 'Avis', href: '/#testimonials' }
  ];

  const navRef = useRef<HTMLElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(3); // 3 is Dashboard/Login
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, top: 0, width: 0, height: 0, opacity: 0 });

  const currentIndex = hoveredIndex !== null ? hoveredIndex : activeIndex;

  useEffect(() => {
    const handleScroll = () => {
      let newIndex = 3; // Par défaut: Dashboard

      // Ne faire le scroll spy que sur la page d'accueil
      if (window.location.pathname === "/") {
        const sections = ['products', 'sessions', 'testimonials'];
        
        for (let i = 0; i < sections.length; i++) {
          const el = document.getElementById(sections[i]);
          if (el) {
            const rect = el.getBoundingClientRect();
            // La section est active si son haut a passé le tiers de l'écran
            // et son bas est encore visible
            if (rect.top <= window.innerHeight / 3 && rect.bottom >= 100) {
              newIndex = i;
              break;
            }
          }
        }

        // Si on est tout en haut, remettre sur le CTA Dashboard
        if (window.scrollY < 100) {
          newIndex = 3;
        }
      }

      setActiveIndex(newIndex);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('hashchange', handleScroll);
    
    // Vérification initiale
    setTimeout(handleScroll, 100);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('hashchange', handleScroll);
    };
  }, []);

  useEffect(() => {
    const activeEl = itemRefs.current[currentIndex];
    if (activeEl) {
      setIndicatorStyle({
        left: activeEl.offsetLeft,
        top: activeEl.offsetTop,
        width: activeEl.offsetWidth,
        height: activeEl.offsetHeight,
        opacity: 1
      });
    }
  }, [currentIndex, isLoggedIn]);

  useEffect(() => {
    const handleResize = () => {
      const activeEl = itemRefs.current[currentIndex];
      if (activeEl) {
        setIndicatorStyle({
          left: activeEl.offsetLeft,
          top: activeEl.offsetTop,
          width: activeEl.offsetWidth,
          height: activeEl.offsetHeight,
          opacity: 1
        });
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentIndex]);

  return (
    <header className="w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between fixed top-0 left-1/2 -translate-x-1/2 z-50">
      <Link 
        href="/" 
        className="flex items-center gap-4 rounded-full border border-white/70 bg-white/55 p-1.5 pr-6 shadow-sm backdrop-blur hover:bg-white/60 transition-colors"
      >
        <div className="w-11 h-11 rounded-full bg-white/80 flex items-center justify-center shadow overflow-hidden ring-1 ring-white/80 backdrop-blur shrink-0">
          <Image src="/images/logo_sorea.webp" alt="SOREA" width={40} height={40} />
        </div>
        <div className="text-sm tracking-[0.35em] text-foreground/80 font-bold">S O R E A</div>
      </Link>
      <nav 
        ref={navRef}
        className="relative hidden md:flex items-center rounded-full border border-white/70 bg-white/55 p-2 shadow-sm backdrop-blur"
        onMouseLeave={() => setHoveredIndex(null)}
      >
        {/* Sliding Indicator */}
        <div 
          className="absolute rounded-full z-0 pointer-events-none"
          style={{
            background: 'linear-gradient(120deg, var(--accent), var(--accent-2), #d946ef, var(--accent))',
            backgroundSize: '300% 300%',
            animation: 'gradientWave 5s ease-in-out infinite',
            boxShadow: '0 14px 30px rgba(139, 92, 246, 0.25)',
            transition: 'all 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
            left: `${indicatorStyle.left}px`,
            top: `${indicatorStyle.top}px`,
            width: `${indicatorStyle.width}px`,
            height: `${indicatorStyle.height}px`,
            opacity: indicatorStyle.opacity,
          }}
        />

        {navItems.map((item, i) => (
          <Link 
            key={item.href}
            href={item.href}
            ref={el => { itemRefs.current[i] = el; }}
            onMouseEnter={() => setHoveredIndex(i)}
            className={`relative z-10 text-sm px-4 py-2 mx-1 rounded-full font-medium transition-colors duration-300 ${
              currentIndex === i ? 'text-white' : 'text-foreground/80 hover:text-foreground'
            }`}
          >
            {item.label}
          </Link>
        ))}

        <div className="relative z-10 mx-2 flex items-center" onMouseEnter={() => setHoveredIndex(null)}>
          <CartDropdown />
        </div>

        <Link 
          href={isLoggedIn ? "/dashboard" : "/login"}
          ref={el => { itemRefs.current[3] = el; }}
          onMouseEnter={() => setHoveredIndex(3)}
          className={`relative z-10 text-sm px-[1.1rem] py-[0.78rem] ml-1 rounded-full font-semibold transition-colors duration-300 ${
            currentIndex === 3 ? 'text-white' : 'text-foreground hover:bg-white/40'
          }`}
        >
          {isLoggedIn ? "Dashboard" : "Se connecter"}
        </Link>
      </nav>
    </header>
  );
}