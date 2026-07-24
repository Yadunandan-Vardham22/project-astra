import { motion } from "framer-motion";

import CelestialStars from "./CelestialStars";
import CosmicMist from "./CosmicMist";
import CosmicDust from "./CosmicDust";


function CelestialBackground() {


  return (

    <div

      className="
        absolute
        inset-0
        overflow-hidden
        bg-[#020008]
      "

    >




      {/* Deep universe base */}

      <div

        className="
          absolute
          inset-0
        "

        style={{

          background:

          `
          radial-gradient(
            ellipse at center,
            #16052f 0%,
            #08001c 45%,
            #010005 100%
          )
          `

        }}

      />








      {/* Slow moving purple atmospheric glow */}

      <motion.div


        animate={{

          x:[

            -40,

            50,

            -40

          ],


          y:[

            30,

            -30,

            30

          ],


          scale:[

            1,

            1.12,

            1

          ]

        }}




        transition={{

          duration:40,

          repeat:Infinity,

          ease:"easeInOut"

        }}




        className="

          absolute

          left-[-20%]

          top-[10%]

          h-[850px]

          w-[850px]

          rounded-full

          bg-purple-700/25

          blur-[200px]

        "


      />









      {/* Slow blue atmospheric glow */}


      <motion.div


        animate={{

          x:[

            50,

            -50,

            50

          ],


          y:[

            -20,

            40,

            -20

          ],


          scale:[

            1,

            1.15,

            1

          ]

        }}




        transition={{

          duration:55,

          repeat:Infinity,

          ease:"easeInOut"

        }}



        className="


          absolute


          right-[-20%]


          bottom-[5%]


          h-[900px]


          w-[900px]


          rounded-full


          bg-blue-600/30


          blur-[220px]


        "



      />









      {/* Nebula clouds */}

      <CosmicMist />





      {/* Floating cosmic particles */}

      <CosmicDust />





      {/* Stars */}

      <CelestialStars />









      {/* Center darkness for readability */}

      <div

        className="

          absolute

          inset-0

          pointer-events-none

        "



        style={{



          background:


          `

          radial-gradient(

            ellipse at center,

            transparent 25%,

            rgba(0,0,0,0.45) 75%,

            rgba(0,0,0,0.75) 100%

          )

          `



        }}



      />






    </div>

  );

}


export default CelestialBackground;