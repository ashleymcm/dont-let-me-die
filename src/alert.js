'use strict';

const axios = require('axios');
const db = require('node-json-db');
const template = require('./template');
const qs = require('querystring');
const debug = require('debug')('actionable-notifications:alert');

const attributes = ['id', 'user', 'message', 'emergency'];
const fields = ['helper', 'status'];

// Initialize alert store
const store = new db.JsonDB('alerts', true, false);

class Alert {

  constructor(properties) {
    debug('constructor');
    for (var prop in properties) {
      if (properties.hasOwnProperty(prop)) {
        this[prop] = properties[prop];
      }
    }
  }

  updateField (field, value) {
    let update;
    if (field === 'helper') {
      update = this.setHelper(value);
    } else {
      update = Promise.reject(new Error('This field is not an alert field'));
    }
    return update.then(() => this.save());
  }

  setHelper (userId) {
    debug('setting agent');
    const helperNotification = this.chatNotify(userId, false);

    const message = `<@${userId}> to the rescue.`;
    const channelNotification = axios.post(process.env.SLACK_WEBHOOK, { text: message });

    return Promise.all([helperNotification, channelNotification]);
  }

  postToChannel (url) {
    debug('posting to channel');
    return axios.post(url || process.env.SLACK_WEBHOOK, { text: 'You have a new alert', blocks: template.fill(this), replace_original: true });
  }

  chatNotify (slackUserId, isActionable) {
    debug('notifying in chat');
    var message = template.fill(this, isActionable);
    message.unshift(
      {
        type: 'section',
        text: {
          type: 'plain_text',
          text: 'You\'ve been assigned an alert'
        }
      },
      {
        type: 'divider'
      }
    );
    axios.post('https://slack.com/api/im.open', qs.stringify({
      token: process.env.SLACK_TOKEN,
      user: slackUserId
    })).then(result => {
      if (result.data.ok) {
        const body = { token: process.env.SLACK_TOKEN, channel: result.data.channel.id, blocks: JSON.stringify(message), text: 'You have a new alert' };
        return axios.post('https://slack.com/api/chat.postMessage', qs.stringify(body));
      }
    })

  }

  save () {
    debug(`saving id: ${this.id}`);
    const properties = attributes.reduce((props, attr) => {
      props[attr] = this[attr];
      return props;
    }, { fields: this.fields });

    return new Promise((resolve, reject) => {
      store.push(`/${this.id}`, properties);
      resolve(this);
    });
  }

  static fromExternal (alertJson) {
    debug('creating from external JSON');
    const properties = { fields: {} };
    attributes.forEach((attr) => { properties[attr] = alertJson[attr]; });
    fields.forEach((field) => { properties.fields[field] = alertJson[field]; });
    const alert = new Alert(properties);
    return alert.save();
  }

  static find (id) {
    debug(`fetching id: ${id}`);
    return new Promise((resolve, reject) => {
      let properties = store.getData(`/${id}`);
      resolve(new Alert(properties));
    });
  }
}

module.exports.Alert = Alert;
