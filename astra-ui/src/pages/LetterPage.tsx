import { useParams } from "react-router-dom";
import { motion } from "framer-motion";

import { useEffect, useState } from "react";

import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../firebase/firebaseConfig";
import type { User } from "firebase/auth";
import HomeButton from "../components/HomeButton";
import EditLetterModal from "../components/EditLetterModal";
import FloatingHeartsBackground from "../components/FloatingHeartsBackground";

const collectionInfo:any = {

  love:{ icon:"💗" },
  angry:{ icon:"🔥" },
  apologies:{ icon:"🌧" },
  "dream-journal":{ icon:"🌙" },
  confessions:{ icon:"🤍" }

};

function LetterPage(){

  const { category, letterId } = useParams();

  const collection = collectionInfo[category || "love"];

  const [letter,setLetter] = useState<any>(null);
  const [loading,setLoading] = useState(true);
  const [currentUser,setCurrentUser] = useState<User|null>(null);
  const [editOpen,setEditOpen] = useState(false);
  const [favoriteUpdating,setFavoriteUpdating] = useState(false);

  useEffect(()=>{
    const unsubscribe = onAuthStateChanged(auth, (user)=> setCurrentUser(user));
    return ()=>unsubscribe();
  },[]);

  async function fetchLetter(){
    if(!letterId) return;
    try{
      const letterRef = doc(db, "letters", letterId);
      const snapshot = await getDoc(letterRef);
      if(snapshot.exists()){
        const data = snapshot.data();
        let updatedViewedBy = data.viewedBy || [];
        if(currentUser && !updatedViewedBy.includes(currentUser.uid)){
          await updateDoc(letterRef, { viewedBy: arrayUnion(currentUser.uid) });
          updatedViewedBy = [...updatedViewedBy, currentUser.uid];
        }
        setLetter({ id:snapshot.id, ...data, viewedBy:updatedViewedBy });
      }
    }catch(e){ console.error("Error fetching letter:", e); }
    finally{ setLoading(false); }
  }

  useEffect(()=>{ if(currentUser) fetchLetter(); },[letterId,currentUser]);

  async function toggleFavorite() {
    if(!currentUser || !letter) return;

    const currentFavoritedBy = Array.isArray(letter.favoritedBy) ? letter.favoritedBy : [];
    const isFavorite = currentFavoritedBy.includes(currentUser.uid);
    const nextFavoritedBy = isFavorite
      ? currentFavoritedBy.filter((id:string) => id !== currentUser.uid)
      : [...currentFavoritedBy, currentUser.uid];

    setLetter((prev:any) => prev ? { ...prev, favoritedBy: nextFavoritedBy } : prev);
    setFavoriteUpdating(true);

    try {
      await updateDoc(doc(db, "letters", letter.id), {
        favoritedBy: isFavorite
          ? arrayRemove(currentUser.uid)
          : arrayUnion(currentUser.uid)
      });
    } catch (error) {
      console.error("Error updating favorite:", error);
      setLetter((prev:any) => prev ? { ...prev, favoritedBy: currentFavoritedBy } : prev);
    } finally {
      setFavoriteUpdating(false);
    }
  }

  if(loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Discovering letter...</div>;
  if(!letter) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Letter not found</div>;

  const canEdit = Boolean(
    currentUser &&
      letter &&
      (
        currentUser.uid === letter.authorId ||
        (letter.authorName && currentUser.displayName && letter.authorName.toLowerCase() === currentUser.displayName.toLowerCase()) ||
        (letter.authorName && currentUser.email && letter.authorName.toLowerCase() === currentUser.email.split("@")[0].toLowerCase())
      )
  );

  const isFavorite = Boolean(
    currentUser &&
      Array.isArray(letter.favoritedBy) &&
      letter.favoritedBy.includes(currentUser.uid)
  );

  return (
    <div className="relative min-h-screen w-screen overflow-y-auto bg-black px-8 pb-20 pt-8 text-white">
      <FloatingHeartsBackground />
      <div className="fixed left-8 top-8 z-[100]">
        <HomeButton label="Letters" to={`/letters/${category}`} />
      </div>

      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3">
            <h1 className="text-3xl font-light tracking-[0.3em]">{letter.title}</h1>
            <div className="text-4xl">{collection.icon}</div>
          </div>
          <p className="mx-auto mt-8 text-sm text-white/70">Written by {letter.authorName}</p>
        </div>

        <motion.div initial={{ opacity:0, y:40 }} animate={{ opacity:1, y:0 }} className="mt-12 rounded-[2rem] border border-pink-200/20 bg-[#faf5ed] p-6 text-black shadow-[0_20px_60px_rgba(236,72,153,0.12)] md:p-10">
          <p className="whitespace-pre-line font-serif text-lg leading-relaxed">
            {letter.greeting || "Dear Star,"}
            {"\n\n"}
            {letter.content}
            {"\n\n"}
            {letter.signature || "With love."}
          </p>
          <div className="mt-10 text-right text-3xl">💋</div>
        </motion.div>

        <div className="mt-8 flex justify-end gap-3">
          <button
            type="button"
            onClick={toggleFavorite}
            disabled={!currentUser || favoriteUpdating}
            className={`rounded-full border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.32em] shadow-[0_0_30px_rgba(244,114,182,0.28)] transition ${
              isFavorite
                ? "border-pink-300/70 bg-pink-500/35 text-pink-50"
                : "border-pink-300/40 bg-pink-500/20 text-pink-100"
            } ${!currentUser ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:bg-pink-500/35 hover:shadow-[0_0_36px_rgba(244,114,182,0.36)]"}`}
          >
            {favoriteUpdating ? "Saving..." : isFavorite ? "★ Favorited" : "☆ Favorite"}
          </button>

          {canEdit && (
            <button
              onClick={() => setEditOpen(true)}
              className="cursor-pointer rounded-full border border-pink-300/20 bg-pink-500/10 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.28em] text-pink-100 shadow-[0_0_20px_rgba(244,114,182,0.12)] transition hover:bg-pink-500/20"
            >
              Edit
            </button>
          )}
        </div>
        {editOpen && <EditLetterModal letter={letter} onClose={() => setEditOpen(false)} onUpdated={() => fetchLetter()} />}
      </div>
    </div>
  );

}

export default LetterPage;