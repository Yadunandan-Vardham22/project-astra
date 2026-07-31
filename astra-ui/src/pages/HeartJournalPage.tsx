import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import FloatingHeartsBackground from "../components/FloatingHeartsBackground";
import HomeButton from "../components/HomeButton";

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
  const [selectedFilter, setSelectedFilter] = useState<"all" | "eraya" | "icarus">("all");

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
    <div className="relative min-h-screen w-screen overflow-y-auto bg-black px-8 pb-20 pt-8 text-white">
      <FloatingHeartsBackground />

      <div className="fixed left-8 top-8 z-[100]">
        <HomeButton label="Romance" to="/romance" />
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3">
            <h1 className="text-3xl font-light tracking-[0.3em]">Heart Journal</h1>
            <div className="text-4xl">🤍</div>
          </div>

          <p className="mt-5 text-xs tracking-[0.5em] text-purple-300">Every answered Heart Prompt becomes a memory you'll always keep.</p>

          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              onClick={() => setSelectedFilter("all")}
              className={`px-3 py-2 rounded-full text-sm transition ${selectedFilter === "all" ? "bg-white/[0.06] border border-white/10 text-white" : "bg-transparent text-white/60 border border-white/5"}`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedFilter("eraya")}
              className={`px-3 py-2 rounded-full text-sm transition ${selectedFilter === "eraya" ? "bg-pink-500/20 border border-pink-300/40 text-pink-200" : "bg-transparent text-white/60 border border-white/5"}`}
            >
              Eraya
            </button>
            <button
              onClick={() => setSelectedFilter("icarus")}
              className={`px-3 py-2 rounded-full text-sm transition ${selectedFilter === "icarus" ? "bg-sky-500/10 border border-sky-300/30 text-sky-200" : "bg-transparent text-white/60 border border-white/5"}`}
            >
              Icarus
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500">
            Loading...
          </div>
        ) : entries.length === 0 ? (
          <div className="rounded-3xl border border-pink-500/20 bg-[#151515] p-6 md:p-10 text-center">
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
            {entries
              .filter((entry) => {
                if (selectedFilter === "all") return true;
                const author = (entry.authorName || "").toLowerCase();
                if (selectedFilter === "eraya") return author === "eraya";
                if (selectedFilter === "icarus") return author === "icarus";
                return true;
              })
              .map((entry) => (
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