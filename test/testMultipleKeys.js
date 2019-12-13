const parallel = require('mocha.parallel');
const TeemoJS = require("../src");
const assert = require("assert");

// No API key access.
parallel('TeemoJS Multiple Keys', function() {
  this.slow(1500);

  let api;
  before(function() {
    let apiKey = process.env.RIOT_API_KEY;
    let tftKey = process.env.TFT_API_KEY;
    if (!apiKey || !tftKey)
      throw new Error('Must set RIOT_API_KEY in environment.');

    // Makes a deep copy.
    const config = JSON.parse(JSON.stringify(TeemoJS.defaultConfig));
    config.key = apiKey;
    config.endpoints.tft['*'] = { key: tftKey };
    config.maxConcurrent = 10;
    api = TeemoJS(config);
  });

  it('gets tft challenger league', async function() {
    const data = await api.req('euw', 'tft.leagueV1.getChallengerLeague');
    assert.ok(data);
    assert.ok(data.entries.length >= 10); // Should be a lot more.
  });
  it('gets lol challenger league', async function() {
    const data = await api.req('euw', 'lol.leagueV4.getChallengerLeague', 'RANKED_SOLO_5x5')
    assert.ok(data);
    assert.ok(data.entries.length >= 10);
  })
});