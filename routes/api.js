const search = require('../vk/search');
const vkApi = require('../vk/api');
const express = require('express');
const router = express.Router();

router.get('/search', function(req, resp, next) {
    const {id1, id2} = req.query;
    if (id1 === undefined || id2 === undefined) {
        resp.send("bad request");
        return;
    }
    
    vkApi.users.get([id1, id2])
        .then(arr => {
            return [arr.response[0].id, arr.response[1].id];
        })
        .then(arr => search(arr[0], arr[1]))
        .then(res => {
            resp.send(res);
        })
});

module.exports = router;
