"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, X } from "lucide-react";
import { createAffirmationAction, createVisualisationAction } from "./actions";

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
  price?: number;
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

  // États pour la gestion des visualisations de la section Vente (Appareil photo)
  const [visualisationCards, setVisualisationCards] = useState<any[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sorea_admin_vente_visualisations");
      if (saved) return JSON.parse(saved);
    }
    return [];
  });
  const [visualisationTrash, setVisualisationTrash] = useState<any[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sorea_admin_vente_visualisation_trash");
      if (saved) return JSON.parse(saved);
    }
    return [];
  });

  // États pour la corbeille de produits du Shop
  const [productTrash, setProductTrash] = useState<ProductData[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sorea_admin_product_trash");
      if (saved) return JSON.parse(saved);
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem("sorea_admin_product_trash", JSON.stringify(productTrash));
  }, [productTrash]);

  useEffect(() => {
    localStorage.setItem("sorea_admin_vente_affirmations", JSON.stringify(affirmations));
    localStorage.setItem("sorea_admin_vente_trash", JSON.stringify(trash));
    localStorage.setItem("sorea_admin_vente_visualisations", JSON.stringify(visualisationCards));
    localStorage.setItem("sorea_admin_vente_visualisation_trash", JSON.stringify(visualisationTrash));
  }, [affirmations, trash, visualisationCards, visualisationTrash]);

  const [isVisualisationModalOpen, setIsVisualisationModalOpen] = useState(false);
  const [activeVisualisationTab, setActiveVisualisationTab] = useState<"galerie" | "corbeille">("galerie");
  const [isAddingVisualisation, setIsAddingVisualisation] = useState(false);
  const [currentVisTitle, setCurrentVisTitle] = useState("");
  const [currentVisImages, setCurrentVisImages] = useState<any[]>([]);
  const [currentVisPrice, setCurrentVisPrice] = useState("0.95");
  const [currentVisDescription, setCurrentVisDescription] = useState("");
  const [editingVisId, setEditingVisId] = useState<string | null>(null);
  const [activeVisMenuId, setActiveVisMenuId] = useState<string | null>(null);

  // États pour l'ajustement / rognage des images
  const [isAdjustMode, setIsAdjustMode] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [cropScale, setCropScale] = useState(1);
  const [cropPos, setCropPos] = useState({ x: 0, y: 0 });
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  const [draggedImageIndex, setDraggedImageIndex] = useState<number | null>(null);
  const [dragOverImageIndex, setDragOverImageIndex] = useState<number | null>(null);

  const visFileInputRef = useRef<HTMLInputElement>(null);

  // Fonction d'importation d'images
  const handleVisFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages = Array.from(e.target.files).map((file) => ({
        url: URL.createObjectURL(file),
      }));
      setCurrentVisImages((prev) => [...prev, ...newImages]);
      e.target.value = "";
    }
  };

  const removeImageFromVisPellicule = (index: number) => {
    setCurrentVisImages(currentVisImages.filter((_, i) => i !== index));
  };

  const handleSaveVisualisation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentVisTitle.trim()) return;

    const priceNum = parseFloat(currentVisPrice);
    if (isNaN(priceNum) || priceNum < 0.50) {
      alert("Le prix minimum est de 0,50 €");
      return;
    }

    const finalImages = currentVisImages;

    if (editingVisId) {
      setVisualisationCards(
        visualisationCards.map((item) =>
          item.id === editingVisId
            ? { ...item, title: currentVisTitle, images: finalImages, price: priceNum, description: currentVisDescription }
            : item
        )
      );
      setEditingVisId(null);
    } else {
      setVisualisationCards([
        ...visualisationCards,
        {
          id: Date.now().toString(),
          title: currentVisTitle,
          images: finalImages,
          price: priceNum,
          description: currentVisDescription,
        },
      ]);
    }

    setCurrentVisTitle("");
    setCurrentVisImages([]);
    setCurrentVisPrice("0.95");
    setCurrentVisDescription("");
    setIsAddingVisualisation(false);
  };

  const startDuplicateVisualisation = (card: any) => {
    setEditingVisId(null); // Force la création d'un nouvel élément
    setCurrentVisTitle(`${card.title || ""} (Copie)`);
    setCurrentVisImages(card.images || []);
    setCurrentVisPrice(card.price ? card.price.toString() : "0.95");
    setCurrentVisDescription(card.description || "");
    setIsAddingVisualisation(true);
    setActiveVisMenuId(null);
  };

  const sendVisualisationToShop = async (card: any) => {
    setActiveVisMenuId(null);
    try {
      const result = await createVisualisationAction({
        title: card.title,
        description: card.description || "",
        price: card.price || 0.95,
      });

      if (!result.success) {
        throw new Error(result.error || "Erreur lors de l'enregistrement en base");
      }

      const existingBoutique = JSON.parse(localStorage.getItem("sorea_visualisation_boutique") || "[]");
      const productWithDbId = { ...card, id: String(result.product.id) };

      if (!existingBoutique.some((item: any) => item.id === productWithDbId.id)) {
        const updatedBoutique = [...existingBoutique, productWithDbId];
        localStorage.setItem("sorea_visualisation_boutique", JSON.stringify(updatedBoutique));
        window.dispatchEvent(new Event("visualisationSentToBoutique"));
      }

      setIsVisualisationModalOpen(false);
      setMessage({ type: "success", text: `"${card.title}" a été envoyé et enregistré dans GameProduct avec succès !` });
      setTimeout(() => setMessage(null), 3000);
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Erreur lors de l'envoi" });
    }
  };

  const deleteVisualisationCard = (id: string) => {
    const cardToDelete = visualisationCards.find(card => card.id === id);
    if (cardToDelete) {
      setVisualisationTrash([...visualisationTrash, cardToDelete]);
      setVisualisationCards(visualisationCards.filter(card => card.id !== id));

      const existingBoutique = JSON.parse(localStorage.getItem("sorea_visualisation_boutique") || "[]");
      const updatedBoutique = existingBoutique.filter((item: any) => item.id !== id);
      localStorage.setItem("sorea_visualisation_boutique", JSON.stringify(updatedBoutique));
      window.dispatchEvent(new Event("visualisationSentToBoutique"));
    }
    setActiveVisMenuId(null);
  };

  const restoreVisualisationCard = (id: string) => {
    const cardToRestore = visualisationTrash.find(card => card.id === id);
    if (cardToRestore) {
      setVisualisationCards([...visualisationCards, cardToRestore]);
      setVisualisationTrash(visualisationTrash.filter(card => card.id !== id));
    }
    setActiveVisMenuId(null);
  };

  const permanentDeleteVisualisationCard = (id: string) => {
    setVisualisationTrash(visualisationTrash.filter(card => card.id !== id));
    setActiveVisMenuId(null);
  };
  
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

  const [isAffirmationModalOpen, setIsAffirmationModalOpen] = useState(false);
  const [activeAffirmationTab, setActiveAffirmationTab] = useState<"galerie" | "corbeille">("galerie");
  const [activeShopTab, setActiveShopTab] = useState<"galerie" | "corbeille">("galerie");
  const [isAddingAffirmation, setIsAddingAffirmation] = useState(false);
  const [currentAffirmationTitle, setCurrentAffirmationTitle] = useState("");
  const [currentAffirmationText, setCurrentAffirmationText] = useState("");
  const [currentAffirmationPrice, setCurrentAffirmationPrice] = useState("0.95");
  const [editingAffirmationId, setEditingAffirmationId] = useState<string | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const handleSaveAffirmation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAffirmationTitle.trim() || !currentAffirmationText.trim()) return;

    const priceNum = parseFloat(currentAffirmationPrice);
    if (isNaN(priceNum) || priceNum < 0.50) {
      alert("Le prix minimum est de 0,50 €");
      return;
    }

    if (editingAffirmationId) {
      setAffirmations(affirmations.map(item => item.id === editingAffirmationId ? { ...item, title: currentAffirmationTitle, text: currentAffirmationText, price: priceNum } : item));
      setEditingAffirmationId(null);
    } else {
      setAffirmations([...affirmations, { id: Date.now().toString(), title: currentAffirmationTitle, text: currentAffirmationText, price: priceNum }]);
    }

    setCurrentAffirmationTitle("");
    setCurrentAffirmationText("");
    setCurrentAffirmationPrice("0.95");
    setIsAddingAffirmation(false);
  };

  const startDuplicateAffirmation = (card: AffirmationCard) => {
    setEditingAffirmationId(null); // Force la création d'un nouvel élément
    setCurrentAffirmationTitle(`${card.title || ""} (Copie)`);
    setCurrentAffirmationText(card.text);
    setCurrentAffirmationPrice(card.price ? card.price.toString() : "0.95");
    setIsAddingAffirmation(true);
    setActiveMenuId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      
      const newValue = currentAffirmationText.substring(0, start) + "\n✓ " + currentAffirmationText.substring(end);
      setCurrentAffirmationText(newValue);

      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 3;
        target.scrollTop = target.scrollHeight;
      }, 0);
    }
  };

  const sendToShop = async (card: AffirmationCard) => {
    setActiveMenuId(null);
    try {
      // 1. Enregistrement en base de données dans la table GameProduct
      const result = await createAffirmationAction({
        title: card.title,
        text: card.text,
        price: card.price || 0.95,
      });

      if (!result.success) {
        throw new Error(result.error || "Erreur lors de l'enregistrement en base");
      }

      // 2. Synchronisation avec l'ID réel de la base de données dans le localStorage
      const existingBoutique = JSON.parse(localStorage.getItem("sorea_affirmations_boutique") || "[]");
      const productWithDbId = { ...card, id: String(result.product.id) };

      if (!existingBoutique.some((item: AffirmationCard) => item.id === productWithDbId.id)) {
        const updatedBoutique = [...existingBoutique, productWithDbId];
        localStorage.setItem("sorea_affirmations_boutique", JSON.stringify(updatedBoutique));
        window.dispatchEvent(new Event("affirmationSentToBoutique"));
      }

      setIsAffirmationModalOpen(false);
      setMessage({ type: "success", text: `"${card.title}" a été envoyé et enregistré dans GameProduct avec succès !` });
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

      const existingBoutique = JSON.parse(localStorage.getItem("sorea_affirmations_boutique") || "[]");
      const updatedBoutique = existingBoutique.filter((item: AffirmationCard) => item.id !== id);
      localStorage.setItem("sorea_affirmations_boutique", JSON.stringify(updatedBoutique));
      window.dispatchEvent(new Event("affirmationSentToBoutique"));
    }
    setActiveMenuId(null);
  };

  const restoreAffirmationCard = (id: string) => {
    const cardToRestore = trash.find(card => card.id === id);
    if (cardToRestore) {
      setAffirmations([...affirmations, cardToRestore]);
      setTrash(trash.filter(card => card.id !== id));
    }
    setActiveMenuId(null);
  };

  const permanentDeleteAffirmationCard = (id: string) => {
    setTrash(trash.filter(card => card.id !== id));
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
    const productToTrash = products.find(p => p.id === productId);
    if (productToTrash) {
      setProductTrash([...productTrash, productToTrash]);
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      setMessage({ type: "success", text: `"${productName}" a été déplacé dans la corbeille` });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const restoreProduct = (productId: number) => {
    const productToRestore = productTrash.find(p => p.id === productId);
    if (productToRestore) {
      setProducts([...products, productToRestore]);
      setProductTrash(productTrash.filter(p => p.id !== productId));
      setMessage({ type: "success", text: "Produit restauré avec succès" });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const permanentDeleteProduct = async (productId: number, productName: string) => {
    if (!confirm(`Supprimer définitivement "${productName}" ?`)) return;

    setActionLoading(productId);
    try {
      const res = await fetch(`/api/admin/products?id=${productId}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setProductTrash((prev) => prev.filter((p) => p.id !== productId));
      setMessage({ type: "success", text: "Produit supprimé définitivement" });
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
          {/* Appareil photo SVG cliquable */}
          <div 
            onClick={() => setIsVisualisationModalOpen(true)}
            className="w-40 h-40 flex items-center justify-center transition-transform hover:scale-105 duration-300 cursor-pointer"
            title="Personnaliser les visualisations"
          >
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-bold text-gray-900">Créer ta nouvelle affirmation</label>
                    <input 
                      type="text"
                      value={currentAffirmationTitle}
                      onChange={(e) => setCurrentAffirmationTitle(e.target.value)}
                      placeholder="Titre de l'affirmaton (ex: Mon abondance)..."
                      className="w-full bg-white border border-purple-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#8B47FF]"
                      autoFocus
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-bold text-gray-900">Donne un prix</label>
                    <div className="relative flex items-center">
                      <input 
                        type="number"
                        step="0.01"
                        min="0.50"
                        required
                        value={currentAffirmationPrice}
                        onChange={(e) => setCurrentAffirmationPrice(e.target.value)}
                        placeholder="Prix de l'affirmation (ex: 0.95)"
                        className="w-full bg-white border border-purple-200 rounded-xl px-4 py-3 pr-10 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#8B47FF]"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-bold text-gray-900">Entrez vos affirmations</label>
                    <textarea 
                      value={currentAffirmationText}
                      onFocus={() => { if (!currentAffirmationText) setCurrentAffirmationText("✓ "); }}
                      onKeyDown={handleKeyDown}
                      onChange={(e) => setCurrentAffirmationText(e.target.value)}
                      placeholder="J'avance vers ce qui me tiens à coeur..."
                      className="w-full bg-white border border-purple-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#8B47FF] h-28 resize-none whitespace-pre-line overflow-y-auto"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-bold text-gray-900">Entrez une description</label>
                    <textarea 
                      placeholder="Adopte un meilleur enthousiasme pour ton quotidien..."
                      className="w-full bg-white border border-purple-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#8B47FF] h-28 resize-none whitespace-pre-line overflow-y-auto"
                    />
                  </div>
                </div>

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
                        className="w-48 h-48 rounded-2xl bg-purple-50 border border-purple-200 p-4 flex flex-col items-center justify-between text-center shadow-sm cursor-pointer hover:bg-purple-100 transition-all relative mx-auto"
                      >
                        <div className="w-full"></div>
                        <div className="flex flex-col items-center justify-center gap-1">
                          <span className="text-sm font-bold text-purple-950">{card.title}</span>
                          <span className="text-xs font-medium text-purple-800 italic line-clamp-3 whitespace-pre-line text-left w-full px-2">
                            &quot;{card.text}&quot;
                          </span>
                        </div>
                        <div className="w-full flex justify-end">
                          <span className="text-xs font-semibold" style={{ color: "#7F6674" }}>
                            {card.price ? card.price.toFixed(2) : "0.95"}€
                          </span>
                        </div>
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
                            onClick={() => startDuplicateAffirmation(card)}
                            className="flex items-center gap-2 text-xs font-semibold text-gray-700 hover:text-[#8B47FF] hover:bg-purple-50 p-2 rounded-lg transition-colors text-left cursor-pointer"
                          >
                            📋 Dupliquer
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
                    <div key={card.id} className="relative">
                      <div 
                        onClick={() => setActiveMenuId(activeMenuId === card.id ? null : card.id)}
                        className="w-48 h-48 mx-auto rounded-2xl bg-gray-50 border border-gray-200 p-4 flex items-center justify-center text-center text-sm font-medium text-gray-600 shadow-sm cursor-pointer hover:bg-gray-100 transition-all relative"
                      >
                        &quot;{card.text}&quot;
                      </div>

                      {activeMenuId === card.id && (
                        <div 
                          onClick={(e) => e.stopPropagation()}
                          className="absolute top-2 right-2 bg-white rounded-xl shadow-xl border border-gray-200 p-2 flex flex-col gap-1 z-20 w-40"
                        >
                          <button 
                            onClick={() => restoreAffirmationCard(card.id)}
                            className="flex items-center gap-2 text-xs font-semibold text-purple-700 hover:bg-purple-50 p-2 rounded-lg transition-colors text-left cursor-pointer"
                          >
                            Restaurer
                          </button>
                          <button 
                            onClick={() => permanentDeleteAffirmationCard(card.id)}
                            className="flex items-center gap-2 text-xs font-semibold text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors text-left cursor-pointer"
                          >
                            🗑️ Supprimer définitivement
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )
              )}
            </div>

          </div>
        </div>
      )}

      {/* MODALE DE GESTION DES VISUALISATIONS (S'ouvre au clic sur l'appareil photo) */}
      {isVisualisationModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-4xl shadow-2xl border border-purple-100 flex flex-col gap-6 relative max-h-[90vh] overflow-y-auto rounded-3xl p-8">
            
            <div className="flex items-center justify-between border-b border-purple-100 pb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Personnalise tes Pellicules de Visualisation</h2>
                <p className="text-xs text-foreground/60 mt-1">Clique sur une pellicule pour l'envoyer dans la Boutique ou la modifier.</p>
              </div>
              <button 
                onClick={() => setIsVisualisationModalOpen(false)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-900 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex gap-6 text-sm border-b border-purple-100 pb-2">
              <button 
                type="button"
                onClick={() => setActiveVisualisationTab("galerie")}
                className={`font-bold pb-1 cursor-pointer transition-colors ${activeVisualisationTab === "galerie" ? "text-[#8B47FF] border-b-2 border-[#8B47FF]" : "text-gray-400 hover:text-gray-600"}`}
              >
                Vente
              </button>
              <button 
                type="button"
                onClick={() => setActiveVisualisationTab("corbeille")}
                className={`font-bold pb-1 cursor-pointer transition-colors ${activeVisualisationTab === "corbeille" ? "text-[#8B47FF] border-b-2 border-[#8B47FF]" : "text-gray-400 hover:text-gray-600"}`}
              >
                Corbeille
              </button>
            </div>

            {isAddingVisualisation && (
              <div className="px-8 mt-2">
                <input
                  type="file"
                  ref={visFileInputRef}
                  onChange={handleVisFileUpload}
                  accept="image/*"
                  multiple
                  className="hidden"
                />

                <form onSubmit={handleSaveVisualisation} className="bg-purple-50/80 p-6 rounded-2xl border border-purple-200 flex flex-col gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-bold text-gray-900">Titre de la pellicule</label>
                      <input 
                        type="text"
                        value={currentVisTitle}
                        onChange={(e) => setCurrentVisTitle(e.target.value)}
                        placeholder="Titre de la pellicule (ex: Voyage de rêve)..."
                        className="w-full bg-white border border-purple-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#8B47FF]"
                        autoFocus
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-bold text-gray-900">Donne un prix (€)</label>
                      <input 
                        type="number"
                        step="0.01"
                        min="0.50"
                        required
                        value={currentVisPrice}
                        onChange={(e) => setCurrentVisPrice(e.target.value)}
                        placeholder="Prix (ex: 0.95)"
                        className="w-full bg-white border border-purple-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#8B47FF]"
                      />
                    </div>
                  </div>

                  {/* Boutons Insérer et Ajuster */}
                  <div className={`flex items-center gap-3 ${isAdjustMode ? "z-40" : ""}`}>
                    <button
                      type="button"
                      onClick={() => visFileInputRef.current?.click()}
                      className="flex items-center gap-2 bg-white border border-purple-300 text-purple-900 font-semibold px-4 py-2.5 rounded-xl hover:bg-purple-100/50 transition-colors cursor-pointer text-sm"
                    >
                      <Plus size={18} />
                      Insérer une image
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsAdjustMode(!isAdjustMode);
                        setSelectedImageIndex(null);
                        setCropScale(1);
                      }}
                      className={`flex items-center gap-2 border font-semibold px-4 py-2.5 rounded-xl transition-colors cursor-pointer text-sm ${
                        isAdjustMode
                          ? "bg-[#8B47FF] text-white border-[#8B47FF]"
                          : "bg-white border-purple-300 text-purple-900 hover:bg-purple-100/50"
                      }`}
                    >
                      Ajuster
                    </button>
                  </div>

                  {/* Zone de description inspirée des affirmations */}
                  <div className="flex flex-col gap-1.5 mt-2">
                    <label className="text-sm font-bold text-gray-900">Entrez une description</label>
                    <textarea 
                      value={currentVisDescription}
                      onChange={(e) => setCurrentVisDescription(e.target.value)}
                      placeholder="Adopte un meilleur enthousiasme pour ton quotidien..."
                      className="w-full bg-white border border-purple-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#8B47FF] h-28 resize-none whitespace-pre-line overflow-y-auto"
                    />
                  </div>

                  {/* Aperçu des images avec gestion du mode ajustement */}
                  {currentVisImages.length > 0 && (
                    <div className="relative">
                      {isAdjustMode && (
                        <div className="absolute inset-[-12px] bg-gray-900/30 backdrop-blur-[1px] z-30 rounded-2xl pointer-events-none transition-all" />
                      )}

                      <div className={`flex gap-3 overflow-x-auto py-2 relative ${isAdjustMode ? "z-40" : ""}`}>
                        {currentVisImages.map((img, idx) => (
                          <div
                            key={idx}
                            draggable={!isAdjustMode}
                            onClick={() => {
                              if (isAdjustMode) {
                                setSelectedImageIndex(idx);
                                setCropScale(1);
                              }
                            }}
                            onDragStart={() => setDraggedImageIndex(idx)}
                            onDragOver={(e) => {
                              e.preventDefault();
                              setDragOverImageIndex(idx);
                            }}
                            onDrop={() => {
                              if (draggedImageIndex === null || draggedImageIndex === idx) return;
                              const updatedImages = [...currentVisImages];
                              const [movedImage] = updatedImages.splice(draggedImageIndex, 1);
                              updatedImages.splice(idx, 0, movedImage);
                              setCurrentVisImages(updatedImages);
                              setDraggedImageIndex(null);
                              setDragOverImageIndex(null);
                            }}
                            onDragEnd={() => {
                              setDraggedImageIndex(null);
                              setDragOverImageIndex(null);
                            }}
                            className={`relative flex items-center shrink-0 ${isAdjustMode ? "cursor-pointer ring-2 ring-[#8B47FF] rounded-xl" : ""}`}
                          >
                            {!isAdjustMode && dragOverImageIndex === idx && (
                              <div className="w-1 h-20 bg-[#7F4DC5] rounded-full mr-2 transition-all animate-pulse" />
                            )}

                            <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-purple-200 cursor-grab active:cursor-grabbing group bg-purple-50/50 flex items-center justify-center">
                              <img
                                src={typeof img === "string" ? img : img.url}
                                alt="Aperçu"
                                className="w-full h-full object-contain pointer-events-none"
                                style={
                                  typeof img !== "string" && img.transform
                                    ? {
                                        transform: `translate(${img.transform.x}px, ${img.transform.y}px) scale(${img.transform.scale})`,
                                      }
                                    : undefined
                                }
                              />
                              {!isAdjustMode && (
                                <button
                                  type="button"
                                  onClick={() => removeImageFromVisPellicule(idx)}
                                  className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 cursor-pointer"
                                >
                                  <X size={12} />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Modale plein écran de rognage */}
                  {selectedImageIndex !== null && currentVisImages[selectedImageIndex] && (
                    <div className="fixed inset-0 z-[200000] bg-[#212121] backdrop-blur-md flex items-center justify-center animate-fade-in select-none">
                      <h3 className="absolute top-[3vh] left-[3vw] text-white text-lg font-medium tracking-wide z-[100000]">
                        Rognage & Ajustement (Format Plein Écran)
                      </h3>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedImageIndex(null);
                          setCropScale(1);
                          setCropPos({ x: 0, y: 0 });
                        }}
                        className="absolute top-[3vh] right-[3vw] text-white hover:text-purple-300 p-[1.2vh] rounded-full bg-black/20 hover:bg-black/40 transition-all cursor-pointer z-[100000] flex items-center justify-center"
                        title="Quitter (Échap)"
                      >
                        <X className="w-[4vh] h-[4vh]" />
                      </button>

                      <div className="flex items-center justify-center w-full h-full px-6">
                        <div className="w-[115vw] h-[105vh] max-w-[125vh] max-h-[110vw] overflow-hidden relative drop-shadow-2xl flex items-center justify-center">  
                          <div className="w-full h-full relative flex items-center justify-center z-20">
                            <img
                              src="/image_Design-SOREA/Pellicule.svg"
                              alt="Cadre Pellicule Plein Écran"
                              className="absolute inset-0 w-full h-full object-contain z-10 pointer-events-none"
                            />
                            <div className="relative z-20 w-[62%] h-[75%] border-2 border-dashed border-white/80 overflow-hidden flex items-center justify-center bg-black/20">
                              <img
                                src={typeof currentVisImages[selectedImageIndex] === "string" ? currentVisImages[selectedImageIndex] : currentVisImages[selectedImageIndex].url}
                                alt="Ajustement"
                                draggable={false}
                                onMouseDown={(e) => {
                                  setIsDraggingImage(true);
                                  setDragStartPos({ x: e.clientX - cropPos.x, y: e.clientY - cropPos.y });
                                }}
                                onMouseMove={(e) => {
                                  if (!isDraggingImage) return;
                                  setCropPos({
                                    x: e.clientX - dragStartPos.x,
                                    y: e.clientY - dragStartPos.y,
                                  });
                                }}
                                onMouseUp={() => setIsDraggingImage(false)}
                                onMouseLeave={() => setIsDraggingImage(false)}
                                className="w-full h-full object-contain transition-transform select-none cursor-grab active:cursor-grabbing"
                                style={{
                                  transform: `translate(${cropPos.x}px, ${cropPos.y}px) scale(${cropScale})`,
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="absolute bottom-[4vh] w-full max-w-3xl bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex items-center gap-6 shadow-2xl z-[100000]">
                        <span className="text-sm font-medium text-white whitespace-nowrap">
                          Échelle (Zoom) :
                        </span>
                        <input
                          type="range"
                          min="1"
                          max="3"
                          step="0.05"
                          value={cropScale}
                          onChange={(e) => setCropScale(parseFloat(e.target.value))}
                          className="flex-1 accent-[#8B47FF] cursor-pointer h-2 bg-white/20 rounded-lg appearance-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (selectedImageIndex !== null) {
                              const updated = [...currentVisImages];
                              const currentImgObj = updated[selectedImageIndex];
                              const urlStr = typeof currentImgObj === "string" ? currentImgObj : currentImgObj.url;
                              
                              updated[selectedImageIndex] = {
                                url: urlStr,
                                transform: { scale: cropScale, x: cropPos.x, y: cropPos.y },
                              };
                              setCurrentVisImages(updated);
                            }
                            setSelectedImageIndex(null);
                            setIsAdjustMode(false);
                            setCropScale(1);
                            setCropPos({ x: 0, y: 0 });
                          }}
                          className="bg-[#8B47FF] text-white font-bold px-8 py-3 rounded-xl shadow-lg hover:bg-[#7535e6] transition-all cursor-pointer text-sm"
                        >
                          Valider
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end gap-3 mt-2">
                    <button 
                      type="button" 
                      onClick={() => setIsAddingVisualisation(false)}
                      className="px-5 py-2 rounded-xl text-gray-600 hover:bg-gray-200 font-semibold transition-colors cursor-pointer"
                    >
                      Annuler
                    </button>
                    <button 
                      type="submit"
                      className="bg-[#8B47FF] text-white px-6 py-2 rounded-xl font-bold shadow-md hover:bg-[#7535e6] transition-colors cursor-pointer"
                    >
                      {editingVisId ? "Mettre à jour" : "Ajouter"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
              {activeVisualisationTab === "galerie" ? (
                <>
                  {visualisationCards.map((card) => (
                    <div key={card.id} className="relative">
                      <div 
                        onClick={() => setActiveVisMenuId(activeVisMenuId === card.id ? null : card.id)}
                        className="relative w-48 h-56 flex flex-col items-center justify-start cursor-pointer hover:scale-105 transition-transform group mx-auto"
                      >
                        {/* Titre au-dessus de la pellicule */}
                        <div className="flex items-center justify-center gap-1.5 mb-2 z-10">
                          <span className="text-sm font-bold text-purple-950 text-center">
                            {card.title}
                          </span>
                        </div>

                        {/* Conteneur avec l'image SVG de Pellicule et l'aperçu */}
                        <div className="relative w-full h-44 flex items-center justify-center">
                          <img
                            src="/image_Design-SOREA/Pellicule.svg"
                            alt="Pellicule support"
                            className="absolute inset-0 w-full h-full object-contain z-10 drop-shadow-md"
                          />
                          <div className="relative z-20 w-[60%] h-[68%] overflow-hidden flex items-center justify-center">
                            {card.images && card.images.length > 0 ? (
                              <img
                                src={typeof card.images[0] === "string" ? card.images[0] : card.images[0].url}
                                alt={card.title}
                                className="w-full h-full object-contain"
                                style={
                                  typeof card.images[0] !== "string" && card.images[0]?.transform
                                    ? {
                                        transform: `translate(${card.images[0].transform.x}px, ${card.images[0].transform.y}px) scale(${card.images[0].transform.scale})`,
                                      }
                                    : undefined
                                }
                              />
                            ) : (
                              <div className="w-full h-full bg-purple-100/60 flex items-center justify-center text-[10px] text-purple-400 font-semibold">
                                Vide
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="w-full flex justify-end mt-1 px-2">
                          <span className="text-xs font-semibold" style={{ color: "#7F6674" }}>
                            {card.price ? card.price.toFixed(2) : "0.95"}€
                          </span>
                        </div>
                      </div>

                      {activeVisMenuId === card.id && (
                        <div 
                          onClick={(e) => e.stopPropagation()}
                          className="absolute top-2 right-2 bg-white rounded-xl shadow-xl border border-purple-100 p-2 flex flex-col gap-1 z-20 w-40"
                        >
                          <button 
                            onClick={() => sendVisualisationToShop(card)}
                            className="flex items-center gap-2 text-xs font-semibold text-[#8B47FF] hover:bg-purple-50 p-2 rounded-lg transition-colors text-left cursor-pointer"
                          >
                            📤 Envoyer
                          </button>
                          <button 
                            onClick={() => startDuplicateVisualisation(card)}
                            className="flex items-center gap-2 text-xs font-semibold text-gray-700 hover:text-[#8B47FF] hover:bg-purple-50 p-2 rounded-lg transition-colors text-left cursor-pointer"
                          >
                            📋 Dupliquer
                          </button>
                          <button 
                            onClick={() => deleteVisualisationCard(card.id)}
                            className="flex items-center gap-2 text-xs font-semibold text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors text-left cursor-pointer"
                          >
                            🗑️ Supprimer
                          </button>
                        </div>
                      )}
                    </div>
                  ))}

                  <button 
                    onClick={() => { setIsAddingVisualisation(true); setEditingVisId(null); setCurrentVisTitle(""); setCurrentVisPrice("0.95"); }}
                    className="w-48 h-48 mx-auto rounded-2xl border-2 border-dashed border-purple-300 bg-[#FAF5FF] hover:bg-purple-50 transition-colors flex flex-col items-center justify-center text-purple-400 gap-2 cursor-pointer shadow-sm"
                  >
                    <span className="text-3xl">+</span>
                    <span className="text-xs font-bold">Ajouter</span>
                  </button>
                </>
              ) : (
                visualisationTrash.length === 0 ? (
                  <p className="text-gray-400 text-sm py-8 italic col-span-full text-center">La corbeille est vide.</p>
                ) : (
                  visualisationTrash.map((card) => (
                    <div key={card.id} className="relative">
                      <div 
                        onClick={() => setActiveVisMenuId(activeVisMenuId === card.id ? null : card.id)}
                        className="w-48 h-48 mx-auto rounded-2xl bg-gray-50 border border-gray-200 p-4 flex items-center justify-center text-center text-sm font-medium text-gray-600 shadow-sm cursor-pointer hover:bg-gray-100 transition-all relative"
                      >
                        {card.title}
                      </div>

                      {activeVisMenuId === card.id && (
                        <div 
                          onClick={(e) => e.stopPropagation()}
                          className="absolute top-2 right-2 bg-white rounded-xl shadow-xl border border-gray-200 p-2 flex flex-col gap-1 z-20 w-40"
                        >
                          <button 
                            onClick={() => restoreVisualisationCard(card.id)}
                            className="flex items-center gap-2 text-xs font-semibold text-purple-700 hover:bg-purple-50 p-2 rounded-lg transition-colors text-left cursor-pointer"
                          >
                            Restaurer
                          </button>
                          <button 
                            onClick={() => permanentDeleteVisualisationCard(card.id)}
                            className="flex items-center gap-2 text-xs font-semibold text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors text-left cursor-pointer"
                          >
                            🗑️ Supprimer définitivement
                          </button>
                        </div>
                      )}
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
          <div className="flex gap-6 text-sm border-b border-purple-100 pb-2 mb-6">
            <button 
              type="button"
              onClick={() => setActiveShopTab("galerie")}
              className={`font-bold pb-1 cursor-pointer transition-colors ${activeShopTab === "galerie" ? "text-[#8B47FF] border-b-2 border-[#8B47FF]" : "text-gray-400 hover:text-gray-600"}`}
            >
              Catalogue ({products.length})
            </button>
            <button 
              type="button"
              onClick={() => setActiveShopTab("corbeille")}
              className={`font-bold pb-1 cursor-pointer transition-colors ${activeShopTab === "corbeille" ? "text-[#8B47FF] border-b-2 border-[#8B47FF]" : "text-gray-400 hover:text-gray-600"}`}
            >
              Corbeille ({productTrash.length})
            </button>
          </div>

          {activeShopTab === "galerie" ? (
            <div className="space-y-6">
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
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {productTrash.length === 0 ? (
                <p className="text-gray-400 text-sm py-8 italic col-span-full text-center">La corbeille de la boutique est vide.</p>
              ) : (
                productTrash.map((product) => (
                  <div
                    key={product.id}
                    className="glass-panel rounded-2xl p-5 transition-all opacity-75 border border-gray-200"
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
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 bg-red-100 text-red-700">
                            Supprimé
                          </span>
                        </div>
                        <p className="text-foreground/50 text-xs mt-1 line-clamp-1">{product.description}</p>
                      </div>
                    </div>

                    {/* Actions Corbeille */}
                    <div className="flex items-center justify-end gap-3 mt-4 pt-3 border-t border-white/20">
                      <button
                        onClick={() => restoreProduct(product.id)}
                        className="text-xs font-semibold text-purple-700 hover:bg-purple-50 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                      >
                        Restaurer
                      </button>
                      <button
                        onClick={() => permanentDeleteProduct(product.id, product.name)}
                        disabled={actionLoading === product.id}
                        className="text-xs font-semibold text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                      >
                        Supprimer définitivement
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}