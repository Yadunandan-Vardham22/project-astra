export interface SpotifyTrackSearchResult {
  id: string;
  name: string;
  artist: string;
  album: string;
  albumArt: string;
  durationMs: number;
  spotifyUrl: string;
  previewUrl?: string | null;
}

let cachedToken: string | null = null;
let tokenExpiresAt = 0;

function getSpotifyCredentials() {
  const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID || "";
  const clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET || "";

  return { clientId, clientSecret };
}

async function getAccessToken() {
  const { clientId, clientSecret } = getSpotifyCredentials();

  if (!clientId || !clientSecret) {
    throw new Error("Spotify credentials are not configured.");
  }

  if (cachedToken && Date.now() < tokenExpiresAt) {
    return cachedToken;
  }

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    throw new Error("Unable to authenticate with Spotify.");
  }

  const data = await response.json() as { access_token?: string; expires_in?: number };

  if (!data.access_token) {
    throw new Error("Spotify returned no access token.");
  }

  cachedToken = data.access_token;
  tokenExpiresAt = Date.now() + (data.expires_in ? data.expires_in * 1000 - 30000 : 0);

  return cachedToken;
}

function formatDuration(durationMs: number) {
  const totalSeconds = Math.floor(durationMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export const spotifyService = {
  async searchTracks(query: string): Promise<SpotifyTrackSearchResult[]> {
    if (!query.trim()) return [];

    const token = await getAccessToken();

    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=8`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Spotify search failed.");
    }

    const data = await response.json() as {
      tracks?: {
        items?: Array<{
          id: string;
          name: string;
          artists?: Array<{ name: string }>;
          album?: { name: string; images?: Array<{ url: string }> };
          duration_ms?: number;
          external_urls?: { spotify?: string };
          preview_url?: string | null;
        }>;
      };
    };

    return (data.tracks?.items || []).map((item) => ({
      id: item.id,
      name: item.name,
      artist: item.artists?.[0]?.name || "Unknown artist",
      album: item.album?.name || "Unknown album",
      albumArt: item.album?.images?.[0]?.url || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=400&q=80",
      durationMs: item.duration_ms || 0,
      spotifyUrl: item.external_urls?.spotify || "",
      previewUrl: item.preview_url || null,
    }));
  },

  async getTrack(trackId: string): Promise<SpotifyTrackSearchResult | null> {
    const token = await getAccessToken();

    const response = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return null;
    }

    const item = await response.json() as {
      id: string;
      name: string;
      artists?: Array<{ name: string }>;
      album?: { name: string; images?: Array<{ url: string }> };
      duration_ms?: number;
      external_urls?: { spotify?: string };
      preview_url?: string | null;
    };

    return {
      id: item.id,
      name: item.name,
      artist: item.artists?.[0]?.name || "Unknown artist",
      album: item.album?.name || "Unknown album",
      albumArt: item.album?.images?.[0]?.url || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=400&q=80",
      durationMs: item.duration_ms || 0,
      spotifyUrl: item.external_urls?.spotify || "",
      previewUrl: item.preview_url || null,
    };
  },

  formatDuration,
};
