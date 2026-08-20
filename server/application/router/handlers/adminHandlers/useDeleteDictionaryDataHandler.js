module.exports = (mediator, answer, common) => {
    const { DELETE_DICTIONARY_DATA } = mediator.getEventTypes();

    return async (req, res) => {
        const { guid, dictionary, dataId } = req.body;
        
        if (!common.checkGuid(guid)) {
            return res.json(answer.bad(242));
        }

        if (!dictionary || !dataId) {
            return res.json(answer.bad(242));
        }

        const response = await mediator.call(DELETE_DICTIONARY_DATA, { guid, dictionary, dataId });
        res.json(response);
    };
};