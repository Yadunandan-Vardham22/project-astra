import { motion } from "framer-motion";

import CelestialStars from "./CelestialStars";
import CosmicMist from "./CosmicMist";
import CosmicDust from "./CosmicDust";

function CelestialBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#020008]">

      <motion.div
        animate={{ x: [50, -50, 50], y: [-20, 40, -20], scale: [1, 1.15, 1] }}
        transition={{ duration: 55, repeat: Infinity, ease: "easeInOut" }}
        className={
          `absolute right-[-20%] bottom-[5%] rounded-full bg-blue-600/30 blur-[220px]
            w-[80vmax] h-[80vmax] sm:w-[70vmax] sm:h-[70vmax] md:w-[900px] md:h-[900px]`
        }
      />

      <motion.div
        animate={{ x: [-50, 50, -50], y: [20, -40, 20], scale: [1, 1.1, 1] }}
        transition={{ duration: 40, repeat: Infinity, ease: "easeInOut" }}
        className={
          `absolute left-[-20%] top-[10%] rounded-full bg-purple-700/25 blur-[200px]
            w-[80vmax] h-[80vmax] sm:w-[60vmax] sm:h-[60vmax] md:w-[850px] md:h-[850px]`
        }
      />

      <CosmicMist />
      <CosmicDust />
      <CelestialStars />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, transparent 25%, rgba(0,0,0,0.6) 60%)`,
        }}
      />

    </div>
  );
}

export default CelestialBackground;
