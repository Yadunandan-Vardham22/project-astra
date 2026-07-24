import { useMemo, useState } from "react";
import Star from "./Star";
import { useCosmic } from "../context/CosmicContext";

function StarField() {
  const [mouse, setMouse] = useState({
    x: -1000,
    y: -1000,
  });

  const {
    buttonHovered,
  } = useCosmic();

  const stars = useMemo(() => {
    return [
      ...Array.from({ length: 150 }, () => ({
        size: Math.random() * 1 + 0.5,
        opacity: Math.random() * 0.3 + 0.2,
        top: Math.random() * 100,
        left: Math.random() * 100,
        isSparkle: false,
      })),

      ...Array.from({ length: 100 }, () => ({
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.4,
        top: Math.random() * 100,
        left: Math.random() * 100,
        isSparkle: Math.random() > 0.95,
      })),

      ...Array.from({ length: 25 }, () => ({
        size: Math.random() * 3 + 2,
        opacity: 1,
        top: Math.random() * 100,
        left: Math.random() * 100,
        isSparkle: Math.random() > 0.6,
      })),
    ];
  }, []);

  return (
    <div
      className="absolute inset-0"
      onMouseMove={(e) => {
        setMouse({
          x: e.clientX,
          y: e.clientY,
        });
      }}
    >
      {stars.map((star, index) => (
        <Star
          key={index}
          top={star.top}
          left={star.left}
          size={star.size}
          opacity={star.opacity}
          isSparkle={star.isSparkle}
          mouse={mouse}
          buttonHovered={buttonHovered}
        />
      ))}
    </div>
  );
}

export default StarField;