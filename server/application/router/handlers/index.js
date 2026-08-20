const useCreateOrderHandler = require('./orderHandlers/useCreateOrderHandler');
const useGetOrdersByUserHandler = require('./orderHandlers/useGetOrdersByUserHandler');
const useCancelOrderHandler = require('./orderHandlers/useCancelOrderHandler');
const useGetProductListHandler = require('./catalogHandlers/useGetProductListHandler');
const useGetProductHandler = require('./catalogHandlers/useGetProductHandler');
const useCreateProductHandler = require('./adminHandlers/useCreateProductHandler');
const useChangeProductHandler = require('./adminHandlers/useChangeProductHandler');
const useChangeOrderStatusHandler = require('./adminHandlers/useChangeOrderStatusHandler');
const useGetDictionariesHandler = require('./adminHandlers/useGetDictionariesHandler');
const useAddDictionaryDataHandler = require('./adminHandlers/useAddDictionaryDataHandler');
const useDeleteDictionaryDataHandler = require('./adminHandlers/useDeleteDictionaryDataHandler');

module.exports = {
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
};