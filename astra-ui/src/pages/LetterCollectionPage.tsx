import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { motion } from "framer-motion";

import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

import { auth, db } from "../firebase/firebaseConfig";

import BackButton from "../components/BackButton";

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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!category) return;

    const lettersQuery = query(collection(db, "letters"), where("category", "==", category), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      lettersQuery,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
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

  if (!currentCollection) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">Collection not found</div>
    );
  }

  return (
    <div className="min-h-screen w-screen overflow-y-auto bg-black px-8 py-20 text-white">
      <BackButton path="/letters" label="Letters" />

      <div className="mx-auto max-w-5xl relative">

        <div className="text-center">
          <div className="inline-flex items-center gap-3 text-3xl font-light tracking-[0.3em]">
            <span>{currentCollection.title}</span>
            <span>{currentCollection.icon}</span>
          </div>
        </div>

        <div className="absolute right-0 top-0 text-right">
          <span className="text-sm text-white/70">({letters.length})</span>
        </div>

        <p className="mt-4 text-center text-xs tracking-[0.5em] text-purple-300 max-w-2xl mx-auto">{currentCollection.subtitle}</p>

        {loading && <p className="mt-20 text-center text-white/50">Discovering letters...</p>}

        {!loading && letters.length === 0 && (
          <div className="mt-20 rounded-3xl border border-white/10 bg-white/[0.04] p-12 text-center">
            <div className="text-5xl">{currentCollection.icon}</div>
            <h2 className="mt-6 text-2xl font-light">No letters yet</h2>
            <p className="mt-4 text-white/60">This collection is waiting for its first letter.</p>
          </div>
        )}

        <div className="mt-16 space-y-8">
          {letters.map((letter) => (
            <motion.button
              key={letter.id}
              onClick={() => navigate(`/letters/${category}/${letter.id}`)}
              whileHover={{ y: -8, scale: 1.01 }}
              className={`group w-full cursor-pointer rounded-3xl border p-6 md:p-10 text-left backdrop-blur-xl transition ${
                letter.authorName?.toLowerCase().trim() === "eraya" ? "border-pink-300/40 bg-pink-500/5" : "border-blue-300/40 bg-blue-500/5"
              }`}
            >
              <div className="relative text-5xl">{currentCollection.icon}</div>

              <h2 className="mt-6 text-3xl font-light">{letter.title}</h2>

              <p className="mt-5 leading-relaxed text-white/70">{letter.content?.slice(0, 150)}...</p>

              <div className="mt-8 flex justify-between text-xs tracking-widest text-white/50">
                <span>Created by {letter.authorName || "Unknown"}</span>
                <span>{letter.createdAt ? letter.createdAt.toDate().toLocaleDateString() : ""}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LetterCollectionPage;
