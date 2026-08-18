module.exports = (mediator, answer, common) => {
    const { GET_PRODUCT } = mediator.getEventTypes();

    return async (req, res) => {
        const { guid, productId } = req.body;
        
        if (!common.checkGuid(guid)) {
            return res.json(answer.bad(242));
        }

        if (!productId) {
            return res.json(answer.bad(242));
        }

        const response = await mediator.call(GET_PRODUCT, { guid, productId });
        res.json(response);
    };
};