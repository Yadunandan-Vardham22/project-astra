import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

import { auth, db } from "../firebase/firebaseConfig";

import AddBucketModal from "../components/AddBucketModal";
import HomeButton from "../components/HomeButton";
import FloatingSakuraBackground from "../components/FloatingSakuraBackground";

function BucketCollectionPage() {
  const navigate = useNavigate();

  const [buckets, setBuckets] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [filterAuthor, setFilterAuthor] = useState<'all' | 'eraya' | 'icarus'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const bucketQuery = query(
      collection(db, "bucketLists"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      bucketQuery,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...(doc.data() as any) }));
        setBuckets(data as any[]);
        setLoading(false);
      },
      (error) => {
        console.error("Bucket listener error:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <div className="relative min-h-screen w-screen overflow-y-auto bg-black px-8 pb-20 pt-8 text-white">
      <FloatingSakuraBackground />
      <div className="fixed left-8 top-8 z-[100]"><HomeButton label="Home" to="/home" /></div>

      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3">
            <h1 className="text-3xl font-light tracking-[0.3em]">Bucket List</h1>
            <div className="text-4xl">🌌</div>
          </div>
          <p className="mt-5 text-xs tracking-[0.5em] text-purple-300">Dreams waiting to become memories.</p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              onClick={() => setFilterAuthor('all')}
              className={`px-3 py-1 rounded-full text-xs tracking-widest transition ${filterAuthor === 'all' ? 'border border-white/20 bg-white/5' : 'border border-white/8 bg-transparent'}`}>
              All
            </button>
            <button
              onClick={() => setFilterAuthor('eraya')}
              className={`px-3 py-1 rounded-full text-xs tracking-widest transition ${filterAuthor === 'eraya' ? 'border border-pink-300/40 bg-pink-500/8 text-pink-200' : 'border border-white/8 bg-transparent'}`}>
              Eraya
            </button>
            <button
              onClick={() => setFilterAuthor('icarus')}
              className={`px-3 py-1 rounded-full text-xs tracking-widest transition ${filterAuthor === 'icarus' ? 'border border-sky-300/40 bg-sky-500/8 text-sky-200' : 'border border-white/8 bg-transparent'}`}>
              Icarus
            </button>
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center text-white/50">Discovering dreams...</div>
        ) : !loading && buckets.length === 0 ? (
          <div className="mt-20 rounded-3xl border border-white/10 bg-white/[0.04] p-12 text-center">
            <div className="text-5xl">🌌</div>
            <h2 className="mt-6 text-2xl font-light">No dreams yet</h2>
            <p className="mt-4 text-white/60">Add the first wish to your universe.</p>
          </div>
        ) : (
          <div className="mt-16 space-y-8">
            {buckets
              .filter((bucket) => {
                if (filterAuthor === 'all') return true;
                const name = (bucket.authorName || '').toLowerCase().trim();
                return filterAuthor === 'eraya' ? name === 'eraya' : name === 'icarus';
              })
              .map((bucket) => (
              <motion.div
                key={bucket.id}
                onClick={() => navigate(`/bucket-list/${bucket.id}`)}
                whileHover={{ y: -4, scale: 1.005 }}
                className={`cursor-pointer rounded-2xl border border-white/10 bg-white/[0.03] pt-4 pb-6 px-5 md:pt-4 md:pb-6 md:px-6 shadow-[0_20px_60px_-40px_rgba(255,255,255,0.12)] transition duration-300 hover:-translate-y-1 ${
                  bucket.authorName?.toLowerCase()?.trim() === "eraya"
                    ? "border-pink-300/40 bg-pink-500/10 hover:border-pink-300/60 border-l-4 border-l-pink-300/60 ring-1 ring-pink-600/10"
                    : "border-sky-300/40 bg-sky-500/10 hover:border-sky-300/60 border-l-4 border-l-sky-300/60 ring-1 ring-sky-600/8"
                }`}
              >
                <div className="flex justify-end">
                  {currentUser && bucket.authorId !== currentUser.uid && !bucket.viewedBy?.includes(currentUser.uid) && (
                    <span className="rounded-full border border-pink-300/40 bg-pink-400/10 px-3 py-2 text-xs md:text-[9px] tracking-[0.25em] text-pink-200 backdrop-blur-md">NEW ✨</span>
                  )}
                </div>

                <h2 className="mt-4 text-3xl font-light">{bucket.title}</h2>

                <p className="mt-4 text-white/70">{bucket.shortDescription}</p>

                <div className="mt-8 flex justify-between text-xs tracking-widest text-white/50">
                  <span>Created by {bucket.authorName}</span>
                  <span>{bucket.createdAt && bucket.createdAt.toDate().toLocaleDateString()}</span>
                </div>

                {bucket.completed && (
                  <div className="mt-6 flex flex-wrap items-center gap-2 text-[11px] tracking-[0.24em] text-green-300">
                    <span>✓ COMPLETED</span>
                    {bucket.completedAt && <span className="text-white/60">{bucket.completedAt.toDate().toLocaleDateString()}</span>}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        <button onClick={() => setAddOpen(true)} className="fixed bottom-20 md:bottom-28 right-4 md:right-8 z-[100] cursor-pointer rounded-full border border-purple-300/30 bg-purple-500/10 px-3 md:px-4 py-3 md:py-4 text-xs tracking-[0.4em] backdrop-blur-xl transition hover:bg-purple-500/20">+ ADD WISH 🌌</button>

        {addOpen && <AddBucketModal onClose={() => setAddOpen(false)} onAdded={() => {}} />}
      </div>
    </div>
  );
}

export default BucketCollectionPage;
