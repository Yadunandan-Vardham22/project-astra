import { useEffect, useState } from "react";

import {
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";

import { db } from "../firebase/firebaseConfig";

import AddFutureDreamModal from "../components/AddFutureDreamModal";

interface FutureDream {
  id: string;
  dream: string;
  authorName: string;
  createdAt: any;
}

function FutureDreamsPage() {
  const [dreams, setDreams] = useState<FutureDream[]>([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const q = query(
      collection(db, "futureDreams"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<FutureDream, "id">),
      }));

      setDreams(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-[#0b0b0b] text-white px-8 py-12">

      <div className="max-w-5xl mx-auto">

        <div className="flex items-center justify-between mb-14">

          <div>

            <h1 className="text-5xl font-light tracking-[0.15em]">
              🌌 FUTURE DREAMS
            </h1>

            <p className="mt-4 text-sm tracking-[0.25em] text-purple-300">
              THE LIFE WE'RE BUILDING TOGETHER
            </p>

          </div>

          <button
            onClick={() => setShowModal(true)}
            className="
              rounded-full
              border
              border-purple-300/30
              bg-purple-500/10
              px-6
              py-3
              text-sm
              tracking-widest
              transition
              hover:bg-purple-500/20
            "
          >
            + ADD DREAM
          </button>

        </div>

        {loading ? (

          <div className="text-center py-24 text-white/50">

            Loading...

          </div>

        ) : dreams.length === 0 ? (

          <div className="py-28 text-center">

            <div className="text-7xl">

              🌌

            </div>

            <h2 className="mt-8 text-3xl font-light">

              No Dreams Yet

            </h2>

            <p className="mt-4 text-white/60">

              Start writing the future you'd love to live together.

            </p>

          </div>

        ) : (

          <div className="space-y-2">

            {dreams.map((dream) => (

              <div
                key={dream.id}
                className="
                  flex
                  items-center
                  justify-between
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/[0.02]
                  px-6
                  py-5
                  transition
                  hover:border-purple-300/30
                  hover:bg-purple-500/[0.04]
                "
              >

                <div className="flex-1">

                  <p className="text-lg">

                    ✨ {dream.dream}

                  </p>

                  <p className="mt-2 text-xs tracking-[0.2em] text-white/45 uppercase">

                    {dream.authorName}
                    {" • "}
                    {dream.createdAt?.toDate?.().toLocaleDateString()}

                  </p>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

      {showModal && (

        <AddFutureDreamModal
          onClose={() => setShowModal(false)}
          onAdded={() => setShowModal(false)}
        />

      )}

    </div>
  );
}

export default FutureDreamsPage;