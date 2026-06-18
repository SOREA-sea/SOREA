'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function EcrirePourMonFuturMoi() {
    const [message, setMessage] = useState('');
    const [savedMessages, setSavedMessages] = useState<Array<{ id: string; content: string; date: string }>>([]);
    const [showForm, setShowForm] = useState(true);
    const [successMessage, setSuccessMessage] = useState('');

    const handleSave = () => {
        if (message.trim() === '') {
            alert('Veuillez écrire un message avant de sauvegarder.');
            return;
        }

        const newMessage = {
            id: Date.now().toString(),
            content: message,
            date: new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })
        };

        setSavedMessages([...savedMessages, newMessage]);
        setMessage('');
        setSuccessMessage('Message sauvegardé avec succès ! ');
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    const handleDelete = (id: string) => {
        setSavedMessages(savedMessages.filter(msg => msg.id !== id));
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

                <div className="flex-grow flex flex-col items-center justify-start w-full gap-8">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-[#8B47FF] mb-2">Écrire pour mon futur moi</h1>
                        <p className="text-gray-600 text-lg">Écrivez des messages encourageants à votre futur vous-même </p>
                    </div>

                    {successMessage && (
                        <div className="w-full max-w-2xl bg-green-50 border-2 border-green-400 rounded-2xl p-4 text-center">
                            <p className="text-lg font-bold text-green-700">{successMessage}</p>
                        </div>
                    )}

                    <div className="w-full max-w-2xl">
                        <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-[#8B47FF]">
                            <label className="block text-lg font-semibold text-gray-800 mb-4">
                                Votre message :
                            </label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Écrivez ce que vous aimeriez dire à votre futur moi. Soyez sincère, encourageante, aimable..."
                                className="w-full p-4 border-2 border-[#8B47FF] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#8B47FF] resize-none text-gray-700"
                                rows={6}
                            />
                            <div className="mt-4 text-sm text-gray-500">
                                {message.length} caractères
                            </div>
                            <button
                                onClick={handleSave}
                                className="w-full mt-6 bg-gradient-to-r from-[#8B47FF] to-[#6D3AE0] text-white font-bold px-6 py-3 rounded-2xl shadow-md transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer"
                            >
                                Sauvegarder le message
                            </button>
                        </div>
                    </div>

                    {savedMessages.length > 0 && (
                        <div className="w-full max-w-2xl">
                            <h2 className="text-2xl font-bold text-[#8B47FF] mb-4">Mes messages sauvegardés ({savedMessages.length})</h2>
                            <div className="flex flex-col gap-4">
                                {savedMessages.map((msg) => (
                                    <div key={msg.id} className="bg-white rounded-2xl p-6 shadow-lg border-2 border-[#E8D5F2]">
                                        <div className="flex justify-between items-start mb-2">
                                            <p className="text-sm text-gray-500 font-medium">{msg.date}</p>
                                            <button
                                                onClick={() => handleDelete(msg.id)}
                                                className="text-red-500 hover:text-red-700 font-bold text-lg transition-colors"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                        <p className="text-gray-800 whitespace-pre-wrap">{msg.content}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {savedMessages.length === 0 && message === '' && (
                        <div className="w-full max-w-2xl text-center py-12">
                            <p className="text-2xl mb-4"></p>
                            <p className="text-gray-600 text-lg">Aucun message sauvegardé pour le moment.</p>
                            <p className="text-gray-500">Commencez à écrire pour votre futur moi !</p>
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
