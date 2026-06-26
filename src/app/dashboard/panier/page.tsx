"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Exemple de type pour les articles du panier (Coaching ou Boutique)
interface CartItem {
  id: string;
  name: string;
  price: number;
  type: "coaching" | "product";
  quantity: number;
  date?: string; // Optionnel : pour les séances de coaching
}

export default function CartPage() {
  const router = useRouter();
  
  // État local pour simuler le panier (à lier avec votre Context, Redux ou LocalStorage)
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Calcul du total
  const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleRemoveItem = (id: string) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-foreground mb-8">Mon Panier</h1>

      {cartItems.length === 0 ? (
        /* ─── ÉTAT PANIER VIDE ─── */
        <div className="text-center py-16 glass-panel rounded-3xl p-8 border border-white/20 bg-white/40 shadow-sm">
          <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          
          <h2 className="text-xl font-bold text-foreground">Votre panier est vide</h2>
          <p className="text-foreground/50 mt-2 max-w-md mx-auto text-sm">
            Vous n'avez pas encore sélectionné de séance de coaching ni d'objet dans la boutique.
          </p>
          
          {/* Groupe de boutons d'action avec le même design identique */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <Link 
              href="/coaching" 
              className="w-full sm:w-auto px-6 py-3 bg-purple-600 text-white font-medium rounded-2xl hover:bg-purple-700 shadow-md transition-all duration-200 text-center"
            >
              Découvrir les séances
            </Link>
            
            <Link 
              href="/shop" 
              className="w-full sm:w-auto px-6 py-3 bg-purple-600 text-white font-medium rounded-2xl hover:bg-purple-700 shadow-md transition-all duration-200 text-center"
            >
              Visiter la boutique
            </Link>
          </div>
        </div>
      ) : (
        /* ─── ÉTAT PANIER PLEIN ─── */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Liste des produits */}
          <div className="md:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div 
                key={item.id} 
                className="flex items-center justify-between p-4 glass-panel rounded-2xl bg-white/60 border border-white/20 shadow-sm"
              >
                <div>
                  <h3 className="font-bold text-foreground">{item.name}</h3>
                  <p className="text-xs text-foreground/50 capitalize">
                    {item.type === "coaching" ? `Coaching • ${item.date}` : "Boutique"}
                  </p>
                  <p className="text-sm font-semibold text-purple-600 mt-1">{item.price} €</p>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className="text-sm text-foreground/60">Qté: {item.quantity}</span>
                  <button 
                    onClick={() => handleRemoveItem(item.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    title="Supprimer"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Résumé du paiement */}
          <div className="p-6 glass-panel rounded-3xl bg-white/80 border border-white/20 shadow-sm h-fit">
            <h2 className="text-lg font-bold text-foreground mb-4">Résumé</h2>
            <div className="flex justify-between border-b border-gray-100 pb-4 mb-4 text-sm text-foreground/70">
              <span>Sous-total</span>
              <span>{totalAmount} €</span>
            </div>
            <div className="flex justify-between font-bold text-base text-foreground mb-6">
              <span>Total</span>
              <span className="text-purple-600">{totalAmount} €</span>
            </div>
            <button className="w-full py-3 bg-purple-600 text-white font-medium rounded-2xl hover:bg-purple-700 shadow-md transition-all">
              Passer au paiement
            </button>
          </div>
        </div>
      )}
    </div>
  );
}