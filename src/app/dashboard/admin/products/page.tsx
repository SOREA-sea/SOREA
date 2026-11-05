"use client";

import { useState, useEffect } from "react";

interface ProductData {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stockQuantity: number;
  imageUrl: string | null;
  isActive: boolean;
  createdAt: string;
  _count: {
    cartItems: number;
    favoriteProducts: number;
  };
}

interface AffirmationCard {
  id: string;
  title: string;
  text: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  //État pour la barre de navigation
  const [activeTab, setActiveTab] = useState<"Jeux" | "Shop" | "Coaching">("Shop");

  // États pour la gestion des affirmations de la section Vente (admin)
  const [affirmations, setAffirmations] = useState<AffirmationCard[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sorea_admin_vente_affirmations");
      if (saved) return JSON.parse(saved);
    }
    return []; // Initialement vide
  });
  const [trash, setTrash] = useState<AffirmationCard[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sorea_admin_vente_trash");
      if (saved) return JSON.parse(saved);
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem("sorea_admin_vente_affirmations", JSON.stringify(affirmations));
    localStorage.setItem("sorea_admin_vente_trash", JSON.stringify(trash));
  }, [affirmations, trash]);

  const [isAffirmationModalOpen, setIsAffirmationModalOpen] = useState(false);
  const [activeAffirmationTab, setActiveAffirmationTab] = useState<"galerie" | "corbeille">("galerie");
  const [isAddingAffirmation, setIsAddingAffirmation] = useState(false);
  const [currentAffirmationTitle, setCurrentAffirmationTitle] = useState("");
  const [currentAffirmationText, setCurrentAffirmationText] = useState("");
  const [editingAffirmationId, setEditingAffirmationId] = useState<string | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductData | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stockQuantity: "",
    imageUrl: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const res = await fetch("/api/admin/products");
      if (res.status === 401 || res.status === 403) {
        window.location.href = "/login";
        return;
      }
      if (!res.ok) throw new Error("Erreur serveur");
      const data = await res.json();
      setProducts(data.products || []);
    } catch (error) {
      setMessage({ type: "error", text: "Impossible de charger les produits" });
    } finally {
      setIsLoading(false);
    }
  }

  const resetForm = () => {
    setFormData({ name: "", description: "", price: "", stockQuantity: "", imageUrl: "" });
    setEditingProduct(null);
    setShowForm(false);
  };

  const handleSaveAffirmation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAffirmationTitle.trim() || !currentAffirmationText.trim()) return;

    if (editingAffirmationId) {
      setAffirmations(affirmations.map(item => item.id === editingAffirmationId ? { ...item, title: currentAffirmationTitle, text: currentAffirmationText } : item));
      setEditingAffirmationId(null);
    } else {
      setAffirmations([...affirmations, { id: Date.now().toString(), title: currentAffirmationTitle, text: currentAffirmationText }]);
    }

    setCurrentAffirmationTitle("");
    setCurrentAffirmationText("");
    setIsAddingAffirmation(false);
  };

  const startEditAffirmation = (card: AffirmationCard) => {
    setEditingAffirmationId(card.id);
    setCurrentAffirmationTitle(card.title || "");
    setCurrentAffirmationText(card.text);
    setIsAddingAffirmation(true);
    setActiveMenuId(null);
  };

  const sendToShop = async (card: AffirmationCard) => {
    setActiveMenuId(null);
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: card.title,
          description: card.text,
          price: 19.99,
          stockQuantity: 10,
          imageUrl: "/images/product_1.webp"
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur lors de l'envoi");

      // Sauvegarde locale pour l'onglet Boutique de la galerie d'affirmations
      const existingBoutique = JSON.parse(localStorage.getItem("sorea_affirmations_boutique") || "[]");
      if (!existingBoutique.some((item: AffirmationCard) => item.id === card.id)) {
        const updatedBoutique = [...existingBoutique, card];
        localStorage.setItem("sorea_affirmations_boutique", JSON.stringify(updatedBoutique));
        window.dispatchEvent(new Event("affirmationSentToBoutique"));
      }

      await fetchProducts();
      setIsAffirmationModalOpen(false);
      setActiveTab("Shop");
      setMessage({ type: "success", text: `"${card.title}" a été envoyé avec succès dans la Boutique !` });
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Erreur lors de l'envoi" });
    }
  };

  const deleteAffirmationCard = (id: string) => {
    const cardToDelete = affirmations.find(card => card.id === id);
    if (cardToDelete) {
      setTrash([...trash, cardToDelete]);
      setAffirmations(affirmations.filter(card => card.id !== id));
    }
    setActiveMenuId(null);
  };

  const openEditForm = (product: ProductData) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      stockQuantity: product.stockQuantity.toString(),
      imageUrl: product.imageUrl || "",
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(-1);

    try {
      if (editingProduct) {
        const res = await fetch("/api/admin/products", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: editingProduct.id, ...formData }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);

        setProducts((prev) =>
          prev.map((p) =>
            p.id === editingProduct.id
              ? {
                  ...p,
                  name: formData.name,
                  description: formData.description,
                  price: parseFloat(formData.price),
                  stockQuantity: parseInt(formData.stockQuantity) || 0,
                  imageUrl: formData.imageUrl || null,
                }
              : p
          )
        );
        setMessage({ type: "success", text: "Produit mis à jour !" });
      } else {
        const res = await fetch("/api/admin/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);

        await fetchProducts();
        setMessage({ type: "success", text: "Produit créé !" });
      }

      resetForm();
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setActionLoading(null);
    }
  };

  const toggleActive = async (productId: number, currentActive: boolean) => {
    setActionLoading(productId);
    try {
      const res = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, isActive: !currentActive }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, isActive: !currentActive } : p))
      );
      setMessage({ type: "success", text: `Produit ${!currentActive ? "activé" : "désactivé"}` });
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setActionLoading(null);
    }
  };

  const deleteProduct = async (productId: number, productName: string) => {
    if (!confirm(`Supprimer définitivement "${productName}" ?`)) return;

    setActionLoading(productId);
    try {
      const res = await fetch(`/api/admin/products?id=${productId}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setProducts((prev) => prev.filter((p) => p.id !== productId));
      setMessage({ type: "success", text: "Produit supprimé" });
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setActionLoading(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pt-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-700">
              Admin
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black section-title">Gestion des produits</h1>
          <p className="text-foreground/60 mt-2">
            {products.length} produits en catalogue.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center bg-white border border-[#8B47FF] rounded-full p-1.5 shadow-xs">
            {(["Jeux", "Shop", "Coaching"] as const).map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative px-8 py-2.5 rounded-full text-base font-medium transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "text-gray-900 font-semibold"
                      : "text-gray-700 hover:text-purple-600"
                  }`}
                >
                  {isActive && (
                    <span className="absolute inset-0 bg-[#E3D5FF] rounded-full blur-[2px] opacity-90 -z-0 transition-all duration-300" />
                  )}
                  <span className="relative z-10">{tab}</span>
                </button>
              );
            })}
          </div>

          {activeTab === "Shop" && (
            <button
              onClick={() => { resetForm(); setShowForm(!showForm); }}
              className="btn-primary flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showForm ? "M6 18L18 6M6 6l12 12" : "M12 4v16m8-8H4"} />
              </svg>
              {showForm ? "Fermer" : "Nouveau produit"}
            </button>
          )}
        </div>
      </header>

      {message && (
        <div className={`p-4 rounded-2xl text-sm font-medium ${
          message.type === "success"
            ? "bg-green-50/80 text-green-700 border border-green-200"
            : "bg-red-50/80 text-red-600 border border-red-200"
        }`}>
          {message.text}
        </div>
      )}

      {/* CONTENU CONDITIONNEL SELON L'ONGLET ACTIF */}
      {activeTab === "Jeux" && (
        <div className="flex items-center justify-center gap-[50px] py-16">
          {/* Appareil photo SVG */}
          <div className="w-40 h-40 flex items-center justify-center transition-transform hover:scale-105 duration-300">
            <img
              src="/image_Design-SOREA/Appareil_photo.svg"
              alt="Appareil photo"
              className="w-full h-full object-contain filter drop-shadow-sm"
            />
          </div>

          {/* Miroir 3D SVG cliquable */}
          <div 
            onClick={() => setIsAffirmationModalOpen(true)}
            className="w-50 h-50 flex items-center justify-center transition-transform hover:scale-105 duration-300 cursor-pointer"
            title="Personnaliser les affirmations"
          >
            <img
              src="/image_Design-SOREA/miroir.svg"
              alt="Miroir"
              className="w-full h-full object-contain filter drop-shadow-sm"
            />
          </div>

          {/* Fleur de Nénuphar PNG (Design Respiration) */}
          <div className="w-52 h-52 flex items-center justify-center transition-transform hover:scale-105 duration-300">
            <img
              src="/image_Design-SOREA/Design_Respiration.png"
              alt="Fleur de nénuphar respiration"
              className="w-full h-full object-contain filter drop-shadow-sm"
            />
          </div>
        </div>
      )}

      {/* MODALE DE GESTION DES AFFIRMATIONS (S'ouvre au clic sur le miroir) */}
      {isAffirmationModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-4xl shadow-2xl border border-purple-100 flex flex-col gap-6 relative max-h-[90vh] overflow-y-auto rounded-3xl p-8">
            
            <div className="flex items-center justify-between border-b border-purple-100 pb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Personnalise tes Affirmations</h2>
                <p className="text-xs text-foreground/60 mt-1">Clique sur une carte pour l'envoyer dans la Boutique ou la modifier.</p>
              </div>
              <button 
                onClick={() => setIsAffirmationModalOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-900 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex gap-6 text-sm border-b border-purple-100 pb-2">
              <button 
                type="button"
                onClick={() => setActiveAffirmationTab("galerie")}
                className={`font-bold pb-1 cursor-pointer transition-colors ${activeAffirmationTab === "galerie" ? "text-[#8B47FF] border-b-2 border-[#8B47FF]" : "text-gray-400 hover:text-gray-600"}`}
              >
                Vente
              </button>
              <button 
                type="button"
                onClick={() => setActiveAffirmationTab("corbeille")}
                className={`font-bold pb-1 cursor-pointer transition-colors ${activeAffirmationTab === "corbeille" ? "text-[#8B47FF] border-b-2 border-[#8B47FF]" : "text-gray-400 hover:text-gray-600"}`}
              >
                Corbeille
              </button>
            </div>

            {isAddingAffirmation && (
              <form onSubmit={handleSaveAffirmation} className="bg-purple-50/80 p-6 rounded-2xl border border-purple-200 flex flex-col gap-4">
                <h3 className="text-lg font-bold text-purple-950">
                  {editingAffirmationId ? "Modifier ton affirmation" : "Créer ta nouvelle affirmation"}
                </h3>
                <input 
                  type="text"
                  value={currentAffirmationTitle}
                  onChange={(e) => setCurrentAffirmationTitle(e.target.value)}
                  placeholder="Titre de l'affirmation (ex: Mon abondance)..."
                  className="w-full bg-white border border-purple-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#8B47FF]"
                  autoFocus
                />
                <textarea 
                  value={currentAffirmationText}
                  onChange={(e) => setCurrentAffirmationText(e.target.value)}
                  placeholder="Entrez vos affirmations..."
                  className="w-full bg-white border border-purple-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#8B47FF] h-28 resize-none whitespace-pre-line"
                />
                <div className="flex justify-end gap-3">
                  <button 
                    type="button" 
                    onClick={() => setIsAddingAffirmation(false)}
                    className="px-5 py-2 rounded-xl text-gray-600 hover:bg-gray-200 font-semibold transition-colors cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button 
                    type="submit"
                    className="bg-[#8B47FF] text-white px-6 py-2 rounded-xl font-bold shadow-md hover:bg-[#7535e6] transition-colors cursor-pointer"
                  >
                    {editingAffirmationId ? "Mettre à jour" : "Ajouter"}
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
              {activeAffirmationTab === "galerie" ? (
                <>
                  {affirmations.map((card) => (
                    <div key={card.id} className="relative">
                      <div 
                        onClick={() => setActiveMenuId(activeMenuId === card.id ? null : card.id)}
                        className="w-48 h-48 rounded-2xl bg-purple-50 border border-purple-200 p-4 flex flex-col items-center justify-center text-center shadow-sm cursor-pointer hover:bg-purple-100 transition-all relative gap-2 mx-auto"
                      >
                        <span className="text-sm font-bold text-purple-950">{card.title}</span>
                        <span className="text-xs font-medium text-purple-800 italic line-clamp-3 whitespace-pre-line text-left w-full px-2">
                          &quot;{card.text}&quot;
                        </span>
                      </div>

                      {activeMenuId === card.id && (
                        <div 
                          onClick={(e) => e.stopPropagation()}
                          className="absolute top-2 right-2 bg-white rounded-xl shadow-xl border border-purple-100 p-2 flex flex-col gap-1 z-20 w-40"
                        >
                          <button 
                            onClick={() => sendToShop(card)}
                            className="flex items-center gap-2 text-xs font-semibold text-[#8B47FF] hover:bg-purple-50 p-2 rounded-lg transition-colors text-left cursor-pointer"
                          >
                            📤 Envoyer
                          </button>
                          <button 
                            onClick={() => startEditAffirmation(card)}
                            className="flex items-center gap-2 text-xs font-semibold text-gray-700 hover:text-[#8B47FF] hover:bg-purple-50 p-2 rounded-lg transition-colors text-left cursor-pointer"
                          >
                            ✏️ Modifier
                          </button>
                          <button 
                            onClick={() => deleteAffirmationCard(card.id)}
                            className="flex items-center gap-2 text-xs font-semibold text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors text-left cursor-pointer"
                          >
                            🗑️ Supprimer
                          </button>
                        </div>
                      )}
                    </div>
                  ))}

                  <button 
                    onClick={() => { setIsAddingAffirmation(true); setEditingAffirmationId(null); setCurrentAffirmationText(""); setCurrentAffirmationTitle(""); }}
                    className="w-48 h-48 mx-auto rounded-2xl border-2 border-dashed border-purple-300 bg-[#FAF5FF] hover:bg-purple-50 transition-colors flex flex-col items-center justify-center text-purple-400 gap-2 cursor-pointer shadow-sm"
                  >
                    <span className="text-3xl">+</span>
                    <span className="text-xs font-bold">Ajouter</span>
                  </button>
                </>
              ) : (
                trash.length === 0 ? (
                  <p className="text-gray-400 text-sm py-8 italic col-span-full text-center">La corbeille est vide.</p>
                ) : (
                  trash.map((card) => (
                    <div key={card.id} className="w-48 h-48 mx-auto rounded-2xl bg-gray-50 border border-gray-200 p-4 flex items-center justify-center text-center text-sm font-medium text-gray-600 shadow-sm">
                      &quot;{card.text}&quot;
                    </div>
                  ))
                )
              )}
            </div>

          </div>
        </div>
      )}

      {activeTab === "Coaching" && (
        <div className="glass-panel rounded-3xl p-12 text-center text-foreground/60 font-medium">
          Section Coaching en cours de construction...
        </div>
      )}

      {activeTab === "Shop" && (
        <>
          {showForm && (
            <form onSubmit={handleSubmit} className="glass-panel rounded-3xl p-8 space-y-5">
              <h2 className="text-xl font-bold">
                {editingProduct ? `Modifier « ${editingProduct.name} »` : "Nouveau produit"}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium ml-1">Nom du produit *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                    className="w-full p-4 rounded-full border border-white/80 bg-white/75 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] outline-none focus:ring-2 focus:ring-purple-300 transition-all placeholder:text-gray-400 text-sm"
                    placeholder="Kit Sérénité"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium ml-1">Prix (€) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData((p) => ({ ...p, price: e.target.value }))}
                    className="w-full p-4 rounded-full border border-white/80 bg-white/75 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] outline-none focus:ring-2 focus:ring-purple-300 transition-all placeholder:text-gray-400 text-sm"
                    placeholder="29.99"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium ml-1">Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                  className="w-full p-4 rounded-full border border-white/80 bg-white/75 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] outline-none focus:ring-2 focus:ring-purple-300 transition-all placeholder:text-gray-400 text-sm"
                  placeholder="Un coffret pour ralentir et respirer..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium ml-1">Stock</label>
                  <input
                    type="number"
                    value={formData.stockQuantity}
                    onChange={(e) => setFormData((p) => ({ ...p, stockQuantity: e.target.value }))}
                    className="w-full p-4 rounded-full border border-white/80 bg-white/75 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] outline-none focus:ring-2 focus:ring-purple-300 transition-all placeholder:text-gray-400 text-sm"
                    placeholder="20"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium ml-1">URL de l'image</label>
                  <input
                    type="text"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData((p) => ({ ...p, imageUrl: e.target.value }))}
                    className="w-full p-4 rounded-full border border-white/80 bg-white/75 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] outline-none focus:ring-2 focus:ring-purple-300 transition-all placeholder:text-gray-400 text-sm"
                    placeholder="/images/product_1.webp"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn-ghost cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={actionLoading === -1}
                  className="btn-primary px-8 py-3 cursor-pointer disabled:opacity-70"
                >
                  {actionLoading === -1
                    ? "Enregistrement..."
                    : editingProduct
                      ? "Mettre à jour"
                      : "Créer le produit"}
                </button>
              </div>
            </form>
          )}

          {/* Products grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                className={`glass-panel rounded-2xl p-5 transition-all ${
                  !product.isActive ? "opacity-50" : "hover:shadow-lg"
                }`}
              >
                <div className="flex gap-4">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-white/60 shrink-0">
                    <img
                      src={product.imageUrl || "/images/product_1.webp"}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-bold text-foreground truncate">{product.name}</p>
                        <p className="text-purple-600 font-bold text-sm">{product.price} €</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                        product.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                      }`}>
                        {product.isActive ? "Actif" : "Inactif"}
                      </span>
                    </div>
                    <p className="text-foreground/50 text-xs mt-1 line-clamp-1">{product.description}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-foreground/40">
                      <span>Stock : {product.stockQuantity}</span>
                      <span>·</span>
                      <span>{product._count.cartItems} au panier</span>
                      <span>·</span>
                      <span>{product._count.favoriteProducts} favoris</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-white/20">
                  <button
                    onClick={() => openEditForm(product)}
                    className="p-2 rounded-xl hover:bg-purple-50 text-foreground/40 hover:text-purple-600 transition-colors cursor-pointer"
                    title="Modifier"
                  >
                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => toggleActive(product.id, product.isActive)}
                    disabled={actionLoading === product.id}
                    className={`p-2 rounded-xl transition-colors cursor-pointer ${
                      product.isActive
                        ? "hover:bg-yellow-50 text-yellow-600"
                        : "hover:bg-green-50 text-green-600"
                    }`}
                    title={product.isActive ? "Désactiver" : "Activer"}
                  >
                    {product.isActive ? (
                      <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                  <button
                    onClick={() => deleteProduct(product.id, product.name)}
                    disabled={actionLoading === product.id}
                    className="p-2 rounded-xl hover:bg-red-50 text-foreground/40 hover:text-red-500 transition-colors cursor-pointer"
                    title="Supprimer"
                  >
                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {products.length === 0 && (
            <div className="glass-panel rounded-3xl p-10 text-center">
              <p className="text-foreground/60 font-medium">Aucun produit dans le catalogue</p>
              <button
                onClick={() => setShowForm(true)}
                className="btn-primary mt-4 inline-block cursor-pointer"
              >
                Ajouter le premier produit
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}