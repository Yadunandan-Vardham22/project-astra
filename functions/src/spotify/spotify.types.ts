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
