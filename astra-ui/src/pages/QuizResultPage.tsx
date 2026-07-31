import {
  useLocation,
  useNavigate
} from "react-router-dom";


import {
  motion
} from "framer-motion";







function QuizResultPage(){



  const navigate = useNavigate();


  const location = useLocation();




  const score =

    location.state?.score || 0;



  const reward =

    location.state?.reward || 0;









  return (



    <div


      className="
        min-h-screen
        bg-black
        px-8
        py-20
        text-white
        flex
        items-center
        justify-center
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
          max-w-xl
          w-full
          rounded-3xl
          border
          border-purple-300/30
          bg-purple-500/5
          p-12
          text-center
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
          rounded-3xl
          border
          border-white/10
          bg-white/5
          p-8
        ">





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









        <div className="
          mt-6
          rounded-3xl
          border
          border-white/10
          bg-white/5
          p-8
        ">





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