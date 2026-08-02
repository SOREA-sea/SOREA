"use client";

import React, { useState, useEffect, useRef } from "react";
import { Bot, X, Send, User } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "model";
  content: string;
}

export default function Chatbot() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "model", content: "Bonjour ! Je suis l'assistant SOREA. Comment puis-je vous aider aujourd'hui ?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    // Scroll automatically to bottom when messages change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Trop de requêtes, veuillez patienter.");
        }
        throw new Error("Erreur de communication avec l'IA");
      }

      const data = await response.json();
      setMessages((prev) => [...prev, { role: "model", content: data.text }]);
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : "Désolé, une erreur s'est produite lors de la génération de la réponse.";
      setMessages((prev) => [
        ...prev,
        { role: "model", content: errorMessage }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen ? (
        <div className="w-80 md:w-96 h-96 rounded-2xl shadow-2xl flex flex-col overflow-hidden mb-4 border border-[rgba(117,94,173,0.16)]">
          <div className="bg-gradient-to-r from-[#8B47FF] to-[#BA98F4] p-4 text-white flex justify-between items-center shadow-sm">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-gradient-to-r from-[#C0ACFF] to-[#F4C4E4] p-[1.5px] flex items-center justify-center">
                <div className="w-full h-full rounded-full flex items-center justify-center overflow-hidden">
                  <img src="/image_Design-SOREA/meduse_bulle.png" alt="Meduse" className="w-full h-full object-cover" />
                </div>
              </div>
              <span className="font-semibold text-lg font-['Inria_Sans']">Assistant SOREA</span>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          {isAuthenticated ? (
            <>
              <div className="flex-1 overflow-y-auto p-4 bg-[#faf7ff] flex flex-col gap-3">
                {messages.map((msg, index) => (
                  <div 
                    key={index} 
                    className={`flex gap-2 max-w-[85%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}
                  >
                    {msg.role === "user" ? (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                      <User size={16} />
                    </div>
                  ) : (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-[#C0ACFF] to-[#F4C4E4] p-[2px] flex items-center justify-center">
                      <div className="w-full h-full rounded-full flex items-center justify-center overflow-hidden">
                        <img src="/image_Design-SOREA/meduse.png" alt="Meduse" className="w-full h-full object-cover" />
                      </div>
                    </div>
                  )}
                    <div className={`p-3 rounded-2xl ${msg.role === "user" ? "text-[#2b2540] border border-[rgba(117,94,173,0.16)] text-sm shadow-sm rounded-tr-sm" : "text-[#2b2540] border border-[rgba(117,94,173,0.16)] text-sm shadow-sm rounded-tl-sm"}`}>
                      {msg.role === "model" ? (
                        <div className="text-sm">
                          <ReactMarkdown
                            components={{
                              p: ({...props}) => <p className="mb-2 last:mb-0" {...props} />,
                              ul: ({...props}) => <ul className="list-disc ml-4 mb-2" {...props} />,
                              ol: ({...props}) => <ol className="list-decimal ml-4 mb-2" {...props} />,
                              li: ({...props}) => <li className="mb-1" {...props} />,
                              strong: ({...props}) => <strong className="font-semibold text-gray-900" {...props} />
                            }}
                          >
                            {msg.content}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        msg.content
                      )}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-2 max-w-[85%] mr-auto">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-[#C0ACFF] to-[#F4C4E4] p-[2px] flex items-center justify-center">
                      <div className="w-full h-full rounded-full flex items-center justify-center overflow-hidden">
                        <img src="/image_Design-SOREA/meduse.png" alt="Meduse" className="w-full h-full object-cover" />
                      </div>
                    </div>

                    <div className="p-3 text-[#2b2540] border border-[rgba(117,94,173,0.16)] rounded-2xl rounded-tl-sm text-sm shadow-sm flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-[#9B8FD9] rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                      <div className="w-1.5 h-1.5 bg-[#9B8FD9] rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                      <div className="w-1.5 h-1.5 bg-[#9B8FD9] rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-3 border-t border-[rgba(117,94,173,0.16)] flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Écrivez votre message..."
                  className="flex-1 border border-[rgba(117,94,173,0.16)] rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#9B8FD9] text-[#2b2540]"
                />
                <button
                  onClick={sendMessage}
                  disabled={isLoading || !input.trim()}
                  className="w-10 h-10 rounded-full bg-gradient-to-r from-[#8B47FF] to-[#BA98F4] text-white flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  <Send size={18} className="ml-1" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-[#faf7ff]">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#C0ACFF] to-[#F4C4E4] p-[3px] flex items-center justify-center mb-4">
                <div className="w-full h-full rounded-full flex items-center justify-center overflow-hidden">
                  <img src="/image_Design-SOREA/meduse.png" alt="Meduse" className="w-full h-full object-cover" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-[#2b2540] mb-2 font-['Inria_Sans']">Connexion requise</h3>
              <p className="text-sm text-[#4d4d57] mb-6">
                Connectez-vous pour parler avec l&apos;assistant SOREA ou pour découvrir nos coachings personnalisés.
              </p>
              <Link 
                href="/login"
                className="bg-gradient-to-r from-[#8B47FF] to-[#BA98F4] text-white px-6 py-2.5 rounded-full font-medium hover:opacity-90 transition-opacity text-sm shadow-sm"
                onClick={() => setIsOpen(false)}
              >
                Se connecter
              </Link>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-gradient-to-r from-[#8B47FF] to-[#BA98F4] rounded-full shadow-[0_20px_60px_rgba(67,56,114,0.12)] flex items-center justify-center text-white hover:scale-105 transition-all duration-300"
          aria-label="Ouvrir l'assistant"
        >
          <div className="rounded-full flex items-center justify-center overflow-hidden p-1">
            <img 
              src="/image_Design-SOREA/meduse.png" 
              alt="Meduse" 
              className="w-full h-full object-cover"
            />
          </div>
        </button>
      )}
    </div>
  );
}
