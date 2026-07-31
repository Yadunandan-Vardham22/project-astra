const { env } = require('./lib/config/env');
const credentials = Buffer.from(env.spotify.clientId + ':' + env.spotify.clientSecret).toString('base64');

fetch('https://accounts.spotify.com/api/token', {
  method: 'POST',
  headers: {
    Authorization: `Basic ${credentials}`,
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  body: 'grant_type=client_credentials',
})
  .then(async (res) => {
    console.log('status', res.status);
    const text = await res.text();
    console.log(text);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
