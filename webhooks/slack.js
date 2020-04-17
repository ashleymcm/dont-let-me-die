const axios = require('axios').default;

exports.sendMessage = async data => {
    try {
        let res = await axios({
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'post',
            url: process.env.SLACK_WEBHOOK_URL,
            data: data
        });
        return res.status == 200;
    }
    catch(error) {
        console.log(error.response.status)
        return false;
    }
};