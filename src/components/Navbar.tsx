"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV_LINKS = [
  { label: "Shopping", href: "/shop" },
  { label: "Coaching", href: "/coaching" },
  { label: "Ambassadeur", href: "/ambassador" },
  { label: "Challenges", href: "/challenge" },
  { label: "Vibe", href: "/vibe" },
  { label: "Mon Carnet", href: "/carnet" },
  { label: "Mon suivi", href: "/suivi" },
  
];

export default function Navbar({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  const pathname = usePathname();
  const [sessionUser, setSessionUser] = useState<{ id: string } | null>(null);
  const [sessionChecked, setSessionChecked] = useState(isLoggedIn);

  useEffect(() => {
    if (isLoggedIn) {
      return;
    }

    let cancelled = false;

    const loadSession = async () => {
      try {
        const response = await fetch("/api/auth/me", { credentials: "include" });
        if (!response.ok) {
          if (!cancelled) setSessionUser(null);
          return;
        }

        const data = await response.json();
        if (!cancelled) setSessionUser(data.user ?? null);
      } catch {
        if (!cancelled) setSessionUser(null);
      } finally {
        if (!cancelled) setSessionChecked(true);
      }
    };

    loadSession();

    return () => {
      cancelled = true;
    };
  }, [isLoggedIn]);

  const isAuthenticated = isLoggedIn || !!sessionUser;
  const ctaLabel = isAuthenticated ? "Mon dossier personnel" : "Se connecter";
  const ctaHref = isAuthenticated ? "/dashboard" : "/login";

  return (
    <>
      <header className="sorea-navbar">
        <Link href="/" className="sorea-logo-link" aria-label="Accueil SOREA">
          <Image
            src="/image_icone/Logo-SOREA.png"
            alt="Logo SOREA"
            width={64}
            height={64}
            priority
          />
        </Link>

        <div className="sorea-navbar-panel">
          <nav className="sorea-navbar-nav" aria-label="Navigation principale">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`sorea-navbar-link ${pathname === link.href ? "sorea-navbar-link--active" : ""}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <Link href={ctaHref} className="sorea-cta-btn">
            {sessionChecked || isAuthenticated ? ctaLabel : "Se connecter"}
          </Link>
        </div>
      </header>

      <style>{`
        .sorea-navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 40;
          display: flex;
          align-items: center;
          gap: 30px;
          height: 78px;
          padding: 7px 46px 7px 46px;
          pointer-events: all;
        }

        .sorea-logo-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 64px;
          height: 64px;
          flex-shrink: 0;
          overflow: hidden;
          border-radius: 999px;
          text-decoration: none;
          filter: drop-shadow(0 2px 2px rgba(35, 18, 58, 0.18));
        }

        .sorea-logo-link img {
          width: 64px;
          height: 64px;
          object-fit: cover;
        }

        .sorea-navbar-panel {
          display: flex;
          align-items: center;
          gap: 24px;
          flex: 1;
          min-width: 0;
          min-height: 66px;
          padding: 0 22px;
          border-radius: 46px;
          background: var(--color-Violet-Blanc);
          box-shadow: inset 0 -4px 2px 0 rgba(171, 160, 189, 0.76), 0 3px 13.6px 0 rgba(0, 0, 0, 0.13);
        }

        .sorea-navbar-nav {
          display: flex;
          align-items: center;
          gap: clamp(28px, 4.4vw, 56px);
          flex: 1;
          min-width: 0;
          overflow-x: auto;
          scrollbar-width: none;
          margin-left: 35px; /* Ajustez la valeur en pixels selon le décalage souhaité */
        }

        .sorea-navbar-nav::-webkit-scrollbar {
          display: none;
        }

        .sorea-navbar-link {
          position: relative;
          padding: 4px 0;
          color: var(--color-SOREA-V1);
          font-family: var(--font-inria-sans), serif;
          font-size: 16px;
          font-weight: 500;
          line-height: 1;
          letter-spacing: 0;
          text-decoration: none;
          white-space: nowrap;
          transition: color 0.18s ease, transform 0.18s ease;
        }

        .sorea-navbar-link::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: -7px;
          height: 2px;
          border-radius: 999px;
          background: linear-gradient(90deg, #8b47ff, #ff80c4);
          opacity: 0;
          transition: opacity 0.18s ease;
        }

        sorea-navbar-link:hover,
        .sorea-navbar-link--active {
          color: #7133b8;
        }

        .sorea-navbar-link:hover::after {
          opacity: 1;
        }

        .sorea-cta-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 150px;
          min-height: 42px;
          padding: 12px 22px;
          flex-shrink: 0;
          border-radius: 40px;
          background: var(--color-SOREA-V1);
          color: #fff;
          font-family: var(--font-inria-sans), serif;
          font-size: 16px;
          font-weight: 700;
          line-height: 1;
          letter-spacing: 0;
          text-decoration: none;
          white-space: nowrap;
          
        }

        .sorea-cta-btn:hover {
          background: #7133b8;
        }

        @media (max-width: 768px) {
          .sorea-navbar {
            gap: 12px;
            height: auto;
            min-height: 78px;
            padding: 8px 14px;
          }

          .sorea-logo-link,
          .sorea-logo-link img {
            width: 56px;
            height: 56px;
          }

          .sorea-navbar-panel {
            min-height: 58px;
            padding: 0 16px;
            gap: 16px;
            border-radius: 16px;
          }

          .sorea-navbar-nav {
            gap: 20px;
          }

          .sorea-navbar-link {
            font-size: 15px;
          }

          .sorea-cta-btn {
            display: none;
          }
        }
      `}</style>
    </>
  );
}