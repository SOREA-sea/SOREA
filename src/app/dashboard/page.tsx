import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("sorea_session")?.value;

  const session = await prisma.userSession.findUnique({
    where: { id: sessionId },
    include: { user: true },
  });

  const user = session?.user;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-black section-title">Tableau de bord</h1>
        <p className="text-foreground/70 mt-2 text-lg">
          Bienvenue dans votre espace, {user?.firstName} {user?.lastName}.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-3xl flex flex-col items-center justify-center text-center hover:shadow-lg transition-shadow">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 text-purple-600">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          </div>
          <h2 className="text-xl font-bold">Mon Profil</h2>
          <p className="text-foreground/60 text-sm mt-2">Gérez vos informations personnelles et vos préférences.</p>
          <button className="mt-4 px-6 py-2 bg-white/50 rounded-full text-sm font-medium hover:bg-white/80 transition-colors">Gérer</button>
        </div>

        <div className="glass-panel p-6 rounded-3xl flex flex-col items-center justify-center text-center hover:shadow-lg transition-shadow">
          <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-4 text-pink-600">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
          </div>
          <h2 className="text-xl font-bold">Mes Favoris</h2>
          <p className="text-foreground/60 text-sm mt-2">Retrouvez vos rituels et produits préférés.</p>
          <button className="mt-4 px-6 py-2 bg-white/50 rounded-full text-sm font-medium hover:bg-white/80 transition-colors">Voir</button>
        </div>

        <div className="glass-panel p-6 rounded-3xl flex flex-col items-center justify-center text-center hover:shadow-lg transition-shadow">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 text-blue-600">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </div>
          <h2 className="text-xl font-bold">Mes Sessions</h2>
          <p className="text-foreground/60 text-sm mt-2">Consultez vos prochains rendez-vous coaching.</p>
          <button className="mt-4 px-6 py-2 bg-white/50 rounded-full text-sm font-medium hover:bg-white/80 transition-colors">Consulter</button>
        </div>
      </div>
    </div>
  );
}
