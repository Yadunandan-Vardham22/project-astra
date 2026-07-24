import { useEffect, useState } from "react";

import Nebula from "../components/Nebula";
import StarField from "../components/StarField";
import Title from "../components/Title";
import MeteorCanvas from "../components/meteor/MeteorCanvas";
import CursorParticles from "../components/CursorParticles";
import { CosmicProvider } from "../context/CosmicContext";

function LandingPage() {
  const [showTitle, setShowTitle] = useState(false);
  const [showMeteor, setShowMeteor] = useState(false);

  useEffect(() => {
    const titleTimer = setTimeout(() => {
      setShowTitle(true);
    }, 500);

    const meteorTimer = setTimeout(() => {
      setShowMeteor(true);
    }, 4300);

    return () => {
      clearTimeout(titleTimer);
      clearTimeout(meteorTimer);
    };
  }, []);

  return (
    <CosmicProvider>
      <div className="relative h-screen w-screen overflow-hidden bg-black">
        <Nebula />

        <StarField />

        <CursorParticles />

        {showMeteor && <MeteorCanvas />}

        {showTitle && <Title />}
      </div>
    </CosmicProvider>
  );
}

export default LandingPage;