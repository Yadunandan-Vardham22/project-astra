import { motion } from "framer-motion";


const smallStars = Array.from(
  { length: 70 },
  (_, index) => ({

    id: index,

    left: Math.random() * 100,

    top: Math.random() * 100,

    size: Math.random() * 2 + 0.5,

    opacity: Math.random() * 0.5 + 0.2,

    duration: Math.random() * 5 + 4,

    delay: Math.random() * 5

  })
);



const glowingStars = [

  {
    left:"18%",
    top:"22%",
    size:4,
    color:"#c084fc"
  },


  {
    left:"82%",
    top:"18%",
    size:5,
    color:"#7dd3fc"
  },


  {
    left:"28%",
    top:"78%",
    size:3,
    color:"#f0abfc"
  },


  {
    left:"75%",
    top:"70%",
    size:4,
    color:"#93c5fd"
  },


  {
    left:"50%",
    top:"15%",
    size:3,
    color:"#ffffff"
  }

];



function CelestialStars(){


  return (

    <div
      className="
        absolute
        inset-0
        pointer-events-none
      "
    >


      {
        smallStars.map((star)=>(


          <motion.div

            key={star.id}


            className="
              absolute
              rounded-full
              bg-white
            "


            style={{

              left:`${star.left}%`,

              top:`${star.top}%`,

              width:`${star.size}px`,

              height:`${star.size}px`,

              opacity:star.opacity

            }}


            animate={{

              opacity:[

                star.opacity,

                star.opacity + 0.35,

                star.opacity

              ],


              scale:[

                1,

                1.5,

                1

              ]

            }}



            transition={{

              duration:star.duration,

              delay:star.delay,

              repeat:Infinity,

              ease:"easeInOut"

            }}


          />

        ))

      }






      {
        glowingStars.map((star,index)=>(


          <motion.div


            key={index}


            className="
              absolute
              rounded-full
              bg-white
            "


            style={{

              left:star.left,

              top:star.top,

              width:`${star.size}px`,

              height:`${star.size}px`,

              boxShadow:

              `
              0 0 12px ${star.color},
              0 0 35px ${star.color},
              0 0 60px ${star.color}
              `

            }}



            animate={{

              scale:[

                1,

                1.8,

                1

              ],


              opacity:[

                0.5,

                1,

                0.5

              ]

            }}



            transition={{

              duration:3 + index,

              repeat:Infinity,

              ease:"easeInOut"

            }}


          />


        ))

      }



    </div>

  );


}



export default CelestialStars;