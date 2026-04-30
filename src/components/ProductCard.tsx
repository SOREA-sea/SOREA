"use client";

import Image from 'next/image';
import { useState } from 'react';

interface ProductCardProps{
  id: number;
  name: string;
  price: number;
  description?: string;
  imageSrc?: string;
}

export default function ProductCard({id, name, price, description, imageSrc}: ProductCardProps){
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: id }),
      });

      if (res.status === 401) {
        // Non connecté — on pourrait rediriger vers login
        window.location.href = "/login";
        return;
      }

      if (res.ok) {
        setAdded(true);
        // Notifier le CartDropdown du changement
        window.dispatchEvent(new Event("cart-updated"));
        setTimeout(() => setAdded(false), 2000);
      }
    } catch (error) {
      console.error("Erreur ajout panier:", error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <article className="product-card h-full overflow-hidden transition-transform duration-300 hover:-translate-y-1">
      {imageSrc ? (
        <div className="rounded-[1.5rem] overflow-hidden bg-white/60">
          <Image src={imageSrc} alt={name} width={400} height={220} className="object-cover w-full h-48" style={{ width: '100%', height: '12rem' }} />
        </div>
      ) : (
        <div className="h-48 bg-gradient-to-tr from-pink-100 via-white to-violet-100 rounded-[1.5rem]" />
      )}
      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <h4 className="text-base font-semibold leading-6">{name}</h4>
          {description && <p className="mt-2 text-sm text-foreground/70 leading-6">{description}</p>}
        </div>
        <div className="shrink-0 rounded-full bg-white/80 px-3 py-2 text-sm font-semibold text-foreground shadow-sm">
          €{price.toFixed(2)}
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="text-xs uppercase tracking-[0.22em] text-foreground/50">Disponible</span>
        <button
          onClick={handleAddToCart}
          disabled={isAdding}
          className={`btn-secondary flex items-center gap-1.5 cursor-pointer transition-all ${
            added ? "!bg-green-100 !text-green-700 !border-green-200" : ""
          }`}
        >
          {isAdding ? (
            <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : added ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Ajouté !
            </>
          ) : (
            "Ajouter"
          )}
        </button>
      </div>
    </article>
  );
}