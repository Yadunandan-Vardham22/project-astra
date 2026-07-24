import { motion } from "framer-motion";
import { useState } from "react";


interface LetterModalProps {

  title:string;

  date?:string;

  content:string;

  onClose:()=>void;

}





function LetterModal({

  title,

  date,

  content,

  onClose

}:LetterModalProps){



  const [opened,setOpened]=useState(false);




  return (

    <div

      onClick={onClose}

      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/80
        backdrop-blur-md
      "

    >






      <div

        onClick={(e)=>e.stopPropagation()}

        className="
          relative
          flex
          min-h-[500px]
          w-[90%]
          max-w-xl
          items-center
          justify-center
        "

      >







        {!opened && (


          <motion.button


            onClick={()=>setOpened(true)}



            initial={{

              scale:0.5,

              opacity:0

            }}



            animate={{

              scale:1,

              opacity:1

            }}



            className="
              cursor-pointer
              text-center
            "


          >



            <motion.div


              animate={{

                y:[0,-12,0],

                rotate:[0,3,-3,0]

              }}



              transition={{

                duration:3,

                repeat:Infinity

              }}



              className="
                text-8xl
              "

            >

              💌


            </motion.div>





            <p

              className="
                mt-8
                text-xs
                tracking-[0.5em]
                text-purple-300
              "

            >

              OPEN LETTER

            </p>




          </motion.button>


        )}









        {opened && (



        <motion.div


          initial={{

            opacity:0,

            scale:0.8,

            y:50

          }}



          animate={{

            opacity:1,

            scale:1,

            y:0

          }}



          transition={{

            type:"spring",

            stiffness:120

          }}



          className="
            relative
            overflow-hidden
            rounded-3xl
            border
            border-pink-200/30
            bg-[#faf5ed]
            p-10
            text-black
            shadow-2xl
          "

        >







          {/* floating stars */}


          {
            Array.from({length:12}).map((_,i)=>(


              <motion.span


                key={i}


                animate={{

                  y:[0,-20,0],

                  opacity:[0.2,1,0.2]

                }}



                transition={{

                  duration:3+i,

                  repeat:Infinity

                }}



                className="
                  absolute
                  text-purple-400
                "



                style={{

                  top:`${Math.random()*100}%`,

                  left:`${Math.random()*100}%`

                }}

              >

                ✦

              </motion.span>


            ))
          }








          <div

            className="
              relative
              z-10
              text-center
            "

          >



            <div className="text-5xl">

              💌

            </div>




            <h2

              className="
                mt-6
                text-3xl
                font-serif
                italic
              "

            >

              {title}

            </h2>




            {
              date && (

                <p

                  className="
                    mt-3
                    text-sm
                    text-gray-500
                  "

                >

                  {date}

                </p>

              )
            }





          </div>








          <div

            className="
              relative
              z-10
              mt-10
              whitespace-pre-line
              font-serif
              text-lg
              leading-relaxed
            "

          >

            {content}

          </div>









          <div

            className="
              relative
              z-10
              mt-10
              text-right
              text-3xl
            "

          >

            💋

          </div>







          <button


            onClick={onClose}



            className="
              relative
              z-10
              mt-8
              w-full
              cursor-pointer
              rounded-full
              border
              border-black/20
              py-3
              text-xs
              tracking-[0.4em]
            "

          >

            CLOSE LETTER

          </button>







        </motion.div>


        )}




      </div>





    </div>

  );

}


export default LetterModal;