import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import CosmicOrb from "./CosmicOrb";
import { useEffect, useState } from "react";



const stars = [

  {
    name: "Observatory",
    icon: "🔭",
    color: "#2563eb",
    position: "top-[15%] left-[15%]",
    route: "/observatory"
  },

  {
    name: "Letters",
    icon: "💌",
    color: "#ec4899",
    position: "top-[20%] right-[15%]",
    route: "/letters"
  },

  {
    name: "Quiz Galaxy",
    icon: "✦",
    color: "#06b6d4",
    position: "top-[45%] left-[45%]",
    route: "/quiz"
  },

  {
    name: "Memories",
    icon: "📸",
    color: "#f59e0b",
    position: "bottom-[20%] left-[15%]",
    route: "/memories"
  },

  {
    name: "Bucket List",
    icon: "🌙",
    color: "#94a3b8",
    position: "bottom-[18%] right-[18%]",
    route: "/bucket-list"
  },

  {
    name: "Romance",
    icon: "❤️",
    color: "#ef4444",
    position: "top-[65%] right-[40%]",
    route: "/romance"
  },

  {
    name: "Garden",
    icon: "🌱",
    color: "#22c55e",
    position: "bottom-[10%] left-[45%]",
    route: "/garden"
  }

];





const tinyStars = Array.from({
  length:80
});





function UniverseMap(){


  const navigate = useNavigate();


const [mouse, setMouse] = useState({ x: 0, y: 0 });

useEffect(() => {
  const handleMove = (e: MouseEvent) => {
    setMouse({
      x: e.clientX,
      y: e.clientY,
    });
  };

  window.addEventListener("mousemove", handleMove);

  return () => window.removeEventListener("mousemove", handleMove);
}, []);

  return (

    <div

      className="
        absolute
        inset-0
      "

    >






      {/* Background Stars */}


      {
        tinyStars.map((_,index)=>(


          <motion.div


            key={index}


            animate={{

              opacity:[0.2,1,0.2]

            }}



            transition={{

              duration:2+(index%5),

              repeat:Infinity,

              delay:index*0.05

            }}



            className="
              absolute
              h-1
              w-1
              rounded-full
              bg-white
            "



            style={{

              top:`${Math.random()*100}%`,

              left:`${Math.random()*100}%`

            }}


          />


        ))
      }


<motion.div
  className="pointer-events-none absolute inset-0 z-0"
>
  <motion.div
    animate={{
      x: mouse.x - 175,
      y: mouse.y - 175,
    }}
    transition={{
      type: "spring",
      stiffness: 90,
      damping: 30,
      mass: 0.4,
    }}
    className="absolute rounded-full blur-3xl w-[40vmax] h-[40vmax] md:w-[350px] md:h-[350px]"
    style={{
      background:
        "radial-gradient(circle, rgba(255,255,255,0.045) 0%, rgba(147,197,253,0.03) 35%, transparent 75%)",
    }}
  />
</motion.div>






      {/* Celestial Planets */}


      {
        stars.map((star,index)=>(


          <motion.div


            key={star.name}



            className={`

              absolute

              ${star.position}

            `}



            initial={{

              opacity:0,

              scale:0.5

            }}



            animate={{

              opacity:1,

              scale:1

            }}



            transition={{

              duration:1,

              delay:index*0.15

            }}



          >




            <CosmicOrb


              icon={star.icon}


              name={star.name}


              color={star.color}


              onClick={()=>navigate(star.route)}


            />




          </motion.div>


        ))
      }



    </div>

  );

}



export default UniverseMap;