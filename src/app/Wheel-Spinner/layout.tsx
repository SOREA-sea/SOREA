import { exigerAbonnementPage } from "@/lib/abonnement";

export default async function Layout({ children }: { children: React.ReactNode }) {
  await exigerAbonnementPage();
  return <>{children}</>;
}