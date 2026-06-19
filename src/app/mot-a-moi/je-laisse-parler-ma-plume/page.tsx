'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const sentences = [
    "J'ai peur de l'avenir mais j'avance avec confiance",
    "Mes erreurs m'ont appris à être plus forte",
    "Je mérite l'amour et le respect",
    "Chaque jour est une nouvelle opportunité",
    "Je suis capable de réaliser mes rêves",
    "Ma voix compte et mérite d'être entendue",
];

export default function JeLaisseParleMaPlume() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userInput, setUserInput] = useState('');
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
    const [completedCount, setCompletedCount] = useState(0);
    const [showReveal, setShowReveal] = useState(false);

    const currentSentence = sentences[currentIndex];
    const normalizedTarget = currentSentence.toLowerCase();
    const normalizedInput = userInput.toLowerCase();
    const isCorrect = normalizedInput.trim() === normalizedTarget.trim();
    const inputHasAnyText = userInput.length > 0;
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [userInput, currentIndex]);

    useEffect(() => {
        if (isCorrect) {
            setFeedback('correct');
            setCompletedCount((count) => count + 1);
            const timeout = window.setTimeout(() => {
                if (currentIndex < sentences.length - 1) {
                    setCurrentIndex((index) => index + 1);
                    setUserInput('');
                    setFeedback(null);
                    setShowReveal(false);
                }
            }, 1200);

            return () => window.clearTimeout(timeout);
        }

        if (inputHasAnyText && !isCorrect) {
            setFeedback('incorrect');
        } else if (!inputHasAnyText) {
            setFeedback(null);
        }
    }, [isCorrect, inputHasAnyText, currentIndex]);

    const handleSkip = () => {
        setShowReveal(true);
    };

    const handleNext = () => {
        if (currentIndex < sentences.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setUserInput('');
            setFeedback(null);
            setShowReveal(false);
        }
    };

    const isGameFinished = currentIndex === sentences.length - 1 && feedback === 'correct';

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-50 to-[#f9f5fa] font-sans text-gray-800 relative items-center">
            <div className="w-[1440px] pr-[96px] pl-[96px] mx-auto pb-[24px]">
                <Navbar />
            </div>

            <main className="flex flex-col flex-grow items-center mx-auto w-[1440px] pt-[50px] pr-[96px] pb-[24px] pl-[96px]">
                <div className="w-full mb-6">
                    <Link href="/mot-a-moi">
                        <button className="flex items-center gap-2 bg-white text-[#8B47FF] font-bold px-6 py-3 rounded-2xl shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer border-2 border-[#8B47FF]">
                            ← Retour
                        </button>
                    </Link>
                </div>

                <div className="flex-grow flex flex-col items-center justify-center min-h-[400px] gap-8 w-full max-w-2xl">
                    <h1 className="text-4xl font-bold text-[#8B47FF] text-center">Je laisse parler ma plume</h1>

                    {!isGameFinished ? (
                        <>
                            <div className="w-full">
                                <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-[#8B47FF]">
                                    <p className="text-sm text-gray-500 mb-2">Phrase {currentIndex + 1} / {sentences.length}</p>
                                    <p className="text-2xl font-semibold text-center text-[#8B47FF] mb-4">
                                        {currentSentence}
                                    </p>
                                    <div className="w-full h-1 bg-gray-200 rounded-full">
                                        <div
                                            className="h-full bg-gradient-to-r from-[#8B47FF] to-[#6D3AE0] rounded-full transition-all duration-300"
                                            style={{ width: `${((currentIndex + 1) / sentences.length) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>

                            <div className="w-full">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Réécrire la phrase :
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-0 min-h-[120px] w-full p-4 border-2 border-[#8B47FF] rounded-2xl bg-white text-left text-lg leading-7 font-sans text-gray-300 whitespace-pre-wrap break-words z-0">
                                        {currentSentence}
                                    </div>

                                    <div className="pointer-events-none absolute inset-0 min-h-[120px] w-full p-4 rounded-2xl text-left text-lg leading-7 font-sans whitespace-pre-wrap break-words z-10">
                                        {currentSentence.split('').map((char, index) => {
                                            const userChar = userInput[index] ?? '';
                                            const isMatch = userChar.toLowerCase() === char.toLowerCase();

                                            return (
                                                <span
                                                    key={`${char}-${index}`}
                                                    className={
                                                        !userInput[index]
                                                            ? 'text-transparent'
                                                            : isMatch
                                                                ? 'text-black'
                                                                : 'text-red-500'
                                                    }
                                                >
                                                    {userChar || char}
                                                </span>
                                            );
                                        })}
                                        {userInput.length > currentSentence.length && (
                                            <span className="text-red-500">
                                                {userInput.slice(currentSentence.length)}
                                            </span>
                                        )}
                                    </div>

                                    <textarea
                                        ref={textareaRef}
                                        value={userInput}
                                        onChange={(e) => setUserInput(e.target.value)}
                                        className="absolute inset-0 w-full h-full p-4 border-2 border-transparent rounded-2xl bg-transparent text-transparent caret-transparent resize-none overflow-hidden focus:outline-none focus:ring-transparent z-20"
                                        rows={3}
                                    />
                                </div>
                            </div>

                            {showReveal && (
                                <div className="w-full bg-yellow-50 border-2 border-yellow-400 rounded-2xl p-4">
                                    <p className="text-sm font-semibold text-yellow-800 mb-2"> La phrase correcte :</p>
                                    <p className="text-lg text-yellow-900">{currentSentence}</p>
                                </div>
                            )}

                            {feedback === 'correct' && (
                                <div className="w-full bg-green-50 border-2 border-green-400 rounded-2xl p-4 text-center">
                                    <p className="text-lg font-bold text-green-700">✅Bravo ! C&apos;est correct !</p>
                                </div>
                            )}

                            {feedback === 'incorrect' && !showReveal && (
                                <div className="w-full bg-red-50 border-2 border-red-400 rounded-2xl p-4 text-center">
                                    <p className="text-lg font-bold text-red-700"> Ce n&apos;est pas tout à fait ça...</p>
                                </div>
                            )}

                            <div className="flex gap-4 w-full">
                                {!showReveal && (
                                    <button
                                        onClick={handleSkip}
                                        className="flex-1 bg-white text-[#8B47FF] font-bold px-6 py-3 rounded-2xl shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer border-2 border-[#8B47FF]"
                                    >
                                        Voir la réponse
                                    </button>
                                )}

                                {(showReveal || feedback === 'incorrect') && currentIndex < sentences.length - 1 && (
                                    <button
                                        onClick={handleNext}
                                        className="flex-1 bg-white text-[#8B47FF] font-bold px-6 py-3 rounded-2xl shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer border-2 border-[#8B47FF]"
                                    >
                                        Suivant
                                    </button>
                                )}
                            </div>

                            <p className="text-center text-gray-600 text-sm">
                                Phrases réussies : <span className="font-bold text-[#8B47FF]">{completedCount} / {sentences.length}</span>
                            </p>
                        </>
                    ) : (
                        <div className="flex flex-col items-center gap-6 text-center">
                            <div className="text-6xl"></div>
                            <h2 className="text-3xl font-bold text-[#8B47FF]">Bravo !</h2>
                            <p className="text-xl text-gray-700">Vous avez complété tous les défis ! </p>
                            <p className="text-gray-600">Vous avez réécrire {completedCount} phrases avec succès.</p>

                            <Link href="/mot-a-moi">
                                <button className="bg-gradient-to-r from-[#8B47FF] to-[#6D3AE0] text-white font-bold px-8 py-4 rounded-2xl shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer">
                                    ← Retour au menu
                                </button>
                            </Link>
                        </div>
                    )}
                </div>
            </main>

            <div className="w-[1440px] pr-[96px] pl-[96px] mx-auto pb-[24px]">
                <Footer />
            </div>
        </div>
    );
}
