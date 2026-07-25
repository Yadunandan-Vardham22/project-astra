import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

interface HeartJournal {
  id: string;
  question: string;
  answer: string;
  authorName: string;
  answeredByName: string;
  answeredAt: any;
}

function HeartJournalPage() {
  const [entries, setEntries] = useState<HeartJournal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "heartPrompts"),
      where("answered", "==", true),
      orderBy("answeredAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<HeartJournal, "id">),
      }));

      setEntries(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-pink-300">
            🤍 Heart Journal
          </h1>

          <p className="text-gray-400 mt-2">
            Every answered Heart Prompt becomes a memory you'll always keep.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500">
            Loading...
          </div>
        ) : entries.length === 0 ? (
          <div className="rounded-3xl border border-pink-500/20 bg-[#151515] p-10 text-center">
            <div className="text-6xl mb-5">🤍</div>

            <h2 className="text-2xl font-semibold mb-3">
              No Memories Yet
            </h2>

            <p className="text-gray-400">
              Once a Heart Prompt is answered, it'll appear here forever.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {entries.map((entry) => (
     <div
  key={entry.id}
  className="
    rounded-3xl
    border
    border-pink-400/20
    bg-gradient-to-br
    from-[#171717]
    to-[#111111]
    p-6
    transition
    hover:border-pink-400/40
    hover:shadow-[0_0_30px_rgba(236,72,153,0.08)]
  "
>

  <div className="flex items-center justify-between mb-5">

    <span
      className="
        rounded-full
        bg-pink-500/10
        border
        border-pink-500/20
        px-3
        py-1
        text-xs
        text-pink-300
      "
    >
      🤍 {entry.answeredAt?.toDate?.().toLocaleDateString()}
    </span>

  </div>

  <p
    className="
      text-xl
      italic
      text-pink-100
      leading-relaxed
    "
  >
    ❝ {entry.question} ❞
  </p>

  <div
    className="
      my-5
      h-px
      bg-gradient-to-r
      from-transparent
      via-pink-500/30
      to-transparent
    "
  />

  <p
    className="
      whitespace-pre-wrap
      leading-7
      text-gray-300
    "
  >
    {entry.answer}
  </p>

  <div
    className="
      mt-5
      flex
      justify-end
      text-xs
      text-pink-300
    "
  >
    {entry.authorName}
    <span className="mx-2">❤️</span>
    {entry.answeredByName}
  </div>

</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default HeartJournalPage;