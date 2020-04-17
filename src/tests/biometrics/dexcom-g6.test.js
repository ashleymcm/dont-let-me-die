const nock = require('nock');
const Dexcom = require ("./../../biometrics/dexcom-g6");


describe('Slack Webhook Tests', () => {
    it("is a dummy test", async () => {
        expect(true).toBeTruthy();
    });

  /*  it("returns true when post successfully refreshes token", async () => {
        const res = await Dexcom.refreshToken();
        expect(res).toBeTruthy();
    });

    it("returns true when successfully gets latest egvs", async () => {
        const res = await Dexcom.getLatestGlucoseReading();
        expect(res).toBeTruthy();
    });
    */
});
