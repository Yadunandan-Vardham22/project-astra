const petalConfig = [
  { left: "4%", top: "-6%", size: "18px", delay: "0s", duration: "12s", opacity: 0.9 },
  { left: "18%", top: "-12%", size: "14px", delay: "1.6s", duration: "14s", opacity: 0.85 },
  { left: "32%", top: "-8%", size: "16px", delay: "0.8s", duration: "13s", opacity: 0.9 },
  { left: "46%", top: "-10%", size: "12px", delay: "2.2s", duration: "15s", opacity: 0.8 },
  { left: "60%", top: "-6%", size: "20px", delay: "3.6s", duration: "16s", opacity: 0.95 },
  { left: "74%", top: "-14%", size: "13px", delay: "1.2s", duration: "14s", opacity: 0.8 },
  { left: "88%", top: "-10%", size: "11px", delay: "4.2s", duration: "17s", opacity: 0.75 },
  { left: "12%", top: "-22%", size: "14px", delay: "5.6s", duration: "18s", opacity: 0.82 },
  { left: "28%", top: "-18%", size: "17px", delay: "4.8s", duration: "16s", opacity: 0.9 },
  { left: "56%", top: "-20%", size: "13px", delay: "6.3s", duration: "19s", opacity: 0.78 },
  { left: "72%", top: "-24%", size: "12px", delay: "3.8s", duration: "15s", opacity: 0.8 },
  { left: "92%", top: "-16%", size: "15px", delay: "5.9s", duration: "16s", opacity: 0.85 }
];

function FloatingSakuraBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <style>{`
        @keyframes sakuraFall {
          0% {
            transform: translate3d(0, -10vh, 0) rotate(0deg) scale(0.95);
            opacity: 0;
          }
          10% { opacity: 1; }
          50% {
            transform: translate3d(24px, 40vh, 0) rotate(120deg) scale(1.02);
          }
          100% {
            transform: translate3d(-20px, 120vh, 0) rotate(220deg) scale(1.05);
            opacity: 0;
          }
        }
      `}</style>
      {petalConfig.map((petal, index) => (
        <span
          key={index}
          className="absolute block"
          style={{
            left: petal.left,
            top: petal.top,
            fontSize: petal.size,
            opacity: petal.opacity,
            animation: `sakuraFall ${petal.duration} linear infinite`,
            animationDelay: petal.delay,
            filter: "drop-shadow(0 0 8px rgba(255,182,193,0.12))",
            willChange: "transform, opacity"
          }}
        >
          🌸
        </span>
      ))}
    </div>
  );
}

export default FloatingSakuraBackground;
