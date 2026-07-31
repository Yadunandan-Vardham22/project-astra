import { useState, useEffect } from "react";
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







  const [containerRef, setContainerRef] = useState<HTMLDivElement|null>(null);
  const [anchorRight, setAnchorRight] = useState(false);

  useEffect(()=>{
    if(!containerRef) return;
    const calc = ()=>{
      const rect = containerRef.getBoundingClientRect();
      setAnchorRight(rect.left > window.innerWidth/2);
    };
    calc();
    window.addEventListener('resize', calc);
    return ()=> window.removeEventListener('resize', calc);
  },[containerRef]);

  return (


    <div ref={setContainerRef} className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-[100]">







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



            className={
              `absolute bottom-24 z-50 rounded-3xl border border-pink-300/30 bg-black/80 p-6 text-white backdrop-blur-xl
            ${anchorRight ? 'md:right-0 md:left-auto md:w-72' : 'md:left-0 md:right-auto md:w-72'} w-[calc(100%-2rem)] left-4 right-4 max-w-[18rem]`
            }

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



        className="flex h-12 w-12 md:h-16 md:w-16 cursor-pointer flex-col items-center justify-center rounded-full border border-pink-300/40 bg-black/40 text-white backdrop-blur-xl"

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