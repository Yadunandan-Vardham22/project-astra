function FloatingMusicBackground() {
  const symbols = [
    { symbol: "♪", left: "8%", top: "12%", color: "#f9a8d4", duration: "18s", delay: "0s" },
    { symbol: "♫", left: "18%", top: "28%", color: "#93c5fd", duration: "20s", delay: "2s" },
    { symbol: "♬", left: "78%", top: "16%", color: "#fcd34d", duration: "16s", delay: "1s" },
    { symbol: "🎵", left: "84%", top: "34%", color: "#c084fc", duration: "22s", delay: "3s" },
    { symbol: "🎶", left: "12%", top: "72%", color: "#6ee7b7", duration: "19s", delay: "4s" },
    { symbol: "♩", left: "74%", top: "70%", color: "#fda4af", duration: "17s", delay: "1.5s" },
  ];

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
      <style>{`
        @keyframes floatMusic {
          0% {
            transform: translate3d(0, 0, 0) rotate(0deg);
            opacity: 0;
          }
          12% {
            opacity: 0.55;
          }
          100% {
            transform: translate3d(0, -110vh, 0) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>

      {symbols.map((item, index) => (
        <span
          key={`${item.symbol}-${index}`}
          className="absolute text-3xl sm:text-4xl lg:text-5xl"
          style={{
            left: item.left,
            top: item.top,
            color: item.color,
            animation: `floatMusic ${item.duration} ease-in-out infinite`,
            animationDelay: item.delay,
            opacity: 0.4,
            filter: "drop-shadow(0 10px 20px rgba(255,255,255,0.12))",
          }}
        >
          {item.symbol}
        </span>
      ))}
    </div>
  );
}

export default FloatingMusicBackground;
