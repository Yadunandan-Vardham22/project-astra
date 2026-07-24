import { motion } from "framer-motion";


interface CosmicOrbProps {

  icon:string;

  name:string;

  color:string;

  onClick:()=>void;

}



function CosmicOrb({

  icon,

  name,

  color,

  onClick

}:CosmicOrbProps){


  return (

    <motion.button


      onClick={onClick}


      whileHover={{

        scale:1.15

      }}



      className="
        cursor-pointer
        flex
        flex-col
        items-center
      "



    >





      <motion.div


        animate={{

          y:[0,-8,0],

          rotate:[0,3,-3,0]

        }}



        transition={{

          duration:6,

          repeat:Infinity,

          ease:"easeInOut"

        }}



        className="
          relative
          flex
          h-14
          w-14
          items-center
          justify-center
          overflow-hidden
          rounded-full
        "



        style={{


          background:

          `
          radial-gradient(
            circle at 30% 25%,
            rgba(255,255,255,0.9),
            ${color},
            rgba(0,0,0,0.9)
          ),

          radial-gradient(
            circle at 70% 80%,
            rgba(0,0,0,0.7),
            transparent
          )
          `,



          boxShadow:

          `
          inset -8px -10px 15px rgba(0,0,0,0.5),
          0 0 20px ${color},
          0 0 45px ${color}
          `


        }}



      >







        {/* Planet surface texture */}

        <motion.div


          animate={{

            x:[-10,10,-10]

          }}



          transition={{

            duration:12,

            repeat:Infinity

          }}



          className="
            absolute
            inset-0
            rounded-full
            opacity-30
            bg-white/20
            blur-md
          "


        />








        {/* Atmosphere */}


        <div

          className="
            absolute
            inset-0
            rounded-full
            border
            border-white/20
          "

        />








        {/* Icon */}


        <span

          className="
            relative
            z-10
            text-xl
          "

        >

          {icon}

        </span>




      </motion.div>







      <span

        className="
          mt-3
          text-[10px]
          tracking-[0.25em]
          text-purple-100
        "

      >

        {name}


      </span>





    </motion.button>

  );

}



export default CosmicOrb;