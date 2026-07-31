import { motion } from "framer-motion";
import { useEffect } from "react";


interface Props {
  onComplete: () => void;
}


function VerificationSuccess({ onComplete }: Props) {


  useEffect(() => {

    const timer = setTimeout(() => {

      onComplete();

    }, 3500);


    return () => clearTimeout(timer);


  }, [onComplete]);





  const stars = Array.from(
    { length: 25 },
    (_, index) => index
  );



  return (

    <motion.div

      initial={{
        opacity:0
      }}

      animate={{
        opacity:1
      }}

      exit={{
        opacity:0
      }}

      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        overflow-hidden
      "

    >



      {/* Expanding cosmic glow */}

      <motion.div

        initial={{
          scale:0.2,
          opacity:0
        }}

        animate={{
          scale:2,
          opacity:0.8
        }}

        transition={{
          duration:3
        }}

        className={
          `absolute rounded-full bg-purple-500/30 blur-[120px]
          w-[40vmax] h-[40vmax] md:w-[300px] md:h-[300px]`
        }

      />





      {/* Floating stars */}

      {
        stars.map((star)=>(

          <motion.div

            key={star}

            className="
              absolute
              h-1
              w-1
              rounded-full
              bg-white
            "

            initial={{

              x:0,
              y:0,
              opacity:0

            }}

            animate={{

              x:
              (Math.random()-0.5)*700,

              y:
              (Math.random()-0.5)*700,

              opacity:[
                0,
                1,
                0
              ]

            }}

            transition={{

              duration:3,

              delay:
              star*0.05

            }}

            style={{

              boxShadow:
              `
              0 0 10px white,
              0 0 25px #a855f7
              `

            }}

          />

        ))
      }






      <motion.div

        initial={{
          y:30,
          opacity:0
        }}

        animate={{
          y:0,
          opacity:1
        }}

        transition={{
          delay:1
        }}

        className="
          relative
          text-center
        "

      >



        <motion.h1

          animate={{

            textShadow:[

              `
              0 0 20px white,
              0 0 50px #a855f7
              `,

              `
              0 0 40px white,
              0 0 90px #c084fc
              `,

              `
              0 0 20px white,
              0 0 50px #a855f7
              `

            ]

          }}

          transition={{
            duration:3,
            repeat:Infinity
          }}

          className="
            text-5xl
            text-[#FFF7E6]
            font-semibold
          "

        >

          The universe recognized you ✦

        </motion.h1>





        <motion.p

          initial={{
            opacity:0
          }}

          animate={{
            opacity:1
          }}

          transition={{
            delay:2
          }}

          className="
            mt-8
            text-lg
            text-[#F3E8FF]
          "

        >

          Welcome back, Bangaram🌙

        </motion.p>



      </motion.div>



    </motion.div>

  );

}


export default VerificationSuccess;