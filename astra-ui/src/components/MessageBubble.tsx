import { Timestamp } from "firebase/firestore";
interface MessageBubbleProps {
  text: string;
  senderName: string;
  isMine: boolean;
  createdAt: Timestamp | null;
}

function MessageBubble({
  text,
  senderName,
  isMine,
  createdAt
}: MessageBubbleProps)  {
    const formattedTime = createdAt
  ? createdAt.toDate().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    })
  : "";
  return (
    <div
      className={`flex ${
        isMine ? "justify-end" : "justify-start"
      }`}
    >
<div
  className={`max-w-[75%] rounded-[28px] px-5 py-4 shadow-lg transition-all duration-300 ${
    isMine
      ? "bg-gradient-to-br from-pink-400 to-pink-500 text-black"
      : "bg-gradient-to-br from-[#1D2333] to-[#151A24] text-white border border-white/5"
  }`}
>
        <p className="mb-2 text-[11px] uppercase tracking-[0.18em] text-red/50">
          {senderName}
        </p>

        <p className="whitespace-pre-wrap break-words leading-7 text-[15px]">
          {text}
        </p>
        <p
  className={`mt-2 text-[11px] ${
    isMine
      ? "text-black/60 text-right"
      : "text-white/40 text-right"
  }`}
>
  {formattedTime}
</p>
      </div>
    </div>
  );
}

export default MessageBubble;