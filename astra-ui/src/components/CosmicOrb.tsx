import { motion } from "framer-motion";
import "./CosmicOrb.css";

interface CosmicOrbProps {
  icon: string;
  name: string;
  color: string;
  onClick: () => void;
}

function CosmicOrb({
  icon,
  name,
  color,
  onClick,
}: CosmicOrbProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{
        scale: 1.12,
      }}
      whileTap={{
        scale: 0.96,
      }}
      className="orb-button"
    >
      <motion.div
        className="cosmic-orb"
        style={
          {
            "--orb-color": color,
          } as React.CSSProperties
        }
        animate={{
          y: [0, -8, 0],
          rotate: [0, 2, -2, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="orb-glow" />

        <div className="orb-shell" />

        <div className="orb-gradient one" />

        <div className="orb-gradient two" />

        <div className="orb-gradient three" />

        <div className="orb-highlight" />

        <div className="orb-ring" />

        <span className="orb-icon">
          {icon}
        </span>
      </motion.div>

      <span className="orb-name">
        {name}
      </span>
    </motion.button>
  );
}

export default CosmicOrb;