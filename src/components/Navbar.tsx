"use client";

import Link from 'next/link';
import Image from 'next/image';
import CartDropdown from './CartDropdown';
import { useState, useEffect, useRef } from 'react';

export default function Navbar({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  const navItems = [
    { label: 'Shopping', href: '/#products' },
    { label: 'Coaching', href: '/#sessions' },
    { label: 'Devenir ambassadrice', href: '/#testimonials' },
    { label: 'Challenge', href: '/#challenge' },
    { label: 'Vibe', href: '/#vibe' },
    { label: 'Mon carnet', href: '/#carnet' },
  ];

  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(navItems.length);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    // Conteneur principal (la grande div bleue sur ton screenshot Figma)
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl flex flex-col items-end gap-2">
      
      {/* 1. La Navbar principale blanche */}
      <div className="w-full flex items-center justify-between px-4 py-2 shadow-sm"
style={{
  background: 'linear-gradient(90deg, rgba(75, 85, 99, 0.15) 0%, rgba(152, 173, 201, 0.15) 100%)',
  backdropFilter: 'blur(12px)',
}}>
        
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm overflow-hidden border border-purple-100">
            <Image src="/images/logo_sorea.webp" alt="SOREA" width={45} height={45} className="object-contain" />
          </div>
        </Link>

        {/* Liens de navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item, i) => (
            <Link 
              key={item.label}
              href={item.href}
              className="px-4 py-2 text-[15px] font-semibold transition-all hover:opacity-70"
              style={{
                color: '#a855f7',
                textShadow: '-1px -1px 0 #ffffff, 1px -1px 0 #ffffff, -1px 1px 0 #ffffff, 1px 1px 0 #ffffff',
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Bouton de connexion */}
        <Link 
          href={isLoggedIn ? "/dashboard" : "/login"}
          className="bg-[#a78bfa] text-white px-8 py-3 rounded-full font-bold text-sm shadow-md hover:bg-[#9061f9] transition-all"
        >
          {isLoggedIn ? "Dashboard" : "Se connecter"}
        </Link>
      </div>

      {/* 2. La zone des icônes (Panier, etc.) - En dehors de la nav blanche, mais dans la même div header */}
      <div className="flex items-center gap-6 px-6 py-1">
        
        {/* Icône Recherche (exemple sur ton image) */}
        <button className="text-gray-500 hover:text-purple-500 transition-colors">
          <Image 
  src="/images/Loop.svg" 
  alt="Recherche" 
  width={27} 
  height={27} 
  className="text-gray-500"
/>
        </button>

        {/* Icône Favoris / Coeur */}
        <div className="flex items-center gap-1 text-gray-500">
           <span className="text-xs font-bold">0</span>
           <Image 
  src="/images/Heart.svg" 
  alt="Like" 
  width={28.95} 
  height={26.40} 
  className="text-gray-500"
/>
        </div>

        {/* Ton composant Panier / Chariot */}
        <div className="flex items-center gap-1">
           <span className="text-xs font-bold text-gray-500">0</span>
           <Image 
  src="/images/Shopping_bag.svg" 
  alt="Basket" 
  width={24} 
  height={24} 
  className="text-gray-500"
/>
        </div>
      </div>

    </header>
  );
}