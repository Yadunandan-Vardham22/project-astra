import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCosmic } from "../context/CosmicContext";

const words = [
  { text: "world.", color: "#9BB8FF" },
  { text: "story.", color: "#8FD3FF" },
  { text: "future.", color: "#C6B4FF" },
  { text: "heart.", color: "#FFC6D9" },
  { text: "life.", color: "#FFFFFF" },
];

function Title() {
  const [index, setIndex] = useState(0);

  const navigate = useNavigate();

  const {
    setButtonHovered,
  } = useCosmic();


  useEffect(() => {
    if (index === words.length - 1) return;

    const delay = index === 0 ? 3200 : 850;

    const timer = setTimeout(() => {
      setIndex((prev) => prev + 1);
    }, delay);

    return () => clearTimeout(timer);
  }, [index]);


  return (
    <div
      className="
        absolute
        inset-0
        z-20
        flex
        items-center
        justify-center
        px-8
        pointer-events-none
      "
      style={{
        isolation: "isolate",
      }}
    >

      <div className="flex flex-col items-center">

        <motion.div
          initial={{
            opacity: 0,
            filter: "blur(12px)",
          }}
          animate={{
            opacity: 1,
            filter: "blur(0px)",
          }}
          transition={{
            duration: 2.2,
          }}
          className="text-center"
        >

          <h1
            className="
              select-none
              text-3xl
              md:text-4xl
              font-thin
              text-white
            "
            style={{
              fontFamily:
                '"Playfair Display", serif',
              fontWeight: 300,
            }}
          >
            Not every wish falls from the sky.
          </h1>


          <div
            className="
              my-7
              flex
              items-center
              justify-center
              gap-4
            "
          >

            <div className="h-px w-16 bg-white/10" />

            <div className="text-[10px] text-amber-200/70">
              ✦
            </div>

            <div className="h-px w-16 bg-white/10" />

          </div>


          <h2
            className="
              select-none
              text-xl
              md:text-2xl
              text-white/70
            "
            style={{
              fontFamily:
                '"Playfair Display", serif',
              fontWeight: 300,
            }}
          >
            Some simply walk into your{" "}

            <span
              className="
                inline-flex
                justify-center
                align-baseline
                ml-1
              "
              style={{
                width: "55px",
              }}
            >

              <AnimatePresence mode="wait">

                <motion.span
                  key={words[index].text}
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                    color: words[index].color,
                  }}
                  exit={{
                    opacity: 0,
                  }}
                  transition={{
                    duration: 0.35,
                    ease: "easeInOut",
                  }}
                >
                  {words[index].text}
                </motion.span>

              </AnimatePresence>

            </span>

          </h2>


        </motion.div>



        <motion.button
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            delay: 7,
            duration: 1,
          }}

          onClick={() => navigate("/login")}

          onMouseEnter={() => {
            setButtonHovered(true);
          }}

          onMouseLeave={() => {
            setButtonHovered(false);
          }}

          whileHover={{
            y: -4,
            scale: 1.06,
          }}

          whileTap={{
            scale: 0.97,
          }}

          className="
            group
            pointer-events-auto
            cursor-pointer
            relative
            mt-10
            overflow-hidden
            rounded-full
            border
            border-white/20
            bg-white/5
            px-10
            py-4
            text-[11px]
            uppercase
            tracking-[0.35em]
            text-white
            backdrop-blur-md
            transition-all
            duration-500
            hover:border-white/60
            hover:bg-white/15
            hover:shadow-[0_0_40px_rgba(255,255,255,0.25)]
          "

          style={{
            fontFamily:
              '"Inter", sans-serif',
          }}
        >

          <motion.span
            className="
              absolute
              inset-y-0
              -left-20
              w-20
              rotate-12
              bg-white/30
            "

            whileHover={{
              left: "120%",
            }}

            transition={{
              duration: 0.7,
              ease: "easeInOut",
            }}
          />


          <span className="relative z-10">
            ✦&nbsp;&nbsp;BEGIN VOYAGE&nbsp;&nbsp;✦
          </span>


        </motion.button>


      </div>

    </div>
  );
}

export default Title;