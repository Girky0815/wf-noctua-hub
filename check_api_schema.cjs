const https = require('https');

https.get('https://api.warframestat.us/pc', (resp) => {
  let data = '';

  resp.on('data', (chunk) => {
    data += chunk;
  });

  resp.on('end', () => {
    try {
      const json = JSON.parse(data);
      console.log('Keys:', Object.keys(json));
      if (json.primeResurgence) console.log('primeResurgence found');
      if (json.vaultTraders) console.log('vaultTraders found');
      if (json.voidTrader) console.log('voidTrader found');
    } catch (e) {
      console.error(e.message);
    }
  });

}).on("error", (err) => {
  console.log("Error: " + err.message);
});
