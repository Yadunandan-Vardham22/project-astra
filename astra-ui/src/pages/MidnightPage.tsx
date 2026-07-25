import { useEffect, useRef, useState } from "react";
import MessageBubble from "../components/MessageBubble";
import MessageInput from "../components/MessageInput";
import { Timestamp } from "firebase/firestore";
import { createNotification } from "../services/notificationService";

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
  sender: {
    id: string;
    name: string;
  };
  createdAt: Timestamp | null;
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

 async function sendMessage(text: string) {

    if (!user) return;
    const receiver =
  authorName === "icarus"
    ? "eraya"
    : "icarus";

  const messageRef = await addDoc(collection(db, "midnightMessages"), {

    text,

    sender: {
        id: user.uid,
        name: authorName
    },

    createdAt: serverTimestamp()

});

await createNotification({

    receiver,

    sender: authorName,

    type: "midnight",

    title: "🌙 Midnight",

    message: `${authorName} sent you a midnight message.`,

    metadata: {

        messageId: messageRef.id

    }

});

}

  return (
    <div className="min-h-screen bg-[#09090F] text-white flex flex-col">

   <div className="border-b border-white/10 py-10 text-center">

    <div className="text-5xl mb-3">🌙</div>

    <h1 className="text-4xl tracking-[0.25em] font-light">
        MIDNIGHT
    </h1>

    <p className="mt-4 text-sm text-white/50 tracking-widest">
        Some conversations are only meant for the stars.
    </p>

</div>

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">

    {messages.map(msg => (
<MessageBubble
    key={msg.id}
    text={msg.text}
    senderName={msg.sender.name}
    isMine={msg.sender.id === user?.uid}
    createdAt={msg.createdAt}
/>
))}

        <div ref={bottomRef} />

      </div>

  <MessageInput onSend={sendMessage} />

    </div>
  );
}

export default MidnightPage;