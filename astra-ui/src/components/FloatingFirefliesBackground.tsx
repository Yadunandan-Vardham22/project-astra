const fireflyConfig = [
  { left: "6%", top: "12%", size: "8px", delay: "0s", duration: "14s", opacity: 0.35 },
  { left: "18%", top: "28%", size: "7px", delay: "1.8s", duration: "16s", opacity: 0.3 },
  { left: "32%", top: "8%", size: "9px", delay: "3.4s", duration: "18s", opacity: 0.4 },
  { left: "48%", top: "20%", size: "6px", delay: "0.9s", duration: "15s", opacity: 0.28 },
  { left: "64%", top: "10%", size: "8px", delay: "2.6s", duration: "17s", opacity: 0.34 },
  { left: "78%", top: "24%", size: "7px", delay: "4.2s", duration: "16s", opacity: 0.3 },
  { left: "88%", top: "14%", size: "6px", delay: "2.1s", duration: "15s", opacity: 0.26 },
  { left: "12%", top: "72%", size: "8px", delay: "5.4s", duration: "19s", opacity: 0.32 },
  { left: "28%", top: "84%", size: "7px", delay: "3.8s", duration: "18s", opacity: 0.3 },
  { left: "56%", top: "76%", size: "8px", delay: "6.2s", duration: "17s", opacity: 0.34 },
  { left: "74%", top: "88%", size: "6px", delay: "4.7s", duration: "16s", opacity: 0.28 },
  { left: "92%", top: "68%", size: "8px", delay: "5.1s", duration: "17s", opacity: 0.32 }
];

function FloatingFirefliesBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <style>{`
        @keyframes fireflyFloat {
          0% {
            transform: translate3d(0, 0, 0) scale(0.7);
            opacity: 0;
          }
          12% {
            opacity: 1;
          }
          50% {
            transform: translate3d(10px, -90px, 0) scale(1);
          }
          100% {
            transform: translate3d(-8px, -210px, 0) scale(0.8);
            opacity: 0;
          }
        }
      `}</style>
      {fireflyConfig.map((firefly, index) => (
        <span
          key={index}
          className="absolute block rounded-full"
          style={{
            left: firefly.left,
            top: firefly.top,
            width: firefly.size,
            height: firefly.size,
            opacity: firefly.opacity,
            animation: `fireflyFloat ${firefly.duration} ease-in-out infinite`,
            animationDelay: firefly.delay,
            background: "radial-gradient(circle, rgba(250, 204, 21, 0.95) 0%, rgba(251, 191, 36, 0.6) 40%, rgba(0, 0, 0, 0) 70%)",
            boxShadow: "0 0 10px rgba(250, 204, 21, 0.45)",
            willChange: "transform, opacity"
          }}
        />
      ))}
    </div>
  );
}

export default FloatingFirefliesBackground;
