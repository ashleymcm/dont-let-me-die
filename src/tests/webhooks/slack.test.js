const nock = require('nock');
const SlackWebhook = require("../../../webhooks/slack");

describe('Slack Webhook Tests', () => {
    const parseUrlForNock = (url) => {
        let urlObj = new URL(url);
        let host = `${urlObj.protocol}//${urlObj.hostname}`;
        let path = urlObj.pathname;
        return [host, path];
    };

    const [host, path] = parseUrlForNock(process.env.SLACK_WEBHOOK_URL);

    const nockSendMessage = (responseCode) => {
        nock(host)
            .defaultReplyHeaders({ 'access-control-allow-origin': '*' })
            .post(path)
            .reply(responseCode)
    };

    beforeAll = () => {

    };

    afterAll = () => {

    };

    beforeEach = () => {

    };

    afterEach = () => {

    };

    it("returns true when post to Slackbot is successful", async () => {
        nockSendMessage(200);
        const res = await SlackWebhook.sendMessage({message: "dummyMessage", emergency: false});
        expect(res).toBeTruthy();
    });

    it("returns false when post to Slackbot results in 400", async () => {
        nockSendMessage(400);
        const res = await SlackWebhook.sendMessage({message: "dummyMessage", emergency: false});
        expect(res).toBeFalsy();
    });

    it("returns false when post to Slackbot results in 500", async () => {
        nockSendMessage(500);
        const res = await SlackWebhook.sendMessage({message: "dummyMessage", emergency: false});
        expect(res).toBeFalsy();
    });
});
