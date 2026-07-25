import { useState } from "react";

interface MessageInputProps {
  onSend: (message: string) => void;
}

function MessageInput({ onSend }: MessageInputProps) {
  const [message, setMessage] = useState("");

  function handleSend() {
    const trimmed = message.trim();

    if (!trimmed) return;

    onSend(trimmed);

    setMessage("");
  }

  return (
    <div className="border-t border-white/10 p-5 flex gap-3">

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSend();
          }
        }}
        placeholder="Write under the moon..."
        className="
          flex-1
          rounded-full
          bg-[#151823]
          px-5
          py-3
          outline-none
          text-white
          placeholder:text-white/40
        "
      />

      <button
        onClick={handleSend}
        className="
          h-12
          w-12
          rounded-full
          bg-pink-400
          hover:bg-pink-300
          transition
        "
      >
        ❤️
      </button>

    </div>
  );
}

export default MessageInput;