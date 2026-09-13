module.exports = (mediator, answer, common) => {
    const { GET_DICTIONARIES } = mediator.getEventTypes();

    return async (req, res) => {
        
        const response = await mediator.call(GET_DICTIONARIES);
        res.json(response);
    };
};