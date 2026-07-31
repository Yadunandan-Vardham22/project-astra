export interface SpotifyArtist {
  id: string;
  name: string;
}

export interface SpotifyAlbum {
  id: string;
  name: string;
  imageUrl: string | null;
}

export interface SpotifyTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  albumImage: string | null;
  duration: number;
  previewUrl: string | null;
  spotifyUrl: string;
  explicit: boolean;
  popularity: number;
}

export interface SpotifySearchResponse {
  tracks: SpotifyTrack[];
}
