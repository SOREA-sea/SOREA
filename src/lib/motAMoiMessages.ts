import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

export type MotAMoiMediaType = "photo" | "audio" | "video";

export interface MotAMoiMessage {
  id: string;
  userId: number;
  title: string;
  note: string | null;
  mediaType: MotAMoiMediaType;
  fileName: string;
  fileUrl: string;
  mimeType: string;
  deliveryDate: string;
  createdAt: string;
}

const dataDir = path.join(process.cwd(), "public", "uploads", "mot-a-moi");
const dataFile = path.join(dataDir, "messages.json");

async function readAllMessages() {
  try {
    const file = await readFile(dataFile, "utf8");
    return JSON.parse(file) as MotAMoiMessage[];
  } catch (error: unknown) {
    const code = error && typeof error === "object" && "code" in error ? error.code : null;
    if (code === "ENOENT") return [];
    throw error;
  }
}

async function writeAllMessages(messages: MotAMoiMessage[]) {
  await mkdir(dataDir, { recursive: true });
  await writeFile(dataFile, JSON.stringify(messages, null, 2), "utf8");
}

export async function getMotAMoiMessagesForUser(userId: number) {
  const messages = await readAllMessages();
  return messages
    .filter((message) => message.userId === userId)
    .sort((a, b) => new Date(a.deliveryDate).getTime() - new Date(b.deliveryDate).getTime());
}

export async function countMotAMoiMessagesForUser(userId: number) {
  const messages = await readAllMessages();
  return messages.filter((message) => message.userId === userId).length;
}

export async function createMotAMoiMessage(input: Omit<MotAMoiMessage, "id" | "createdAt">) {
  const messages = await readAllMessages();
  const message: MotAMoiMessage = {
    ...input,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
    createdAt: new Date().toISOString(),
  };

  messages.push(message);
  await writeAllMessages(messages);
  return message;
}
