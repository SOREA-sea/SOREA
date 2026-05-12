"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

interface ShopProduct {
  id: number;
  name: string;
  price: number;
  imageUrl: string | null;
  description: string | null;
}

export default function ShopProductCarousel({ products }: { products: ShopProduct[] }) {
  // We need at least 4 items to safely infinite-scroll on desktop
  const paddedProducts = [...products];
  while (paddedProducts.length < 4) {
    paddedProducts.push({
      id: -paddedProducts.length, // Dummy ID
      name: "",
      price: 0,
      imageUrl: null,
      description: null
    });
  }

  const itemLength = paddedProducts.length;
  // Duplicate array 3 times to allow infinite looping (left, center, right)
  const extendedProducts = [...paddedProducts, ...paddedProducts, ...paddedProducts];

  const [currentIndex, setCurrentIndex] = useState(itemLength);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  // Récupérer les favoris initiaux au montage
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await fetch("/api/dashboard/favorites");
        if (res.ok) {
          const data = await res.json();
          if (data.products && Array.isArray(data.products)) {
            const favIds = new Set<number>(data.products.map((fav: any) => Number(fav.product.id)));
            setFavorites(favIds);
          }
        }
      } catch (error) {
        console.error("Erreur de récupération des favoris:", error);
      }
    };
    fetchFavorites();
  }, []);

  const next = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTransitionEnabled(true);
    setCurrentIndex((prev) => prev + 1);
  };

  const prev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTransitionEnabled(true);
    setCurrentIndex((prev) => prev - 1);
  };

  const handleTransitionEnd = () => {
    setIsAnimating(false);
    // Silent jump if we hit the boundaries
    if (currentIndex >= itemLength * 2) {
      setTransitionEnabled(false);
      setCurrentIndex(currentIndex - itemLength);
    } else if (currentIndex <= 0) {
      setTransitionEnabled(false);
      setCurrentIndex(currentIndex + itemLength);
    }
  };

  // Ajout au panier DB
  const handleAddToCart = async (e: React.MouseEvent, productId: number) => {
    e.stopPropagation();
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      if (res.status === 401) {
        window.location.href = "/login";
        return;
      }
      if (res.ok) {
        window.dispatchEvent(new Event("cart-updated"));
      }
    } catch (error) {
      console.error("Erreur ajout panier:", error);
    }
  };

  // Toggle Favori
  const handleToggleFavorite = async (e: React.MouseEvent, productId: number) => {
    e.stopPropagation();
    try {
      const res = await fetch("/api/dashboard/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "product", targetId: productId }),
      });
      if (res.status === 401) {
        window.location.href = "/login";
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setFavorites((prev) => {
          const newFavs = new Set(prev);
          if (data.status === "added") {
            newFavs.add(productId);
          } else {
            newFavs.delete(productId);
          }
          return newFavs;
        });
      }
    } catch (error) {
      console.error("Erreur toggle favori:", error);
    }
  };

  return (
    <div className="relative mb-20 max-w-[100%] mx-auto w-full px-2 md:px-0">
      <style>{`
        .carousel-track {
          --cards-show: 1;
          transform: translateX(calc(var(--current-index) * -100% / var(--cards-show)));
        }
        @media (min-width: 640px) {
          .carousel-track { --cards-show: 2; }
        }
        @media (min-width: 1024px) {
          .carousel-track { --cards-show: 4; }
        }
      `}</style>
      
      {/* Left Arrow */}
      <button 
        onClick={prev}
        className="absolute left-0 md:-left-5 top-1/2 transform -translate-y-1/2 z-20 w-10 h-10 bg-white rounded-full border-[2px] border-[#64218C] text-[#64218C] flex items-center justify-center shadow-lg hover:bg-[#64218C] hover:text-white hover:scale-110 transition-all cursor-pointer"
      >
        <i className="fa-solid fa-chevron-left text-base"></i>
      </button>

      {/* Overflow wrapper */}
      <div className="overflow-hidden w-full rounded-[1.5rem] py-4 px-2">
        <div 
          className="flex carousel-track w-full"
          style={{ 
            '--current-index': currentIndex,
            transition: transitionEnabled ? 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)' : 'none'
          } as React.CSSProperties}
          onTransitionEnd={handleTransitionEnd}
        >
          {extendedProducts.map((product, idx) => (
            <div 
              key={`${product.id}-${idx}`} 
              className="w-full sm:w-1/2 lg:w-1/4 flex-none px-2 md:px-3"
            >
              <div className="flex flex-col h-[350px] w-full rounded-[1.5rem] overflow-hidden shadow-md hover:shadow-xl bg-white cursor-pointer group transition-shadow duration-300">
                
                {/* Image Section */}
                <div className="h-[65%] w-full relative bg-white">
                  {product.imageUrl ? (
                    <Image 
                      src={product.imageUrl} 
                      alt={product.name} 
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500" 
                    />
                  ) : null}
                  
                  {product.id > 0 && (
                    <div className="absolute top-0 right-0 p-4 z-10">
                      <button 
                        onClick={(e) => handleToggleFavorite(e, product.id)}
                        className={`${favorites.has(product.id) ? 'text-[#64218C]' : 'text-[#BCA4DD]'} hover:text-[#64218C] transition-colors drop-shadow-sm hover:scale-110 transform`}
                      >
                        <i className={`fa-heart text-2xl ${favorites.has(product.id) ? 'fa-solid' : 'fa-regular'}`}></i>
                      </button>
                    </div>
                  )}
                </div>

                {/* Details Section */}
                <div className="h-[35%] w-full bg-[#6B6B6B] group-hover:bg-[#4D4C51] transition-colors p-5 flex flex-col justify-center relative">
                  {product.id > 0 && (
                    <>
                      <h3 className="text-white font-bold text-lg leading-tight truncate">{product.name}</h3>
                      <div className="flex justify-between items-center mt-3">
                        <span className="text-white font-semibold tracking-wide">{product.price.toFixed(2)} €</span>
                        <button 
                          onClick={(e) => handleAddToCart(e, product.id)}
                          className="text-[#4D4C51] hover:text-white font-semibold text-sm bg-white hover:bg-[#64218C] shadow px-4 py-1.5 rounded-full transition-colors"
                        >
                          Ajouter
                        </button>
                      </div>
                    </>
                  )}
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Arrow */}
      <button 
        onClick={next}
        className="absolute right-0 md:-right-5 top-1/2 transform -translate-y-1/2 z-20 w-10 h-10 bg-white rounded-full border-[2px] border-[#64218C] text-[#64218C] flex items-center justify-center shadow-lg hover:bg-[#64218C] hover:text-white hover:scale-110 transition-all cursor-pointer"
      >
        <i className="fa-solid fa-chevron-right text-base"></i>
      </button>

    </div>
  );
}