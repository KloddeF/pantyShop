module.exports = (mediator, answer, common) => {
    const { ADD_DICTIONARY_DATA } = mediator.getEventTypes();

    return async (req, res) => {
        const { guid, dictionary, data } = req.body;
        
        if (!common.checkGuid(guid)) {
            return res.json(answer.bad(242));
        }

        if (!dictionary || !data) {
            return res.json(answer.bad(242));
        }

        const response = await mediator.call(ADD_DICTIONARY_DATA, { guid, dictionary, data });
        res.json(response);
    };
};