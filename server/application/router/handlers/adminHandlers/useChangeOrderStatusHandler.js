module.exports = (mediator, answer, common) => {
    const { CHANGE_ORDER_STATUS } = mediator.getEventTypes();

    return async (req, res) => {
        const { guid, orderId, statusId } = req.body;
        
        if (!common.checkGuid(guid)) {
            return res.json(answer.bad(242));
        }

        if (!orderId || !statusId) {
            return res.json(answer.bad(242));
        }

        const response = await mediator.call(CHANGE_ORDER_STATUS, { guid, orderId, statusId });
        res.json(response);
    };
};