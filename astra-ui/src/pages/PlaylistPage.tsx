import { useEffect, useMemo, useState } from "react";
import FloatingMusicBackground from "../components/FloatingMusicBackground";
import PlaylistCard from "../components/PlaylistCard";
import { playlistService, type PlaylistModel, type PlaylistTrackModel } from "../services/playlistService";

interface PlaylistSummary {
  trackCount: number;
  totalDuration: number;
  lastAddedSong: string | null;
}

function PlaylistPage() {
  const [playlists, setPlaylists] = useState<PlaylistModel[]>([]);
  const [playlistSummaries, setPlaylistSummaries] = useState<Record<string, PlaylistSummary>>({});
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string>("");
  const [newPlaylistTitle, setNewPlaylistTitle] = useState("");
  const [newPlaylistDescription, setNewPlaylistDescription] = useState("");
  const [creatingPlaylist, setCreatingPlaylist] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<PlaylistTrackModel | null>(null);
  const [trackNote, setTrackNote] = useState("");

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
        window.setTimeout(() => {
          setPlaylistSummaries(Object.fromEntries(summaries));
        }, 0);
      }
    }

    void loadSummaries();

    return () => {
      active = false;
    };
  }, [playlists]);

  async function handleAddTrack(track: PlaylistTrackModel, note: string) {
    if (!selectedPlaylistId) return;

    try {
      await playlistService.addTrackToPlaylist(
        selectedPlaylistId,
        {
          trackId: track.id,
          sourceUrl: track.sourceUrl,
          songTitle: track.songTitle,
          artist: track.artist,
          album: track.album,
          albumArt: track.albumArt,
          duration: track.duration,
          previewUrl: track.previewUrl,
        },
        note,
        "You"
      );

      setSelectedTrack(null);
      setTrackNote("");
      setError(null);
      setIsAddModalOpen(false);
    } catch {
      setError("Unable to save this song to your soundtrack right now.");
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
    } catch {
      setError("Unable to create that playlist right now.");
    } finally {
      setCreatingPlaylist(false);
    }
  }

  function updateSelectedTrack(nextValues: Partial<PlaylistTrackModel>) {
    setSelectedTrack((current) => ({
      id: current?.id || "",
      trackId: current?.trackId || "",
      sourceUrl: current?.sourceUrl || "",
      songTitle: current?.songTitle || "",
      artist: current?.artist || "",
      album: current?.album || "",
      albumArt: current?.albumArt || "",
      duration: current?.duration || 0,
      previewUrl: current?.previewUrl ?? null,
      addedBy: current?.addedBy || "You",
      addedAt: current?.addedAt || new Date().toISOString(),
      personalNote: current?.personalNote ?? null,
      ...nextValues,
    }));
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
                  setSelectedTrack(null);
                  setTrackNote("");
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

            <div className="mt-6 rounded-[28px] border border-white/10 bg-white/[0.04] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.24)] backdrop-blur-xl sm:p-6">
              <p className="text-[10px] uppercase tracking-[0.35em] text-pink-200/70">Add a song manually</p>
              <p className="mt-3 text-sm leading-7 text-white/70">
                Choose a playlist and enter the song details you want to remember.
              </p>
              {error ? <p className="mt-3 text-sm text-amber-200">{error}</p> : null}
              <div className="mt-4 space-y-3">
                <input
                  value={selectedTrack?.songTitle || ""}
                  onChange={(event) => updateSelectedTrack({ songTitle: event.target.value })}
                  placeholder="Song title"
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-white/40"
                />
                <input
                  value={selectedTrack?.artist || ""}
                  onChange={(event) => updateSelectedTrack({ artist: event.target.value })}
                  placeholder="Artist"
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-white/40"
                />
                <input
                  value={selectedTrack?.album || ""}
                  onChange={(event) => updateSelectedTrack({ album: event.target.value })}
                  placeholder="Album"
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-white/40"
                />
                <textarea
                  value={trackNote}
                  onChange={(event) => setTrackNote(event.target.value)}
                  placeholder="Why is this song part of your story?"
                  className="min-h-[90px] w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-white/40"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  if (!selectedTrack) {
                    setSelectedTrack({
                      id: "",
                      trackId: "",
                      sourceUrl: "",
                      songTitle: "",
                      artist: "",
                      album: "",
                      albumArt: "",
                      duration: 0,
                      previewUrl: null,
                      addedBy: "You",
                      addedAt: new Date().toISOString(),
                      personalNote: null,
                    });
                    return;
                  }
                  handleAddTrack(selectedTrack, trackNote);
                }}
                className="mt-4 rounded-full border border-pink-300/30 bg-pink-400/20 px-4 py-2 text-sm text-pink-100 transition hover:bg-pink-400/30"
              >
                Add song
              </button>
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
