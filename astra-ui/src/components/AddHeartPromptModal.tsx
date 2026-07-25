import { useEffect, useState } from "react";

import {
  addDoc,
  collection,
  serverTimestamp,
  doc,
  getDoc,
  query,
  where,
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

interface AddHeartPromptModalProps{

  onClose:()=>void;

  onAdded:()=>void;

}

function AddHeartPromptModal({

  onClose,

  onAdded

}:AddHeartPromptModalProps){

  const [question,setQuestion]=
    useState("");

  const [authorId,setAuthorId]=
    useState("");

  const [authorName,setAuthorName]=
    useState("");

  const [saving,setSaving]=
    useState(false);

  const [error,setError]=
    useState("");

  useEffect(()=>{

    const unsubscribe=

      onAuthStateChanged(

        auth,

        async(user:User|null)=>{

          if(!user)
            return;

          setAuthorId(user.uid);

          const userRef=

            doc(
              db,
              "users",
              user.uid
            );

          const snapshot=

            await getDoc(userRef);

          if(snapshot.exists()){

            const data=snapshot.data();

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

    return ()=>unsubscribe();

  },[]);

  async function createHeartPrompt(){

    setError("");

    if(!question.trim()){

      setError(
        "Question cannot be empty."
      );

      return;

    }

    try{

      setSaving(true);

      const existingQuery=query(

        collection(
          db,
          "heartPrompts"
        ),

        where(
          "answered",
          "==",
          false
        )

      );

      const existingSnapshot=

        await getDocs(
          existingQuery
        );

      if(!existingSnapshot.empty){

        setError(
          "There is already an active Heart Prompt."
        );

        setSaving(false);

        return;

      }

      const promptRef=

        await addDoc(

          collection(
            db,
            "heartPrompts"
          ),

          {

            question,

            authorId,

            authorName,

            answered:false,

            answer:"",

            answeredBy:"",

            answeredByName:"",

            createdAt:
              serverTimestamp(),

            answeredAt:null

          }

        );
              await createNotification({

        receiver:
          authorName === "icarus"
            ? "eraya"
            : "icarus",

        sender: authorName,

        type: "heart_prompt",

        title: "❤️ New Heart Prompt",

        message:
          `${authorName} asked today's Heart Prompt.`,

        referenceId: promptRef.id

      });

      onAdded();

      onClose();

    }catch(err){

      console.error(err);

      setError(
        "Failed to create Heart Prompt."
      );

    }finally{

      setSaving(false);

    }

  }

  return(

    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

      <div className="bg-[#161616] border border-pink-500/30 rounded-2xl w-full max-w-lg p-6">

        <h2 className="text-2xl font-bold text-pink-300 mb-2">

          ❤️ New Heart Prompt

        </h2>

        <p className="text-gray-400 text-sm mb-6">

          Ask one meaningful question.
          Your partner will answer it,
          and it will automatically move
          into the Heart Journal.

        </p>

        <textarea

          value={question}

          onChange={(e)=>
            setQuestion(e.target.value)
          }

          rows={6}

          maxLength={300}

          placeholder="What would you like to ask today?"

          className="w-full rounded-xl bg-[#202020] border border-pink-500/20 p-4 outline-none resize-none text-white placeholder:text-gray-500 focus:border-pink-400 transition"

        />

        <div className="mt-2 flex justify-end">

          <span className="text-xs text-gray-500">

            {question.length}/300

          </span>

        </div>

        {error && (

          <div className="mt-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-sm p-3">

            {error}

          </div>

        )}

        <div className="flex justify-end gap-3 mt-6">

          <button

            onClick={onClose}

            disabled={saving}

            className="px-5 py-2 rounded-lg border border-gray-600 hover:bg-gray-700 transition"

          >

            Cancel

          </button>

          <button

            onClick={createHeartPrompt}

            disabled={saving}

            className="px-5 py-2 rounded-lg bg-pink-600 hover:bg-pink-500 disabled:opacity-50 transition"

          >

            {saving
              ? "Creating..."
              : "Create"}

          </button>

        </div>

      </div>

    </div>

  );
  }

export default AddHeartPromptModal;