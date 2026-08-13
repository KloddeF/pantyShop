module.exports = (mediator, answer, common) => {
    const { CANCEL_ORDER } = mediator.getEventTypes();

    return async (req, res) => {
        const { guid, orderId } = req.body;
        
        if (!common.checkGuid(guid)) {
            return res.json(answer.bad(242));
        }

        if (!orderId) {
            return res.json(answer.bad(242));
        }

        const response = await mediator.call(CANCEL_ORDER, { guid, orderId });
        res.json(response);
    };
};