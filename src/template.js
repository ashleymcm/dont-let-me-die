
/**
 * Takes a JSON object representing an alert and turns it into well
 * formatted Slack message
 * @param {object} alert - JSON representation of the alert.
 * @param {boolean} isActionable - Should message actions be shown?
 */
const fill = (alert, isActionable) => {
  isActionable = isActionable === undefined ? true : isActionable;
  let urgencyText = alert.emergency ? "🔥 Somebody should check up!" : "⚠️"

  let header_block = {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: `${urgencyText} ${alert.message}`
    },
  }

  if (isActionable) {
    // Add a claim button to the message
    header_block.accessory = {
      type: 'button',
      action_id: `claim.${alert.id}`,
      text: {
        type: 'plain_text',
        text: 'Claim'
      }
    };
  }

  let blocks = [header_block];

  return blocks;
};

module.exports = { fill };
