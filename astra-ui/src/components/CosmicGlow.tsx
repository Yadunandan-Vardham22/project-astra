import { motion } from "framer-motion";

function CosmicGlow() {
  return (
    <>
      {/* Blue cosmic aura */}
      <motion.div
        className="absolute top-[25%] left-[55%] h-20 w-20 md:h-40 md:w-40 rounded-full bg-cyan-300/10 blur-3xl"
        animate={{
          opacity: [0.3, 0.7, 0.3],
          scale: [0.9, 1.1, 0.9],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />


      {/* Orange cosmic aura */}
      <motion.div
        className="absolute top-[55%] left-[45%] h-20 w-20 md:h-40 md:w-40 rounded-full bg-orange-300/10 blur-3xl"
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scale: [0.9, 1.1, 0.9],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </>
  );
}

export default CosmicGlow;