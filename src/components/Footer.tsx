export default function Footer(){
  return (
    <footer className="mt-20 border-t border-white/50 py-10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-foreground/70">
        <div>© {new Date().getFullYear()} SOREA — Sérénité, équilibre et alignement.</div>
        <div className="flex gap-5">
          <a className="hover:text-foreground transition-colors" href="#">Privacy</a>
          <a className="hover:text-foreground transition-colors" href="#">Terms</a>
          <a className="hover:text-foreground transition-colors" href="#">Contact</a>
        </div>
      </div>
    </footer>
  );
}
