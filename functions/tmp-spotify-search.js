const { env } = require('./lib/config/env');
const credentials = Buffer.from(env.spotify.clientId + ':' + env.spotify.clientSecret).toString('base64');

async function main() {
  const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  const tokenJson = await tokenRes.json();
  const accessToken = tokenJson.access_token;

  const searchRes = await fetch('https://api.spotify.com/v1/search?q=shape&type=track&limit=20', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
      'User-Agent': 'Mozilla/5.0',
    },
  });

  console.log('search status', searchRes.status);
  const body = await searchRes.text();
  console.log(body);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
