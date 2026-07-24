import { useState } from "react";
import LightBloom from "./LightBloom";
import Meteor from "./Meteor";
import Title from "./Title";

function IntroSequence() {
  const [showBloom, setShowBloom] = useState(false);
  const [showTitle, setShowTitle] = useState(false);

  return (
    <>
      {!showBloom && (
        <>
          <Meteor
            startX="110vw"
            startY="-10vh"
            endX="45vw"
            endY="35vh"
          />

          <Meteor
            startX="-20vw"
            startY="100vh"
            endX="45vw"
            endY="35vh"
            delay={0.15}
            onComplete={() => {
              setShowBloom(true);

              setTimeout(() => {
                setShowTitle(true);
              }, 500);
            }}
          />
        </>
      )}

      {showBloom && <LightBloom />}

      {showTitle && <Title />}
    </>
  );
}

export default IntroSequence;