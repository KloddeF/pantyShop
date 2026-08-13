module.exports = (mediator, answer, common) => {
    const { CREATE_ORDER } = mediator.getEventTypes();

    return async (req, res) => {
        const { guid, products } = req.body;
        
        if (!common.checkGuid(guid)) {
            return res.json(answer.bad(242));
        }

        const response = await mediator.call(CREATE_ORDER, { guid, products });
        res.json(response);
    };
};