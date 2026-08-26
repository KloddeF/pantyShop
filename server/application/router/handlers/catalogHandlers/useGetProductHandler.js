module.exports = (mediator, answer, common) => {
    const { GET_PRODUCT } = mediator.getEventTypes();

    return async (req, res) => {
        const { productId } = req.body;
        
        if (!productId) {
            return res.json(answer.bad(242));
        }

        const response = await mediator.call(GET_PRODUCT, { productId });
        res.json(response);
    };
};