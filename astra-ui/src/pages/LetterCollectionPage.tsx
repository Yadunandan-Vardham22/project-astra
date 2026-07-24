import { useParams } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";

import BackButton from "../components/BackButton";
import LetterModal from "../components/LetterModal";





const collections:any = {


  love:{

    icon:"💗",

    title:"Love Letters",

    subtitle:
    "Words written from the heart.",


    letters:[

      {
        title:"A Little Reminder",

        date:"24 July 2026",

        content:
`Dear Star,

Sometimes I just want you to remember that you are loved.

Even on the days when you forget your own light,
I hope you remember that someone believes in you.

Always keep shining.

— Your Star Keeper`
      },



      {
        title:"When You Miss Me",

        date:"A letter saved for lonely nights",

        content:
`Dear Star,

Distance only changes where we stand,
not how close two hearts can feel.

Whenever you miss me,
remember that somewhere there is someone
thinking about you too.

— Your Star Keeper`
      },



      {
        title:"Things I Never Say",

        date:"A hidden piece of my heart",

        content:
`Dear Star,

There are feelings that are too big
to fit inside ordinary conversations.

So I am leaving them here,
where they will wait forever.

— Your Star Keeper`
      }

    ]

  },







  apologies:{

    icon:"🌧",

    title:"Apology Letters",

    subtitle:
    "Words after storms.",


    letters:[

      {

        title:"Understanding",

        date:"A moment of reflection",

        content:
`Sometimes we hurt the people we love
without intending to.

This letter is a reminder that love is also
about listening, understanding and growing.`

      }

    ]

  },








  future:{

    icon:"🌌",

    title:"Future Us",

    subtitle:
    "Messages waiting for tomorrow.",


    letters:[

      {

        title:"A Letter From Today",

        date:"Saved for the future",

        content:
`To the future version of us,

Remember where we started.

Remember the dreams,
the struggles and the reasons
we chose each other.`

      }

    ]

  },








  "dream-journal":{

    icon:"🌙",

    title:"Dream Journal",

    subtitle:
    "Worlds that existed while we slept.",


    letters:[

      {

        title:"Dream Fragment #001",

        date:"A night worth remembering",

        content:
`A strange world appeared while sleeping.

A place that existed only for a few moments,
but felt real enough to deserve a memory.`

      }

    ]

  },








  hidden:{

    icon:"✨",

    title:"Hidden Letters",

    subtitle:
    "Secrets waiting to be discovered.",


    letters:[

      {

        title:"Hidden Message",

        date:"Locked among the stars",

        content:
`Some messages are not meant to be found immediately.

They wait for the perfect moment.`

      }

    ]

  }


};










function LetterCollectionPage(){



  const {category}=useParams();



  const collection =
    collections[category || "love"];





  const [selectedLetter,setSelectedLetter]=useState<any>(null);







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





      <BackButton

        path="/letters"

        label="Letters"

      />








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



          <div className="text-6xl">

            {collection.icon}

          </div>





          <h1


            className="
              mt-6
              text-5xl
              font-light
              tracking-[0.3em]
            "


          >

            {collection.title}

          </h1>







          <p


            className="
              mt-5
              text-xs
              tracking-[0.5em]
              text-purple-300
            "


          >

            {collection.subtitle}

          </p>



        </div>









        {/* Letter Cards */}



        <div


          className="
            mt-20
            grid
            gap-8
            md:grid-cols-2
          "


        >




        {

          collection.letters.map(

            (letter:any,index:number)=>(


              <motion.button



                key={index}



                whileHover={{

                  y:-8,

                  scale:1.03

                }}



                onClick={()=>setSelectedLetter(letter)}



                className="
                  group
                  cursor-pointer
                  rounded-3xl
                  border
                  border-white/10
                  bg-white/[0.04]
                  p-10
                  text-left
                  backdrop-blur-xl
                  transition
                  hover:border-pink-300/40
                "



              >





                <motion.div


                  animate={{

                    y:[0,-8,0]

                  }}



                  transition={{

                    duration:3,

                    repeat:Infinity

                  }}



                  className="text-5xl"

                >

                  💌

                </motion.div>







                <h2


                  className="
                    mt-6
                    text-2xl
                    font-light
                  "


                >

                  {letter.title}

                </h2>








                <p


                  className="
                    mt-3
                    text-sm
                    text-white/50
                  "


                >

                  {letter.date}

                </p>








                <p


                  className="
                    mt-8
                    text-xs
                    tracking-[0.3em]
                    text-purple-300
                  "


                >

                  OPEN LETTER →

                </p>





              </motion.button>


            )

          )

        }




        </div>







      </div>









      {
        selectedLetter && (


          <LetterModal


            title={selectedLetter.title}


            date={selectedLetter.date}


            content={selectedLetter.content}


            onClose={()=>setSelectedLetter(null)}


          />


        )
      }







    </div>

  );

}



export default LetterCollectionPage;