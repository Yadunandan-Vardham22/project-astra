type StarProps = {
  top: number;
  left: number;
  size: number;
  opacity: number;
  isSparkle: boolean;
  mouse: {
    x: number;
    y: number;
  };
  buttonHovered: boolean;
};

function Star({
  top,
  left,
  size,
  opacity,
  isSparkle,
  mouse,
  buttonHovered,
}: StarProps) {
  const starX =
    (left / 100) * window.innerWidth;

  const starY =
    (top / 100) * window.innerHeight;

  /*
    Cursor interaction
  */
  const cursorDx = starX - mouse.x;
  const cursorDy = starY - mouse.y;

  const cursorDistance = Math.sqrt(
    cursorDx * cursorDx +
      cursorDy * cursorDy
  );

  const cursorRadius = 180;

  let offsetX = 0;
  let offsetY = 0;
  let glow = 0;

  if (cursorDistance < cursorRadius) {
    const force =
      (cursorRadius - cursorDistance) /
      cursorRadius;

    offsetX =
      (cursorDx / cursorDistance) *
      force *
      12;

    offsetY =
      (cursorDy / cursorDistance) *
      force *
      12;

    glow = force;
  }


  /*
    Button attraction
  */
  const buttonX =
    window.innerWidth / 2;

  const buttonY =
    window.innerHeight * 0.65;

  let attractionX = 0;
  let attractionY = 0;

  if (buttonHovered) {
    const buttonDx =
      buttonX - starX;

    const buttonDy =
      buttonY - starY;

    const buttonDistance =
      Math.sqrt(
        buttonDx * buttonDx +
          buttonDy * buttonDy
      );

    const attractionRadius = 350;

    if (buttonDistance < attractionRadius) {
      const force =
        (attractionRadius -
          buttonDistance) /
        attractionRadius;

      attractionX =
        (buttonDx / buttonDistance) *
        force *
        18;

      attractionY =
        (buttonDy / buttonDistance) *
        force *
        18;

      glow = Math.max(
        glow,
        force
      );
    }
  }


  const starColor =
    glow > 0.7
      ? "#c7d9ff"
      : glow > 0.3
      ? "#e6edff"
      : "#ffffff";

  const sparkleColor =
    glow > 0.7
      ? "#ffe8b5"
      : glow > 0.3
      ? "#d9e8ff"
      : "#ffffff";


  return (
    <div
      className="
        absolute
        animate-pulse
        transition-transform
        duration-700
        ease-out
      "
      style={{
        top: `${top}%`,
        left: `${left}%`,
        transform: `
          translate(
            ${offsetX + attractionX}px,
            ${offsetY + attractionY}px
          )
        `,
        animationDuration:
          `${Math.random() * 4 + 2}s`,
        animationDelay:
          `${Math.random() * 5}s`,
      }}
    >
      {isSparkle ? (
        <div
          style={{
            fontSize: `${size * 4}px`,
            color: sparkleColor,
            opacity:
              opacity + glow * 0.5,
            textShadow: `
              0 0 ${
                12 + glow * 25
              }px ${
                glow > 0.5
                  ? "rgba(180,210,255,0.95)"
                  : "rgba(255,255,255,0.95)"
              }
            `,
          }}
        >
          ✦
        </div>
      ) : (
        <div
          className="
            rounded-full
            transition-colors
            duration-500
          "
          style={{
            width: `${size}px`,
            height: `${size}px`,
            backgroundColor:
              starColor,
            opacity:
              opacity + glow * 0.5,
            boxShadow: `
              0 0 ${
                8 + glow * 18
              }px ${
                2 + glow * 5
              }px ${
                glow > 0.5
                  ? "rgba(160,200,255,0.9)"
                  : "rgba(255,255,255,0.9)"
              }
            `,
          }}
        />
      )}
    </div>
  );
}

export default Star;