import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";

import { auth, db } from "../firebase/firebaseConfig";

import CelestialBackground from "../components/CelestialBackground";
import CosmicCursor from "../components/CosmicCursor";
import VerificationSuccess from "../components/VerificationSuccess";



function VerifyPage() {


  const navigate = useNavigate();


  const [questions, setQuestions] = useState<any[]>([]);

  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [answer, setAnswer] = useState("");

  const [loading, setLoading] = useState(true);

  const [message, setMessage] = useState("");

  const [wrong, setWrong] = useState(false);

  const [showSuccess, setShowSuccess] = useState(false);





  useEffect(() => {


    const loadQuestions = async () => {


      const user = auth.currentUser;


      if (!user) {

        navigate("/login");

        return;

      }



      const userRef = doc(
        db,
        "users",
        user.uid
      );



      const snap = await getDoc(userRef);



      if (!snap.exists()) {

        navigate("/login");

        return;

      }



      setQuestions(
        snap.data().questions || []
      );


      setLoading(false);


    };



    loadQuestions();



  }, [navigate]);









  const verifyAnswer = () => {


    const correctAnswer =
      questions[currentQuestion].answer;



    if (

      answer.trim().toLowerCase()

      ===

      correctAnswer.trim().toLowerCase()

    ) {



      setWrong(false);

      setAnswer("");



      if (

        currentQuestion === questions.length - 1

      ) {


        setShowSuccess(true);


      }

      else {


        setMessage(
          "Hmm... the stars recognize you ✦"
        );



        setTimeout(()=>{


          setCurrentQuestion(

            currentQuestion + 1

          );


          setMessage("");



        },1800);



      }



    }

    else {


      setWrong(true);


      setMessage(
        "Nice try, stranger ✦\nBut my star would know this one."
      );


    }



  };









  if (loading) {


    return (

      <div

        className="
          h-screen
          flex
          items-center
          justify-center
          bg-black
          text-white
        "

      >

        Looking through the stars...

      </div>

    );

  }









  if (showSuccess) {


    return (

      <div

        className="
          relative
          h-screen
          w-screen
        "

      >

        <CelestialBackground />

        <CosmicCursor />


        <VerificationSuccess

          onComplete={() =>
            navigate("/home")
          }

        />


      </div>

    );


  }









  return (

    <div

      className="
        relative
        h-screen
        w-screen
        overflow-hidden
      "

    >



      <CelestialBackground />

      <CosmicCursor />







      <div

        className="
          relative
          z-10
          h-full
          flex
          items-center
          justify-center
        "

      >





        <motion.div


          initial={{

            opacity:0,

            y:30

          }}



          animate={{

            opacity:1,

            y:0

          }}



          transition={{

            duration:1.2

          }}



          className="w-full max-w-[420px] text-center -translate-y-10 px-6"


        >






          {/* Floating star */}

          <motion.div


            animate={{

              y:[0,-8,0],

              opacity:[0.5,1,0.5]

            }}



            transition={{

              duration:3,

              repeat:Infinity

            }}



            className="
              mb-6
              text-xl
              text-purple-200
            "

          >

            ✦

          </motion.div>









          <motion.h1


            animate={{


              textShadow:[


                `
                0 0 15px rgba(255,255,255,0.5),
                0 0 35px rgba(168,85,247,0.8)
                `,


                `
                0 0 30px rgba(255,255,255,0.9),
                0 0 70px rgba(168,85,247,1)
                `,


                `
                0 0 15px rgba(255,255,255,0.5),
                0 0 35px rgba(168,85,247,0.8)
                `


              ]

            }}



            transition={{

              duration:4,

              repeat:Infinity

            }}



            className="

              text-3xl

              font-light

              tracking-wide

              whitespace-nowrap

              text-[#FFF7E6]

            "


          >

            {
              currentQuestion === 0

              ?

              "One tiny question, My Sitara ✦"

              :

              "Wait a second... My Sitara ✦"

            }



          </motion.h1>









          <p


            className="
              mt-10
              text-sm
              leading-7
              text-[#F8F1FF]
            "



            style={{


              textShadow:

              `
              0 0 12px rgba(255,255,255,0.6)
              `

            }}



          >



            {
              currentQuestion === 0

              ?

              <>
                Before I let you in,
                <br/>
                I need to make sure you are actually you...
                <br/>
                and not an alien pretending to be cute. 👽
              </>


              :

              <>
                Wait a second...
                <br/>
                I have one more question for you.
                <br/>
                Don't worry, it's easier than winning an argument with me. 😌
              </>

            }


          </p>









          <motion.p


            key={
              questions[currentQuestion]?.question
            }



            initial={{

              opacity:0,

              y:15

            }}



            animate={{

              opacity:1,

              y:0

            }}



            className="
              mt-20
              text-lg
              text-white
            "



            style={{

              textShadow:

              `
              0 0 10px white,
              0 0 35px #c4b5fd,
              0 0 60px #8b5cf6
              `

            }}



          >

            {
              questions[currentQuestion]?.question
            }


          </motion.p>









          <input


            value={answer}



            onChange={(e)=>

              setAnswer(e.target.value)

            }



            placeholder="Whisper your answer..."



            className={`


              mt-14

              w-full

              bg-transparent

              border-b

              pb-3

              text-center

              outline-none

              tracking-[0.5em]

              text-white


              placeholder:text-[#ede9fe]/70



              ${

                wrong

                ?

                "border-pink-400"

                :

                "border-[#c4b5fd]"


              }


            `}



          />









          {

            message &&

            (

              <motion.p


                initial={{

                  opacity:0

                }}



                animate={{

                  opacity:1

                }}



                className="
                  mt-6
                  whitespace-pre-line
                  text-sm
                  text-[#F8F1FF]
                "


              >

                {message}


              </motion.p>


            )

          }









          <motion.button


            onClick={verifyAnswer}



            whileHover={{

              scale:1.05,

              y:-3

            }}



            whileTap={{

              scale:0.95

            }}



            animate={{


              boxShadow:[


                "0 0 15px rgba(168,85,247,0.4)",


                "0 0 40px rgba(168,85,247,0.8)",


                "0 0 15px rgba(168,85,247,0.4)"

              ]


            }}



            transition={{

              duration:3,

              repeat:Infinity

            }}



            className="

              mt-14

              px-10

              py-3

              rounded-full

              border

              border-[#E9D5FF]/50

              bg-white/5

              text-sm

              tracking-[0.3em]

              uppercase

              text-[#FFF7E6]

              cursor-pointer

            "


          >


            {
              currentQuestion === 0

              ?

              "Enter the stars ✦"

              :

              "Reveal my star ✦"

            }


          </motion.button>






        </motion.div>



      </div>





    </div>


  );

}



export default VerifyPage;