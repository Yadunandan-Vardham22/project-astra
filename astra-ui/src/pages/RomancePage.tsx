
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";



function RomancePage() {

  
const navigate = useNavigate();
const romanceFeatures = [
  {
    icon: "❤️",
    title: "Daily Heart Prompt",
    description:
      "Ask one meaningful question every day and build your story together.",
    locked: false,
    path: "/romance/heart-prompt"
  },

  {
    icon: "🤍",
    title: "Heart Journal",
    description:
      "A timeline of every question, answer and memory you've shared.",
    locked: false,
    path: "/romance/heart-journal"
  },

  {
    icon: "🌙",
    title: "Late Night",
    description:
      "A private space for your most intimate conversations.",
    locked: false,
    path: "/romance/late-night"
  },

  {
    icon: "✨",
    title: "Love Challenges",
    description:
      "Complete romantic challenges together and earn Stardust.",
    locked: false,
    path: "/romance/love-challenges"
  },

  {
    icon: "🌌",
    title: "Future Dreams",
    description:
      "Capture the future you're dreaming of together.",
    locked: false,
    path: "/romance/future-dreams"
  },

  {
    icon: "🎵",
    title: "Playlists",
    description:
      "Build the soundtrack of your relationship.",
    locked: true,
    path: ""
  }
];

  return (

    <div
      className="
        min-h-screen
        w-screen
        overflow-y-auto
        bg-black
        px-8
        py-20
        text-white
      "
    >

      


      <div
        className="
          mx-auto
          max-w-5xl
        "
      >

        <div className="text-center">

          <div className="text-7xl">
            🌹
          </div>

          <h1
            className="
              mt-6
              text-5xl
              font-light
              tracking-[0.25em]
            "
          >
            ROMANCE
          </h1>

          <p
            className="
              mt-5
              text-sm
              tracking-[0.35em]
              text-pink-300
            "
          >
            Every love story deserves its own universe.
          </p>

        </div>

        <div
          className="
             mt-20
    grid
    gap-8
    md:grid-cols-2
          "
        >

          {

            romanceFeatures.map((feature) => (

              <motion.button
    onClick={() => {
        if (!feature.locked) {
            navigate(feature.path);
        }
    }}

                key={feature.title}

                disabled={feature.locked}

                whileHover={
                  feature.locked
                    ? {}
                    : {
                        y: -8,
                        scale: 1.01
                      }
                }

                className={`
                  w-full
                  rounded-3xl
                  border
                  p-6 md:p-10
                  text-left
                  transition
                  backdrop-blur-xl

                  ${
                    feature.locked
                      ? "cursor-not-allowed border-white/10 bg-white/[0.03] opacity-60"
                      : "cursor-pointer border-pink-300/30 bg-pink-500/5 hover:border-pink-300/50"
                  }
                `}
              >

                <div className="flex items-start justify-between">

                  <div className="text-5xl">

                    {feature.icon}

                  </div>

                  {

                    feature.locked && (

                      <div
                        className="
                          rounded-full
                          border
                          border-white/10
                          bg-white/5
                          px-4
                          py-2
                          text-xs
                          tracking-[0.3em]
                          text-white/70
                        "
                      >
                        🔒 COMING SOON
                      </div>

                    )

                  }

                </div>

                <h2
                  className="
                    mt-8
                    text-3xl
                    font-light
                  "
                >
                  {feature.title}
                </h2>

                <p
                  className="
                    mt-5
                    max-w-2xl
                    leading-relaxed
                    text-white/65
                  "
                >
                  {feature.description}
                </p>

              </motion.button>

            ))

          }

        </div>

      </div>

    </div>

  );

}

export default RomancePage;