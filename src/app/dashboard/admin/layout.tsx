import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
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

  if (session.user.role !== "admin") {
    redirect("/dashboard");
  }

  return <>{children}</>;
}
