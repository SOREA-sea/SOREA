// app/dashboard/coach/sessions/create/page.tsx

// On importe ton composant depuis ton dossier de composants
import CoachSessionCreator from "@/components/CoachSessionCreator"; 

export default function CreateSessionPage() {
  return (
    <div className="p-6">
      {/* On affiche ton composant ici */}
      <CoachSessionCreator />
    </div>
  );
}