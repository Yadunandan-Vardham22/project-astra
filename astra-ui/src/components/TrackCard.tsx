import type { PlaylistTrackModel } from "../services/playlistService";
import { spotifyService } from "../services/spotify.service";

interface TrackCardProps {
  track: PlaylistTrackModel;
}

function TrackCard({ track }: TrackCardProps) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-black/25 p-4 shadow-[0_12px_36px_rgba(0,0,0,0.2)] backdrop-blur-lg">
      <div className="flex gap-4">
        <img
          src={track.albumArt}
          alt={track.songTitle}
          className="h-16 w-16 rounded-2xl object-cover shadow-lg"
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-base font-medium text-white">{track.songTitle}</h3>
              <p className="mt-1 text-sm text-pink-200/80">{track.artist}</p>
            </div>
            <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-white/70">
              {spotifyService.formatDuration(track.duration)}
            </span>
          </div>

          <p className="mt-2 text-sm text-white/60">{track.album}</p>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.25em] text-white/45">
            <span>Added by {track.addedBy}</span>
            <span>{new Date(track.addedAt).toLocaleDateString()}</span>
          </div>

          {track.personalNote ? (
            <div className="mt-3 rounded-2xl border border-pink-300/20 bg-pink-400/10 p-3 text-sm leading-7 text-pink-100/90">
              “{track.personalNote}”
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default TrackCard;
