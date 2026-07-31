import { Timestamp } from "firebase/firestore";
import { useEffect, useState } from "react";

interface MessageBubbleProps {
  text: string;
  type?: "text" | "image" | "video" | "audio";
  mediaUrl?: string | null;
  senderName: string;
  isMine: boolean;
  createdAt: Timestamp | null;
}

function MessageBubble({
  text,
  type = "text",
  mediaUrl,
  senderName,
  isMine,
  createdAt
}: MessageBubbleProps) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const formattedTime = createdAt
    ? createdAt.toDate().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      })
    : "";

  useEffect(() => {
    if (!isLightboxOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsLightboxOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen]);

  const renderMedia = () => {
    if (!mediaUrl) return null;

    switch (type) {
      case "image":
        return (
          <button
            type="button"
            onClick={() => setIsLightboxOpen(true)}
            className="group mb-2 overflow-hidden rounded-[20px]"
          >
            <img src={mediaUrl} alt="shared media" className="max-h-[18rem] w-full rounded-[18px] object-cover shadow-[0_8px_24px_rgba(0,0,0,0.18)] transition duration-300 group-hover:scale-[1.01]" />
          </button>
        );
      case "video":
        return (
          <div className="group relative mb-2 overflow-hidden rounded-[20px] bg-black/20 shadow-[0_8px_24px_rgba(0,0,0,0.18)]">
            <video controls src={mediaUrl} className="max-h-[18rem] w-full rounded-[20px] object-cover" />
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-[20px] bg-black/20 backdrop-blur-[1px]" />
          </div>
        );
      case "audio":
        return (
          <div className="mb-2 rounded-[18px] border border-white/10 bg-black/10 px-3 py-3">
            <div className="mb-2 flex items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-white/45">
              <span>♪</span>
              <span>Audio</span>
            </div>
            <audio controls src={mediaUrl} className="w-full" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className={`flex ${isMine ? "justify-end" : "justify-start"} mb-3 transition-all duration-300`}>
        <div className={`flex max-w-[92%] flex-col md:max-w-[78%] ${isMine ? "items-end" : "items-start"}`}>
          <div
            className={`w-fit rounded-[24px] border px-3 py-2.5 shadow-[0_10px_28px_rgba(0,0,0,0.2)] backdrop-blur-sm transition-all duration-300 ${
              isMine
                ? "border-pink-300/25 bg-gradient-to-br from-pink-400 to-pink-500 text-black"
                : "border-white/10 bg-gradient-to-br from-[#1D2333] to-[#151A24] text-white"
            }`}
          >
            {renderMedia()}

            {text ? (
              <p className="whitespace-pre-wrap break-words leading-6 text-sm md:text-[14px]">
                {text}
              </p>
            ) : null}
          </div>

          <div className={`mt-1.5 flex items-center ${isMine ? "justify-end" : "justify-start"}`}>
            <span className={`text-[10px] md:text-[11px] font-medium ${isMine ? "text-pink-100/90" : "text-slate-200/90"}`}>
              {formattedTime}
            </span>
          </div>
        </div>
      </div>

      {isLightboxOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 px-4 backdrop-blur-xl" onClick={() => setIsLightboxOpen(false)}>
          <div className="relative max-h-[90vh] max-w-[90vw] overflow-hidden rounded-[28px] border border-white/10 bg-black/40 p-2 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <img src={mediaUrl!} alt="fullscreen media" className="max-h-[85vh] max-w-[85vw] rounded-[24px] object-contain" />
            <button
              type="button"
              onClick={() => setIsLightboxOpen(false)}
              className="absolute right-4 top-4 rounded-full border border-white/15 bg-black/50 px-3 py-1 text-sm text-white/80 backdrop-blur"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default MessageBubble;