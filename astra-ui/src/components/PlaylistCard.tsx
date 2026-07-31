import { motion } from "framer-motion";
import type { PlaylistModel } from "../services/playlistService";

interface PlaylistCardProps {
  playlist: PlaylistModel;
  trackCount: number;
  totalDuration: number;
  lastAddedSong?: string | null;
  accentClass: string;
  onOpen?: () => void;
}

function formatDuration(totalDuration: number) {
  if (!totalDuration) return "—";
  const hours = Math.floor(totalDuration / 3600);
  const minutes = Math.floor((totalDuration % 3600) / 60);
  if (hours && minutes) return `${hours} hr ${minutes} min`;
  if (hours) return `${hours} hr`;
  return `${minutes} min`;
}

function PlaylistCard({
  playlist,
  trackCount,
  totalDuration,
  lastAddedSong,
  accentClass,
  onOpen,
}: PlaylistCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      whileHover={{ y: -4, scale: 1.01 }}
      className={`group overflow-hidden rounded-[24px] border border-white/10 bg-gradient-to-br ${accentClass} p-5 shadow-[0_16px_50px_rgba(0,0,0,0.22)] backdrop-blur-xl transition-all duration-250`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.35em] text-white/65">Shared collection</p>
          <h3 className="mt-3 text-xl font-light tracking-[0.2em] text-white">{playlist.title}</h3>
        </div>
        <div className="rounded-full border border-white/15 bg-black/15 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-white/70">
          {trackCount ? `${trackCount} song${trackCount > 1 ? "s" : ""}` : "Waiting for the first song..."}
        </div>
      </div>

      <p className="mt-4 text-sm leading-7 text-white/70">{playlist.description}</p>

      <div className="mt-6 space-y-3 border-t border-white/10 pt-4 text-sm text-white/70">
        <div className="flex items-center justify-between">
          <span>Duration</span>
          <span className="font-medium text-white/90">{formatDuration(totalDuration)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Last added</span>
          <span className="font-medium text-white/90">{lastAddedSong || "—"}</span>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <span className="text-[11px] uppercase tracking-[0.3em] text-white/55">Open</span>
        <button
          type="button"
          onClick={onOpen}
          className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-white/80 transition group-hover:bg-white/20"
        >
          →
        </button>
      </div>
    </motion.article>
  );
}

export default PlaylistCard;
