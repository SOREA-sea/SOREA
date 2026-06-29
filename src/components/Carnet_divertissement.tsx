"use client";
import { useState, useEffect } from "react";

interface HobbyItemUI {
  id: number;
  label: string;
}

interface HobbyCategoryUI {
  id: number;
  name: string;
  icon: string;
  isDefault: boolean;
  items: HobbyItemUI[];
  inputValue: string;
}

export default function CarnetDivertissement() {
  const [categories, setCategories] = useState<HobbyCategoryUI[]>([]);
  const [newHobbyInput, setNewHobbyInput] = useState("");
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    fetch("/api/carnet/hobbies")
      .then((r) => r.json())
      .then((res) => {
        const cats = (res.data || []).map((c: any) => ({
          id: c.id,
          name: c.name,
          icon: c.icon,
          isDefault: c.isDefault,
          items: c.items.map((i: any) => ({ id: i.id, label: i.label })),
          inputValue: "",
        }));
        setCategories(cats);
      })
      .catch((err) => console.error("Erreur chargement hobbies:", err))
      .finally(() => setChargement(false));
  }, []);

  const updateCategoryInput = (catId: number, value: string) => {
    setCategories((prev) => prev.map((c) => (c.id === catId ? { ...c, inputValue: value } : c)));
  };

  const addItemToCategory = async (catId: number) => {
    const cat = categories.find((c) => c.id === catId);
    const texte = cat?.inputValue.trim();
    if (!texte) return;

    const tempId = Date.now();
    setCategories((prev) =>
      prev.map((c) => (c.id === catId ? { ...c, items: [...c.items, { id: tempId, label: texte }], inputValue: "" } : c))
    );

    try {
      const res = await fetch("/api/carnet/hobbies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "addItem", categoryId: catId, label: texte }),
      });
      if (!res.ok) throw new Error("Échec sauvegarde");
      const data = await res.json();
      setCategories((prev) =>
        prev.map((c) =>
          c.id === catId
            ? { ...c, items: c.items.map((i) => (i.id === tempId ? { id: data.data.id, label: data.data.label } : i)) }
            : c
        )
      );
    } catch (err) {
      console.error(err);
      setCategories((prev) => prev.map((c) => (c.id === catId ? { ...c, items: c.items.filter((i) => i.id !== tempId) } : c)));
    }
  };

  const removeItemFromCategory = async (catId: number, itemId: number) => {
    const ancien = categories;
    setCategories((prev) => prev.map((c) => (c.id === catId ? { ...c, items: c.items.filter((i) => i.id !== itemId) } : c)));

    try {
      const res = await fetch(`/api/carnet/hobbies?itemId=${itemId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Échec suppression");
    } catch (err) {
      console.error(err);
      setCategories(ancien);
    }
  };

  const removeCategory = async (catId: number) => {
    const ancien = categories;
    setCategories((prev) => prev.filter((c) => c.id !== catId));

    try {
      const res = await fetch(`/api/carnet/hobbies?categoryId=${catId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Échec suppression");
    } catch (err) {
      console.error(err);
      setCategories(ancien);
    }
  };

  const addHobbyCategory = async () => {
    const trimmed = newHobbyInput.trim();
    if (!trimmed) return;

    const tempId = Date.now();
    setCategories((prev) => [...prev, { id: tempId, name: trimmed, icon: "⭐", isDefault: false, items: [], inputValue: "" }]);
    setNewHobbyInput("");

    try {
      const res = await fetch("/api/carnet/hobbies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "addCategory", name: trimmed }),
      });
      if (!res.ok) throw new Error("Échec sauvegarde");
      const data = await res.json();
      setCategories((prev) =>
        prev.map((c) => (c.id === tempId ? { id: data.data.id, name: data.data.name, icon: data.data.icon, isDefault: false, items: [], inputValue: "" } : c))
      );
    } catch (err) {
      console.error(err);
      setCategories((prev) => prev.filter((c) => c.id !== tempId));
    }
  };

  if (chargement) {
    return (
      <div style={styles.card}>
        <p style={{ fontSize: 12, color: "#8b5cf6" }}>Chargement…</p>
      </div>
    );
  }

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={styles.avatar}>🎉</div>
        <div>
          <div style={styles.title}>Divertissement</div>
          <div style={styles.subtitle}>Vos hobbies pour nourrir la joie</div>
        </div>
      </div>

      <div style={styles.divider} />

      <div style={styles.categoriesList}>
        {categories.map((cat) => (
          <div key={cat.id} style={styles.categoryBlock}>
            <div style={styles.categoryTitle}>
              <span style={styles.catIcon}>{cat.icon}</span>
              <span style={styles.catName}>{cat.name}</span>
              {!cat.isDefault && (
                <button style={styles.deleteCatBtn} onClick={() => removeCategory(cat.id)} title="Supprimer ce hobby">
                  ✕
                </button>
              )}
            </div>

            {cat.items.length === 0 && <p style={styles.emptyMsg}>Aucun item pour l&apos;instant.</p>}
            {cat.items.map((item) => (
              <div key={item.id} style={styles.itemRow}>
                <span style={styles.bullet}>•</span>
                <span style={styles.itemLabel}>{item.label}</span>
                <button style={styles.retireBtn} onClick={() => removeItemFromCategory(cat.id, item.id)}>
                  retirer
                </button>
              </div>
            ))}

            <div style={styles.inputRow}>
              <input
                type="text"
                placeholder={`Ajouter dans ${cat.name.toLowerCase()}`}
                value={cat.inputValue}
                onChange={(e) => updateCategoryInput(cat.id, e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addItemToCategory(cat.id)}
                style={styles.input}
              />
              <button style={styles.okBtn} onClick={() => addItemToCategory(cat.id)}>
                OK
              </button>
            </div>
          </div>
        ))}
      </div>

      <div style={styles.divider} />

      <div style={styles.addHobbySection}>
        <div style={styles.addHobbyLabel}>Ajouter un hobby</div>
        <div style={styles.addHobbyRow}>
          <input
            type="text"
            placeholder="Ex: Dessin, Jardinage, Cuisine, Photo…"
            value={newHobbyInput}
            onChange={(e) => setNewHobbyInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addHobbyCategory()}
            style={styles.addHobbyInput}
          />
          <button style={styles.addBtn} onClick={addHobbyCategory}>
            Ajouter
          </button>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: { background: "#ffffff", borderRadius: "16px", boxShadow: "0 4px 24px rgba(124,58,237,0.10)", padding: "24px 28px 20px", width: "370px", fontFamily: "'Nunito', 'Segoe UI', sans-serif", border: "1px solid #ede9fe" },
  header: { display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px" },
  avatar: { width: "42px", height: "42px", borderRadius: "12px", background: "linear-gradient(135deg, #a78bfa, #7c3aed)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", flexShrink: 0 },
  title: { fontWeight: 800, fontSize: "18px", color: "#1e1b4b", letterSpacing: "-0.3px", lineHeight: 1.2 },
  subtitle: { fontSize: "12.5px", color: "#8b5cf6", fontWeight: 500, fontStyle: "italic" },
  divider: { height: "1px", background: "#ede9fe", margin: "0 0 16px 0" },
  categoriesList: { display: "flex", flexDirection: "column", gap: "20px", marginBottom: "16px" },
  categoryBlock: { display: "flex", flexDirection: "column", gap: "6px" },
  categoryTitle: { display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" },
  catIcon: { fontSize: "15px" },
  catName: { fontWeight: 700, fontSize: "14px", color: "#1e1b4b" },
  emptyMsg: { fontSize: "12px", color: "#a78bfa", margin: "0 0 4px 0", fontStyle: "italic" },
  itemRow: { display: "flex", alignItems: "center", gap: "6px", paddingLeft: "2px" },
  bullet: { color: "#7c3aed", fontWeight: 700, fontSize: "16px", lineHeight: 1 },
  itemLabel: { flex: 1, fontSize: "13.5px", color: "#374151", fontWeight: 500 },
  deleteCatBtn: { marginLeft: "auto", background: "none", border: "none", color: "#f87171", fontSize: "13px", cursor: "pointer", fontFamily: "inherit", fontWeight: 700, padding: "0 2px", lineHeight: 1, flexShrink: 0 },
  retireBtn: { background: "none", border: "none", color: "#a78bfa", fontSize: "12px", cursor: "pointer", fontFamily: "inherit", textDecoration: "underline", padding: 0, flexShrink: 0 },
  inputRow: { display: "flex", gap: "8px", marginTop: "4px" },
  input: { flex: 1, padding: "7px 12px", border: "1.5px dashed #ddd6fe", borderRadius: "8px", fontSize: "12.5px", fontFamily: "inherit", color: "#374151", outline: "none", background: "#faf5ff" },
  okBtn: { padding: "7px 16px", background: "#7c3aed", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 700, fontSize: "13px", cursor: "pointer", fontFamily: "inherit", flexShrink: 0 },
  addHobbySection: { display: "flex", flexDirection: "column", gap: "8px", background: "#faf5ff", border: "1.5px dashed #ddd6fe", borderRadius: "10px", padding: "14px 16px" },
  addHobbyLabel: { fontSize: "13px", fontWeight: 600, color: "#6d28d9" },
  addHobbyRow: { display: "flex", gap: "8px" },
  addHobbyInput: { flex: 1, padding: "8px 12px", border: "1.5px solid #ddd6fe", borderRadius: "8px", fontSize: "13px", fontFamily: "inherit", color: "#374151", outline: "none", background: "#fff" },
  addBtn: { padding: "8px 18px", background: "#7c3aed", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 700, fontSize: "13px", cursor: "pointer", fontFamily: "inherit", flexShrink: 0 },
};