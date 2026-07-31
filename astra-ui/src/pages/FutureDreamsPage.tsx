import { useEffect, useState } from "react";

import {
  collection,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  doc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";

import { onAuthStateChanged } from "firebase/auth";

import { db, auth } from "../firebase/firebaseConfig";

import AddQuoteModal from "../components/AddQuoteModal";
import FloatingHeartsBackground from "../components/FloatingHeartsBackground";
import HomeButton from "../components/HomeButton";

interface Quote {
  id: string;
  quote: string;
  authorName: string;
  likedBy?: string[];
  createdAt: any;
}

function FutureDreamsPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showLikedOnly, setShowLikedOnly] = useState(false);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (u) => setCurrentUser(u));

    const q = query(collection(db, "quotes"), orderBy("createdAt", "desc"));

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
        setQuotes(data);
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setLoading(false);
      }
    );

    return () => {
      unsub();
      unsubAuth();
    };
  }, []);

  async function toggleLike(quote: Quote) {
    if (!currentUser) return;
    const ref = doc(db, "quotes", quote.id);
    try {
      if (Array.isArray(quote.likedBy) && quote.likedBy.includes(currentUser.uid)) {
        await updateDoc(ref, { likedBy: arrayRemove(currentUser.uid) });
      } else {
        await updateDoc(ref, { likedBy: arrayUnion(currentUser.uid) });
      }
    } catch (err) {
      console.error(err);
    }
  }

  const filtered = quotes.filter((q) => {
    if (!showLikedOnly) return true;
    if (!currentUser) return false;
    return Array.isArray(q.likedBy) && q.likedBy.includes(currentUser.uid);
  });

  return (
    <div className="relative min-h-screen w-screen overflow-y-auto bg-black px-8 pb-20 pt-8 text-white">
      <FloatingHeartsBackground />

      <div className="fixed left-8 top-8 z-[100]"><HomeButton label="Romance" to="/romance" /></div>

      <div className="max-w-5xl mx-auto">

        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3">
            <h1 className="text-3xl font-light tracking-[0.3em]">Quotes</h1>
            <div className="text-4xl">❝</div>
          </div>
          <p className="mt-5 text-xs tracking-[0.5em] text-purple-300">Collect your favourite lines.</p>
        </div>

        <div className="mt-10 flex items-center justify-center gap-3 md:justify-end">
          <button
            type="button"
            onClick={() => setShowLikedOnly((v) => !v)}
            className={`cursor-pointer rounded-full border px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.32em] transition ${
              showLikedOnly ? "border-yellow-300/70 bg-yellow-500/35 text-yellow-50" : "border-yellow-300/30 bg-yellow-500/15 text-yellow-100"
            } hover:bg-yellow-500/25`}
          >
            Liked
          </button>
        </div>

        {loading ? (
          <div className="text-center py-24 text-white/50">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.04] p-10 text-center text-white/60">
            <div className="text-5xl">❝</div>
            <h2 className="mt-6 text-2xl font-light">No quotes yet</h2>
            <p className="mt-4 text-white/60">Add a quote to start collecting favorites.</p>
          </div>
        ) : (
          <div className="mt-8 space-y-3">
            {filtered.map((q) => {
              const liked = currentUser && Array.isArray(q.likedBy) && q.likedBy.includes(currentUser.uid);
              const isEraya = q.authorName?.toLowerCase() === "eraya";
              const isIcarus = q.authorName?.toLowerCase() === "icarus";
              const cardStyles = isEraya
                ? "border-pink-300/30 bg-pink-500/5 hover:bg-pink-500/10"
                : isIcarus
                  ? "border-sky-300/30 bg-sky-500/5 hover:bg-sky-500/10"
                  : "border-white/10 bg-white/[0.02] hover:bg-white/[0.06]";
              return (
                <div key={q.id} className={`flex items-start gap-4 rounded-3xl border p-6 transition ${cardStyles}`}>
                  <div className="flex-1">
                    <p className="text-lg italic text-white/90">❝ {q.quote} ❞</p>
                    <p className="mt-2 text-xs tracking-[0.2em] text-white/45 uppercase">{q.authorName} • {q.createdAt?.toDate?.().toLocaleDateString()}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <button onClick={() => toggleLike(q)} className={`rounded-full px-3 py-2 text-xs transition ${liked ? "bg-yellow-500/25 text-yellow-300" : "bg-transparent text-white/60 border border-white/5"}`}>
                      {liked ? "★ Liked" : "☆ Like"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      <button onClick={() => setShowModal(true)} className="fixed bottom-32 right-10 cursor-pointer rounded-full border border-yellow-300/40 bg-yellow-500/20 px-6 py-3 text-xs tracking-widest backdrop-blur-xl">+ ADD QUOTE</button>

      {showModal && <AddQuoteModal onClose={() => setShowModal(false)} onAdded={() => setShowModal(false)} />}

    </div>
  );
}

export default FutureDreamsPage;