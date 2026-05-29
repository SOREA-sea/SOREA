import { useState } from "react";

interface HobbyItem {
  id: number;
  label: string;
}

interface HobbyCategory {
  id: number;
  name: string;
  icon: string;
  items: HobbyItem[];
  inputValue: string;
}

const defaultCategories: HobbyCategory[] = [
  {
    id: 1,
    name: "Lecture",
    icon: "📖",
    items: [
      { id: 11, label: "Finir 'Ikigai'" },
      { id: 12, label: "10 pages ce soir" },
    ],
    inputValue: "",
  },
  {
    id: 2,
    name: "Musique",
    icon: "🎵",
    items: [{ id: 21, label: "Playlist focus 25 min" }],
    inputValue: "",
  },
  {
    id: 3,
    name: "Films & Séries",
    icon: "🎬",
    items: [{ id: 31, label: "1 épisode le samedi" }],
    inputValue: "",
  },
  {
    id: 4,
    name: "Jeux",
    icon: "🎮",
    items: [{ id: 41, label: "10 min puzzle antistress" }],
    inputValue: "",
  },
];

export default function CarnetDivertissement() {
  const [categories, setCategories] = useState<HobbyCategory[]>(defaultCategories);
  const [newHobbyInput, setNewHobbyInput] = useState("");

  const updateCategoryInput = (catId: number, value: string) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === catId ? { ...c, inputValue: value } : c))
    );
  };

  const addItemToCategory = (catId: number) => {
    setCategories((prev) =>
      prev.map((c) => {
        if (c.id !== catId || !c.inputValue.trim()) return c;
        return {
          ...c,
          items: [...c.items, { id: Date.now(), label: c.inputValue.trim() }],
          inputValue: "",
        };
      })
    );
  };

  const removeItemFromCategory = (catId: number, itemId: number) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === catId ? { ...c, items: c.items.filter((i) => i.id !== itemId) } : c
      )
    );
  };

  const removeCategory = (catId: number) => {
    setCategories((prev) => prev.filter((c) => c.id !== catId));
  };

  const addHobbyCategory = () => {
    const trimmed = newHobbyInput.trim();
    if (!trimmed) return;
    setCategories((prev) => [
      ...prev,
      { id: Date.now(), name: trimmed, icon: "⭐", items: [], inputValue: "" },
    ]);
    setNewHobbyInput("");
  };

  return (
    <div style={styles.card}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.avatar}>🎉</div>
        <div>
          <div style={styles.title}>Divertissement</div>
          <div style={styles.subtitle}>Vos hobbies pour nourrir la joie</div>
        </div>
      </div>

      <div style={styles.divider} />

      {/* Categories */}
      <div style={styles.categoriesList}>
        {categories.map((cat) => (
          <div key={cat.id} style={styles.categoryBlock}>
            {/* Category title */}
            <div style={styles.categoryTitle}>
              <span style={styles.catIcon}>{cat.icon}</span>
              <span style={styles.catName}>{cat.name}</span>
              {cat.icon === "⭐" && (
                <button
                  style={styles.deleteCatBtn}
                  onClick={() => removeCategory(cat.id)}
                  title="Supprimer ce hobby"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Items */}
            {cat.items.length === 0 && (
              <p style={styles.emptyMsg}>Aucun item pour l'instant.</p>
            )}
            {cat.items.map((item) => (
              <div key={item.id} style={styles.itemRow}>
                <span style={styles.bullet}>•</span>
                <span style={styles.itemLabel}>{item.label}</span>
                <button
                  style={styles.retireBtn}
                  onClick={() => removeItemFromCategory(cat.id, item.id)}
                >
                  retirer
                </button>
              </div>
            ))}

            {/* Add item input */}
            <div style={styles.inputRow}>
              <input
                type="text"
                placeholder={`Ajouter dans ${cat.name.toLowerCase()}`}
                value={cat.inputValue}
                onChange={(e) => updateCategoryInput(cat.id, e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addItemToCategory(cat.id)}
                style={styles.input}
              />
              <button
                style={styles.okBtn}
                onClick={() => addItemToCategory(cat.id)}
              >
                OK
              </button>
            </div>
          </div>
        ))}
      </div>

      <div style={styles.divider} />

      {/* Add hobby */}
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

/* ── Styles ── */
const styles: Record<string, React.CSSProperties> = {
  card: {
    background: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 4px 24px rgba(124,58,237,0.10)",
    padding: "24px 28px 20px",
    width: "370px",
    fontFamily: "'Nunito', 'Segoe UI', sans-serif",
    border: "1px solid #ede9fe",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    marginBottom: "16px",
  },
  avatar: {
    width: "42px",
    height: "42px",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #a78bfa, #7c3aed)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    flexShrink: 0,
  },
  title: {
    fontWeight: 800,
    fontSize: "18px",
    color: "#1e1b4b",
    letterSpacing: "-0.3px",
    lineHeight: 1.2,
  },
  subtitle: {
    fontSize: "12.5px",
    color: "#8b5cf6",
    fontWeight: 500,
    fontStyle: "italic",
  },
  divider: {
    height: "1px",
    background: "#ede9fe",
    margin: "0 0 16px 0",
  },
  categoriesList: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    marginBottom: "16px",
  },
  categoryBlock: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  categoryTitle: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    marginBottom: "4px",
  },
  catIcon: {
    fontSize: "15px",
  },
  catName: {
    fontWeight: 700,
    fontSize: "14px",
    color: "#1e1b4b",
  },
  emptyMsg: {
    fontSize: "12px",
    color: "#a78bfa",
    margin: "0 0 4px 0",
    fontStyle: "italic",
  },
  itemRow: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    paddingLeft: "2px",
  },
  bullet: {
    color: "#7c3aed",
    fontWeight: 700,
    fontSize: "16px",
    lineHeight: 1,
  },
  itemLabel: {
    flex: 1,
    fontSize: "13.5px",
    color: "#374151",
    fontWeight: 500,
  },
  deleteCatBtn: {
    marginLeft: "auto",
    background: "none",
    border: "none",
    color: "#f87171",
    fontSize: "13px",
    cursor: "pointer",
    fontFamily: "inherit",
    fontWeight: 700,
    padding: "0 2px",
    lineHeight: 1,
    flexShrink: 0,
  },
  retireBtn: {
    background: "none",
    border: "none",
    color: "#a78bfa",
    fontSize: "12px",
    cursor: "pointer",
    fontFamily: "inherit",
    textDecoration: "underline",
    padding: 0,
    flexShrink: 0,
  },
  inputRow: {
    display: "flex",
    gap: "8px",
    marginTop: "4px",
  },
  input: {
    flex: 1,
    padding: "7px 12px",
    border: "1.5px dashed #ddd6fe",
    borderRadius: "8px",
    fontSize: "12.5px",
    fontFamily: "inherit",
    color: "#374151",
    outline: "none",
    background: "#faf5ff",
  },
  okBtn: {
    padding: "7px 16px",
    background: "#7c3aed",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontWeight: 700,
    fontSize: "13px",
    cursor: "pointer",
    fontFamily: "inherit",
    flexShrink: 0,
  },
  addHobbySection: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    background: "#faf5ff",
    border: "1.5px dashed #ddd6fe",
    borderRadius: "10px",
    padding: "14px 16px",
  },
  addHobbyLabel: {
    fontSize: "13px",
    fontWeight: 600,
    color: "#6d28d9",
  },
  addHobbyRow: {
    display: "flex",
    gap: "8px",
  },
  addHobbyInput: {
    flex: 1,
    padding: "8px 12px",
    border: "1.5px solid #ddd6fe",
    borderRadius: "8px",
    fontSize: "13px",
    fontFamily: "inherit",
    color: "#374151",
    outline: "none",
    background: "#fff",
  },
  addBtn: {
    padding: "8px 18px",
    background: "#7c3aed",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontWeight: 700,
    fontSize: "13px",
    cursor: "pointer",
    fontFamily: "inherit",
    flexShrink: 0,
  },
};
