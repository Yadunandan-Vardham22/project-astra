import {logger} from "firebase-functions/v2";
import {spotifyService} from "./spotify.service";
import type {SpotifyTrack} from "./spotify.types";

interface SpotifySearchApiResponse {
  tracks?: {
    items?: Array<{
      id: string;
      name: string;
      artists?: Array<{name: string}>;
      album?: {
        name: string;
        images?: Array<{url: string}>;
      };
      duration_ms?: number;
      preview_url?: string | null;
      external_urls?: {
        spotify?: string;
      };
      explicit?: boolean;
      popularity?: number;
    }>;
    total?: number;
  };
}

/**
 * Searches Spotify for tracks and returns a simplified payload.
 *
 * @param {string} query The search query.
 * @return {Promise<SpotifyTrack[]>} Matching tracks.
 */
export async function searchTracks(query: string): Promise<SpotifyTrack[]> {
  const token = await spotifyService.getAccessToken();
  const params = new URLSearchParams({
    q: query,
    type: "track",
    limit: "20",
  });

  const response = await fetch(
    `https://api.spotify.com/v1/search?${params.toString()}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    }
  );

  if (!response.ok) {
    const errorBody = await response.text();
    logger.error("Spotify API request failed", {status: response.status, errorBody});
    throw new Error(`Spotify search failed with status ${response.status}: ${errorBody}`);
  }

  const payload = (await response.json()) as SpotifySearchApiResponse;
  const items = payload.tracks?.items ?? [];

  return items.map((item) => {
    const artists = (item.artists ?? []).map((artist) => artist.name);

    return {
      id: item.id,
      title: item.name,
      artist: artists[0] ?? "",
      album: item.album?.name ?? "",
      albumImage: item.album?.images?.[0]?.url ?? null,
      duration: Math.round((item.duration_ms ?? 0) / 1000),
      previewUrl: item.preview_url ?? null,
      spotifyUrl: item.external_urls?.spotify ?? "",
      explicit: item.explicit ?? false,
      popularity: item.popularity ?? 0,
    };
  });
}
