import Link from 'next/link';
import Image from 'next/image';
import CartDropdown from './CartDropdown';

export default function Navbar({ isLoggedIn = false }: { isLoggedIn?: boolean }){
  return (
    <header className="w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between sticky top-0 z-30">
      <Link href="/" className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-full bg-white/80 flex items-center justify-center shadow overflow-hidden ring-1 ring-white/80 backdrop-blur">
          <Image src="/images/logo_sorea.webp" alt="SOREA" width={40} height={40} />
        </div>
        <div className="text-sm tracking-[0.35em] text-foreground/70">S O R E A</div>
      </Link>
      <nav className="hidden md:flex gap-2 items-center rounded-full border border-white/70 bg-white/55 px-2 py-2 shadow-sm backdrop-blur">
        <Link href="/#products" className="text-sm px-4 py-2 rounded-full hover:bg-white/70 transition-colors">Boutique</Link>
        <Link href="/#sessions" className="text-sm px-4 py-2 rounded-full hover:bg-white/70 transition-colors">Séances</Link>
        <Link href="/#testimonials" className="text-sm px-4 py-2 rounded-full hover:bg-white/70 transition-colors">Avis</Link>
        <CartDropdown />
        {isLoggedIn ? (
          <Link href="/dashboard" className="btn-primary">Dashboard</Link>
        ) : (
          <Link href="/login" className="btn-primary">Se connecter</Link>
        )}
      </nav>
    </header>
  );
}