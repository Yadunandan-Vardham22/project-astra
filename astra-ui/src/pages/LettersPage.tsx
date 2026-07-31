import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import AddLetterModal from "../components/AddLetterModal";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const letters = [

  {
    id:"love",
    icon:"💗",
    title:"Love Letters",
    description:
    "Words written for the moments when the heart needs a reminder."
  },

  {
    id:"angry",
    icon:"🔥",
    title:"Angry Letters",
    description:
    "Words written in moments of frustration, honesty and emotions left unspoken."
  },

  {
    id:"apologies",
    icon:"🌧",
    title:"Apology Letters",
    description:
    "Letters about understanding, growth and the things left unsaid."
  },

  {
    id:"dream-journal",
    icon:"🌙",
    title:"Dream Journal",
    description:
    "A place to preserve the strange, beautiful worlds visited while sleeping."
  },

  {
    id:"confessions",
    icon:"🤍",
    title:"Confession Box",
    description:
    "A place where hearts speak without fear. Honest thoughts, hidden feelings and quiet truths."
  }

];

function LettersPage(){

  const navigate = useNavigate();

  const [showAddLetter,setShowAddLetter] =
    useState(false);

  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    let mounted = true;

    async function fetchCounts() {
      try {
        const promises = letters.map(async (l) => {
          const q = query(collection(db, "letters"), where("category", "==", l.id));
          const snap = await getDocs(q);
          return [l.id, snap.size] as [string, number];
        });

        const results = await Promise.all(promises);

        if (!mounted) return;

        const map = Object.fromEntries(results);
        setCounts(map);
      } catch (e) {
        console.error("Error fetching letter counts:", e);
      }
    }

    fetchCounts();

    return () => {
      mounted = false;
    };
  }, []);

  return (

    <div

      className="
        min-h-screen
        w-screen
        overflow-y-auto
        bg-black
        px-8
        py-20
        text-white
      "

    >

      <div

        className="
          mx-auto
          max-w-5xl
        "

      >

        {/* Header */}

        <div

          className="
            text-center
          "

        >

          <div className="text-4xl">

            💌

          </div>

          <h1

            className="
              mt-6
              text-3xl
              font-light
              tracking-[0.3em]
            "

          >

            Letters

          </h1>

          <p

            className="
              mt-5
              text-xs
              tracking-[0.5em]
              text-purple-300
            "

          >

            WORDS THAT SURVIVED TIME

          </p>

          <p

            className="
              mx-auto
              mt-8
              max-w-xl
              text-lg
              italic
              text-white/70
            "

          >

            "Some feelings are too precious
            to disappear with time."

          </p>

        </div>

        {/* Letter Categories */}

        <div

          className="
            mt-20
            grid
            gap-8
            md:grid-cols-2
          "

        >

          {

            letters.map((letter)=>(

              <button

                key={letter.id}

                onClick={()=>navigate(

                  `/letters/${letter.id}`

                )}

                className="
                  group
                  cursor-pointer
                  rounded-3xl
                  border
                  border-white/10
                  bg-white/[0.04]
                  p-6 md:p-10
                  text-left
                  backdrop-blur-xl
                  transition
                  hover:border-pink-300/40
                  hover:bg-white/[0.08]
                "
                style={{
                  boxShadow: `0 12px 40px ${(
                    {
                      love: 'rgba(236,72,153,0.12)',
                      angry: 'rgba(249,115,22,0.10)',
                      apologies: 'rgba(59,130,246,0.10)',
                      'dream-journal': 'rgba(139,92,246,0.10)',
                      confessions: 'rgba(107,114,128,0.06)'
                    } as Record<string,string>
                  )[letter.id] || 'transparent'}`
                }}

              >

                <div className="flex items-start justify-between gap-4">

                  <div>

                    <h2 className="text-2xl font-light tracking-wide flex items-center gap-3">

                      <span>{letter.title}</span>

                      <span className="text-2xl md:text-3xl">{letter.icon}</span>

                    </h2>

                    <p className="mt-2 text-sm leading-relaxed text-white/70">

                      {letter.description}

                    </p>

                  </div>

                  <div className="flex-shrink-0 flex items-start pt-1">

                    <span className="text-sm text-white/70">({counts[letter.id] ?? 0})</span>

                  </div>

                </div>

                <p

                  className="
                    mt-6
                    text-xs
                    tracking-[0.3em]
                    text-purple-300
                  "

                >

                  OPEN COLLECTION →

                </p>

              </button>

            ))

          }

        </div>

        {/* Bottom Quote */}

        <div

          className="
            mt-20
            rounded-3xl
            border
            border-purple-300/20
            bg-purple-500/5
            p-6 md:p-10
            text-center
          "

        >

          <p

            className="
              text-xs
              tracking-[0.5em]
              text-purple-300
            "

          >

            LETTERS FROM THE UNIVERSE

          </p>

          <p

            className="
              mt-6
              text-xl
              font-light
              italic
            "

          >

            "Some words are written by hands.
            Others are written by hearts."

          </p>

        </div>

      </div>

      <button

        onClick={()=>setShowAddLetter(true)}

        className="
          fixed
          bottom-32
          right-10
          cursor-pointer
          rounded-full
          border
          border-pink-300/40
          bg-pink-500/20
          px-6
          py-3 md:py-4
          text-xs
          tracking-widest
          backdrop-blur-xl
        "

      >

        + WRITE LETTER 💌

      </button>

      {

        showAddLetter && (

          <AddLetterModal

            onClose={()=>
              setShowAddLetter(false)
            }

            onAdded={()=>{}}

          />

        )

      }

    </div>

  );

}

export default LettersPage;