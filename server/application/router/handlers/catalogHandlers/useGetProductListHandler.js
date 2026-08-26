module.exports = (mediator, answer, common) => {
    const { GET_PRODUCT_LIST } = mediator.getEventTypes();

    return async (req, res) => {

        const response = await mediator.call(GET_PRODUCT_LIST);
        res.json(response);
    };
};