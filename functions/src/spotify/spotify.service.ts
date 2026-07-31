import {env} from "../config/env";

interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

/**
 * Handles Spotify access token issuance and caching.
 */
class SpotifyService {
  private accessToken: string | null = null;
  private expiresAt = 0;

  /**
   * Retrieves a fresh Spotify access token using the client credentials flow.
   *
   * @return {Promise<string>} A valid access token.
   */
  private async fetchAccessToken(): Promise<string> {
    const credentials = Buffer.from(
      `${env.spotify.clientId}:${env.spotify.clientSecret}`
    ).toString("base64");

    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });

    if (!response.ok) {
      throw new Error("Failed to authenticate with Spotify");
    }

    const data = (await response.json()) as SpotifyTokenResponse;

    this.accessToken = data.access_token;

    // Refresh one minute before expiry.
    this.expiresAt = Date.now() + (data.expires_in - 60) * 1000;

    return this.accessToken;
  }

  /**
   * Returns a cached Spotify access token when available.
   *
   * @return {Promise<string>} A cached or refreshed access token.
   */
  async getAccessToken(): Promise<string> {
    if (this.accessToken && Date.now() < this.expiresAt) {
      return this.accessToken;
    }

    return this.fetchAccessToken();
  }
}

export const spotifyService = new SpotifyService();
