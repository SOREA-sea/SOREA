"use client";

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FileAudio, ImageIcon, Upload, Video } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const navItems = [
  { label: "Plume", href: "/mot-a-moi/je-laisse-parler-ma-plume" },
  { label: "Futur moi", href: "/mot-a-moi/ecrire-pour-mon-futur-moi" },
  { label: "Messagerie", href: "/dashboard/messagerie" },
  { label: "Challenge", href: "/challenge" },
];

const mediaOptions = [
  { label: "Photo", accept: "image/*", icon: ImageIcon, helper: "JPG, PNG ou WEBP" },
  { label: "Audio", accept: "audio/*", icon: FileAudio, helper: "MP3, WAV, M4A" },
  { label: "Video", accept: "video/mp4", icon: Video, helper: "MP4 uniquement" },
];

export default function MotAMoiPage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const previewUrlRef = useRef<string | null>(null);
  const [selectedAccept, setSelectedAccept] = useState(mediaOptions[0].accept);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [message, setMessage] = useState<string | null>(null);

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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("Ton mot est scellé. Il t'attendra au bon moment.");
  };

  const renderMediaPreview = () => {
    if (!file || !previewUrl) {
      return (
        <div className="flex min-h-[170px] flex-col items-center justify-center gap-3 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#8B47FF]/10 text-[#8B47FF]">
            <Upload className="h-7 w-7" />
          </div>
          <p className="text-sm font-bold text-[#2f2238]">Ajoute une photo, un audio ou une vidéo.</p>
          <p className="max-w-sm text-xs leading-relaxed text-[#7d53b2]">
            Ce média restera associé à ton mot à toi.
          </p>
        </div>
      );
    }

    if (file.type.startsWith("image/")) {
      return <img src={previewUrl} alt="Aperçu du message" className="max-h-[260px] w-full object-contain" />;
    }

    if (file.type.startsWith("audio/")) {
      return (
        <div className="flex min-h-[170px] flex-col items-center justify-center gap-4">
          <FileAudio className="h-12 w-12 text-[#8B47FF]" />
          <p className="text-center text-sm font-bold text-[#2f2238]">{file.name}</p>
          <audio controls src={previewUrl} className="w-full max-w-md" />
        </div>
      );
    }

    return <video controls src={previewUrl} className="max-h-[260px] w-full bg-black object-contain" />;
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#F4EBFF_0%,#FFFFFF_45%,#FEF0F9_100%)] text-[#2f2238]">
      <div className="mx-auto w-full max-w-[1440px] px-4 pb-6 md:px-12 lg:px-[96px]">
        <Navbar />
      </div>

      <main className="mx-auto w-full max-w-[860px] px-5 pb-16 pt-28 md:pt-36">
        <p className="mb-5 text-lg font-bold tracking-[0.12em] text-[#8B47FF]/70">Mots à moi</p>

        <nav className="mx-auto flex max-w-[690px] items-center justify-between rounded-full bg-[#F4EBFF] px-3 py-1 shadow-sm ring-1 ring-[#8B47FF]/15">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="rounded-full px-4 py-2 text-xs font-bold tracking-[0.12em] text-[#8B47FF] transition-colors hover:bg-white"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/challenge"
            className="rounded-full bg-[#8B47FF] px-6 py-2 text-xs font-bold uppercase tracking-[0.12em] text-white transition-shadow hover:ring-2 hover:ring-[#8B47FF]/30"
          >
            CTA
          </Link>
        </nav>

        <section className="mx-auto mt-24 max-w-[430px] text-center">
          <h1 className="text-3xl font-bold tracking-[0.08em] text-black">Headline/tittle</h1>
          <p className="mt-6 text-base leading-relaxed tracking-[0.04em] text-[#7d53b2]">
            Please add your content here. Keep it short and simple. And smile :)
          </p>
        </section>

        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-20 max-w-[700px] border-[4px] border-[#8B47FF] bg-white p-2 shadow-xl shadow-purple-100"
        >
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Title"
            required
            className="w-[76%] border-2 border-dotted border-[#8B47FF]/70 bg-white px-3 py-2 text-sm outline-none placeholder:text-[#8B47FF]/45 focus:border-solid"
            aria-label="Titre du mot"
          />

          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Please add your content here."
            required
            className="mt-2 min-h-[250px] w-full resize-none border-2 border-dotted border-[#8B47FF]/70 bg-white px-3 py-5 text-base outline-none placeholder:text-[#8B47FF]/45 focus:border-solid"
            aria-label="Contenu du mot"
          />

          <section className="mt-5 border-2 border-dotted border-[#8B47FF]/70 px-6 py-5">
            <input
              ref={fileInputRef}
              type="file"
              accept={selectedAccept}
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="rounded-xl bg-[#F4EBFF] px-5 py-5">
              {renderMediaPreview()}

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {mediaOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.label}
                      type="button"
                      onClick={() => openPicker(option.accept)}
                      className="flex items-center justify-center gap-2 rounded-lg bg-white px-3 py-3 text-xs font-bold text-[#8B47FF] shadow-sm transition-shadow hover:ring-2 hover:ring-[#8B47FF]/30"
                    >
                      <Icon className="h-4 w-4" />
                      <span>{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-5 rounded-xl bg-[#F4EBFF] px-7 py-9">
              <div className="grid gap-5 md:grid-cols-[1fr_150px] md:items-center">
                <div>
                  <p className="text-sm font-bold text-[#2f2238]">Quand veux-tu recevoir ce mot ?</p>
                  <p className="mt-4 max-w-[330px] text-xs leading-relaxed text-[#7d53b2]">
                    Sans choix de ta part, il te sera envoyé demain à minuit.
                  </p>
                </div>
                <input
                  type="date"
                  value={deliveryDate}
                  onChange={(event) => setDeliveryDate(event.target.value)}
                  className="rounded-lg bg-[#8B47FF] px-4 py-4 text-sm font-bold text-white outline-none transition-shadow hover:ring-2 hover:ring-[#8B47FF]/30"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-5 py-8">
              <button
                type="submit"
                className="rounded-lg bg-[#8B47FF] px-7 py-4 text-xs font-bold text-white shadow-md shadow-purple-200 transition-shadow hover:ring-2 hover:ring-[#8B47FF]/35"
              >
                Sceller son mot
              </button>
              <button
                type="button"
                onClick={() => setMessage("Brouillon enregistré.")}
                className="text-xs font-semibold text-[#8B47FF]/70 transition-colors hover:text-[#8B47FF]"
              >
                Enregistrer en brouillon
              </button>
            </div>

            {message && (
              <p className="pb-5 text-center text-xs font-bold text-[#7d53b2]">
                {message}
              </p>
            )}
          </section>
        </form>

        <section className="mx-auto mt-12 max-w-[700px] rounded-xl bg-[#F4EBFF] px-8 py-8 text-center shadow-sm">
          <p className="mx-auto max-w-[380px] text-sm leading-relaxed text-[#2f2238]">
            Please add your content here. Keep it short and simple. And smile :)
          </p>
          <Link
            href="/challenge"
            className="mt-5 inline-flex rounded-lg bg-[#8B47FF] px-10 py-4 text-xs font-bold text-white shadow-md shadow-purple-200 transition-shadow hover:ring-2 hover:ring-[#8B47FF]/35"
          >
            Retour au Challenge
          </Link>
        </section>
      </main>

      <div className="mx-auto w-full max-w-[1440px] px-4 pb-6 md:px-12 lg:px-[96px]">
        <Footer />
      </div>
    </div>
  );
}
