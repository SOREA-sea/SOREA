"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
// on doit changer les # apresss
const NAV_LINKS = [
  { label: "Shopping", href: "#products" },
  { label: "Coaching", href: "#sessions" },
  { label: "Devenir ambassadrice", href: "/register" },
  { label: "Challenge", href: "#community" },
  { label: "Vibe", href: "#" },
  { label: "Mon carnet", href: "#" },
];

export default function Navbar({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = () => { if (timerRef.current) clearTimeout(timerRef.current); setVisible(true); };
  const hide = () => { timerRef.current = setTimeout(() => setVisible(false), 250); };

  return (
    <>
      <Link
        href={isLoggedIn ? "/dashboard" : "/login"}
        className="sorea-cta-float-btn"
        onMouseEnter={show}
        onMouseLeave={hide}
      >
        {isLoggedIn ? "Mon espace" : "Se connecter"}
      </Link>

      <div className="sorea-hotzone" onMouseEnter={show} onMouseLeave={hide} />

      <header
        className={`sorea-navbar ${visible ? "sorea-navbar--visible" : ""}`}
        onMouseEnter={show}
        onMouseLeave={hide}
      >
        <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none", flexShrink: 0 }}>
          <Image src="/images/logo_sorea.webp" alt="Logo SOREA" width={54} height={54} priority />
        </Link>

        <nav className="sorea-navbar-nav">
          {NAV_LINKS.map((link) => (
            <Link key={link.label} href={link.href} className="sorea-navbar-link">
              {link.label}
            </Link>
          ))}
        </nav>
      </header>

      <style>{`
        .sorea-cta-float-btn {
          position: fixed;
          top: 22px;
          right: 56px;
          z-index: 60;
          font-family: var(--font-inria-sans), serif;
          font-weight: 700;
          font-size: 15px;
          letter-spacing: 0.04em;
          border-radius: 20px;
          padding: 11px 28px;
          white-space: nowrap;
          text-decoration: none;
          display: inline-block;
          flex-shrink: 0;
          background: #9B6FD9;
          color: #fff;
          border: 3px solid #9B6FD9;
          transition: background 0.22s ease, color 0.22s ease, border-color 0.22s ease;
        }

        .sorea-cta-float-btn:hover {
          background: #fff;
          color: #9B6FD9;
        }

        .sorea-hotzone {
          position: fixed;
          top: 0; left: 0; right: 0;
          height: 16px;
          z-index: 50;
        }

        .sorea-navbar {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 40;
          height: 84px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 56px;
          background: linear-gradient(90deg, #ddd8ef 0%, #e4dff2 40%, #ecdfe8 100%);
          border-bottom: 1px solid rgba(180,170,210,0.3);
          opacity: 0;
          transform: translateY(-100%);
          transition: opacity 0.28s ease, transform 0.28s ease;
          pointer-events: none;
        }

        .sorea-navbar--visible {
          opacity: 1;
          transform: translateY(0);
          pointer-events: all;
        }

        .sorea-navbar-nav {
          display: flex;
          align-items: center;
          gap: 28px;
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
        }

        /* ── Liens : blanc + contour violet par défaut ── */
        .sorea-navbar-link {
          font-family: var(--font-inria-sans), serif;
          font-weight: 700;
          font-size: 18px;
          letter-spacing: 0.05em;
          text-decoration: none;
          white-space: nowrap;
          position: relative;
          padding: 4px 0;
          color: #fff;
          -webkit-text-stroke: 3px var(--color-sorea-navBar);
          paint-order: stroke fill;
          transition: transform 0.18s ease, -webkit-text-stroke 0.2s ease;
          transform-origin: center;
        }

        /* Soulignement dégradé direct (sans animation) */
        .sorea-navbar-link::after {
          content: '';
          position: absolute;
          left: 0; right: 0; bottom: -3px;
          height: 2px;
          border-radius: 2px;
          background: linear-gradient(259.12deg, #8b47ff, #f498c5);
          opacity: 0;
          transition: opacity 0.18s ease;
        }

        /* Hover : texte en dégradé + soulignement direct + petit pop */
        .sorea-navbar-link:hover {
          background-image: linear-gradient(259.12deg, #8b47ff, #f498c5);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          -webkit-text-stroke: 0px transparent;
          transform: scale(1.08);
        }

        .sorea-navbar-link:hover::after {
          opacity: 1;
        }

      `}</style>
    </>
  );
}