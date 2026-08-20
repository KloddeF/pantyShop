const express = require('express');
const router = express.Router();

const {
    useCreateOrderHandler,
    useGetOrdersByUserHandler,
    useCancelOrderHandler,
    useGetProductListHandler,
    useGetProductHandler,
    useCreateProductHandler,
    useChangeProductHandler,
    useChangeOrderStatusHandler,
    useGetDictionariesHandler,
    useAddDictionaryDataHandler,
    useDeleteDictionaryDataHandler,

} = require('./handlers');

function Router(mediator, answer, common) {
    // ============ ORDER ROUTES ============
    router.post('/createOrder', useCreateOrderHandler(mediator, answer, common));
    router.post('/getOrdersByUser', useGetOrdersByUserHandler(mediator, answer, common));
    router.post('/cancelOrder', useCancelOrderHandler(mediator, answer, common));

    // ============ CATALOG ROUTES ============
    router.post('/getProductList', useGetProductListHandler(mediator, answer, common));
    router.post('/getProduct', useGetProductHandler(mediator, answer, common));

    // ============ ADMIN ROUTES ============
    router.post('/createProduct', useCreateProductHandler(mediator, answer, common));
    router.post('/changeProduct', useChangeProductHandler(mediator, answer, common));
    router.post('/changeOrderStatus', useChangeOrderStatusHandler(mediator, answer, common));
    router.post('/getDictionaries', useGetDictionariesHandler(mediator, answer, common));
    router.post('/addDictionaryData', useAddDictionaryDataHandler(mediator, answer, common));
    router.post('/deleteDictionaryData', useDeleteDictionaryDataHandler(mediator, answer, common));

    // ============ NOT FOUND ============
    router.all('/*path', (_, res) => {
        res.json(answer.bad(404));
    });


    return router;
}

module.exports = Router;