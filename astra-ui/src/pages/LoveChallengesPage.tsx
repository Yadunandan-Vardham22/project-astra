import { useEffect, useState } from "react";

import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  serverTimestamp,
  setDoc,
  increment
} from "firebase/firestore";

import {
  onAuthStateChanged
} from "firebase/auth";

import {
  auth,
  db
} from "../firebase/firebaseConfig";

import AddLoveChallengeModal from "../components/AddLoveChallengeModal";
import FloatingHeartsBackground from "../components/FloatingHeartsBackground";
import HomeButton from "../components/HomeButton";

import {
  createNotification
} from "../services/notificationService";

interface LoveChallenge {

  id: string;

  challenge: string;

  createdById: string;

  createdByName: string;

  receiverId: string;

  receiverName: string;

  completed: boolean;

  completedAt: any;

  completedById: string;

  completedByName: string;

  reward: number;

  createdAt: any;

}

function LoveChallengesPage() {

  const [user, setUser] = useState<any>(null);

  const [challenges, setChallenges] =
    useState<LoveChallenge[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [showModal, setShowModal] =
    useState(false);

  useEffect(() => {

    const unsubscribe =
      onAuthStateChanged(
        auth,
        currentUser => {
          setUser(currentUser);
        }
      );

    return () => unsubscribe();

  }, []);

  useEffect(() => {

    const q = query(

      collection(
        db,
        "loveChallenges"
      ),

      orderBy(
        "createdAt",
        "desc"
      )

    );

    const unsubscribe =
      onSnapshot(

        q,

        snapshot => {

          const data =
            snapshot.docs.map(doc => ({

              id: doc.id,

              ...(doc.data() as Omit<LoveChallenge, "id">)

            }));

          setChallenges(data);

          setLoading(false);

        }

      );

    return () => unsubscribe();

  }, []);

  async function completeChallenge(

    challenge: LoveChallenge

  ) {

    if (

      !user ||

      challenge.completed ||

      user.uid !== challenge.createdById

    ) {

      return;

    }

    try {

      await updateDoc(

        doc(
          db,
          "loveChallenges",
          challenge.id
        ),

        {

          completed: true,

          completedAt:
            serverTimestamp(),

          completedById:
            user.uid,

          completedByName:
            challenge.createdByName

        }

      );

      await setDoc(

        doc(
          db,
          "stardust",
          challenge.receiverId
        ),

        {

          total: increment(
            challenge.reward
          )

        },

        {

          merge: true

        }

      );

      await createNotification({

        receiver:
          challenge.receiverName,

        sender:
          challenge.createdByName,

        type:
          "loveChallengeCompleted",

        title:
          "⭐ Challenge Completed",

        message:
          `${challenge.createdByName} completed a Love Challenge. You earned ⭐${challenge.reward} Stardust!`,

        metadata: {

          challengeId:
            challenge.id

        }

      });

    }

    catch (error) {

      console.error(error);

    }

  }

  const activeChallenges =
    challenges.filter(
      challenge => !challenge.completed
    );

  const completedChallenges =
    challenges.filter(
      challenge => challenge.completed
    );

  const favoritesChallenges =
    challenges.filter(
      challenge => user && (challenge.createdById === user.uid)
    );

  

  return (
    <div className="relative min-h-screen w-screen overflow-y-auto bg-black px-8 pb-20 pt-8 text-white">
      <FloatingHeartsBackground />

      <div className="fixed left-8 top-8 z-[100]"><HomeButton label="Romance" to="/romance" /></div>

      <div className="max-w-5xl mx-auto">

        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3">
            <h1 className="text-3xl font-light tracking-[0.3em]">Love Challenges</h1>
            <div className="text-4xl">❤️</div>
          </div>
          <p className="mt-5 text-xs tracking-[0.5em] text-pink-300">Complete romantic adventures together.</p>
        </div>

        {/* Active & Completed sections */}

        {loading ? (
          <div className="py-24 text-center text-white/50">Loading...</div>
        ) : (

          <>

            <div id="active-section" className="space-y-3">

              {activeChallenges.length === 0 ? (

                <div className="py-20 text-center text-white/40">No active Love Challenges ❤️</div>

              ) : (

                activeChallenges.map(challenge => (

                  <div key={challenge.id} className={`flex flex-col gap-4 rounded-xl border px-5 py-4 transition md:flex-row md:items-center md:justify-between ${challenge.createdByName === "eraya" ? "border-pink-300/40 bg-pink-500/10 hover:border-pink-300/60" : "border-cyan-300/40 bg-cyan-500/10 hover:border-cyan-300/60"}`}>

                    <div className="flex-1 text-center md:text-left">

                      <p className="text-base">{challenge.challenge}</p>

                      <div className="mt-4">
                        <p className={`text-[10px] md:text-[11px] uppercase tracking-[0.2em] ${challenge.createdByName === "eraya" ? "text-pink-100" : "text-cyan-100"}`}>Reward: {challenge.reward} Stardust</p>
                      </div>

                    </div>

                    {user?.uid === challenge.createdById && (

                      <button onClick={() => completeChallenge(challenge)} className="rounded-full border border-green-300/30 bg-green-500/10 px-5 py-2 text-xs tracking-[0.2em] text-green-200 transition hover:bg-green-500/20 self-center md:self-auto">COMPLETE ❤️</button>

                    )}

                  </div>

                ))

              )}

            </div>

            <div className="mt-16">

              <h2 className="mb-6 text-xl tracking-[0.3em] text-white/70">COMPLETED</h2>

              <div id="completed-section" className="space-y-3">

                {completedChallenges.length === 0 ? (

                  <div className="text-white/30">Nothing completed yet.</div>

                ) : (

                  completedChallenges.map(challenge => (

                    <div key={challenge.id} className={`flex flex-col gap-3 rounded-xl border px-5 py-3 md:py-4 opacity-70 ${challenge.createdByName === "eraya" ? "border-pink-300/40 bg-pink-500/10" : "border-cyan-300/40 bg-cyan-500/10"}`}>

                      <div>

                        <p className="text-base line-through text-white/60">{challenge.challenge}</p>

                        <div className="mt-2 flex flex-wrap items-center gap-3">
                          <p className="text-xs md:text-[11px] uppercase tracking-[0.2em] text-white/35">Created by {challenge.createdByName}</p>
                          <p className={`text-xs md:text-[11px] uppercase tracking-[0.2em] ${challenge.createdByName === "eraya" ? "text-pink-100" : "text-cyan-100"}`}>Reward: {challenge.reward} Stardust</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="text-xs text-white/35">
                          Awarded {challenge.reward} Stardust to {challenge.receiverName}.
                        </div>
                        <div className="text-green-300 text-xs tracking-[0.2em]">✓ COMPLETED</div>
                      </div>

                    </div>

                  ))

                )}

              </div>

            </div>

          </>

        )}

      </div>

      {/* Floating Add Challenge button */}
      <button onClick={() => setShowModal(true)} className="fixed bottom-32 right-10 cursor-pointer rounded-full border border-pink-300/40 bg-pink-500/20 px-6 py-3 text-xs tracking-widest backdrop-blur-xl">+ ADD CHALLENGE</button>

      {showModal && (

        <AddLoveChallengeModal onClose={() => setShowModal(false)} onAdded={() => setShowModal(false)} />

      )}

    </div>

  );

}

export default LoveChallengesPage;