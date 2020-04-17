const axios = require('axios').default;

exports.sendMessage = async data => {
    try {
        let res = await axios.post('http://localhost:5000/incoming', data);
        return res.status == 200;
    }
    catch(error) {
        return false;
    }
};