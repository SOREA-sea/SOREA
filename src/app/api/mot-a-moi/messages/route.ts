import { NextRequest, NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "../../middleware/auth";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 25 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/", "audio/", "video/mp4"];

function getMediaType(mimeType: string) {
  if (mimeType.startsWith("image/")) return "photo";
  if (mimeType.startsWith("audio/")) return "audio";
  return "video";
}

function sanitizeFileName(fileName: string) {
  return fileName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

export async function GET() {
  try {
    const user = await getUserFromRequest();
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const messages = await prisma.motAMoiMessage.findMany({
      where: { userId: user.id },
      orderBy: { deliveryDate: "asc" },
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Erreur mot-a-moi/messages GET:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest();
    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const title = String(formData.get("title") || "").trim();
    const note = String(formData.get("note") || "").trim();
    const deliveryDateValue = String(formData.get("deliveryDate") || "");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Un fichier audio, photo ou MP4 est requis" }, { status: 400 });
    }

    if (!title) {
      return NextResponse.json({ error: "Le titre est requis" }, { status: 400 });
    }

    if (!deliveryDateValue) {
      return NextResponse.json({ error: "La date de réception est requise" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "Le fichier ne doit pas dépasser 25 Mo" }, { status: 400 });
    }

    const isAccepted = ACCEPTED_TYPES.some((type) =>
      type.endsWith("/") ? file.type.startsWith(type) : file.type === type
    );

    if (!isAccepted) {
      return NextResponse.json(
        { error: "Format non accepté. Ajoutez une photo, un audio ou une vidéo MP4." },
        { status: 400 }
      );
    }

    const deliveryDate = new Date(deliveryDateValue);
    if (Number.isNaN(deliveryDate.getTime())) {
      return NextResponse.json({ error: "La date de réception est invalide" }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads", "mot-a-moi", String(user.id));
    await mkdir(uploadDir, { recursive: true });

    const safeName = sanitizeFileName(file.name || "mot-a-moi");
    const storedName = `${Date.now()}-${safeName}`;
    const filePath = path.join(uploadDir, storedName);
    const bytes = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, bytes);

    const message = await prisma.motAMoiMessage.create({
      data: {
        userId: user.id,
        title,
        note: note || null,
        mediaType: getMediaType(file.type),
        fileName: file.name || storedName,
        fileUrl: `/uploads/mot-a-moi/${user.id}/${storedName}`,
        mimeType: file.type,
        deliveryDate,
      },
    });

    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    console.error("Erreur mot-a-moi/messages POST:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}
