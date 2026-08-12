'use client'; // Error components must be Client Components

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-[#b291db]">500</h1>
        <h2 className="text-3xl font-semibold text-gray-800 mt-4 mb-2">Erreur serveur</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Oups ! Une erreur inattendue s'est produite.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#a881cf] hover:bg-[#8766b4] transition-colors"
          >
            Réessayer
          </button>
          <Link 
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 border border-[#a881cf] text-base font-medium rounded-md text-[#a881cf] bg-white hover:bg-gray-50 transition-colors"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
