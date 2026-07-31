import { memo, useCallback, useEffect, useMemo, useState } from "react";
import type { SpotifyTrack } from "../types/spotify";
import { spotifyService } from "../services/spotify.service";

interface PlaylistSearchProps {
  value: string;
  onChange: (value: string) => void;
  results: SpotifyTrack[];
  loading: boolean;
  error: string | null;
  emptyState: string | null;
  onAddTrack: (track: SpotifyTrack, note: string) => Promise<void> | void;
  onRetry: () => void;
  disabled?: boolean;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function highlightText(text: string, query: string) {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return text;
  }

  const pattern = new RegExp(`(${escapeRegExp(trimmedQuery)})`, "ig");
  const parts = text.split(pattern);

  return parts.map((part, index) => {
    const isMatch = part.toLowerCase() === trimmedQuery.toLowerCase();

    return isMatch ? (
      <mark key={`${part}-${index}`} className="rounded bg-pink-300/30 px-1 text-white">
        {part}
      </mark>
    ) : (
      <span key={`${part}-${index}`}>{part}</span>
    );
  });
}

const PlaylistSearch = memo(function PlaylistSearch({
  value,
  onChange,
  results,
  loading,
  error,
  emptyState,
  onAddTrack,
  onRetry,
  disabled,
}: PlaylistSearchProps) {
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    setActiveIndex(-1);
  }, [results]);

  const emptyMessage = useMemo(() => {
    if (!value.trim()) return "Search for a song that feels like your story.";
    if (emptyState) return emptyState;
    if (!loading && !results.length && !error) return "No songs matched yet — try another title or artist.";
    return null;
  }, [emptyState, error, loading, results.length, value]);

  const handleNoteChange = useCallback((trackId: string, note: string) => {
    setNotes((current) => ({ ...current, [trackId]: note }));
  }, []);

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!results.length) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((current) => (current < results.length - 1 ? current + 1 : 0));
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) => (current > 0 ? current - 1 : results.length - 1));
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      if (activeIndex >= 0 && results[activeIndex]) {
        const selectedTrack = results[activeIndex];
        onAddTrack(selectedTrack, notes[selectedTrack.id] || "");
      }
      return;
    }

    if (event.key === "Escape") {
      setActiveIndex(-1);
    }
  }, [activeIndex, notes, onAddTrack, results]);

  return (
    <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.24)] backdrop-blur-xl sm:p-6">
      <label className="text-[10px] uppercase tracking-[0.35em] text-pink-200/70">Search songs</label>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search Spotify for a song..."
        className="mt-3 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none ring-0 placeholder:text-white/40"
        disabled={disabled}
      />

      {loading ? (
        <div className="mt-4 space-y-3">
          {Array.from({length: 3}).map((_, index) => (
            <div key={index} className="animate-pulse rounded-[24px] border border-white/10 bg-black/20 p-4">
              <div className="flex gap-4">
                <div className="h-16 w-16 rounded-2xl bg-white/10" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-3/4 rounded bg-white/10" />
                  <div className="h-3 w-1/2 rounded bg-white/10" />
                  <div className="h-3 w-2/3 rounded bg-white/10" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {error ? (
        <div className="mt-4 rounded-2xl border border-amber-300/20 bg-amber-400/10 p-4 text-sm text-amber-100/90">
          <div className="flex items-center justify-between gap-3">
            <span>{error}</span>
            <button
              type="button"
              onClick={onRetry}
              className="rounded-full border border-amber-300/20 bg-amber-400/20 px-3 py-1.5 text-xs uppercase tracking-[0.25em] text-amber-50"
            >
              Retry
            </button>
          </div>
        </div>
      ) : null}

      {!loading && !error && emptyMessage ? (
        <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/60">
          {emptyMessage}
        </div>
      ) : null}

      <div className="mt-5 space-y-3">
        {results.map((track, index) => {
          const isActive = index === activeIndex;

          return (
            <div
              key={track.id}
              className={`rounded-[24px] border p-4 transition ${isActive ? "border-pink-300/40 bg-pink-400/10" : "border-white/10 bg-black/25"}`}
            >
            <div className="flex gap-4">
              <img
                src={track.albumImage || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=400&q=80"}
                alt={track.title}
                loading="lazy"
                decoding="async"
                className="h-16 w-16 rounded-2xl object-cover"
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-medium text-white">{highlightText(track.title, value)}</h3>
                    <p className="mt-1 text-sm text-pink-200/80">{highlightText(track.artist, value)}</p>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-white/70">
                    {spotifyService.formatDuration(track.duration)}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-white/60">
                  <span>{highlightText(track.album, value)}</span>
                  {track.explicit ? (
                    <span className="rounded-full border border-amber-300/25 bg-amber-400/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.25em] text-amber-100">
                      Explicit
                    </span>
                  ) : null}
                  {track.previewUrl ? (
                    <span className="rounded-full border border-emerald-300/25 bg-emerald-400/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.25em] text-emerald-100">
                      Preview
                    </span>
                  ) : null}
                </div>
              </div>
            </div>

            <textarea
              value={notes[track.id] || ""}
              onChange={(event) => handleNoteChange(track.id, event.target.value)}
              placeholder="Why is this song part of your story?"
              className="mt-4 min-h-[90px] w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-white outline-none placeholder:text-white/35"
            />

            <div className="mt-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-white/40">
                {track.spotifyUrl ? (
                  <a
                    href={track.spotifyUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-[10px] text-white/70 transition hover:bg-white/20"
                  >
                    Open Spotify
                  </a>
                ) : null}
                <span>Add it to your soundtrack</span>
              </div>
              <button
                type="button"
                onClick={() => onAddTrack(track, notes[track.id] || "")}
                className="rounded-full border border-pink-300/30 bg-pink-400/20 px-4 py-2 text-sm text-pink-100 transition hover:bg-pink-400/30"
              >
                Add song
              </button>
            </div>
          </div>
        );
        })}
      </div>
    </div>
  );
});

export default PlaylistSearch;
