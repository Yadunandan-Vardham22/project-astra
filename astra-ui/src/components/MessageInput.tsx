import { useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";

interface AttachmentData {
  file: File;
  type: "image" | "video" | "audio";
}

interface MessageInputProps {
  onSend: (message: string, attachment?: AttachmentData | null) => void;
}

function getAttachmentType(file: File): AttachmentData["type"] {
  if (file.type.startsWith("video")) return "video";
  if (file.type.startsWith("audio")) return "audio";
  return "image";
}

function MessageInput({ onSend }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [attachment, setAttachment] = useState<AttachmentData | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [pickerType, setPickerType] = useState<AttachmentData["type"] | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  function handleFileSelect(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const type = getAttachmentType(file);

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    const nextPreview = URL.createObjectURL(file);
    setPreviewUrl(nextPreview);
    setAttachment({ file, type });
    setMenuOpen(false);
  }

  function openPicker(type: AttachmentData["type"]) {
    setPickerType(type);
    setMenuOpen(false);
    setTimeout(() => fileInputRef.current?.click(), 60);
  }

  function clearAttachment() {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setAttachment(null);
    setPickerType(null);
  }

  function handleSend() {
    const trimmed = message.trim();

    if (!trimmed && !attachment) return;

    onSend(trimmed, attachment);

    setMessage("");
    clearAttachment();
  }

  return (
    <div className="rounded-[28px] border border-white/10 bg-white/10 p-3 shadow-[0_10px_35px_rgba(0,0,0,0.3)] backdrop-blur-xl">
      {attachment && (
        <div className="mb-3 rounded-[22px] border border-white/10 bg-[#0d1018]/80 p-3 shadow-inner">
          {attachment.type === "image" && previewUrl ? (
            <img src={previewUrl} alt="selected preview" className="h-32 w-full rounded-[18px] object-cover" />
          ) : attachment.type === "video" && previewUrl ? (
            <video
              src={previewUrl}
              muted
              autoPlay
              loop
              playsInline
              className="h-32 w-full rounded-[18px] object-cover"
            />
          ) : previewUrl ? (
            <div className="rounded-[18px] border border-white/10 bg-black/30 p-3 text-sm text-white/70">
              <p className="mb-2 font-medium">🎵 Audio selected</p>
              <p className="text-xs text-white/50">{attachment.file.name}</p>
              <audio controls src={previewUrl} className="mt-3 w-full" />
            </div>
          ) : (
            <div className="rounded-[18px] border border-white/10 bg-black/30 p-3 text-sm text-white/70">
              {attachment.file.name}
            </div>
          )}

          <div className="mt-2 flex items-center justify-between">
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/50">
              {attachment.type} ready
            </p>
            <button onClick={clearAttachment} className="text-xs text-pink-300 transition hover:text-pink-200">
              Remove
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2">
        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-pink-300/20 bg-black/30 text-xl shadow-[0_0_18px_rgba(244,114,182,0.2)] transition duration-200 hover:scale-105 hover:bg-black/40"
          >
            📎
          </button>

          {menuOpen && (
            <div className="absolute bottom-14 left-0 flex min-w-[140px] flex-col gap-1 rounded-[18px] border border-white/10 bg-[#11141d]/90 p-2 shadow-[0_18px_45px_rgba(0,0,0,0.35)] backdrop-blur-xl">
              {[
                { label: "Photo", icon: "📷", type: "image" as const },
                { label: "Video", icon: "🎥", type: "video" as const },
                { label: "Audio", icon: "🎵", type: "audio" as const },
              ].map((option) => (
                <button
                  key={option.type}
                  type="button"
                  onClick={() => openPicker(option.type)}
                  className="flex items-center gap-2 rounded-[12px] px-3 py-2 text-left text-sm text-white/80 transition hover:bg-white/10"
                >
                  <span>{option.icon}</span>
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*,audio/*"
          className="hidden"
          onChange={handleFileSelect}
        />

        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSend();
            }
          }}
          placeholder="Write under the moon..."
          className="flex-1 rounded-full border border-white/10 bg-[#121723]/80 px-5 py-3 text-sm text-white outline-none placeholder:text-white/40"
        />

        <button
          onClick={handleSend}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-pink-500 text-lg shadow-[0_0_18px_rgba(244,114,182,0.3)] transition duration-200 hover:scale-105 hover:shadow-[0_0_24px_rgba(244,114,182,0.45)]"
        >
          ✦
        </button>
      </div>
    </div>
  );
}

export default MessageInput;