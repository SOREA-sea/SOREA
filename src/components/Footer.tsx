import Link from 'next/link';

export default function Footer(){
  return (
    <footer className="mt-20 border-t border-white/50 py-10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-foreground/70">
        <div>© {new Date().getFullYear()} SOREA — Sérénité, équilibre et alignement.</div>
        <div className="flex gap-5">
          <Link href="/termandprivacy" className="hover:text-foreground transition-colors">Privacy</Link>
          <Link href="/termandprivacy" className="hover:text-foreground transition-colors">Terms</Link>
          <Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link>
        </div>
      </div>
    </footer>
  );
}