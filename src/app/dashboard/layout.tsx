import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-pastel-1 to-pastel-2 text-foreground font-sans">
      <Navbar isLoggedIn={true} />
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-12">
        {children}
      </main>
      <Footer />
    </div>
  );
}
