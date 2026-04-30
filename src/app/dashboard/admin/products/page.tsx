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

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/admin/products");
      if (!res.ok) throw new Error("Erreur");
      const data = await res.json();
      setProducts(data.products);
    } catch (error) {
      setMessage({ type: "error", text: "Impossible de charger les produits" });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: "", description: "", price: "", stockQuantity: "", imageUrl: "" });
    setEditingProduct(null);
    setShowForm(false);
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
        // PATCH
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
        // POST
        const res = await fetch("/api/admin/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);

        await fetchProducts(); // Reload to get full product with _count
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
    <div className="space-y-6">
      <header className="flex items-start justify-between gap-4">
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
        <button
          onClick={() => { resetForm(); setShowForm(!showForm); }}
          className="btn-primary flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showForm ? "M6 18L18 6M6 6l12 12" : "M12 4v16m8-8H4"} />
          </svg>
          {showForm ? "Fermer" : "Nouveau produit"}
        </button>
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

      {/* Create / Edit form */}
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
  );
}
