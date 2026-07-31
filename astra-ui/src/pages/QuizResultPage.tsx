import {
  useLocation,
  useNavigate
} from "react-router-dom";


import {
  motion
} from "framer-motion";

import FloatingPuzzleBackground from "../components/FloatingPuzzleBackground";

function formatAnswerValue(value: any) {
  if (Array.isArray(value)) {
    return value.join(", ");
  }

  if (value === null || value === undefined || value === "") {
    return "No answer selected";
  }

  return String(value);
}







function QuizResultPage(){



  const navigate = useNavigate();


  const location = useLocation();




  const score =

    location.state?.score || 0;

  const reward =

    location.state?.reward || 0;
  const quiz = location.state?.quiz || null;
  const answers = Array.isArray(location.state?.answers) ? location.state.answers : [];
  const questions = Array.isArray(quiz?.questions) ? quiz.questions : [];

  function isAnswerCorrect(question: any, selected: any) {
    const correct = question.correctAnswers || question.correctAnswer;

    if (Array.isArray(correct)) {
      const normalizedSelected = Array.isArray(selected)
        ? selected
        : selected === null || selected === undefined || selected === ""
          ? []
          : [selected];

      return JSON.stringify([...correct].sort()) === JSON.stringify([...normalizedSelected].sort());
    }

    return selected === correct;
  }

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






      <motion.div



        initial={{

          opacity:0,

          scale:0.8

        }}



        animate={{

          opacity:1,

          scale:1

        }}



        className="
          mx-auto
          max-w-5xl
          w-full
          rounded-[2rem]
          border
          border-purple-300/30
          bg-purple-500/5
          p-8
          text-center
          md:p-12
        "


      >








        <div className="
          text-7xl
        ">

          ✨

        </div>








        <h1 className="
          mt-8
          text-5xl
          font-light
        ">


          QUIZ COMPLETED


        </h1>








        <p className="
          mt-6
          text-white/60
        ">


          You discovered how well you know each other.


        </p>









        <div className="
          mt-10
          grid
          gap-6
          md:grid-cols-2
        ">

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">





          <p className="
            text-xs
            tracking-[0.4em]
            text-purple-300
          ">

            SCORE

          </p>






          <h2 className="
            mt-4
            text-6xl
            font-light
          ">


            {score}


          </h2>





        </div>









          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">





          <p className="
            text-xs
            tracking-[0.4em]
            text-purple-300
          ">

            STAR DUST EARNED

          </p>






          <h2 className="
            mt-4
            text-4xl
            font-light
          ">


            ⭐ {reward}


          </h2>






        </div>

      </div>








        <div className="mt-10 space-y-6 text-left">
          {questions.map((question: any, index: number) => {
            const answer = answers[index] || {};
            const selected = answer.selected;
            const correct = question.correctAnswers || question.correctAnswer || [];
            const isCorrect = isAnswerCorrect(question, selected);

            return (
              <div key={index} className="rounded-[1.5rem] border border-white/10 bg-black/20 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-purple-300">{index + 1}</p>
                    <h3 className="mt-2 text-lg font-light text-white">{question.question}</h3>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.3em] ${isCorrect ? "bg-green-500/15 text-green-300" : "bg-rose-500/15 text-rose-300"}`}>
                    {isCorrect ? "Correct" : "Review"}
                  </span>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">Your answer</p>
                    <p className="mt-2 text-sm text-white/80">{formatAnswerValue(selected)}</p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">Correct answer</p>
                    <p className="mt-2 text-sm text-white/80">{formatAnswerValue(correct)}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button



          onClick={()=>navigate("/quiz")}



          className="
            mt-10
            w-full
            cursor-pointer
            rounded-full
            border
            border-white/20
            py-3 md:py-4
            text-xs
            tracking-[0.4em]
            transition
            hover:bg-white/10
          "


        >

          BACK TO QUIZZES


        </button>







      </motion.div>







    </div>


  );

}




export default QuizResultPage;