import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-[#b291db]">404</h1>
        <h2 className="text-3xl font-semibold text-gray-800 mt-4 mb-2">Page introuvable</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <Link 
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#a881cf] hover:bg-[#8766b4] transition-colors"
        >
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}
