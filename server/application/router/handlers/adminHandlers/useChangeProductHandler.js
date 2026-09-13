module.exports = (mediator, answer, common) => {
    const { CHANGE_PRODUCT } = mediator.getEventTypes();

    return async (req, res) => {
        const { guid, productId, name, price, brandId, genderId, typeId, sizeIds, colorIds, stockQuantity, description } = req.body;
        
        if (!common.checkGuid(guid)) {
            return res.json(answer.bad(242));
        }

        if (!productId) {
            return res.json(answer.bad(242));
        }

        const response = await mediator.call(CHANGE_PRODUCT, { 
            guid, productId, name, price, brandId, genderId, typeId, sizeIds, colorIds, stockQuantity, description
        });
        res.json(response);
    };
};