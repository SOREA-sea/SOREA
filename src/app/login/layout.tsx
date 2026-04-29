import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export default async function LoginLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("sorea_session")?.value;

  if (sessionId) {
    const session = await prisma.userSession.findUnique({
      where: { id: sessionId },
    });
    if (session && session.expiresAt > new Date()) {
      redirect("/dashboard");
    }
  }

  return <>{children}</>;
}
