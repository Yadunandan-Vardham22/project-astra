import { motion } from "framer-motion";

function LightBloom() {
  return (
    <>
      {/* Outer Energy */}
      <motion.div
        className="absolute left-1/2 top-[35%] rounded-full"
        initial={{
          width: 0,
          height: 0,
          opacity: 0,
          x: "-50%",
          y: "-50%",
        }}
        animate={{
          width: ["0px", "1400px"],
          height: ["0px", "1400px"],
          opacity: [0, 0.18, 0],
        }}
        transition={{
          duration: 1.5,
          ease: "easeOut",
        }}
        style={{
          background:
            "radial-gradient(circle, rgba(255,255,255,.9) 0%, rgba(255,255,255,.15) 45%, rgba(255,255,255,0) 100%)",
          filter: "blur(60px)",
        }}
      />

      {/* Inner Explosion */}
      <motion.div
        className="absolute left-1/2 top-[35%] rounded-full bg-white"
        initial={{
          width: 0,
          height: 0,
          opacity: 0,
          x: "-50%",
          y: "-50%",
        }}
        animate={{
          width: ["0px", "500px"],
          height: ["0px", "500px"],
          opacity: [0, 1, 0],
        }}
        transition={{
          duration: 0.8,
          ease: "easeOut",
        }}
        style={{
          filter: "blur(20px)",
        }}
      />

      {/* Hot Core */}
      <motion.div
        className="absolute left-1/2 top-[35%] rounded-full bg-white"
        initial={{
          width: 0,
          height: 0,
          opacity: 1,
          x: "-50%",
          y: "-50%",
        }}
        animate={{
          width: ["0px", "120px"],
          height: ["0px", "120px"],
          opacity: [1, 0],
        }}
        transition={{
          duration: 0.45,
          ease: "easeOut",
        }}
        style={{
          boxShadow: "0 0 120px white",
        }}
      />
    </>
  );
}

export default LightBloom;