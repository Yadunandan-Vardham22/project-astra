import { useState } from "react";

import {
  doc,
  updateDoc,
  serverTimestamp
} from "firebase/firestore";

import {
  auth,
  db
} from "../firebase/firebaseConfig";

interface HeartPrompt{

  id:string;

  question:string;

  authorId:string;

  authorName:string;

  answer:string;

  answered:boolean;

}

interface AnswerHeartPromptModalProps{

  prompt:HeartPrompt;

  currentUserName:string;

  onClose:()=>void;

  onAnswered:()=>void;

}

function AnswerHeartPromptModal({

  prompt,

  currentUserName,

  onClose,

  onAnswered

}:AnswerHeartPromptModalProps){

  const [answer,setAnswer]=
    useState("");

  const [saving,setSaving]=
    useState(false);

  const [error,setError]=
    useState("");

  async function submitAnswer(){

    setError("");

    if(!answer.trim()){

      setError(
        "Please write your answer."
      );

      return;

    }

    try{

      setSaving(true);

      await updateDoc(

        doc(
          db,
          "heartPrompts",
          prompt.id
        ),

        {

          answer,

          answered:true,

          answeredBy:
            auth.currentUser?.uid ?? "",

          answeredByName:
            currentUserName,

          answeredAt:
            serverTimestamp()

        }

      );

      onAnswered();

      onClose();

    }catch(err){

      console.error(err);

      setError(
        "Failed to submit answer."
      );

    }finally{

      setSaving(false);

    }

  }

  return(

    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

      <div className="bg-[#161616] border border-pink-500/30 rounded-2xl w-full max-w-xl p-6">

        <h2 className="text-2xl font-bold text-pink-300 mb-2">

          ❤️ Answer Heart Prompt

        </h2>

        <p className="text-sm text-gray-400 mb-6">

          {prompt.authorName} asked:

        </p>

        <div className="rounded-xl bg-[#202020] border border-pink-500/20 p-5 mb-6">

                  <p className="text-white text-lg leading-relaxed">

            {prompt.question}

          </p>

        </div>

        <textarea

          value={answer}

          onChange={(e)=>
            setAnswer(e.target.value)
          }

          rows={7}

          maxLength={1000}

          placeholder="Write your answer from the heart..."

          className="w-full rounded-xl bg-[#202020] border border-pink-500/20 p-4 resize-none outline-none text-white placeholder:text-gray-500 focus:border-pink-400 transition"

        />

        <div className="mt-2 flex justify-end">

          <span className="text-xs text-gray-500">

            {answer.length}/1000

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

            onClick={submitAnswer}

            disabled={saving}

            className="px-5 py-2 rounded-lg bg-pink-600 hover:bg-pink-500 disabled:opacity-50 transition"

          >

            {saving
              ? "Submitting..."
              : "Submit Answer"}

          </button>

        </div>

      </div>

    </div>

  );
  }

export default AnswerHeartPromptModal;