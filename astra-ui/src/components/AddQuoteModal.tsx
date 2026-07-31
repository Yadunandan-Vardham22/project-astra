import { useEffect, useState } from "react";
import { addDoc, collection, doc, getDoc, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase/firebaseConfig";
import { createNotification } from "../services/notificationService";

interface AddQuoteModalProps {
  onClose: () => void;
  onAdded: () => void;
}

function AddQuoteModal({ onClose, onAdded }: AddQuoteModalProps) {
  const [quote, setQuote] = useState("");
  const [authorId, setAuthorId] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) return;
      setAuthorId(user.uid);
      const snapshot = await getDoc(doc(db, "users", user.uid));
      if (snapshot.exists()) {
        const data = snapshot.data();
        setAuthorName((data.starName || data.name || "Unknown").toLowerCase());
      }
    });
    return () => unsub();
  }, []);

  async function saveQuote() {
    setError("");
    if (!quote.trim()) {
      setError("Quote cannot be empty.");
      return;
    }
    try {
      setSaving(true);
      const ref = await addDoc(collection(db, "quotes"), {
        quote: quote.trim(),
        authorId,
        authorName,
        likedBy: [],
        createdAt: serverTimestamp(),
      });

      await createNotification({
        receiver: authorName === "icarus" ? "eraya" : "icarus",
        sender: authorName,
        type: "quote",
        title: "✦ New Quote",
        message: `${authorName} added a new quote.`,
        referenceId: ref.id,
      });

      onAdded();
      onClose();
    } catch (err) {
      console.error(err);
      setError("Failed to save quote.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#161616] border border-yellow-400/30 rounded-3xl w-full max-w-xl p-8">
        <h2 className="text-3xl font-light text-yellow-300">✦ Add Quote</h2>
        <p className="mt-2 text-sm text-gray-400">Share a short favorite quote. Others can like it.</p>

        <textarea
          value={quote}
          onChange={(e) => setQuote(e.target.value)}
          rows={4}
          maxLength={280}
          placeholder="Sometimes the heart knows what the mind cannot..."
          className="mt-8 w-full rounded-2xl bg-[#202020] border border-yellow-400/20 p-5 resize-none outline-none text-white placeholder:text-gray-500 focus:border-yellow-300 transition"
        />

        <div className="mt-2 flex justify-end text-xs text-gray-500">{quote.length}/280</div>

        {error && <div className="mt-5 rounded-xl bg-red-500/10 border border-red-500/30 p-3 text-red-300 text-sm">{error}</div>}

        <div className="flex justify-end gap-4 mt-8">
          <button onClick={onClose} disabled={saving} className="px-6 py-2 rounded-xl border border-gray-600 hover:bg-gray-700 transition">Cancel</button>
          <button onClick={saveQuote} disabled={saving} className="px-6 py-2 rounded-xl bg-yellow-600 hover:bg-yellow-500 transition disabled:opacity-50">{saving ? "Saving..." : "Save Quote"}</button>
        </div>
      </div>
    </div>
  );
}

export default AddQuoteModal;
