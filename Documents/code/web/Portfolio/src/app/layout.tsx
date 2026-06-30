import type { Metadata } from "next";
import "./globals.css";
import { MenuProvider } from "@/context/MenuContext";

export const metadata: Metadata = {
    title: "Dev://Underground",
    description: "Portfolio style Need for Speed Underground",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="fr">
            <body className="antialiased">
                <MenuProvider>
                    {children}
                </MenuProvider>
            </body>
        </html>
    );
}
