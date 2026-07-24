import { motion } from "framer-motion";

type MeteorProps = {
  startX: string;
  startY: string;
  endX: string;
  endY: string;
  delay?: number;
  onComplete?: () => void;
};

function Meteor({
  startX,
  startY,
  endX,
  endY,
  delay = 0,
  onComplete,
}: MeteorProps) {
  return (
    <motion.div
      className="absolute flex items-center"
      initial={{
        x: startX,
        y: startY,
        opacity: 0,
      }}
      animate={{
        x: endX,
        y: endY,
        opacity: [0, 1, 1, 0],
      }}
      transition={{
        duration: 1.8,
        delay,
        ease: "easeOut",
      }}
      onAnimationComplete={onComplete}
    >
      {/* Tail Layer 1 */}
      <div
        className="absolute right-2 h-[2px] w-52"
        style={{
          background:
            "linear-gradient(to left, transparent, rgba(255,255,255,0.75))",
          filter: "blur(2px)",
        }}
      />

      {/* Tail Layer 2 */}
      <div
        className="absolute right-2 h-[5px] w-40"
        style={{
          background:
            "linear-gradient(to left, transparent, rgba(180,220,255,0.30))",
          filter: "blur(8px)",
        }}
      />

      {/* Tail Layer 3 */}
      <div
        className="absolute right-2 h-[12px] w-28"
        style={{
          background:
            "linear-gradient(to left, transparent, rgba(120,180,255,0.12))",
          filter: "blur(18px)",
        }}
      />

      {/* Outer Glow */}
      <div className="absolute right-0 h-10 w-10 rounded-full bg-blue-200/20 blur-xl" />

      {/* Inner Glow */}
      <div className="absolute right-1 h-6 w-6 rounded-full bg-white/40 blur-md" />

      {/* Core */}
      <div
        className="relative h-3 w-3 rounded-full bg-white"
        style={{
          boxShadow: `
            0 0 8px #fff,
            0 0 20px rgba(255,255,255,.9),
            0 0 45px rgba(150,200,255,.8)
          `,
        }}
      />
    </motion.div>
  );
}

export default Meteor;