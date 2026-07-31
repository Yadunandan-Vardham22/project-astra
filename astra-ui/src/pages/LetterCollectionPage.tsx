import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { motion } from "framer-motion";

import { collection, query, where, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

import { auth, db } from "../firebase/firebaseConfig";

import HomeButton from "../components/HomeButton";
import FloatingHeartsBackground from "../components/FloatingHeartsBackground";

const collectionInfo: any = {
  love: {
    icon: "💗",
    title: "Love Letters",
    subtitle: "Words written from the heart."
  },
  angry: {
    icon: "🔥",
    title: "Angry Letters",
    subtitle: "Words written in moments of frustration and emotions left unspoken."
  },
  apologies: {
    icon: "🌧",
    title: "Apology Letters",
    subtitle: "Words after storms."
  },
  "dream-journal": {
    icon: "🌙",
    title: "Dream Journal",
    subtitle: "Worlds that existed while we slept."
  },
  confessions: {
    icon: "🤍",
    title: "Confession Box",
    subtitle: "The quiet truths we were never brave enough to say out loud."
  }
};

function LetterCollectionPage() {
  const navigate = useNavigate();
  const { category } = useParams();

  const [letters, setLetters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [selectedFilter, setSelectedFilter] = useState<"all" | "eraya" | "icarus">("all");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!category) return;

    const lettersQuery = query(collection(db, "letters"), where("category", "==", category));

    const unsubscribe = onSnapshot(
      lettersQuery,
      (snapshot) => {
        const data = snapshot.docs
          .map((doc) => ({ id: doc.id, ...(doc.data() as any) }))
          .sort((a, b) => {
            const aTime = a.createdAt?.toDate?.().getTime?.() ?? 0;
            const bTime = b.createdAt?.toDate?.().getTime?.() ?? 0;
            return bTime - aTime;
          });

        setLetters(data);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching letters:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [category]);

  const currentCollection = collectionInfo[category || "love"];

  const filteredLetters = letters.filter((letter) => {
    const authorName = (letter.authorName || "").trim().toLowerCase();
    const isFavoriteForCurrentUser = Boolean(
      currentUser &&
        Array.isArray(letter.favoritedBy) &&
        letter.favoritedBy.includes(currentUser.uid)
    );

    if (showFavoritesOnly) return isFavoriteForCurrentUser;
    if (selectedFilter === "all") return true;
    if (selectedFilter === "eraya") return authorName === "eraya";
    if (selectedFilter === "icarus") return authorName === "icarus";
    return false;
  });

  if (!currentCollection) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">Collection not found</div>
    );
  }

  return (
    <div className="relative min-h-screen w-screen overflow-y-auto bg-black px-8 pb-20 pt-8 text-white">
      <FloatingHeartsBackground />
      <div className="fixed left-8 top-8 z-[100]">
        <HomeButton label="Letters" to="/letters" />
      </div>

      <div className="mx-auto max-w-5xl relative">

        <div className="text-center">
          <div className="flex items-center justify-center gap-3">
            <h1 className="text-3xl font-light tracking-[0.3em]">{currentCollection.title}</h1>
            <div className="text-4xl">{currentCollection.icon}</div>
          </div>

          <p className="mt-5 text-xs tracking-[0.5em] text-purple-300">WORDS THAT SURVIVED TIME</p>
        </div>

        {loading && <p className="mt-20 text-center text-white/50">Discovering letters...</p>}

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3 md:justify-end">
          <label className="flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/70 shadow-[0_0_0_1px_rgba(255,255,255,0.04)] backdrop-blur-xl">
            <span className="text-[10px] font-medium uppercase tracking-[0.35em] text-purple-300">Filter</span>
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1.5">
              <select
                value={selectedFilter}
                onChange={(event) => setSelectedFilter(event.target.value as "all" | "eraya" | "icarus")}
                className="cursor-pointer bg-transparent text-sm font-light tracking-[0.2em] text-white outline-none"
              >
                <option value="all" className="bg-black text-white">All letters</option>
                <option value="eraya" className="bg-black text-white">Eraya</option>
                <option value="icarus" className="bg-black text-white">Icarus</option>
              </select>
              <span className="text-[10px] text-white/50">▾</span>
            </div>
          </label>

          <button
            type="button"
            onClick={() => setShowFavoritesOnly((value) => !value)}
            className={`cursor-pointer rounded-full border px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.32em] shadow-[0_0_24px_rgba(244,114,182,0.22)] transition ${
              showFavoritesOnly
                ? "border-pink-300/70 bg-pink-500/35 text-pink-50"
                : "border-pink-300/30 bg-pink-500/15 text-pink-100"
            } hover:bg-pink-500/25 hover:shadow-[0_0_30px_rgba(244,114,182,0.30)]`}
          >
            Favorites
          </button>
        </div>

        {!loading && letters.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.04] p-10 text-center text-white/60">
            <div className="text-5xl">{currentCollection.icon}</div>
            <h2 className="mt-6 text-2xl font-light">No letters yet</h2>
            <p className="mt-4 text-white/60">This collection is waiting for its first letter.</p>
          </div>
        ) : filteredLetters.length === 0 ? (
          null
        ) : (
          <div className="mt-8 grid gap-8 md:grid-cols-2">
            {filteredLetters.map((letter) => {
              const authorName = (letter.authorName || "Unknown").trim();
              const authorLower = authorName.toLowerCase();
              const isEraya = authorLower === "eraya";
              const isIcarus = authorLower === "icarus";
              const viewedBy = Array.isArray(letter.viewedBy) ? letter.viewedBy : [];
              const isNewForCurrentUser = Boolean(
                currentUser &&
                  letter.authorId !== currentUser.uid &&
                  !viewedBy.includes(currentUser.uid)
              );
              const isFavoriteForCurrentUser = Boolean(
                currentUser &&
                  Array.isArray(letter.favoritedBy) &&
                  letter.favoritedBy.includes(currentUser.uid)
              );

              return (
                <motion.button
                  key={letter.id}
                  onClick={() => navigate(`/letters/${category}/${letter.id}`)}
                  whileHover={{ y: -8, scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className={`group relative w-full cursor-pointer rounded-3xl border p-6 text-left backdrop-blur-xl transition hover:bg-white/[0.08] md:p-10 ${
                    isEraya
                      ? "border-pink-300/40 bg-pink-500/5 shadow-[0_0_0_1px_rgba(244,114,182,0.12)]"
                      : isIcarus
                        ? "border-sky-300/40 bg-sky-500/5 shadow-[0_0_0_1px_rgba(125,211,252,0.12)]"
                        : "border-white/10 bg-white/[0.04]"
                  }`}
                >
                  {isNewForCurrentUser && (
                    <span className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full border border-cyan-300/40 bg-cyan-400/15 px-2.5 py-0.5 text-[9px] font-medium uppercase tracking-[0.28em] text-cyan-200">
                      <motion.span
                        initial={{ opacity: 0.7, scale: 0.9 }}
                        animate={{ opacity: [0.7, 1, 0.7], rotate: [-4, 4, -4], scale: [0.9, 1.08, 0.9] }}
                        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                        className="text-[10px]"
                      >
                        ✦
                      </motion.span>
                      <span>New</span>
                    </span>
                  )}

                  <div className="flex items-start gap-4">
                    <div>
                      <h2 className="flex items-center gap-3 text-2xl font-light tracking-wide">
                        <span>{letter.title}</span>
                        <span className="text-2xl md:text-3xl">{currentCollection.icon}</span>
                      </h2>

                      <p className="mt-3 text-sm leading-relaxed text-white/70">
                        {letter.content?.slice(0, 140)}{letter.content?.length > 140 ? "..." : ""}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col gap-2">
                    <p className="text-xs tracking-[0.3em] text-purple-300">OPEN LETTER →</p>
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center justify-start gap-2 text-[10px] uppercase tracking-[0.3em] text-white/55">
                        <span className={`h-2 w-2 rounded-full ${isEraya ? "bg-pink-300" : isIcarus ? "bg-sky-300" : "bg-white/50"}`} />
                        <span>By {authorName}</span>
                      </div>
                      <span className="text-xs text-white/60">
                        {letter.createdAt ? letter.createdAt.toDate().toLocaleDateString() : ""}
                      </span>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default LetterCollectionPage;
