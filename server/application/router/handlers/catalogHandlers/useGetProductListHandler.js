module.exports = (mediator, answer, common) => {
    const { GET_PRODUCT_LIST } = mediator.getEventTypes();

    return async (req, res) => {
        const { guid } = req.body;
        
        if (!common.checkGuid(guid)) {
            return res.json(answer.bad(242));
        }

        const response = await mediator.call(GET_PRODUCT_LIST, { guid });
        res.json(response);
    };
};