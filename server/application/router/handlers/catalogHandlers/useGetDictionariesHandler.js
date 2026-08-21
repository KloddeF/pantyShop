module.exports = (mediator, answer, common) => {
    const { GET_DICTIONARIES } = mediator.getEventTypes();

    return async (req, res) => {
        const { guid } = req.body;
        
        if (!common.checkGuid(guid)) {
            return res.json(answer.bad(242));
        }

        const response = await mediator.call(GET_DICTIONARIES, { guid });
        res.json(response);
    };
};