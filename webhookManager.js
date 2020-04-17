// add code that controls how often we ping external biometric apis
require('dotenv').config();
const Dexcom = require ("./biometrics/dexcom-g6");
const SlackWebhook = require("./webhooks/slack");

/* TODO: accept call to turn on listening */
/* TODO: accept call to turn off listening */

let strikes = 0;

const addStrike = () => {
    strikes++;
};

const resetStrikes = () => {
    strikes = 0;
};

const sendDexcomReading = async (message, emergency) => {
    const sendMessage = await SlackWebhook.sendMessage({
        message: message,
        emergency: emergency
    });

    if (sendMessage) resetStrikes();
    else addStrike();
};

const handleDexcomReading = reading => {
    if (!reading) {
        strikes++;
    }
    else if (reading <= 2.4) {
        sendDexcomReading(`Uh oh this is bad: glucose is ${reading.toFixed(1)}.`, true);
    }
    else if (reading <= 3.0) {
        sendDexcomReading(`Need to get sugar now before it gets serious: glucose is ${reading.toFixed(1)}.`, false);
    }
    else if (reading <= 3.9) {
        sendDexcomReading(`Need to chill for a few mins: glucose is ${reading.toFixed(1)}.`, false);
    }
};

const dexcomListener = setInterval(async () => {
    // three strikes and you're out?
    if (strikes > 2) {
        // STOP STUFF I GUESS
        return;
    }
    const reading = await Dexcom.getDummyGlucoseReading();
    handleDexcomReading(reading);
}, 5000);

