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

  return (
        <div className="min-h-screen bg-[#0b0b0b] text-white px-8 py-12">

      <div className="max-w-5xl mx-auto">

        <div className="flex items-center justify-between mb-12">

          <div>

            <h1 className="text-5xl font-light tracking-[0.15em]">

              ❤️ LOVE CHALLENGES

            </h1>

            <p className="mt-4 text-sm tracking-[0.25em] text-pink-300">

              Complete romantic adventures together.

            </p>

          </div>

          <button

            onClick={() => setShowModal(true)}

            className="
              rounded-full
              border
              border-pink-300/30
              bg-pink-500/10
              px-6
              py-3
              text-sm
              tracking-widest
              transition
              hover:bg-pink-500/20
            "

          >

            + ADD CHALLENGE

          </button>

        </div>

        {

          loading ? (

            <div className="py-24 text-center text-white/50">

              Loading...

            </div>

          ) : (

            <>

              <div className="space-y-3">

                {

                  activeChallenges.length === 0 ? (

                    <div className="py-20 text-center text-white/40">

                      No active Love Challenges ❤️

                    </div>

                  ) : (

                    activeChallenges.map(challenge => (

                      <div

                        key={challenge.id}

                        className="
                          flex
                          items-center
                          justify-between
                          rounded-xl
                          border
                          border-white/10
                          bg-white/[0.02]
                          px-5
                          py-3 md:py-4
                          transition
                          hover:border-pink-300/30
                        "

                      >

                        <div className="flex-1">

                          <p className="text-base">

                            ❤️ {challenge.challenge}

                          </p>

                          <p className="mt-1 text-xs md:text-[11px] uppercase tracking-[0.2em] text-white/40">

                            Created by {challenge.createdByName}

                          </p>

                        </div>

                        {

                          user?.uid === challenge.createdById && (

                            <button

                              onClick={() => completeChallenge(challenge)}

                              className="
                                rounded-full
                                border
                                border-green-300/30
                                bg-green-500/10
                                px-5
                                py-2
                                text-xs
                                tracking-[0.2em]
                                text-green-200
                                transition
                                hover:bg-green-500/20
                              "

                            >

                              COMPLETE ❤️

                            </button>

                          )

                        }

                      </div>

                    ))

                  )

                }

              </div>

              <div className="mt-16">

                <h2

                  className="
                    mb-6
                    text-xl
                    tracking-[0.3em]
                    text-white/70
                  "

                >

                  COMPLETED

                </h2>

                <div className="space-y-3">

                  {

                    completedChallenges.length === 0 ? (

                      <div className="text-white/30">

                        Nothing completed yet.

                      </div>

                    ) : (

                      completedChallenges.map(challenge => (

                        <div

                          key={challenge.id}

                          className="
                            flex
                            items-center
                            justify-between
                            rounded-xl
                            border
                            border-white/5
                            bg-white/[0.015]
                            px-5
                            py-3 md:py-4
                            opacity-70
                          "

                        >

                          <div className="flex-1">

                            <p className="text-base line-through text-white/60">

                              ❤️ {challenge.challenge}

                            </p>

                            <p className="mt-1 text-xs md:text-[11px] uppercase tracking-[0.2em] text-white/35">

                              Created by {challenge.createdByName}

                            </p>

                          </div>

                          <div className="text-green-300 text-xs tracking-[0.2em]">

                            ✓ COMPLETED

                          </div>

                        </div>

                      ))

                    )

                  }

                </div>

              </div>

            </>
                    )

        }

      </div>

      {

        showModal && (

          <AddLoveChallengeModal

            onClose={() =>

              setShowModal(false)

            }

            onAdded={() =>

              setShowModal(false)

            }

          />

        )

      }

    </div>

  );

}

export default LoveChallengesPage;