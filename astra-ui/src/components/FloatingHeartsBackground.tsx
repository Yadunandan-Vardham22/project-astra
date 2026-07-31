const heartConfig = [
  { left: "6%", top: "12%", size: "16px", delay: "0s", duration: "16s", opacity: 0.16 },
  { left: "18%", top: "28%", size: "12px", delay: "2.2s", duration: "18s", opacity: 0.12 },
  { left: "32%", top: "8%", size: "14px", delay: "4s", duration: "20s", opacity: 0.14 },
  { left: "48%", top: "20%", size: "11px", delay: "1.5s", duration: "17s", opacity: 0.1 },
  { left: "64%", top: "10%", size: "17px", delay: "3.4s", duration: "19s", opacity: 0.16 },
  { left: "78%", top: "24%", size: "13px", delay: "5.2s", duration: "18s", opacity: 0.12 },
  { left: "88%", top: "14%", size: "10px", delay: "2.8s", duration: "16s", opacity: 0.1 },
  { left: "12%", top: "72%", size: "12px", delay: "6.6s", duration: "21s", opacity: 0.12 },
  { left: "28%", top: "84%", size: "15px", delay: "4.8s", duration: "20s", opacity: 0.14 },
  { left: "56%", top: "76%", size: "13px", delay: "7.3s", duration: "19s", opacity: 0.12 },
  { left: "74%", top: "88%", size: "11px", delay: "3.8s", duration: "17s", opacity: 0.1 },
  { left: "92%", top: "68%", size: "14px", delay: "5.9s", duration: "18s", opacity: 0.13 }
];

function FloatingHeartsBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <style>{`
        @keyframes heartFloat {
          0% {
            transform: translate3d(0, 0, 0) scale(0.9);
            opacity: 0;
          }
          12% {
            opacity: 1;
          }
          50% {
            transform: translate3d(8px, -90px, 0) scale(1.05);
          }
          100% {
            transform: translate3d(-10px, -210px, 0) scale(1.1);
            opacity: 0;
          }
        }
      `}</style>
      {heartConfig.map((heart, index) => (
        <span
          key={index}
          className="absolute block"
          style={{
            left: heart.left,
            top: heart.top,
            fontSize: heart.size,
            opacity: heart.opacity,
            animation: `heartFloat ${heart.duration} ease-in-out infinite`,
            animationDelay: heart.delay,
            filter: "drop-shadow(0 0 8px rgba(244, 114, 182, 0.16))",
            willChange: "transform, opacity"
          }}
        >
          ❤
        </span>
      ))}
    </div>
  );
}

export default FloatingHeartsBackground;
