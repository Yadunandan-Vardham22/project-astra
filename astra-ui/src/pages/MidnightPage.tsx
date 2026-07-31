import { useEffect, useRef, useState } from "react";
import MessageBubble from "../components/MessageBubble";
import MessageInput from "../components/MessageInput";
import FloatingHeartsBackground from "../components/FloatingHeartsBackground";
import { Timestamp } from "firebase/firestore";
import { createNotification } from "../services/notificationService";
import { uploadToCloudinary } from "../services/cloudinary";

import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  doc,
  getDoc
} from "firebase/firestore";

import { onAuthStateChanged } from "firebase/auth";

import { auth, db } from "../firebase/firebaseConfig";

interface Message {
  id: string;
  text: string;
  type: "text" | "image" | "video" | "audio";
  mediaUrl?: string | null;
  publicId?: string | null;
  resourceType?: string | null;
  format?: string | null;
  bytes?: number | null;
  originalFilename?: string | null;
  duration?: number | null;
  width?: number | null;
  height?: number | null;
  sender: {
    id: string;
    name: string;
  };
  authorName?: string | null;
  createdAt: Timestamp | null;
}

function getMediaFolder(type: "image" | "video" | "audio") {
  if (type === "video") return "chat-app/videos";
  if (type === "audio") return "chat-app/audio";
  return "chat-app/images";
}

function MidnightPage() {
  const [user, setUser] = useState<any>(null);

  const [messages, setMessages] = useState<Message[]>([]);

  const [authorName, setAuthorName] = useState("");

  const bottomRef = useRef<HTMLDivElement | null>(null);

useEffect(() => {

  const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {

    setUser(currentUser);

    if (!currentUser) return;

    const userDoc = await getDoc(
      doc(db, "users", currentUser.uid)
    );

    if (userDoc.exists()) {

      const data = userDoc.data();
console.log(data);
      setAuthorName(data.starName);

    }

  });

  return () => unsubscribe();

}, []);

  useEffect(() => {
    const q = query(
      collection(db, "midnightMessages"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, snapshot => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<Message, "id">)
      }));

      setMessages(data);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages]);

 async function sendMessage(text: string, attachment?: { file: File; type: "image" | "video" | "audio" } | null) {

    if (!user) return;

    const trimmedText = text.trim();
    const hasAttachment = Boolean(attachment?.file);

    if (!trimmedText && !hasAttachment) return;

    const receiver =
      authorName === "icarus"
        ? "eraya"
        : "icarus";

    let mediaUrl: string | null = null;
    let messageType: Message["type"] = "text";
    let mediaMetadata: Partial<Message> = {};

    try {
      if (attachment?.file) {
        messageType = attachment.type;
        const folder = getMediaFolder(attachment.type);
        const uploadResult = await uploadToCloudinary(attachment.file, folder);

        mediaUrl = uploadResult.url;
        mediaMetadata = {
          mediaUrl: uploadResult.url,
          publicId: uploadResult.publicId,
          resourceType: uploadResult.resourceType,
          format: uploadResult.format,
          bytes: uploadResult.bytes,
          originalFilename: uploadResult.originalFilename,
          width: uploadResult.width,
          height: uploadResult.height,
          duration: uploadResult.duration,
        };
      }

      const payload = {
        text: trimmedText,
        type: messageType,
        mediaUrl: mediaUrl ?? null,
        publicId: mediaMetadata.publicId ?? null,
        resourceType: mediaMetadata.resourceType ?? null,
        format: mediaMetadata.format ?? null,
        bytes: mediaMetadata.bytes ?? null,
        originalFilename: mediaMetadata.originalFilename ?? null,
        width: mediaMetadata.width ?? null,
        height: mediaMetadata.height ?? null,
        duration: mediaMetadata.duration ?? null,
        sender: {
          id: user.uid,
          name: authorName
        },
        authorName,
        createdAt: serverTimestamp(),
        timestamp: serverTimestamp(),
      };

      const messageRef = await addDoc(collection(db, "midnightMessages"), payload);

      await createNotification({
        receiver,
        sender: authorName,
        type: "midnight",
        title: "🌙 Midnight",
        message: messageType === "text"
          ? `${authorName} sent you a midnight message.`
          : `${authorName} sent you a ${messageType} message.`,
        metadata: {
          messageId: messageRef.id
        }
      });
    } catch (error) {
      console.error("[MidnightPage] sendMessage failed", error);
    }
  }

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(255,192,203,0.14),_transparent_45%),linear-gradient(135deg,_#05070d_0%,_#090b13_100%)] px-3 pb-3 pt-3 text-white sm:px-4 lg:px-6">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-[10%] top-[12%] h-32 w-32 rounded-full bg-pink-400/10 blur-3xl" />
        <div className="absolute bottom-[20%] right-[8%] h-40 w-40 rounded-full bg-fuchsia-500/10 blur-3xl" />
      </div>

      <FloatingHeartsBackground />

      <div className="relative z-10 mx-auto flex h-full w-full max-w-3xl flex-col">
        <header className="shrink-0 px-2 pb-3 pt-2 text-center sm:px-0">
          <div className="flex items-center justify-center gap-3">
            <h1 className="text-3xl font-light tracking-[0.3em]">Midnight</h1>
            <div className="text-4xl">🌙</div>
          </div>
          <p className="mx-auto mt-2 max-w-xl text-[11px] tracking-[0.25em] text-white/45 sm:text-[13px]">
            Some conversations are only meant for the stars.
          </p>
        </header>

        <main className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[28px] border border-white/10 bg-black/15 px-2 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-sm sm:px-3 sm:py-3">
          <div className="flex-1 overflow-y-auto px-1 pb-4 pt-1 sm:px-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                text={msg.text}
                type={msg.type || "text"}
                mediaUrl={msg.mediaUrl || null}
                senderName={msg.sender.name}
                isMine={msg.sender.id === user?.uid}
                createdAt={msg.createdAt}
              />
            ))}

            <div ref={bottomRef} />
          </div>

          <div className="shrink-0 px-1 pb-1 pt-2 sm:px-2">
            <MessageInput onSend={sendMessage} />
          </div>
        </main>
      </div>
    </div>
  );
}

export default MidnightPage;