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