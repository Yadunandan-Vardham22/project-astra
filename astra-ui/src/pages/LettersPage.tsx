import { useNavigate } from "react-router-dom";
import HomeButton from "../components/HomeButton";



const letters = [

  {
    id:"love",
    icon:"💗",
    title:"Love Letters",
    description:
    "Words written for the moments when the heart needs a reminder."
  },


  {
    id:"apologies",
    icon:"🌧",
    title:"Apology Letters",
    description:
    "Letters about understanding, growth and the things left unsaid."
  },


  {
    id:"future",
    icon:"🌌",
    title:"Future Us",
    description:
    "Messages saved for moments that have not arrived yet."
  },


  {
    id:"dream-journal",
    icon:"🌙",
    title:"Dream Journal",
    description:
    "A place to preserve the strange, beautiful worlds visited while sleeping."
  },


  {
    id:"hidden",
    icon:"✨",
    title:"Hidden Letters",
    description:
    "Secret messages waiting to be discovered."
  }

];





function LettersPage(){


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

            💌

          </div>






          <h1

            className="
              mt-6
              text-5xl
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
                  p-10
                  text-left
                  backdrop-blur-xl
                  transition
                  hover:border-pink-300/40
                  hover:bg-white/[0.08]
                "



              >






                <div

                  className="
                    text-5xl
                  "

                >

                  {letter.icon}


                </div>








                <h2

                  className="
                    mt-6
                    text-2xl
                    font-light
                    tracking-wide
                  "

                >

                  {letter.title}


                </h2>








                <p

                  className="
                    mt-4
                    text-sm
                    leading-relaxed
                    text-white/70
                  "

                >

                  {letter.description}


                </p>








                <p

                  className="
                    mt-8
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
            p-10
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





    </div>

  );

}



export default LettersPage;