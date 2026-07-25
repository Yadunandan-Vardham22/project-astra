import { useEffect, useState } from "react";
import {
  createNotification
} from "../services/notificationService";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

import { auth, db } from "../firebase/firebaseConfig";

interface AddFutureDreamModalProps {
  onClose: () => void;
  onAdded: () => void;
}

function AddFutureDreamModal({
  onClose,
  onAdded,
}: AddFutureDreamModalProps) {
  const [dream, setDream] = useState("");
  const [authorId, setAuthorId] = useState("");
  const [authorName, setAuthorName] = useState("");

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      setAuthorId(user.uid);

      const snapshot = await getDoc(doc(db, "users", user.uid));

      if (snapshot.exists()) {
        const data = snapshot.data();

        setAuthorName(
          (data.starName || data.name || "Unknown").toLowerCase()
        );
      }
    });

    return () => unsubscribe();
  }, []);

  async function saveDream() {
    setError("");

    if (!dream.trim()) {
      setError("Dream cannot be empty.");
      return;
    }

    try {
      setSaving(true);

      const dreamRef = await addDoc(
  collection(db, "futureDreams"),
  {
    dream: dream.trim(),
    authorId,
    authorName,
    createdAt: serverTimestamp(),
  }
);

await createNotification({

  receiver:
    authorName === "icarus"
      ? "eraya"
      : "icarus",

  sender: authorName,

  type: "futureDream",

  title: "🌌 New Future Dream",

  message:
    `${authorName} added a new dream for your future together.`,

  referenceId: dreamRef.id

});

onAdded();
onClose();

      onAdded();
      onClose();
    } catch (err) {
      console.error(err);
      setError("Failed to save dream.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#161616] border border-purple-400/30 rounded-3xl w-full max-w-xl p-8">

        <h2 className="text-3xl font-light text-purple-300">
          🌌 Future Dream
        </h2>

        <p className="mt-2 text-sm text-gray-400">
          One sentence. One dream for your future together.
        </p>

        <textarea
          value={dream}
          onChange={(e) => setDream(e.target.value)}
          rows={4}
          maxLength={180}
          placeholder="Visit Iceland together..."
          className="mt-8 w-full rounded-2xl bg-[#202020] border border-purple-400/20 p-5 resize-none outline-none text-white placeholder:text-gray-500 focus:border-purple-300 transition"
        />

        <div className="mt-2 flex justify-end text-xs text-gray-500">
          {dream.length}/180
        </div>

        {error && (
          <div className="mt-5 rounded-xl bg-red-500/10 border border-red-500/30 p-3 text-red-300 text-sm">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-4 mt-8">

          <button
            onClick={onClose}
            disabled={saving}
            className="px-6 py-2 rounded-xl border border-gray-600 hover:bg-gray-700 transition"
          >
            Cancel
          </button>

          <button
            onClick={saveDream}
            disabled={saving}
            className="px-6 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 transition disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Dream"}
          </button>

        </div>

      </div>
    </div>
  );
}

export default AddFutureDreamModal;