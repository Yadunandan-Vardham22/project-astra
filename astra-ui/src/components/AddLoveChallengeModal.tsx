import { useEffect, useState } from "react";

import {
  addDoc,
  collection,
  serverTimestamp,
  doc,
  getDoc,
  getDocs
} from "firebase/firestore";

import {
  onAuthStateChanged
} from "firebase/auth";

import type {
  User
} from "firebase/auth";

import {
  auth,
  db
} from "../firebase/firebaseConfig";

import {
  createNotification
} from "../services/notificationService";

interface AddLoveChallengeModalProps {

  onClose: () => void;

  onAdded: () => void;

}

function AddLoveChallengeModal({

  onClose,

  onAdded

}: AddLoveChallengeModalProps) {

  const [challenge, setChallenge] =
    useState("");

  const [authorId, setAuthorId] =
    useState("");

  const [authorName, setAuthorName] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [reward, setReward] =
    useState(20);

  useEffect(() => {

    const unsubscribe =

      onAuthStateChanged(

        auth,

        async (user: User | null) => {

          if (!user)
            return;

          setAuthorId(user.uid);

          const snapshot =

            await getDoc(

              doc(
                db,
                "users",
                user.uid
              )

            );

          if (snapshot.exists()) {

            const data = snapshot.data();

            setAuthorName(

              (

                data.starName ||

                data.name ||

                "Unknown"

              ).toLowerCase()

            );

          }

        }

      );

    return () => unsubscribe();

  }, []);

  async function createChallenge() {

    setError("");

    if (!challenge.trim()) {

      setError(

        "Challenge cannot be empty."

      );

      return;

    }

    if (!reward || reward < 1) {
      setError("Reward must be at least 1 Stardust.");
      return;
    }

    try {

      setSaving(true);

      const receiverName =
  authorName === "icarus"
    ? "eraya"
    : "icarus";

const usersSnapshot =
  await getDocs(
    collection(db,"users")
  );

const receiver =
  usersSnapshot.docs.find(doc=>{

    const data:any = doc.data();

    return (
      data.starName?.toLowerCase()
      ===
      receiverName
    );

  });

      const challengeRef =

        await addDoc(

          collection(
            db,
            "loveChallenges"
          ),

       {
    challenge: challenge.trim(),

    createdById: authorId,

    createdByName: authorName,

    receiverId: receiver?.id ?? "",

    receiverName,

    completed:false,

    completedAt:null,

    completedById:"",

    completedByName:"",

    reward: reward,

    createdAt:serverTimestamp()
}

        );

      await createNotification({

        receiver:
          authorName === "icarus"
            ? "eraya"
            : "icarus",

        sender: authorName,

        type: "loveChallenge",

        title: "✨ New Love Challenge",

        message:
          `${authorName} added a new Love Challenge.`,

        metadata: {

          challengeId: challengeRef.id

        }

      });

      onAdded();

      onClose();

    }

    catch (err) {

      console.error(err);

      setError(

        "Failed to create Love Challenge."

      );

    }

    finally {

      setSaving(false);

    }

  }

  return (

    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

      <div className="bg-[#161616] border border-yellow-400/30 rounded-2xl w-full max-w-lg p-6">

        <h2 className="text-2xl font-bold text-yellow-300 mb-2">

          ✨ New Love Challenge

        </h2>

        <p className="text-gray-400 text-sm mb-6">

          Add something fun, meaningful or adventurous
          for your relationship.

        </p>

        <textarea

          value={challenge}

          onChange={(e) =>
            setChallenge(e.target.value)
          }

          rows={5}

          maxLength={250}

          placeholder="Watch the sunrise together..."

          className="w-full rounded-xl bg-[#202020] border border-yellow-400/20 p-4 outline-none resize-none text-white placeholder:text-gray-500 focus:border-yellow-300 transition"

        />

        <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto]">
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-300">Stardust reward</label>
            <input
              type="number"
              min={1}
              value={reward}
              onChange={(e) => setReward(Number(e.target.value) || 1)}
              className="w-full rounded-xl bg-[#202020] border border-yellow-400/20 px-4 py-3 outline-none text-white focus:border-yellow-300 transition"
            />
          </div>
          <div className="flex items-end text-xs text-gray-500">
            Set how much Stardust the performer will earn.
          </div>
        </div>

        <div className="mt-2 flex justify-end">

          <span className="text-xs text-gray-500">

            {challenge.length}/250

          </span>

        </div>

        {

          error && (

            <div className="mt-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm p-3">

              {error}

            </div>

          )

        }

        <div className="flex justify-end gap-3 mt-6">

          <button

            onClick={onClose}

            disabled={saving}

            className="px-5 py-2 rounded-lg border border-gray-600 hover:bg-gray-700 transition"

          >

            Cancel

          </button>

          <button

            onClick={createChallenge}

            disabled={saving}

            className="px-5 py-2 rounded-lg bg-yellow-500 text-black hover:bg-yellow-400 disabled:opacity-50 transition"

          >

            {

              saving

                ? "Creating..."

                : "Create"

            }

          </button>

        </div>

      </div>

    </div>

  );

}

export default AddLoveChallengeModal;