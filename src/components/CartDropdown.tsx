"use client";

import { useState, useEffect, useRef } from "react";

interface CartItem {
  id: number;
  quantity: number;
  unitPrice: number;
  product: {
    id: number;
    name: string;
    price: number;
    imageUrl: string | null;
    isActive: boolean;
  };
}

export default function CartDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Charger le count initial
  useEffect(() => {
    fetchCart(false);
  }, []);

  // Écouter l'événement custom "cart-updated" pour les mises à jour live
  useEffect(() => {
    const handler = () => fetchCart(false);
    window.addEventListener("cart-updated", handler);
    return () => window.removeEventListener("cart-updated", handler);
  }, []);

  // Fermer le dropdown en cliquant à l'extérieur
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function fetchCart(showLoading = true) {
    if (showLoading) setIsLoading(true);
    try {
      const res = await fetch("/api/cart");
      if (!res.ok) return;
      const data = await res.json();
      setItems(data.items || []);
      setTotal(data.total || 0);
      setCount(data.count || 0);
    } catch (error) {
      // silently fail
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async (itemId: number) => {
    try {
      const res = await fetch(`/api/cart?itemId=${itemId}`, { method: "DELETE" });
      if (!res.ok) return;
      const data = await res.json();
      setCount(data.count);
      setItems((prev) => prev.filter((i) => i.id !== itemId));
      setTotal((prev) => {
        const removed = items.find((i) => i.id === itemId);
        return removed ? prev - removed.product.price * removed.quantity : prev;
      });
    } catch (error) {
      console.error("Erreur suppression item:", error);
    }
  };

  const decrementItem = async (itemId: number) => {
    const item = items.find((i) => i.id === itemId);
    if (!item) return;

    try {
      const res = await fetch(`/api/cart?itemId=${itemId}&decrement=true`, { method: "DELETE" });
      if (!res.ok) return;
      const data = await res.json();
      setCount(data.count);

      if (item.quantity <= 1) {
        setItems((prev) => prev.filter((i) => i.id !== itemId));
      } else {
        setItems((prev) =>
          prev.map((i) => (i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i))
        );
      }
      setTotal((prev) => prev - item.product.price);
    } catch (error) {
      console.error("Erreur décrémentation:", error);
    }
  };

  const incrementItem = async (itemId: number) => {
    const item = items.find((i) => i.id === itemId);
    if (!item) return;

    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: item.product.id, quantity: 1 }),
      });
      if (!res.ok) return;
      const data = await res.json();
      setCount(data.count);
      setItems((prev) =>
        prev.map((i) => (i.id === itemId ? { ...i, quantity: i.quantity + 1 } : i))
      );
      setTotal((prev) => prev + item.product.price);
    } catch (error) {
      console.error("Erreur incrémentation:", error);
    }
  };

  const handleToggle = () => {
    if (!isOpen) fetchCart(true);
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Cart button */}
      <button
        onClick={handleToggle}
        className="relative p-2 rounded-full hover:bg-white/70 transition-colors cursor-pointer"
        aria-label="Panier"
      >
        <svg className="w-5 h-5 text-foreground/70" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
        </svg>
        {count > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-purple-600 to-pink-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-md animate-[scale-in_0.2s_ease-out]">
            {count > 99 ? "99+" : count}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-3 w-80 sm:w-96 rounded-3xl shadow-2xl border border-white/50 overflow-hidden z-50"
          style={{ animation: "fadeSlideDown 0.2s ease-out", background: "rgba(255,255,255,0.97)", backdropFilter: "blur(24px)" }}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-white/30 flex items-center justify-between">
            <h3 className="font-bold text-foreground">
              Mon panier
              {count > 0 && (
                <span className="ml-2 text-foreground/40 text-sm font-normal">
                  ({count} article{count > 1 ? "s" : ""})
                </span>
              )}
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-white/60 transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4 text-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="max-h-80 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-10">
                <div className="w-6 h-6 border-2 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
              </div>
            ) : items.length === 0 ? (
              <div className="py-10 px-6 text-center">
                <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 text-purple-400">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                  </svg>
                </div>
                <p className="text-foreground/60 font-medium text-sm">Votre panier est vide</p>
                <p className="text-foreground/40 text-xs mt-1">Explorez nos produits bien-être !</p>
              </div>
            ) : (
              <div className="divide-y divide-white/20">
                {items.map((item) => (
                  <div key={item.id} className="px-5 py-4 flex gap-3 hover:bg-white/20 transition-colors">
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-white/60 shrink-0">
                      <img
                        src={item.product.imageUrl || "/images/product_1.webp"}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-foreground truncate">{item.product.name}</p>
                      <p className="text-purple-600 font-bold text-sm">{item.product.price} €</p>
                      {/* Quantity controls */}
                      <div className="flex items-center gap-2 mt-1.5">
                        <button
                          onClick={() => decrementItem(item.id)}
                          className="w-6 h-6 rounded-full bg-white/60 border border-white/80 flex items-center justify-center text-foreground/60 hover:bg-white hover:text-foreground transition-colors cursor-pointer text-xs font-bold"
                        >
                          −
                        </button>
                        <span className="text-xs font-semibold text-foreground min-w-[16px] text-center">{item.quantity}</span>
                        <button
                          onClick={() => incrementItem(item.id)}
                          className="w-6 h-6 rounded-full bg-white/60 border border-white/80 flex items-center justify-center text-foreground/60 hover:bg-white hover:text-foreground transition-colors cursor-pointer text-xs font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col items-end justify-between shrink-0">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1 rounded-lg hover:bg-red-50 text-foreground/30 hover:text-red-500 transition-colors cursor-pointer"
                        title="Retirer"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                      <p className="text-xs font-semibold text-foreground/60">
                        {(item.product.price * item.quantity).toFixed(2)} €
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="px-6 py-4 border-t border-white/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground/60">Total</span>
                <span className="text-lg font-black text-foreground">{total.toFixed(2)} €</span>
              </div>
              <button className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform cursor-pointer">
                Commander
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        @keyframes fadeSlideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
