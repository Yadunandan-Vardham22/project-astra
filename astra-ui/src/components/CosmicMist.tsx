import { motion } from "framer-motion";


function CosmicMist() {


  return (

    <div
      className="
        absolute
        inset-0
        overflow-hidden
        pointer-events-none
      "
    >


      {/* Left purple nebula */}

      <motion.div

        animate={{
          x:[-60,40,-60],
          y:[20,-40,20],
          rotate:[0,20,0],
          scale:[1,1.15,1]
        }}

        transition={{
          duration:45,
          repeat:Infinity,
          ease:"easeInOut"
        }}

        className={
          `absolute -left-[25%] top-[5%] rounded-full bg-purple-700/30 blur-[200px]
          w-[80vmax] h-[80vmax] sm:w-[60vmax] sm:h-[60vmax] md:w-[800px] md:h-[900px]`
        }

      />





      {/* Pink violet cloud */}

      <motion.div

        animate={{

          x:[30,-30,30],

          y:[-20,40,-20],

          opacity:[0.3,0.55,0.3]

        }}

        transition={{

          duration:30,

          repeat:Infinity,

          ease:"easeInOut"

        }}

        className={
          `absolute left-[5%] bottom-[10%] rounded-full bg-fuchsia-500/20 blur-[160px]
          w-[55vmax] h-[55vmax] sm:w-[45vmax] sm:h-[45vmax] md:w-[500px] md:h-[500px]`
        }

      />







      {/* Central cosmic haze */}

      <motion.div


        animate={{

          scale:[1,1.2,1],

          opacity:[0.15,0.35,0.15]

        }}


        transition={{

          duration:25,

          repeat:Infinity

        }}



        className={
          `absolute left-[35%] top-[25%] rounded-full bg-purple-400/20 blur-[150px]
          w-[45vmax] h-[45vmax] sm:w-[36vmax] sm:h-[36vmax] md:w-[450px] md:h-[450px]`
        }

      />








      {/* Right blue nebula */}


      <motion.div


        animate={{

          x:[60,-40,60],

          y:[-30,50,-30],

          rotate:[0,-20,0],

          scale:[1,1.15,1]

        }}



        transition={{

          duration:55,

          repeat:Infinity,

          ease:"easeInOut"

        }}



        className={
          `absolute -right-[25%] bottom-[5%] rounded-full bg-blue-600/35 blur-[210px]
          w-[90vmax] h-[90vmax] sm:w-[70vmax] sm:h-[70vmax] md:w-[850px] md:h-[950px]`
        }

      />








      {/* Cyan edge glow */}

      <motion.div


        animate={{

          opacity:[0.15,0.4,0.15]

        }}


        transition={{

          duration:20,

          repeat:Infinity

        }}


        className={
          `absolute right-[10%] top-[30%] rounded-full bg-cyan-400/20 blur-[150px]
          w-[40vmax] h-[40vmax] sm:w-[32vmax] sm:h-[32vmax] md:w-[400px] md:h-[400px]`
        }

      />




    </div>

  );

}


export default CosmicMist;