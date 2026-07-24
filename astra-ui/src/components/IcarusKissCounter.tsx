import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";



interface IcarusKissCounterProps {

  value:number;

  sweetKisses:number;

  lipLocks:number;

  latestNote:string;

}







function IcarusKissCounter({

  value,

  sweetKisses,

  lipLocks,

  latestNote

}:IcarusKissCounterProps){



  const [open,setOpen] = useState(false);







  return (


    <div

      className="
        fixed
        bottom-8
        right-8
        z-[100]
      "

    >







      <AnimatePresence>


      {

        open && (

          <motion.div


            onClick={()=>setOpen(false)}



            className="
              fixed
              inset-0
              z-40
            "

          />

        )

      }


      </AnimatePresence>









      <AnimatePresence>


      {

        open && (


          <motion.div


            onClick={(e)=>
              e.stopPropagation()
            }



            initial={{

              opacity:0,

              scale:0.3,

              y:40

            }}



            animate={{

              opacity:1,

              scale:1,

              y:0

            }}



            exit={{

              opacity:0,

              scale:0.3

            }}



            className="
              absolute
              bottom-24
              right-0
              z-50
              w-72
              rounded-3xl
              border
              border-pink-300/30
              bg-black/80
              p-6
              text-white
              backdrop-blur-xl
            "

          >



            <h2

              className="
                mb-6
                text-center
                text-sm
                tracking-widest
              "

            >

              YOUR KISSES ✦

            </h2>







            <div className="space-y-4 text-sm">


              <p>

                💋 Total Kisses:

                <span className="ml-2 text-pink-200">

                  {value}

                </span>

              </p>





              <p>

                💋 Sweet Kisses:

                <span className="ml-2 text-pink-200">

                  {sweetKisses}

                </span>

              </p>





              <p>

                ❤️‍🔥 Lip Locks:

                <span className="ml-2 text-pink-200">

                  {lipLocks}

                </span>

              </p>





              <div>


                <p className="
                  text-white/50
                ">

                  Latest Kiss

                </p>



                <p className="
                  mt-2
                  leading-relaxed
                  text-purple-200
                ">

                  {
                    latestNote ||

                    "No kisses yet"

                  }

                </p>


              </div>



            </div>






          </motion.div>


        )

      }


      </AnimatePresence>









      <motion.button


        onClick={()=>setOpen(!open)}



        animate={{

          y:[0,-12,0]

        }}



        transition={{

          duration:3,

          repeat:Infinity

        }}



        className="
          flex
          h-16
          w-16
          cursor-pointer
          flex-col
          items-center
          justify-center
          rounded-full
          border
          border-pink-300/40
          bg-black/40
          text-white
          backdrop-blur-xl
        "

      >



        <span className="text-2xl">

          💋

        </span>



        <span className="text-xs">

          {value}

        </span>



      </motion.button>







    </div>


  );

}



export default IcarusKissCounter;