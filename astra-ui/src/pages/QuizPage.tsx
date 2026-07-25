import { useNavigate } from "react-router-dom";



const categories = [

  {
    id:"about-us",

    icon:"💗",

    title:"About Us",

    description:
    "Questions about memories, moments and the little things that make us us."
  },


  {
    id:"about-me",

    icon:"🌌",

    title:"About Me",

    description:
    "How well do you know the person behind the stars?"
  },


  {
    id:"fun",

    icon:"🎭",

    title:"Fun Challenges",

    description:
    "Random questions, silly moments and things to make you smile."
  },


  {
    id:"dreams",

    icon:"🌙",

    title:"Dreams",

    description:
    "Questions about imagination, wishes and worlds we want to explore."
  },


  {
    id:"chemistry",

    icon:"🔥",

    title:"Chemistry",

    description:
    "The playful, teasing and flirty side of our universe."
  }

];







function QuizPage(){


  const navigate = useNavigate();




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




          <div className="text-6xl">

            ✦

          </div>






          <h1

            className="
              mt-6
              text-5xl
              font-light
              tracking-[0.3em]
            "

          >

            Quiz Galaxy

          </h1>







          <p

            className="
              mt-5
              text-xs
              tracking-[0.5em]
              text-purple-300
            "

          >

            QUESTIONS WRITTEN AMONG STARS

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

            "Every answer is another little piece
            of knowing each other."

          </p>




        </div>









        {/* Categories */}



        <div

          className="
            mt-20
            grid
            gap-8
            md:grid-cols-2
          "

        >





        {

          categories.map((category)=>(



            <button


              key={category.id}



              onClick={()=>navigate(

                `/quiz/${category.id}`

              )}





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
                hover:border-purple-300/40
                hover:bg-white/[0.08]
              "


            >





              <div

                className="
                  text-5xl
                "

              >

                {category.icon}

              </div>







              <h2

                className="
                  mt-6
                  text-2xl
                  font-light
                "

              >

                {category.title}

              </h2>







              <p

                className="
                  mt-4
                  text-sm
                  leading-relaxed
                  text-white/70
                "

              >

                {category.description}

              </p>







              <p

                className="
                  mt-8
                  text-xs
                  tracking-[0.3em]
                  text-purple-300
                "

              >

                ENTER GALAXY →

              </p>






            </button>



          ))

        }





        </div>








      </div>





    </div>

  );

}



export default QuizPage;