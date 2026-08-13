const express = require('express');
const router = express.Router();

const {
    useCreateOrderHandler,
    useGetOrdersByUserHandler,
    useCancelOrderHandler,

} = require('./handlers');

function Router(mediator, answer, common) {
    // ============ ORDER ROUTES ============
    router.post('/createOrder', useCreateOrderHandler(mediator, answer, common));
    router.post('/getOrdersByUser', useGetOrdersByUserHandler(mediator, answer, common));
    router.post('/cancelOrder', useCancelOrderHandler(mediator, answer, common));

    // ============ NOT FOUND ============
    router.all('/*path', (_, res) => {
        res.json(answer.bad(404));
    });


    return router;
}

module.exports = Router;