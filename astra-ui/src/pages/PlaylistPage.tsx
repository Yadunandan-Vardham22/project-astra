import { useEffect, useMemo, useRef, useState } from "react";
import FloatingMusicBackground from "../components/FloatingMusicBackground";
import PlaylistCard from "../components/PlaylistCard";
import PlaylistSearch from "../components/PlaylistSearch";
import { playlistService, type PlaylistModel } from "../services/playlistService";
import { spotifyService } from "../services/spotify.service";
import type { SpotifyTrack } from "../types/spotify";

interface PlaylistSummary {
  trackCount: number;
  totalDuration: number;
  lastAddedSong: string | null;
}

function PlaylistPage() {
  const [playlists, setPlaylists] = useState<PlaylistModel[]>([]);
  const [playlistSummaries, setPlaylistSummaries] = useState<Record<string, PlaylistSummary>>({});
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SpotifyTrack[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emptyState, setEmptyState] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string>("");
  const [newPlaylistTitle, setNewPlaylistTitle] = useState("");
  const [newPlaylistDescription, setNewPlaylistDescription] = useState("");
  const [creatingPlaylist, setCreatingPlaylist] = useState(false);
  const searchRequestRef = useRef(0);
  const latestQueryRef = useRef("");
  const activeSearchControllerRef = useRef<AbortController | null>(null);
  const [searchVersion, setSearchVersion] = useState(0);

  useEffect(() => {
    const unsubscribe = playlistService.subscribeToPlaylists((nextPlaylists) => {
      setPlaylists(nextPlaylists);
      if (!selectedPlaylistId && nextPlaylists.length) {
        setSelectedPlaylistId(nextPlaylists[0].id);
      }
    });

    return () => unsubscribe();
  }, [selectedPlaylistId]);

  useEffect(() => {
    if (!playlists.length) {
      setPlaylistSummaries({});
      return;
    }

    let active = true;

    async function loadSummaries() {
      const summaries = await Promise.all(
        playlists.map(async (playlist) => {
          const tracks = await playlistService.getPlaylistTracks(playlist.id);
          const totalDuration = tracks.reduce((sum, track) => sum + (track.duration || 0), 0);
          return [
            playlist.id,
            {
              trackCount: tracks.length,
              totalDuration,
              lastAddedSong: tracks[0]?.songTitle || null,
            },
          ] as const;
        })
      );

      if (active) {
        setPlaylistSummaries(Object.fromEntries(summaries));
      }
    }

    loadSummaries();

    return () => {
      active = false;
    };
  }, [playlists]);

  useEffect(() => {
    const trimmedQuery = query.trim();
    latestQueryRef.current = trimmedQuery;

    if (!trimmedQuery || trimmedQuery.length < 2) {
      setResults([]);
      setError(null);
      setEmptyState(null);
      setLoading(false);
      return;
    }

    if (activeSearchControllerRef.current) {
      activeSearchControllerRef.current.abort();
    }

    const requestId = searchRequestRef.current + 1;
    searchRequestRef.current = requestId;
    const controller = new AbortController();
    activeSearchControllerRef.current = controller;

    setResults([]);
    setLoading(true);
    setError(null);
    setEmptyState(null);

    const timer = window.setTimeout(async () => {
      try {
        const nextResults = await spotifyService.searchTracks(trimmedQuery, controller.signal);

        if (latestQueryRef.current !== trimmedQuery || searchRequestRef.current !== requestId) {
          return;
        }

        setResults(nextResults);
        setEmptyState(nextResults.length ? null : "No songs found");
      } catch {
        if (latestQueryRef.current !== trimmedQuery || searchRequestRef.current !== requestId) {
          return;
        }

        setResults([]);
        setError("Unable to search Spotify. Please try again.");
        setEmptyState(null);
      } finally {
        if (latestQueryRef.current === trimmedQuery && searchRequestRef.current === requestId) {
          setLoading(false);
        }
      }
    }, 300);

    return () => {
      window.clearTimeout(timer);
      if (activeSearchControllerRef.current === controller) {
        controller.abort();
      }
    };
  }, [query, searchVersion]);

  async function handleAddTrack(track: SpotifyTrack, note: string) {
    if (isSaving || !selectedPlaylistId) return;

    setIsSaving(true);
    try {
      await playlistService.addTrackToPlaylist(
        selectedPlaylistId,
        {
          spotifyTrackId: track.id,
          spotifyUrl: track.spotifyUrl,
          songTitle: track.title,
          artist: track.artist,
          album: track.album,
          albumArt: track.albumImage || "",
          duration: track.duration,
          previewUrl: track.previewUrl,
        },
        note,
        "You"
      );

      setQuery("");
      setResults([]);
      setError(null);
      setEmptyState(null);
      setIsAddModalOpen(false);
    } catch (err) {
      setError("Unable to save this song to your soundtrack right now.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleCreatePlaylist() {
    if (!newPlaylistTitle.trim()) return;

    setCreatingPlaylist(true);
    try {
      const createdPlaylist = await playlistService.createPlaylist({
        title: newPlaylistTitle.trim(),
        description: newPlaylistDescription.trim() || "A new chapter in our soundtrack.",
      });
      setSelectedPlaylistId(createdPlaylist.id);
      setNewPlaylistTitle("");
      setNewPlaylistDescription("");
      setIsCreateModalOpen(false);
    } catch (err) {
      setError("Unable to create that playlist right now.");
    } finally {
      setCreatingPlaylist(false);
    }
  }

  const accentClasses = useMemo(() => [
    "from-violet-500/30 via-fuchsia-500/20 to-slate-900",
    "from-sky-500/25 via-cyan-500/15 to-slate-900",
    "from-amber-500/25 via-orange-500/20 to-slate-900",
    "from-purple-400/25 via-indigo-500/15 to-slate-900",
  ], []);

  return (
    <div className="min-h-screen w-full overflow-y-auto bg-[radial-gradient(circle_at_top,_rgba(255,192,203,0.16),_transparent_45%),linear-gradient(135deg,_#05070d_0%,_#090b13_100%)] px-4 py-8 text-white sm:px-6 lg:px-8">
      <FloatingMusicBackground />

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-8 pb-24">
        <section className="px-2 py-2 text-center sm:px-0 sm:py-0">
          <div className="flex items-center justify-center gap-3">
            <h1 className="text-3xl font-light tracking-[0.3em]">Our Soundtrack</h1>
            <div className="text-4xl">🎵</div>
          </div>
          <p className="mx-auto mt-3 max-w-2xl text-[11px] tracking-[0.25em] text-white/45 sm:text-[13px]">
            Every chapter of us has a song.
          </p>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          {playlists.map((playlist, index) => {
            const summary = playlistSummaries[playlist.id];
            return (
              <PlaylistCard
                key={playlist.id}
                playlist={playlist}
                trackCount={summary?.trackCount || 0}
                totalDuration={summary?.totalDuration || 0}
                lastAddedSong={summary?.lastAddedSong || null}
                accentClass={accentClasses[index % accentClasses.length]}
                onOpen={() => {
                  setSelectedPlaylistId(playlist.id);
                  setIsAddModalOpen(true);
                }}
              />
            );
          })}

          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="group flex min-h-[250px] items-center justify-center rounded-[24px] border border-dashed border-white/10 bg-white/[0.03] p-6 text-center shadow-[0_16px_50px_rgba(0,0,0,0.18)] backdrop-blur-xl transition duration-250 hover:-translate-y-1 hover:border-pink-300/25 hover:bg-white/[0.06]"
          >
            <div>
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/10 text-3xl text-white/80 transition group-hover:scale-105">
                +
              </div>
              <h3 className="mt-5 text-xl font-light tracking-[0.2em] text-white">Create Playlist</h3>
              <p className="mt-3 text-sm leading-7 text-white/65">Start a new collection for a season, a place, or a feeling.</p>
            </div>
          </button>
        </section>
      </div>

      <button
        type="button"
        onClick={() => setIsAddModalOpen(true)}
        className="fixed bottom-24 right-4 z-[120] rounded-full border border-white/20 bg-black/40 px-5 py-2.5 text-xs tracking-[0.35em] text-white backdrop-blur-xl transition hover:bg-white/10 sm:bottom-28 sm:right-6"
      >
        ADD SONG
      </button>

      {isAddModalOpen ? (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 px-4 py-6 backdrop-blur-md">
          <div className="w-full max-w-3xl rounded-[32px] border border-white/10 bg-[#090b13]/95 p-5 shadow-[0_30px_90px_rgba(0,0,0,0.4)] sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.35em] text-pink-200/70">Add to your soundtrack</p>
                <h2 className="mt-2 text-2xl font-light tracking-[0.2em] text-white">Choose a song for your shared story</h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setQuery("");
                  setResults([]);
                  setError(null);
                }}
                className="rounded-full border border-white/10 bg-white/10 px-3 py-2 text-sm text-white/70"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
              <label className="text-[10px] uppercase tracking-[0.35em] text-pink-200/70">Choose a playlist</label>
              <select
                value={selectedPlaylistId}
                onChange={(event) => setSelectedPlaylistId(event.target.value)}
                className="mt-3 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none"
              >
                {playlists.map((playlist) => (
                  <option key={playlist.id} value={playlist.id} className="bg-[#090b13] text-white">
                    {playlist.title}
                  </option>
                ))}
                <option value="__create__" className="bg-[#090b13] text-white">
                  + Create New Playlist
                </option>
              </select>

              {selectedPlaylistId === "__create__" ? (
                <div className="mt-4 space-y-3">
                  <input
                    value={newPlaylistTitle}
                    onChange={(event) => setNewPlaylistTitle(event.target.value)}
                    placeholder="Playlist title"
                    className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-white/40"
                  />
                  <textarea
                    value={newPlaylistDescription}
                    onChange={(event) => setNewPlaylistDescription(event.target.value)}
                    placeholder="What feeling does this playlist hold?"
                    className="min-h-[90px] w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-white/40"
                  />
                  <button
                    type="button"
                    onClick={handleCreatePlaylist}
                    disabled={creatingPlaylist || !newPlaylistTitle.trim()}
                    className="rounded-full border border-pink-300/20 bg-pink-400/10 px-4 py-2 text-sm text-pink-100 transition disabled:opacity-50"
                  >
                    {creatingPlaylist ? "Creating..." : "Create Playlist"}
                  </button>
                </div>
              ) : null}
            </div>

            <div className="mt-6">
              <PlaylistSearch
                value={query}
                onChange={setQuery}
                results={results}
                loading={loading}
                error={error}
                emptyState={emptyState}
                onAddTrack={handleAddTrack}
                onRetry={() => setSearchVersion((current) => current + 1)}
                disabled={isSaving}
              />
            </div>
          </div>
        </div>
      ) : null}

      {isCreateModalOpen ? (
        <div className="fixed inset-0 z-[220] flex items-center justify-center bg-black/80 px-4 py-6 backdrop-blur-md">
          <div className="w-full max-w-md rounded-[32px] border border-white/10 bg-[#090b13]/95 p-5 shadow-[0_30px_90px_rgba(0,0,0,0.4)] sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.35em] text-pink-200/70">Create a playlist</p>
                <h2 className="mt-2 text-2xl font-light tracking-[0.2em] text-white">Start a new collection</h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setNewPlaylistTitle("");
                  setNewPlaylistDescription("");
                }}
                className="rounded-full border border-white/10 bg-white/10 px-3 py-2 text-sm text-white/70"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 space-y-3">
              <input
                value={newPlaylistTitle}
                onChange={(event) => setNewPlaylistTitle(event.target.value)}
                placeholder="Playlist title"
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-white/40"
              />
              <textarea
                value={newPlaylistDescription}
                onChange={(event) => setNewPlaylistDescription(event.target.value)}
                placeholder="What feeling does this playlist hold?"
                className="min-h-[100px] w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-white/40"
              />
              <button
                type="button"
                onClick={handleCreatePlaylist}
                disabled={creatingPlaylist || !newPlaylistTitle.trim()}
                className="rounded-full border border-pink-300/20 bg-pink-400/10 px-4 py-2 text-sm text-pink-100 transition disabled:opacity-50"
              >
                {creatingPlaylist ? "Creating..." : "Create Playlist"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default PlaylistPage;
