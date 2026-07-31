
import { useNavigate } from "react-router-dom";
import FloatingHeartsBackground from "../components/FloatingHeartsBackground";

function RomancePage() {
  const navigate = useNavigate();

  const romanceFeatures = [
    {
      icon: "❤️",
      title: "Daily Heart Prompt",
      description: "Ask one meaningful question every day and build your story together.",
      locked: false,
      path: "/romance/heart-prompt",
    },
    {
      icon: "🤍",
      title: "Heart Journal",
      description: "A timeline of every question, answer and memory you've shared.",
      locked: false,
      path: "/romance/heart-journal",
    },
    {
      icon: "🌙",
      title: "Late Night",
      description: "A private space for your most intimate conversations.",
      locked: false,
      path: "/romance/late-night",
    },
    {
      icon: "✨",
      title: "Love Challenges",
      description: "Complete romantic challenges together and earn Stardust.",
      locked: false,
      path: "/romance/love-challenges",
    },
    {
      icon: "❝",
      title: "Quotes",
      description: "Add your favourite lines and let the other heart like them.",
      locked: false,
      path: "/romance/quotes",
    },
  ];

  return (
    <div className="relative min-h-screen w-screen overflow-y-auto bg-black px-8 pb-20 pt-8 text-white">
      <FloatingHeartsBackground />

      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3">
            <h1 className="text-3xl font-light tracking-[0.3em]">Romance</h1>
            <div className="text-4xl">🌹</div>
          </div>

          <p className="mt-5 text-xs tracking-[0.5em] text-purple-300">EVERY LOVE STORY DESERVES ITS OWN UNIVERSE</p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {romanceFeatures.map((feature) => (
            <button
              key={feature.title}
              onClick={() => {
                if (!feature.locked && feature.path) navigate(feature.path);
              }}
              disabled={feature.locked}
              className={`group cursor-pointer rounded-3xl border border-white/10 bg-white/[0.04] p-6 md:p-10 text-left backdrop-blur-xl transition hover:border-pink-300/40 hover:bg-white/[0.08] ${feature.locked ? "cursor-not-allowed opacity-60" : ""}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-light tracking-wide flex items-center gap-3">
                    <span>{feature.title}</span>
                    <span className="text-2xl md:text-3xl">{feature.icon}</span>
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-white/70">{feature.description}</p>
                </div>

                {feature.locked && <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs tracking-[0.3em] text-white/70">🔒 COMING SOON</div>}
              </div>

              <p className="mt-6 text-xs tracking-[0.3em] text-purple-300">OPEN →</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RomancePage;