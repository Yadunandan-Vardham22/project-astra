import {
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export interface PlaylistModel {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlaylistTrackModel {
  id: string;
  trackId: string;
  sourceUrl: string;
  songTitle: string;
  artist: string;
  album: string;
  albumArt: string;
  duration: number;
  previewUrl?: string | null;
  addedBy: string;
  addedAt: string;
  personalNote?: string | null;
}

function getNow() {
  return new Date().toISOString();
}

export const playlistService = {
  async getPlaylists() {
    const q = query(collection(db, "playlists"), orderBy("updatedAt", "desc"));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((item) => ({
      id: item.id,
      ...(item.data() as Omit<PlaylistModel, "id">),
    })) as PlaylistModel[];
  },

  subscribeToPlaylists(callback: (playlists: PlaylistModel[]) => void) {
    const q = query(collection(db, "playlists"), orderBy("updatedAt", "desc"));

    return onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((item) => ({
        id: item.id,
        ...(item.data() as Omit<PlaylistModel, "id">),
      })) as PlaylistModel[];

      callback(items);
    });
  },

  async createPlaylist(input: { title: string; description?: string; coverImage?: string }) {
    const playlistRef = doc(collection(db, "playlists"));
    const playlist: PlaylistModel = {
      id: playlistRef.id,
      title: input.title.trim(),
      description: input.description?.trim() || "A new chapter in our soundtrack.",
      coverImage:
        input.coverImage ||
        "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80",
      createdBy: "You",
      createdAt: getNow(),
      updatedAt: getNow(),
    };

    await setDoc(playlistRef, playlist);
    return playlist;
  },

  async getPlaylistTracks(playlistId: string) {
    const q = query(collection(db, "playlists", playlistId, "tracks"), orderBy("addedAt", "desc"));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((item) => ({
      id: item.id,
      ...(item.data() as Omit<PlaylistTrackModel, "id">),
    })) as PlaylistTrackModel[];
  },

  async addTrackToPlaylist(
    playlistId: string,
    track: Omit<PlaylistTrackModel, "id" | "addedAt" | "addedBy"> & { addedBy?: string },
    personalNote: string,
    addedBy: string
  ) {
    const playlistRef = collection(db, "playlists", playlistId, "tracks");
    const snapshot = await getDocs(playlistRef);
    const alreadyExists = snapshot.docs.some((item) => item.data().trackId === track.trackId);

    if (alreadyExists) {
      return null;
    }

    const payload: PlaylistTrackModel = {
      id: "",
      trackId: track.trackId,
      sourceUrl: track.sourceUrl,
      songTitle: track.songTitle,
      artist: track.artist,
      album: track.album,
      albumArt: track.albumArt,
      duration: track.duration,
      previewUrl: track.previewUrl,
      addedBy: addedBy || "You",
      addedAt: getNow(),
      personalNote: personalNote.trim() || null,
    };

    const trackRef = await addDoc(playlistRef, payload);
    await updateDoc(doc(db, "playlists", playlistId), {
      updatedAt: getNow(),
    });

    return {
      ...payload,
      id: trackRef.id,
    } as PlaylistTrackModel;
  },

  subscribeToPlaylistTracks(playlistId: string, callback: (tracks: PlaylistTrackModel[]) => void) {
    const q = query(collection(db, "playlists", playlistId, "tracks"), orderBy("addedAt", "desc"));

    return onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((item) => ({
        id: item.id,
        ...(item.data() as Omit<PlaylistTrackModel, "id">),
      })) as PlaylistTrackModel[];

      callback(items);
    });
  },
};
