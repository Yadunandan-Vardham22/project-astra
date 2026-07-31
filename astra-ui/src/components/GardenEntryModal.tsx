import { useEffect, useState } from "react";
import { addDoc, collection, doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db, storage } from "../firebase/firebaseConfig";
import { createNotification } from "../services/notificationService";

interface GardenEntryModalProps {
  type: "bug" | "suggestion";
  onClose: () => void;
  onSubmitted: () => void;
}

function GardenEntryModal({ type, onClose, onSubmitted }: GardenEntryModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [authorName, setAuthorName] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) return;
      const snapshot = await getDoc(doc(db, "users", user.uid));
      if (snapshot.exists()) {
        const data = snapshot.data();
        setAuthorName((data.starName || data.name || "Unknown").toLowerCase());
      }
    });
    return () => unsub();
  }, []);

  async function handleSubmit() {
    setError("");

    if (!title.trim()) {
      setError("Please enter a title.");
      return;
    }

    if (!description.trim()) {
      setError("Please enter a description.");
      return;
    }

    try {
      setSaving(true);
      const gardenEntryRef = await addDoc(collection(db, "gardenEntries"), {
        type,
        title: title.trim(),
        description: description.trim(),
        createdBy: authorName,
        status: type === "bug" ? "open" : "considering",
        createdAt: serverTimestamp(),
        attachment: null,
      });

      if (type === "bug" && file) {
        const fileRef = ref(storage, `garden/${gardenEntryRef.id}/${file.name}`);
        await uploadBytes(fileRef, file);
        const url = await getDownloadURL(fileRef);
        await updateDoc(gardenEntryRef, {
          attachment: url,
        });
      }

      await createNotification({
        receiver: "icarus",
        sender: authorName,
        type: type === "bug" ? "garden-bug" : "garden-suggestion",
        title: type === "bug" ? "🐛 Bug Reported" : "🌱 Suggestion Sent",
        message: type === "bug" ? `A bug has been reported by ${authorName}.` : `A suggestion has been sent by ${authorName}.`,
      });

      onSubmitted();
      onClose();
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 py-6">
      <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-[#141414] p-8 shadow-[0_30px_60px_-40px_rgba(255,255,255,0.25)]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-light text-white">{type === "bug" ? "Report Bug" : "Send Suggestion"}</h2>
            <p className="mt-2 text-sm text-purple-300">
              {type === "bug"
                ? "Share the issue and attach a file if needed."
                : "Add a suggestion heading and describe your idea clearly."}
            </p>
          </div>
          <button onClick={onClose} className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/75 hover:bg-white/5">Close</button>
        </div>

        <div className="mt-8 grid gap-5">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-white outline-none transition focus:border-pink-300"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            placeholder={type === "bug" ? "Describe the bug in detail..." : "Describe your suggestion..."}
            className="w-full rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-white outline-none transition focus:border-pink-300"
          />
          {type === "bug" && (
            <label className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70 transition hover:border-pink-300 hover:bg-white/10">
              Attach file
              <input
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden"
              />
            </label>
          )}
          {file && <div className="text-sm text-white/70">Selected file: {file.name}</div>}
          {error && <div className="rounded-2xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-300">{error}</div>}
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="rounded-full bg-pink-500 px-6 py-3 text-sm font-semibold text-black transition hover:bg-pink-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Sending..." : type === "bug" ? "Report Bug" : "Send Suggestion"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default GardenEntryModal;
