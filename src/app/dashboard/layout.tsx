import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DashboardSidebar from "@/components/DashboardSidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("sorea_session")?.value;

  if (!sessionId) {
    redirect("/login");
  }

  const session = await prisma.userSession.findUnique({
    where: { id: sessionId },
    include: { user: true },
  });

  if (!session || session.expiresAt <= new Date()) {
    redirect("/login");
  }

  const user = session.user;

  // Fetch des compteurs pour la sidebar
  const [favoriteProducts, favoriteCoaches, favoriteSessions, reservationsCount, sessionsCount] =
    await Promise.all([
      prisma.favoriteProduct.count({ where: { userId: user.id } }),
      prisma.favoriteCoach.count({ where: { userId: user.id } }),
      prisma.favoriteSession.count({ where: { userId: user.id } }),
      prisma.sessionBooking.count({ where: { userId: user.id, status: "pending" } }),
      prisma.sessionBooking.count({ where: { userId: user.id, status: "confirmed" } }),
    ]);

  const favoritesCount = favoriteProducts + favoriteCoaches + favoriteSessions;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-pastel-1 to-pastel-2 text-foreground font-sans">
      <Navbar isLoggedIn={true} />
      <div className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 flex gap-8">
        <DashboardSidebar
          user={{
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            avatarUrl: user.avatarUrl,
            role: user.role,
            favoritesCount,
            reservationsCount,
            sessionsCount,
            twoFactorEnabled: user.twoFactorEnabled ?? false,
          }}
        />

        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}