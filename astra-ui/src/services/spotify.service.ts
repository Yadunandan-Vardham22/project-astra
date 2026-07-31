import type { SpotifySearchResponse, SpotifyTrack } from "../types/spotify";

const FUNCTIONS_BASE_URL = import.meta.env.VITE_FUNCTIONS_BASE_URL || "";

function getFunctionsUrl(path: string): string {
  const baseUrl = FUNCTIONS_BASE_URL.trim();

  if (!baseUrl) {
    throw new Error("Firebase Functions URL is not configured.");
  }

  return `${baseUrl.replace(/\/$/, "")}${path}`;
}

function formatDuration(seconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = safeSeconds % 60;

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

function normalizeTrack(track: SpotifyTrack): SpotifyTrack {
  return {
    ...track,
    title: track.title || "Untitled track",
    artist: track.artist || "Unknown artist",
    album: track.album || "Unknown album",
    duration: track.duration || 0,
    previewUrl: track.previewUrl ?? null,
    spotifyUrl: track.spotifyUrl || "",
    explicit: Boolean(track.explicit),
    popularity: track.popularity || 0,
  };
}

export const spotifyService = {
  formatDuration,

  async searchTracks(query: string, signal?: AbortSignal): Promise<SpotifyTrack[]> {
    const trimmedQuery = query.trim();

    if (!trimmedQuery || trimmedQuery.length < 2) {
      return [];
    }

    const url = getFunctionsUrl(`/spotify/search?q=${encodeURIComponent(trimmedQuery)}`);

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        signal: signal ?? controller.signal,
      });

      if (!response.ok) {
        throw new Error("Unable to search Spotify right now. Please try again.");
      }

      const payload = (await response.json()) as
        | SpotifySearchResponse
        | { success?: boolean; data?: { tracks?: SpotifyTrack[] }; message?: string };

      const tracks = Array.isArray((payload as { data?: { tracks?: SpotifyTrack[] } }).data?.tracks)
        ? (payload as { data: { tracks: SpotifyTrack[] } }).data.tracks
        : Array.isArray((payload as SpotifySearchResponse).tracks)
          ? (payload as SpotifySearchResponse).tracks
          : [];

      return tracks.map(normalizeTrack);
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error("The search timed out. Please try again.");
      }

      if (error instanceof TypeError) {
        throw new Error("Unable to reach Spotify right now. Please try again.");
      }

      const message = error instanceof Error ? error.message : "Unable to search Spotify right now. Please try again.";
      throw new Error(message);
    } finally {
      window.clearTimeout(timeoutId);
    }
  },
};
