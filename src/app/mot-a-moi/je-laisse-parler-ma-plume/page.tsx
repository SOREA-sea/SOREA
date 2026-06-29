'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const defaultAffirmation = "Ta phrase du jour se charge...";

export default function JeLaisseParleMaPlume() {
    const [currentSentence, setCurrentSentence] = useState(defaultAffirmation);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [userInput, setUserInput] = useState('');
    const [showReveal, setShowReveal] = useState(false);
    const [phase, setPhase] = useState<string | null>(null);

    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    const normalizedTarget = currentSentence.toLowerCase();
    const normalizedInput = userInput.toLowerCase();
    const firstErrorIndex = (() => {
        for (let index = 0; index < userInput.length; index += 1) {
            const expected = normalizedTarget[index];
            const actual = normalizedInput[index];
            if (expected !== actual) {
                return index;
            }
        }
        return -1;
    })();

    const hasError = firstErrorIndex !== -1;
    const isCorrect = !hasError && userInput.length > 0 && normalizedInput === normalizedTarget;
    const feedback: 'correct' | 'incorrect' | null = !userInput
        ? null
        : isCorrect
            ? 'correct'
            : 'incorrect';

    useEffect(() => {
        async function loadAffirmation() {
            try {
                const response = await fetch('/api/mot-a-moi/daily-affirmation');
                if (!response.ok) throw new Error('Erreur de chargement');
                const data = await response.json();
                setCurrentSentence(data.affirmation || defaultAffirmation);
                setPhase(data.phase || null);
            } catch (err) {
                console.error(err);
                setError('Impossible de charger la phrase du jour.');
                setCurrentSentence('Je me connecte à ma force interieure.');
            } finally {
                setIsLoading(false);
            }
        }

        loadAffirmation();
    }, []);

    const isComplete = feedback === 'correct' && !isLoading;

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [userInput, currentSentence]);

    const handleReveal = () => {
        setShowReveal(true);
    };

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
                    <p className="text-center text-gray-600 max-w-2xl">
                        Réécris la phrase affichée. Les lettres incorrectes deviennent rouges et la validation se fait automatiquement.
                    </p>

                    <div className="w-full">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Phrase du jour :
                        </label>
                        <div className="relative">
                            <div className="absolute inset-0 min-h-[140px] w-full p-4 border-2 border-[#8B47FF] rounded-2xl bg-white text-left text-lg leading-7 font-sans text-gray-300 whitespace-pre-wrap break-words z-0">
                                {currentSentence}
                            </div>

                            <div className="pointer-events-none absolute inset-0 min-h-[140px] w-full p-4 rounded-2xl text-left text-lg leading-7 font-sans whitespace-pre-wrap break-words z-10">
                                {currentSentence.split('').map((char, index) => {
                                    const isTyped = index < userInput.length;
                                    const expected = currentSentence[index];
                                    const actual = userInput[index] ?? '';
                                    const isCorrectChar = isTyped && actual.toLowerCase() === expected.toLowerCase();
                                    const isErrorChar = isTyped && !isCorrectChar && index === firstErrorIndex;

                                    return (
                                        <span
                                            key={`${char}-${index}`}
                                            className={
                                                isErrorChar
                                                    ? 'text-red-500'
                                                    : isCorrectChar
                                                        ? 'text-violet-600'
                                                        : 'text-gray-300'
                                            }
                                        >
                                            {char}
                                        </span>
                                    );
                                })}
                            </div>

                            <textarea
                                ref={textareaRef}
                                value={userInput}
                                onChange={(e) => {
                                    const rawValue = e.target.value;
                                    if (rawValue.length > currentSentence.length) {
                                        return;
                                    }

                                    let nextValue = rawValue;
                                    const lowerValue = rawValue.toLowerCase();
                                    const expected = currentSentence.toLowerCase();
                                    let errorIndex = -1;

                                    for (let index = 0; index < lowerValue.length; index += 1) {
                                        if (lowerValue[index] !== expected[index]) {
                                            errorIndex = index;
                                            break;
                                        }
                                    }

                                    if (errorIndex !== -1) {
                                        nextValue = rawValue.slice(0, errorIndex + 1);
                                    }

                                    setUserInput(nextValue);
                                    setShowReveal(false);
                                }}
                                className="absolute inset-0 w-full h-full p-4 border-2 border-transparent rounded-2xl bg-transparent text-transparent caret-transparent resize-none overflow-hidden focus:outline-none focus:ring-transparent z-20"
                                rows={4}
                                aria-label="Réécris la phrase du jour"
                            />
                        </div>
                    </div>

                    {showReveal && (
                        <div className="w-full bg-yellow-50 border-2 border-yellow-400 rounded-2xl p-4">
                            <p className="text-sm font-semibold text-yellow-800 mb-2">La phrase correcte :</p>
                            <p className="text-lg text-yellow-900">{currentSentence}</p>
                        </div>
                    )}

                    {!isLoading && feedback === 'correct' && (
                        <div className="w-full bg-green-50 border-2 border-green-400 rounded-2xl p-4 text-center">
                            <p className="text-lg font-bold text-green-700">Bravo, c&apos;est correct !</p>
                        </div>
                    )}

                    {!isLoading && feedback === 'incorrect' && !showReveal && (
                        <div className="w-full bg-red-50 border-2 border-red-400 rounded-2xl p-4 text-center">
                            <p className="text-lg font-bold text-red-700">Ce n&apos;est pas tout à fait ça...</p>
                        </div>
                    )}

                    {isComplete && (
                        <div className="w-full bg-blue-50 border-2 border-blue-400 rounded-2xl p-4 text-center">
                            <p className="text-lg font-bold text-blue-700">La phrase est validée automatiquement.</p>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-4 w-full justify-between items-center">

                        {phase && (
                            <span className="text-sm text-gray-600">Phase : {phase}</span>
                        )}
                    </div>

                    {!isLoading && error && (
                        <p className="text-center text-red-600 text-sm">{error}</p>
                    )}

                    {isComplete && (
                        <div className="w-full bg-purple-50 border-2 border-purple-400 rounded-2xl p-4 text-center">
                            <p className="text-lg font-bold text-purple-700">Tu as recopié la phrase du jour avec succès.</p>
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
