module.exports = (mediator, answer, common) => {
    const { CREATE_PRODUCT } = mediator.getEventTypes();

    return async (req, res) => {
        const { guid, name, price, brandId, genderId, typeId, sizeIds, colorIds, stockQuantity, description } = req.body;
        
        if (!common.checkGuid(guid)) {
            return res.json(answer.bad(242));
        }

        if (!name || !price || !brandId || !genderId || !typeId || stockQuantity === undefined) {
            return res.json(answer.bad(242));
        }

        const response = await mediator.call(CREATE_PRODUCT, { 
            guid, name, price, brandId, genderId, typeId, sizeIds, colorIds, stockQuantity, description 
        });
        res.json(response);
    };
};