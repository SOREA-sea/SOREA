import { useState } from "react";

const didYouKnowText = {
  title: "Le saviez-vous ?",
  content: [
    "Pratiquer la gratitude chaque jour réduit le stress, améliore la qualité du sommeil et augmente le sentiment de bonheur.",
    "En cultivant cette attitude du bien-être, vous stimulez naturellement votre sérotonine, cette précieuse molécule du bonheur qui éclaire l'esprit et apaise le coeur.",
  ],
};

const categories = [
  { label: "Gratitude", color: "#C4B5E8" },
  { label: "Journaling", color: "#F5DEC8" },
  { label: "Libre", color: "#7DE8E8" },
];

export default function SoreaCarnet() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #DDD6F0 0%, #F0EEF8 50%, #F5F3FA 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Georgia', 'Times New Roman', serif",
        position: "relative",
      }}
    >
      {/* Left sidebar buttons */}
      <div
        style={{
          position: "absolute",
          left: "6%",
          top: "50%",
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        {/* Retour button */}
        <button
          onClick={() => window.history.back()}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: "#7B4FC8",
            fontWeight: "700",
            fontSize: "15px",
            fontFamily: "'Georgia', serif",
            padding: "4px 0",
          }}
        >
          <span style={{ fontSize: "18px" }}>←</span>
          <span>Retour</span>
        </button>

        {/* Commander mon Carnet Gratitude button */}
        <button
          style={{
            background: "white",
            border: "2.5px solid #7B4FC8",
            borderRadius: "12px",
            color: "#4A1A8C",
            fontWeight: "700",
            fontSize: "13px",
            fontFamily: "'Georgia', serif",
            padding: "10px 14px",
            cursor: "pointer",
            lineHeight: "1.4",
            textAlign: "center",
            maxWidth: "150px",
            boxShadow: "0 2px 8px rgba(123,79,200,0.10)",
          }}
        >
          Commander mon<br />Carnet Gratitude
        </button>
      </div>

      {/* Book */}
      <div
        style={{
          width: "720px",
          height: "500px",
          position: "relative",
          display: "flex",
          filter: "drop-shadow(0 12px 40px rgba(120,80,200,0.18))",
        }}
      >
        {/* Book cover / spine shadow */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "18px",
            background: "#B49DD4",
            zIndex: 0,
          }}
        />

        {/* Book inner (white pages area) */}
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            right: "10px",
            bottom: "6px",
            borderRadius: "12px",
            background: "white",
            zIndex: 1,
            display: "flex",
            overflow: "hidden",
          }}
        >
          {/* Left page */}
          <div
            style={{
              flex: 1,
              padding: "32px 28px 28px 32px",
              borderRight: "2px solid #E0D8F0",
              position: "relative",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Title */}
            <h2
              style={{
                fontWeight: "800",
                fontSize: "20px",
                color: "#1A1A2E",
                marginBottom: "20px",
                fontFamily: "'Georgia', serif",
              }}
            >
              Bonjour Prénom :-)
            </h2>

            {/* Did you know box */}
            <div
              onClick={() => setExpanded((v) => !v)}
              style={{
                background: "#FDF3E3",
                borderRadius: "10px",
                padding: "20px",
                cursor: "pointer",
                flex: 1,
                transition: "opacity 0.3s",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Title line always visible */}
              <p
                style={{
                  fontWeight: "700",
                  fontSize: "16px",
                  textDecoration: "underline",
                  color: "#1A1A2E",
                  marginBottom: expanded ? "14px" : "0",
                  fontFamily: "'Georgia', serif",
                }}
              >
                {didYouKnowText.title}{" "}
                <span style={{ textDecoration: "none", fontWeight: "400" }}>?</span>
              </p>

              {/* Content only visible when expanded */}
              {expanded && (
                <div>
                  {didYouKnowText.content.map((para, i) => (
                    <p
                      key={i}
                      style={{
                        fontSize: "14px",
                        lineHeight: "1.65",
                        color: "#2D2D2D",
                        marginBottom: i < didYouKnowText.content.length - 1 ? "12px" : 0,
                        fontFamily: "'Georgia', serif",
                      }}
                    >
                      {para}
                    </p>
                  ))}
                </div>
              )}

              {/* Overlay blur when collapsed */}
              {!expanded && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(253,243,227,0.55)",
                    backdropFilter: "blur(3px)",
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                />
              )}
            </div>
          </div>

          {/* Right page */}
          <div
            style={{
              flex: 1,
              padding: "32px 32px 28px 28px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: "20px",
            }}
          >
            {categories.map((cat) => (
              <button
                key={cat.label}
                style={{
                  background: expanded ? cat.color : "#D4D4D4",
                  border: "none",
                  borderRadius: "10px",
                  padding: "18px 0",
                  fontSize: "15px",
                  fontWeight: "700",
                  color: expanded ? "#3A1A7A" : "#888",
                  cursor: "pointer",
                  fontFamily: "'Georgia', serif",
                  transition: "background 0.4s, color 0.4s",
                  filter: expanded ? "none" : "blur(1.5px)",
                  letterSpacing: "0.01em",
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Book spine center line */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "6px",
            bottom: "0",
            width: "4px",
            background: "linear-gradient(to bottom, #C4B0E0, #A890CC)",
            zIndex: 3,
            transform: "translateX(-50%)",
            borderRadius: "2px",
          }}
        />

        {/* Book bottom binding bump */}
        <div
          style={{
            position: "absolute",
            bottom: "-8px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "60px",
            height: "16px",
            background: "#B49DD4",
            borderRadius: "0 0 12px 12px",
            zIndex: 4,
          }}
        />

        {/* Page curl top left */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "80px",
            height: "18px",
            background: "linear-gradient(to bottom, #C4B0E0, #B49DD4)",
            borderRadius: "0 0 40px 40px",
            zIndex: 4,
          }}
        />
      </div>
    </div>
  );
}
