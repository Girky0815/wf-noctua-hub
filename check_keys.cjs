const fs = require('fs');
try {
  const data = fs.readFileSync('status.json', 'utf8');
  const json = JSON.parse(data);
  console.log('Top level keys:', Object.keys(json));

  if (json.vaultTrader) {
    console.log('vaultTrader found:');
    console.log('  active:', json.vaultTrader.active);
    console.log('  inventory length:', json.vaultTrader.inventory ? json.vaultTrader.inventory.length : 0);
    console.log('  activation:', json.vaultTrader.activation);
    console.log('  expiry:', json.vaultTrader.expiry);
    console.log('Full object (start):', JSON.stringify(json.vaultTrader, null, 2).substring(0, 500));
  } else {
    console.log('vaultTrader not found');
  }

  if (json.voidTrader) {
    console.log('voidTrader:', JSON.stringify(json.voidTrader, null, 2).substring(0, 500));
  }

  // Check for any key that looks like it might be resurgence
  Object.keys(json).forEach(key => {
    if (key.toLowerCase().includes('prime') || key.toLowerCase().includes('resurgence') || key.toLowerCase().includes('trader')) {
      console.log(`Found potential key: ${key}`);
    }
  });

} catch (e) {
  console.error(e);
}
