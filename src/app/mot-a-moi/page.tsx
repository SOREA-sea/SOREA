"use client";

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CalendarDays, FileAudio, ImageIcon, Inbox, Upload, Video } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const mediaOptions = [
  {
    label: "Photo",
    accept: "image/*",
    icon: ImageIcon,
    helper: "JPG, PNG ou WEBP",
  },
  {
    label: "Audio",
    accept: "audio/*",
    icon: FileAudio,
    helper: "MP3, WAV, M4A",
  },
  {
    label: "Vidéo",
    accept: "video/mp4",
    icon: Video,
    helper: "MP4 uniquement",
  },
];

export default function MotAMoiPage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const previewUrlRef = useRef<string | null>(null);
  const [selectedAccept, setSelectedAccept] = useState(mediaOptions[0].accept);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  const openPicker = (accept: string) => {
    setSelectedAccept(accept);
    window.setTimeout(() => fileInputRef.current?.click(), 0);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }

    setFile(selectedFile);
    const nextPreviewUrl = selectedFile ? URL.createObjectURL(selectedFile) : null;
    previewUrlRef.current = nextPreviewUrl;
    setPreviewUrl(nextPreviewUrl);
    setMessage(null);
    if (selectedFile && !title) {
      setTitle(selectedFile.name.replace(/\.[^/.]+$/, ""));
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);

    if (!file) {
      setMessage({ type: "error", text: "Ajoute une photo, un audio ou une vidéo avant d'envoyer." });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("note", note);
    formData.append("deliveryDate", deliveryDate);

    setIsUploading(true);
    try {
      const response = await fetch("/api/mot-a-moi/messages", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Impossible d'enregistrer ce message.");
      }

      setFile(null);
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
        previewUrlRef.current = null;
      }
      setPreviewUrl(null);
      setTitle("");
      setNote("");
      setDeliveryDate("");
      if (fileInputRef.current) fileInputRef.current.value = "";
      setMessage({ type: "success", text: "Ton message a été ajouté à ta messagerie Mot à moi." });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Une erreur est survenue.";
      setMessage({ type: "error", text: errorMessage });
    } finally {
      setIsUploading(false);
    }
  };

  const renderPreview = () => {
    if (!file || !previewUrl) {
      return (
        <div className="flex h-full min-h-[320px] flex-col items-center justify-center gap-4 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-[28px] bg-[#8B47FF]/10 text-[#8B47FF]">
            <Upload className="h-10 w-10" />
          </div>
          <div>
            <p className="text-2xl font-black text-[#2f2238]">Importe ton message du futur</p>
            <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500">
              Choisis une photo, un audio ou une vidéo MP4 à recevoir plus tard dans ton espace personnel.
            </p>
          </div>
        </div>
      );
    }

    if (file.type.startsWith("image/")) {
      return <img src={previewUrl} alt="Aperçu du message" className="h-full min-h-[320px] w-full rounded-[28px] object-cover" />;
    }

    if (file.type.startsWith("audio/")) {
      return (
        <div className="flex h-full min-h-[320px] flex-col items-center justify-center gap-5 rounded-[28px] bg-white/70">
          <FileAudio className="h-16 w-16 text-[#8B47FF]" />
          <p className="max-w-sm text-center font-semibold text-[#2f2238]">{file.name}</p>
          <audio controls src={previewUrl} className="w-full max-w-md" />
        </div>
      );
    }

    return <video controls src={previewUrl} className="h-full min-h-[320px] w-full rounded-[28px] bg-black object-contain" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-[#f9f5fa] font-sans text-gray-800">
      <div className="mx-auto w-full max-w-7xl px-6 pb-6">
        <Navbar />
      </div>

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 pb-14 pt-24">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <Link href="/challenge" className="mb-5 inline-flex items-center rounded-full border border-[#8B47FF]/30 bg-white px-5 py-2.5 text-sm font-bold text-[#8B47FF] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              Retour
            </Link>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#8B47FF]/60">Mot à moi</p>
            <h1 className="mt-2 text-4xl font-black text-[#2f2238] md:text-5xl">Message pour mon futur moi</h1>
            <p className="mt-3 max-w-2xl text-gray-600">
              Envoie-toi une photo, un audio ou une vidéo à retrouver dans ta messagerie personnelle le jour choisi.
            </p>
          </div>

          <Link href="/dashboard/messagerie" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#8B47FF] px-6 py-3 font-bold text-white shadow-lg shadow-purple-200 transition hover:-translate-y-0.5 hover:bg-[#7432e6]">
            <Inbox className="h-5 w-5" />
            Ma messagerie
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          <section className="rounded-[32px] border border-white/80 bg-white/70 p-4 shadow-xl shadow-purple-100/70 backdrop-blur">
            <div className="relative min-h-[360px] overflow-hidden rounded-[28px] bg-gradient-to-br from-[#f7efff] via-white to-[#fff8fb] p-3">
              {renderPreview()}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept={selectedAccept}
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {mediaOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.label}
                    type="button"
                    onClick={() => openPicker(option.accept)}
                    className="flex items-center gap-3 rounded-2xl border border-purple-100 bg-white/85 px-4 py-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[#8B47FF]/50 hover:shadow-md"
                    title={`Importer ${option.label.toLowerCase()}`}
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#8B47FF]/10 text-[#8B47FF]">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span>
                      <span className="block font-black text-[#2f2238]">{option.label}</span>
                      <span className="text-xs text-gray-500">{option.helper}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="rounded-[32px] border border-white/80 bg-white/75 p-6 shadow-xl shadow-purple-100/70 backdrop-blur">
              <h2 className="text-2xl font-black text-[#2f2238]">Programmer l&apos;envoi</h2>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                Le média apparaîtra dans l&apos;espace perso à la date choisie.
              </p>

            <div className="mt-6 space-y-5">
              <div>
                <label className="ml-1 text-sm font-bold text-[#2f2238]">Titre</label>
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  required
                  placeholder="Ex: Pour les jours de doute"
                  className="mt-2 w-full rounded-2xl border border-purple-100 bg-white px-4 py-3 outline-none transition focus:border-[#8B47FF] focus:ring-4 focus:ring-purple-100"
                />
              </div>

              <div>
                <label className="ml-1 text-sm font-bold text-[#2f2238]">Date de réception</label>
                <div className="relative mt-2">
                  <CalendarDays className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#8B47FF]" />
                  <input
                    type="date"
                    value={deliveryDate}
                    onChange={(event) => setDeliveryDate(event.target.value)}
                    required
                    className="w-full rounded-2xl border border-purple-100 bg-white py-3 pl-12 pr-4 outline-none transition focus:border-[#8B47FF] focus:ring-4 focus:ring-purple-100"
                  />
                </div>
              </div>

              <div>
                <label className="ml-1 text-sm font-bold text-[#2f2238]">Petit mot optionnel</label>
                <textarea
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  rows={5}
                  placeholder="Une intention, une phrase, une douceur..."
                  className="mt-2 w-full resize-none rounded-2xl border border-purple-100 bg-white px-4 py-3 outline-none transition focus:border-[#8B47FF] focus:ring-4 focus:ring-purple-100"
                />
              </div>

              {message && (
                <div className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${
                  message.type === "success"
                    ? "border-green-200 bg-green-50 text-green-700"
                    : "border-red-200 bg-red-50 text-red-600"
                }`}>
                  {message.text}
                </div>
              )}

              <button
                type="submit"
                disabled={isUploading}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#8B47FF] px-6 py-4 font-black text-white shadow-lg shadow-purple-200 transition hover:-translate-y-0.5 hover:bg-[#7432e6] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                <Upload className="h-5 w-5" />
                {isUploading ? "Envoi en cours..." : "Envoyer à mon futur moi"}
              </button>
            </div>
          </section>
        </form>
      </main>

      <div className="mx-auto w-full max-w-7xl px-6 pb-6">
        <Footer />
      </div>
    </div>
  );
}
