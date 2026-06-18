import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CalendarClock, FileAudio, ImageIcon, Lock, Plus, Video } from "lucide-react";
import prisma from "@/lib/prisma";

function formatDate(date: Date) {
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function MediaIcon({ type }: { type: string }) {
  if (type === "photo") return <ImageIcon className="h-5 w-5" />;
  if (type === "audio") return <FileAudio className="h-5 w-5" />;
  return <Video className="h-5 w-5" />;
}

export default async function MessageriePage() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("sorea_session")?.value;

  if (!sessionId) {
    redirect("/login");
  }

  const session = await prisma.userSession.findUnique({
    where: { id: sessionId },
    include: { user: true },
  });

  if (!session || session.expiresAt <= new Date()) {
    redirect("/login");
  }

  const messages = await prisma.motAMoiMessage.findMany({
    where: { userId: session.user.id },
    orderBy: { deliveryDate: "asc" },
  });

  const now = new Date();
  const availableMessages = messages.filter((message) => message.deliveryDate <= now);
  const upcomingMessages = messages.filter((message) => message.deliveryDate > now);

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-foreground/50">Espace perso</p>
          <h1 className="section-title mt-1 text-3xl font-black md:text-4xl">Ma messagerie</h1>
          <p className="mt-2 max-w-2xl text-foreground/60">
            Retrouvez ici les photos, audios et vidéos envoyés depuis Mot à moi.
          </p>
        </div>
        <Link href="/mot-a-moi" className="btn-primary inline-flex items-center justify-center gap-2 px-5 py-3">
          <Plus className="h-5 w-5" />
          Nouveau message
        </Link>
      </header>

      <section className="glass-panel rounded-3xl p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-bold">Messages disponibles</h2>
            <p className="text-sm text-foreground/50">Ceux dont la date de réception est arrivée.</p>
          </div>
          <span className="w-fit rounded-full bg-purple-100 px-4 py-2 text-sm font-bold text-purple-700">
            {availableMessages.length} reçu{availableMessages.length > 1 ? "s" : ""}
          </span>
        </div>

        {availableMessages.length === 0 ? (
          <div className="mt-6 rounded-3xl border border-dashed border-purple-200 bg-white/55 p-8 text-center">
            <CalendarClock className="mx-auto h-10 w-10 text-purple-400" />
            <p className="mt-3 font-bold text-foreground">Aucun message reçu pour le moment</p>
            <p className="mt-1 text-sm text-foreground/50">Programme un message depuis Mot à moi pour le voir apparaître ici.</p>
          </div>
        ) : (
          <div className="mt-6 grid gap-5 xl:grid-cols-2">
            {availableMessages.map((message) => (
              <article key={message.id} className="rounded-3xl border border-white/70 bg-white/70 p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-100 text-purple-600">
                      <MediaIcon type={message.mediaType} />
                    </div>
                    <h3 className="text-lg font-black text-foreground">{message.title}</h3>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/40">
                      Reçu le {formatDate(message.deliveryDate)}
                    </p>
                  </div>
                </div>

                {message.note && (
                  <p className="mt-4 rounded-2xl bg-purple-50/70 p-4 text-sm leading-6 text-foreground/70">
                    {message.note}
                  </p>
                )}

                <div className="mt-4 overflow-hidden rounded-2xl bg-white">
                  {message.mediaType === "photo" && (
                    <img src={message.fileUrl} alt={message.title} className="max-h-[360px] w-full object-cover" />
                  )}
                  {message.mediaType === "audio" && (
                    <div className="p-4">
                      <audio controls src={message.fileUrl} className="w-full" />
                    </div>
                  )}
                  {message.mediaType === "video" && (
                    <video controls src={message.fileUrl} className="max-h-[360px] w-full bg-black object-contain" />
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold">Messages programmés</h2>
        {upcomingMessages.length === 0 ? (
          <div className="glass-panel rounded-3xl p-6 text-foreground/60">
            Aucun message programmé pour plus tard.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {upcomingMessages.map((message) => (
              <article key={message.id} className="glass-panel rounded-3xl p-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/80 text-purple-600">
                    <Lock className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-black text-foreground">{message.title}</p>
                    <p className="text-sm text-foreground/50">Disponible le {formatDate(message.deliveryDate)}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
