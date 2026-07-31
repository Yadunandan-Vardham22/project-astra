import express from "express";
import {logger} from "firebase-functions/v2";
import {onRequest} from "firebase-functions/v2/https";
import {searchTracks} from "./spotify.api";
import {badRequest, internalError, success} from "../utils/response";

const app = express();

function getAllowedOrigins(): string[] {
  const configuredOrigins = process.env.ALLOWED_ORIGINS || "";

  return configuredOrigins
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)
    .concat(["http://localhost:5173"]);
}

function isOriginAllowed(origin: string | undefined): boolean {
  if (!origin) {
    return true;
  }

  return getAllowedOrigins().includes(origin);
}

app.use((request, response, next) => {
  const origin = request.get("Origin");

  if (origin && isOriginAllowed(origin)) {
    response.setHeader("Access-Control-Allow-Origin", origin);
    response.setHeader("Vary", "Origin");
  }

  response.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept");

  if (request.method === "OPTIONS") {
    response.status(204).end();
    return;
  }

  next();
});

/**
 * Handles Spotify track search requests.
 *
 * @param {express.Request} request The incoming request.
 * @param {express.Response} response The outgoing response.
 * @return {Promise<void>} Resolves after sending the response.
 */
async function handleSpotifySearch(
  request: express.Request,
  response: express.Response
): Promise<void> {
  if (request.method !== "GET") {
    response.status(405).json(
      badRequest("Only GET requests are supported.", "method_not_allowed")
    );
    return;
  }

  const rawQuery = typeof request.query.q === "string" ? request.query.q : "";
  const query = rawQuery.trim();

  logger.info("Incoming Spotify search request", {queryLength: query.length});

  if (!query || query.length < 2) {
    response.status(400).json(
      badRequest(
        "Query parameter q must be at least 2 characters long.",
        "invalid_query"
      )
    );
    return;
  }

  try {
    const startedAt = Date.now();
    const tracks = await searchTracks(query);
    const durationMs = Date.now() - startedAt;

    logger.info("Spotify search completed", {
      durationMs,
      resultCount: tracks.length,
    });

    response.status(200).json(success({tracks}, "Spotify search completed"));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    logger.error("Spotify search failed", {errorMessage});

    response.status(500).json(
      internalError("Failed to search Spotify", "spotify_search_failed")
    );
  }
}

app.get("/search", handleSpotifySearch);

/**
 * Exposes the Spotify search endpoint for deployment.
 */
export const spotify = onRequest({region: "us-central1"}, app);
