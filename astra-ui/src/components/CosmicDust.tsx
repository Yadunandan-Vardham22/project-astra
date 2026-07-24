import { motion } from "framer-motion";


const dustParticles = Array.from(
  { length: 45 },
  (_, index) => ({

    id:index,

    left: Math.random() * 100,

    top: Math.random() * 100,

    size: Math.random() * 3 + 1,

    duration: Math.random() * 20 + 20,

    delay: Math.random() * 10

  })
);



function CosmicDust(){


  return (

    <div

      className="
        absolute
        inset-0
        pointer-events-none
      "

    >


      {
        dustParticles.map((dust)=>(


          <motion.div


            key={dust.id}


            className="
              absolute
              rounded-full
            "



            style={{


              left:`${dust.left}%`,


              top:`${dust.top}%`,


              width:`${dust.size}px`,


              height:`${dust.size}px`,



              background:
              `
              rgba(255,255,255,0.35)
              `,



              boxShadow:
              `
              0 0 12px rgba(168,85,247,0.5)
              `


            }}



            animate={{


              x:[

                0,

                Math.random()*80-40,

                0

              ],


              y:[

                0,

                Math.random()*100-50,

                0

              ],


              opacity:[

                0.1,

                0.7,

                0.1

              ]



            }}



            transition={{


              duration:dust.duration,


              delay:dust.delay,


              repeat:Infinity,


              ease:"easeInOut"


            }}



          />


        ))

      }


    </div>

  );

}


export default CosmicDust;