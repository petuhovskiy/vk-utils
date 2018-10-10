const https = require('https')

const parseJSON = (x) => JSON.parse(x);

const httpsGet = (url) => {
    return new Promise((resolve, reject) => {
        https.get(url, res => {
            let data = '';
            res.setEncoding('utf8');
            res.on('data', d => { data += d });
            res.on('end', e => resolve(data));
        }).on('error', e => reject(e))
    })
}

const api = {
    users: {
        get: ids => httpsGet(`https://api.vk.com/method/users.get?v=5.52&access_token=d3005f52d3005f52d3005f525dd34e527edd300d3005f5288bda38d60df6ce4380386de&fields=photo_200,photo_100,photo_50&name_case=Nom&user_ids=${ids.join(',')}`).then(parseJSON)
    },
    friends: {
        get: id => httpsGet(`https://api.vk.com/method/friends.get?v=5.52&access_token=d3005f52d3005f52d3005f525dd34e527edd300d3005f5288bda38d60df6ce4380386de&user_id=${id}`).then(parseJSON)
    }
};

module.exports = api;
