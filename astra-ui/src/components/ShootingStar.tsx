import { motion } from "framer-motion";

function ShootingStar() {
  return (
    <motion.div
      className="absolute h-[2px] w-40 -rotate-45 rounded-full"
      style={{
        background:
          "linear-gradient(to right, rgba(255,255,255,1), rgba(255,255,255,0))",
        boxShadow: "0 0 15px rgba(255,255,255,0.9)",
      }}
      initial={{
        x: 1200,
        y: -300,
        opacity: 0,
      }}
      animate={{
        x: -500,
        y: 800,
        opacity: [0, 1, 1, 0],
      }}
      transition={{
        duration: 2.5,
        ease: "easeInOut",
      }}
    />
  );
}

export default ShootingStar;