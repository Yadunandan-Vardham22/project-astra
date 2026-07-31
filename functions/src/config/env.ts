import {existsSync, readFileSync} from "node:fs";
import {resolve} from "node:path";

function loadEnvFile(): void {
  const envFilePath = resolve(__dirname, "../../.env");

  if (!existsSync(envFilePath)) {
    return;
  }

  const content = readFileSync(envFilePath, "utf8");

  for (const line of content.split(/\r?\n/)) {
    const trimmedLine = line.trim();

    if (!trimmedLine || trimmedLine.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmedLine.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmedLine.slice(0, separatorIndex).trim();
    const rawValue = trimmedLine.slice(separatorIndex + 1).trim();

    if (!key || process.env[key] !== undefined) {
      continue;
    }

    const normalizedValue = rawValue.replace(/^['"]|['"]$/g, "");
    process.env[key] = normalizedValue;
  }
}

loadEnvFile();

/**
 * Reads a required environment variable.
 *
 * @param {string} name The variable name to read.
 * @return {string} The resolved environment variable value.
 */
function getEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

export const env = {
  spotify: {
    clientId: getEnv("SPOTIFY_CLIENT_ID"),
    clientSecret: getEnv("SPOTIFY_CLIENT_SECRET"),
  },
};
