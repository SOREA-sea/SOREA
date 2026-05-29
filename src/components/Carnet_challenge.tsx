import { useState } from "react";

type Theme = "Anti-stress" | "Sommeil" | "Mouvement" | "Autre";

interface Challenge {
  id: number;
  label: string;
  checked: boolean;
}

const defaultChallenges: Record<Theme, Challenge[]> = {
  "Anti-stress": [
    { id: 1, label: "Respiration 5-5-5 (3 cycles)", checked: false },
    { id: 2, label: "Balade 10 minutes sans écran", checked: true },
    { id: 3, label: "Note de gratitude", checked: false },
  ],
  Sommeil: [
    { id: 4, label: "Écran off 1h avant dodo", checked: false },
    { id: 5, label: "Étirements doux 5 min", checked: false },
    { id: 6, label: "Lecture 10 pages", checked: false },
  ],
  Mouvement: [
    { id: 7, label: "Pilates 10 minutes", checked: false },
    { id: 8, label: "20 squats / 20 fentes", checked: false },
    { id: 9, label: "Marche 3 000 pas", checked: false },
  ],
  Autre: [
    { id: 10, label: "Manger un fruit", checked: false },
  ],
};

const themeOrder: Theme[] = ["Anti-stress", "Sommeil", "Mouvement", "Autre"];

const themeColors: Record<Theme, string> = {
  "Anti-stress": "#a78bfa",
  Sommeil: "#a78bfa",
  Mouvement: "#a78bfa",
  Autre: "#a78bfa",
};

export default function CarnetChallenge() {
  const [activeTheme, setActiveTheme] = useState<Theme>("Anti-stress");
  const [challenges, setChallenges] = useState<Record<Theme, Challenge[]>>(defaultChallenges);
  const [customInput, setCustomInput] = useState("");

  const toggleChallenge = (id: number) => {
    setChallenges((prev) => ({
      ...prev,
      [activeTheme]: prev[activeTheme].map((c) =>
        c.id === id ? { ...c, checked: !c.checked } : c
      ),
    }));
  };

  const addChallenge = () => {
    const trimmed = customInput.trim();
    if (!trimmed) return;
    const newId = Date.now();
    setChallenges((prev) => ({
      ...prev,
      [activeTheme]: [
        ...prev[activeTheme],
        { id: newId, label: trimmed, checked: false },
      ],
    }));
    setCustomInput("");
  };

  const resetList = () => {
    setChallenges((prev) => ({
      ...prev,
      [activeTheme]: [],
    }));
  };

  return (
    <div style={styles.card}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.iconWrap}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
        </div>
        <span style={styles.title}>Challenges</span>
      </div>

      <p style={styles.subtitle}>Choisissez une thématique ou créez la vôtre</p>

      {/* Theme tabs – row 1 */}
      <div style={styles.tabRow}>
        {(["Anti-stress", "Sommeil"] as Theme[]).map((t) => (
          <button
            key={t}
            style={activeTheme === t ? styles.tabActive : styles.tabInactive}
            onClick={() => setActiveTheme(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Theme tabs – row 2 */}
      <div style={styles.tabRow}>
        {(["Mouvement", "Autre"] as Theme[]).map((t) => (
          <button
            key={t}
            style={activeTheme === t ? styles.tabActive : styles.tabInactive}
            onClick={() => setActiveTheme(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Challenge list */}
      <div style={styles.list}>
        {challenges[activeTheme].map((challenge) => (
          <label key={challenge.id} style={styles.item}>
            <input
              type="checkbox"
              checked={challenge.checked}
              onChange={() => toggleChallenge(challenge.id)}
              style={{ display: "none" }}
            />
            <span style={challenge.checked ? styles.checkboxChecked : styles.checkboxUnchecked}>
              {challenge.checked && (
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="2 6 5 9 10 3" />
                </svg>
              )}
            </span>
            <span style={{ ...styles.itemLabel, textDecoration: challenge.checked ? "line-through" : "none", color: challenge.checked ? "#c4b5fd" : "#374151" }}>
              {challenge.label}
            </span>
          </label>
        ))}
      </div>

      {/* Custom input */}
      <div style={styles.inputRow}>
        <input
          type="text"
          placeholder="Ajouter une tâche personnalisée"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addChallenge()}
          style={styles.input}
        />
        <button onClick={addChallenge} style={styles.addBtn}>
          Ajouter
        </button>
      </div>

      {/* Reset */}
      <div style={styles.resetRow}>
        <button onClick={resetList} style={styles.resetBtn}>
          Réinitialiser la liste
        </button>
      </div>
    </div>
  );
}

/* ── Inline styles ── */
const styles: Record<string, React.CSSProperties> = {
  card: {
    background: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 4px 24px rgba(124,58,237,0.10)",
    padding: "24px 28px 20px",
    width: "320px",
    fontFamily: "'Nunito', 'Segoe UI', sans-serif",
    border: "1px solid #ede9fe",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "4px",
  },
  iconWrap: {
    background: "#ede9fe",
    borderRadius: "8px",
    width: "32px",
    height: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  title: {
    fontWeight: 700,
    fontSize: "17px",
    color: "#1e1b4b",
    letterSpacing: "-0.3px",
  },
  subtitle: {
    fontSize: "12px",
    color: "#8b5cf6",
    marginBottom: "14px",
    marginTop: "2px",
    fontWeight: 500,
  },
  tabRow: {
    display: "flex",
    gap: "8px",
    marginBottom: "8px",
  },
  tabActive: {
    flex: 1,
    padding: "7px 0",
    background: "#7c3aed",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontWeight: 700,
    fontSize: "13px",
    cursor: "pointer",
    transition: "background 0.18s",
    fontFamily: "inherit",
  },
  tabInactive: {
    flex: 1,
    padding: "7px 0",
    background: "transparent",
    color: "#6d28d9",
    border: "1.5px solid #ddd6fe",
    borderRadius: "8px",
    fontWeight: 600,
    fontSize: "13px",
    cursor: "pointer",
    transition: "background 0.18s",
    fontFamily: "inherit",
  },
  list: {
    marginTop: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    minHeight: "88px",
  },
  item: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    cursor: "pointer",
    background: "#faf5ff",
    borderRadius: "8px",
    padding: "8px 12px",
    border: "1px solid #ede9fe",
    transition: "background 0.14s",
  },
  checkboxUnchecked: {
    width: "18px",
    height: "18px",
    borderRadius: "5px",
    border: "1.8px solid #c4b5fd",
    background: "#fff",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    width: "18px",
    height: "18px",
    borderRadius: "5px",
    border: "1.8px solid #7c3aed",
    background: "#7c3aed",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  itemLabel: {
    fontSize: "13.5px",
    fontWeight: 500,
    transition: "color 0.2s",
  },
  inputRow: {
    display: "flex",
    gap: "8px",
    marginTop: "16px",
  },
  input: {
    flex: 1,
    padding: "8px 12px",
    border: "1.5px solid #ddd6fe",
    borderRadius: "8px",
    fontSize: "13px",
    fontFamily: "inherit",
    color: "#374151",
    outline: "none",
    background: "#faf5ff",
  },
  addBtn: {
    padding: "8px 16px",
    background: "#7c3aed",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontWeight: 700,
    fontSize: "13px",
    cursor: "pointer",
    fontFamily: "inherit",
    whiteSpace: "nowrap",
  },
  resetRow: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "10px",
  },
  resetBtn: {
    background: "none",
    border: "none",
    color: "#a78bfa",
    fontSize: "12px",
    cursor: "pointer",
    fontFamily: "inherit",
    textDecoration: "underline",
    padding: 0,
  },
};
