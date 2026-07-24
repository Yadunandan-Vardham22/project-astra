import { motion } from "framer-motion";

const particles = Array.from({ length: 100 });

function CosmicTrails() {
  return (
    <div
      className="
        absolute
        inset-0
        z-0
        pointer-events-none
        overflow-hidden
      "
    >

      {/* Cyan particles */}
      {particles.map((_, index) => (
        <motion.div
          key={`cyan-${index}`}
          className="
            absolute
            rounded-full
            bg-[#9DEBFF]
          "
          style={{
            width: `${Math.random() * 3 + 1}px`,
            height: `${Math.random() * 3 + 1}px`,
            top: `${15 + Math.random() * 45}%`,
            boxShadow:
              "0 0 12px rgba(120,220,255,0.9)",
          }}
          animate={{
            x: [
              "-10vw",
              "110vw",
            ],
            y: [
              0,
              Math.random() * 80 - 40,
              0,
            ],
            opacity: [
              0,
              1,
              0,
            ],
            scale: [
              0.5,
              1.5,
              0.5,
            ],
          }}
          transition={{
            duration:
              8 + Math.random() * 8,
            repeat: Infinity,
            delay:
              Math.random() * 10,
            ease: "easeInOut",
          }}
        />
      ))}



      {/* Pink particles */}
      {particles.map((_, index) => (
        <motion.div
          key={`pink-${index}`}
          className="
            absolute
            rounded-full
            bg-[#FFD1C1]
          "
          style={{
            width: `${Math.random() * 3 + 1}px`,
            height: `${Math.random() * 3 + 1}px`,
            top: `${45 + Math.random() * 40}%`,
            boxShadow:
              "0 0 12px rgba(255,170,130,0.9)",
          }}
          animate={{
            x: [
              "110vw",
              "-10vw",
            ],
            y: [
              0,
              Math.random() * 80 - 40,
              0,
            ],
            opacity: [
              0,
              1,
              0,
            ],
            scale: [
              0.5,
              1.5,
              0.5,
            ],
          }}
          transition={{
            duration:
              10 + Math.random() * 8,
            repeat: Infinity,
            delay:
              Math.random() * 10,
            ease: "easeInOut",
          }}
        />
      ))}

    </div>
  );
}

export default CosmicTrails;