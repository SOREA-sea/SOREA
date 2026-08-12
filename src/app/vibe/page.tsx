// import SoreaVibe from "@/components/vibe";

/*export default function Page() {
  return null; // Page désactivée (return <SoreaVibe />;)
}
export default function Page() {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Bienvenue sur la page Vibe </h1>
    </div>
  );
}*/
import SoreaVibe from "@/components/vibe"; // ou le bon chemin vers ton composant

export default function Page() {
  return <SoreaVibe />;
}