const express = require('express');
const router = express.Router();

const { TEST1 } = require('../../config');

const {
    useTestHandler
    //..useHandlers

} = require('./handlers');

function Router(mediator, answer, common) {
    // ============ LOBBY ROUTES ============
    router.post(TEST1.TEST, useTestHandler(mediator, answer, common));

    // ============ NOT FOUND ============
    router.all('/*path', (_, res) => {
        res.json(answer.bad(404));
    });


    return router;
}

module.exports = Router;