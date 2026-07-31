const leafConfig = [
  { left: "-10%", top: "12%", size: "20px", delay: "0s", duration: "18s", opacity: 0.85 },
  { left: "-18%", top: "28%", size: "16px", delay: "2.4s", duration: "20s", opacity: 0.75 },
  { left: "-22%", top: "8%", size: "18px", delay: "1.2s", duration: "22s", opacity: 0.8 },
  { left: "-8%", top: "40%", size: "14px", delay: "3.6s", duration: "17s", opacity: 0.65 },
  { left: "-14%", top: "58%", size: "19px", delay: "4.8s", duration: "21s", opacity: 0.78 },
  { left: "-24%", top: "72%", size: "15px", delay: "2.8s", duration: "19s", opacity: 0.7 },
  { left: "-30%", top: "84%", size: "13px", delay: "5.1s", duration: "23s", opacity: 0.72 }
];

function FloatingLeavesBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <style>{`
        @keyframes leafDrift {
          0% {
            transform: translate3d(0, 0, 0) rotate(-15deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          50% {
            transform: translate3d(120vw, 10vh, 0) rotate(20deg);
          }
          100% {
            transform: translate3d(240vw, -10vh, 0) rotate(5deg);
            opacity: 0;
          }
        }
      `}</style>
      {leafConfig.map((leaf, index) => (
        <span
          key={index}
          className="absolute block"
          style={{
            left: leaf.left,
            top: leaf.top,
            fontSize: leaf.size,
            opacity: leaf.opacity,
            animation: `leafDrift ${leaf.duration} cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite`,
            animationDelay: leaf.delay,
            filter: "drop-shadow(0 0 10px rgba(134, 197, 17, 0.18))",
            willChange: "transform, opacity"
          }}
        >
          🍃
        </span>
      ))}
    </div>
  );
}

export default FloatingLeavesBackground;
