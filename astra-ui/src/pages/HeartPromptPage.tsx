import { useEffect, useState } from "react";

import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query
} from "firebase/firestore";

import { onAuthStateChanged } from "firebase/auth";

import type { User } from "firebase/auth";

import { auth, db } from "../firebase/firebaseConfig";

import AddHeartPromptModal from "../components/AddHeartPromptModal";
import AnswerHeartPromptModal from "../components/AnswerHeartPromptModal";
import FloatingHeartsBackground from "../components/FloatingHeartsBackground";
import HomeButton from "../components/HomeButton";

interface HeartPrompt {
  id: string;
  question: string;
  authorId: string;
  authorName: string;
  answer: string;
  answered: boolean;
}

function HeartPromptPage() {
  const [currentUserId, setCurrentUserId] = useState("");
  const [currentUserName, setCurrentUserName] = useState("");
  const [prompt, setPrompt] = useState<HeartPrompt | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAnswerModal, setShowAnswerModal] = useState(false);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user: User | null) => {
      if (!user) {
        setLoading(false);
        return;
      }

      setCurrentUserId(user.uid);

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setCurrentUserName(((data as any).starName || (data as any).name || "Unknown").toLowerCase());
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    const q = query(collection(db, "heartPrompts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const activePrompt = snapshot.docs
        .map((d) => ({ id: d.id, ...(d.data() as any) }))
        .find((item: any) => !item.answered);

      if (activePrompt) setPrompt(activePrompt as HeartPrompt);
      else setPrompt(null);

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const isAuthor = prompt?.authorId === currentUserId;

  return (
    <div className="relative min-h-screen w-screen overflow-y-auto bg-black px-8 pb-20 pt-8 text-white">
      <FloatingHeartsBackground />

      <div className="fixed left-8 top-8 z-[100]">
        <HomeButton label="Romance" to="/romance" />
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-light tracking-[0.25em] text-pink-300">Daily Heart Prompt</h1>
          <p className="text-xs tracking-[0.5em] text-purple-300 mt-2 inline-block">
            One question. One heartfelt answer.
            <span className="ml-2 text-pink-300 text-sm animate-pulse">▏</span>
          </p>
        </div>

        <div className="mt-12">
          {loading ? (
            <div className="text-center py-20 text-gray-500">Loading...</div>
          ) : !prompt ? (
            <div className="rounded-3xl border border-pink-500/20 bg-[#151515] p-6 md:p-10 text-center">
              <div className="text-6xl mb-5">❤️</div>
              <h2 className="text-2xl font-semibold mb-3">No Active Heart Prompt</h2>
              <p className="text-gray-400">Ask a meaningful question to begin today's conversation.</p>
            </div>
          ) : (
            <div className="rounded-3xl border border-pink-500/20 bg-[#151515] p-8 mt-6">
              <div className="flex items-center justify-between">
                <span className="text-pink-300 font-semibold">Asked by {prompt.authorName}</span>
                <span className="text-xs text-gray-500">Active</span>
              </div>

              <div className="mt-8">
                <p className="text-3xl leading-relaxed font-light">"{prompt.question}"</p>
              </div>

              <div className="mt-10">
                {isAuthor ? (
                  <div className="rounded-2xl border border-pink-500/20 bg-pink-500/5 p-5">
                    <p className="text-pink-300 font-medium mb-2">Waiting for your partner ❤️</p>
                    <p className="text-gray-400">Your question has been sent. It'll move to the Heart Journal once your partner answers.</p>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-pink-500/20 bg-pink-500/5 p-5">
                    <p className="text-pink-300 font-medium mb-2">It's your turn.</p>
                    <p className="text-gray-400 mb-6">Answer honestly. Once submitted, this conversation will be saved forever in your Heart Journal.</p>
                    <button
                      onClick={() => setShowAnswerModal(true)}
                      className="rounded-full border border-pink-300/30 bg-pink-600/70 px-4 py-2 text-sm tracking-widest font-semibold shadow-[0_8px_30px_rgba(244,114,182,0.12)] hover:shadow-[0_12px_40px_rgba(244,114,182,0.18)] transition cursor-pointer"
                    >
                      Answer Prompt
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Floating Ask button */}
        {!prompt && (
          <button
            onClick={() => setShowAddModal(true)}
            className="fixed bottom-32 right-10 cursor-pointer rounded-full border border-pink-300/40 bg-pink-500/20 px-6 py-3 text-xs tracking-widest backdrop-blur-xl"
          >
            Ask Today's Prompt
          </button>
        )}

        {showAddModal && <AddHeartPromptModal onClose={() => setShowAddModal(false)} onAdded={() => setShowAddModal(false)} />}

        {showAnswerModal && prompt && (
          <AnswerHeartPromptModal
            prompt={prompt}
            currentUserName={currentUserName}
            onClose={() => setShowAnswerModal(false)}
            onAnswered={() => setShowAnswerModal(false)}
          />
        )}
      </div>
    </div>
  );
}

export default HeartPromptPage;
