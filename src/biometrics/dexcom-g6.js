// all the methods we need to ping the dexcom api
const axios = require('axios').default;
const qs = require("qs");

exports.parseLatestReading = data => {

};

exports.refreshToken = async () => {
    try {
        const data = {
            'client_id': process.env.DEXCOM_CLIENT_ID,
            'client_secret': process.env.DEXCOM_CLIENT_SECRET,
            'refresh_token': process.env.DEXCOM_REFRESH_TOKEN,
            'grant_type': 'refresh_token',
            'redirect_uri': process.env.DEXCOM_REDIRECT_URI
        };

        let res = await axios({
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'cache-control': 'no-cache'
            },
            method: 'post',
            url: process.env.DEXCOM_HOST_URL + process.env.DEXCOM_REFRESH_TOKEN_PATH,
            data: qs.stringify(data)
        });
        return res.status == 200;
    }
    catch(error) {
        return false;
    }
};

exports.getLatestGlucoseReading = async () => {
    try {
        const params = {
            startDate: '2017-06-16T15:30:00',
            endDate: '2017-06-16T15:30:00'
        };

        let res = await axios({
            headers: {
                'authorization': `Bearer ${process.env.DEXCOM_AUTH_TOKEN}`
            },
            method: 'post',
            url: process.env.DEXCOM_HOST_URL + process.env.DEXCOM_GET_EGVS_PATH,
            params: params,
            withCredentials: false
        });
        return res.status == 200;
    }
    catch(error) {
        return false;
    }
};

exports.getDummyGlucoseReading = async () => {
    return Math.random() * 15;
};
