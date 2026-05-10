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
    // Conteneur principal (la grande div )
    <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl flex flex-col items-end gap-2">
      
      {/* 1. La Navbar principale blanche */}
      <div className="w-[1248px] h-[84px] flex items-center justify-center px-[70px] gap-[50px] shadow-sm mx-auto"
style={{
  background: 'linear-gradient(90deg, rgba(75, 85, 99, 0.15) 0%, rgba(152, 173, 201, 0.15) 100%)',
  backdropFilter: 'blur(12px)',
}}>
        
        {/* Logo - shrink-0 pour éviter qu'il s'écrase */}
        <Link href="/" className="shrink-0">
          <div className=" flex items-center justify-center">
            <Image src="/images/Logo_SOREA.png" alt="SOREA" width={72} height={72} className="object-contain" />
          </div>
        </Link>

        {/* Liens de navigation - gap-[50px] ici aussi pour l'espace entre chaque lien*/}
        <nav className="hidden lg:flex items-center gap-[50px]">
          {navItems.map((item, i) => (
            <Link 
              key={item.label}
              href={item.href}
              className="text-[15px] font-semibold transition-all hover:opacity-70 whitespace-nowrap"
              style={{
                color: '#a855f7',
                textShadow: '-1px -1px 0 #ffffff, 1px -1px 0 #ffffff, -1px 1px 0 #ffffff, 1px 1px 0 #ffffff',
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Bouton de connexion - shrink-0 pour garder sa taille*/}
        <Link 
          href={isLoggedIn ? "/dashboard" : "/login"}
          className="shrink-0 bg-[#a78bfa] text-white px-8 py-3 rounded-full font-bold text-sm shadow-md hover:bg-[#9061f9] transition-all whitespace-nowrap"
        >
          {isLoggedIn ? "Dashboard" : "Se connecter"}
        </Link>
      </div>

      {/* 2. La zone des icônes (Panier, etc.) - En dehors de la nav blanche, mais dans la même div header */}
      <div className="flex items-center gap-6 px-6 py-1">
        
        {/* Icône Recherche (exemple sur ton image) */}
        <div className="text-gray-500 hover:text-purple-500 transition-colors">
          <Image 
  src="/images/Loop.svg" 
  alt="Recherche" 
  width={27} 
  height={27} 
  className="text-gray-500"
/>
        </div>

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
 <div className="text-gray-500 hover:text-purple-500 transition-colors">
          <Image 
  src="/images/Navbar.png" 
  alt="Recherche" 
  width={1248} 
  height={84} 
  className="text-gray-500"
/>
        </div>
    </header>
  );
}