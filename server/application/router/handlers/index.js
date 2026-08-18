const useCreateOrderHandler = require('./orderHandlers/useCreateOrderHandler');
const useGetOrdersByUserHandler = require('./orderHandlers/useGetOrdersByUserHandler');
const useCancelOrderHandler = require('./orderHandlers/useCancelOrderHandler');
const useGetProductListHandler = require('./catalogHandlers/useGetProductListHandler');
const useGetProductHandler = require('./catalogHandlers/useGetProductHandler');

module.exports = {
    useCreateOrderHandler,
    useGetOrdersByUserHandler,
    useCancelOrderHandler,
    useGetProductListHandler,
    useGetProductHandler,
};