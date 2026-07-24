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

        className="
          absolute
          -left-[25%]
          top-[5%]
          h-[900px]
          w-[800px]
          rounded-full
          bg-purple-700/30
          blur-[200px]
        "

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

        className="
          absolute
          left-[5%]
          bottom-[10%]
          h-[500px]
          w-[500px]
          rounded-full
          bg-fuchsia-500/20
          blur-[160px]
        "

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



        className="
          absolute
          left-[35%]
          top-[25%]
          h-[450px]
          w-[450px]
          rounded-full
          bg-purple-400/20
          blur-[150px]
        "

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



        className="
          absolute
          -right-[25%]
          bottom-[5%]
          h-[950px]
          w-[850px]
          rounded-full
          bg-blue-600/35
          blur-[210px]
        "

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


        className="
          absolute
          right-[10%]
          top-[30%]
          h-[400px]
          w-[400px]
          rounded-full
          bg-cyan-400/20
          blur-[150px]
        "

      />




    </div>

  );

}


export default CosmicMist;