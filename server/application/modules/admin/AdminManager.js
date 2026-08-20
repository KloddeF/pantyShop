const BaseManager = require("../BaseManager");
const Admin = require("./Admin");

class AdminManager extends BaseManager {
    constructor(options) {
        super(options);
        
        this.mediator.subscribe(this.EVENTS.CREATE_PRODUCT, (data) => this.eventCreateProduct(data));
        this.mediator.subscribe(this.EVENTS.CHANGE_PRODUCT, (data) => this.eventChangeProduct(data));
        this.mediator.subscribe(this.EVENTS.CHANGE_ORDER_STATUS, (data) => this.eventChangeOrderStatus(data));
        this.mediator.subscribe(this.EVENTS.GET_DICTIONARIES, (data) => this.eventGetDictionaries(data));
        this.mediator.subscribe(this.EVENTS.ADD_DICTIONARY_DATA, (data) => this.eventAddDictionaryData(data));
        this.mediator.subscribe(this.EVENTS.DELETE_DICTIONARY_DATA, (data) => this.eventDeleteDictionaryData(data));
    }

    // ============ EVENTS ============

    // создание товара
    async eventCreateProduct(data) {
        const { guid, name, price, brandId, genderId, typeId, sizeIds, colorIds, stockQuantity } = data;

        const admin = new Admin({ db: this.db, common: this.common });
        
        // проверяем права админа
        const user = await admin.checkAdminRole(guid);
        if (!user) {
            return this.answer.bad(1004);
        }

        // проверяем существование бренда
        const brand = await this.db.getBrandById(brandId);
        if (!brand) {
            return this.answer.bad(3001);
        }

        // проверяем существование гендера
        const gender = await this.db.getGenderById(genderId);
        if (!gender) {
            return this.answer.bad(3002);
        }

        // проверяем существование типа
        const type = await this.db.getTypeById(typeId);
        if (!type) {
            return this.answer.bad(3003);
        }

        // проверяем существование размеров
        if (sizeIds && sizeIds.length > 0) {
            for (const sizeId of sizeIds) {
                const size = await this.db.getSizeById(sizeId);
                if (!size) {
                    return this.answer.bad(3004);
                }
            }
        }

        // проверяем существование цветов
        if (colorIds && colorIds.length > 0) {
            for (const colorId of colorIds) {
                const color = await this.db.getColorById(colorId);
                if (!color) {
                    return this.answer.bad(3005);
                }
            }
        }

        await admin.createProduct(name, price, brandId, genderId, typeId, sizeIds || [], colorIds || [], stockQuantity);
        return this.answer.good(true);
    }

    // изменение товара
    async eventChangeProduct(data) {
        const { guid, productId, name, price, brandId, genderId, typeId, sizeIds, colorIds, stockQuantity } = data;

        const admin = new Admin({ db: this.db, common: this.common });
        
        // проверяем права админа
        const user = await admin.checkAdminRole(guid);
        if (!user) {
            return this.answer.bad(1004);
        }

        // проверяем существование товара
        const existingProduct = await this.db.getProductById(productId);
        if (!existingProduct) {
            return this.answer.bad(2001);
        }

        // проверяем существование бренда
        if (brandId !== undefined) {
            const brand = await this.db.getBrandById(brandId);
            if (!brand) {
                return this.answer.bad(3001);
            }
        }

        // проверяем существование гендера
        if (genderId !== undefined) {
            const gender = await this.db.getGenderById(genderId);
            if (!gender) {
                return this.answer.bad(3002);
            }
        }

        // проверяем существование типа
        if (typeId !== undefined) {
            const type = await this.db.getTypeById(typeId);
            if (!type) {
                return this.answer.bad(3003);
            }
        }

        // проверяем существование размеров
        if (sizeIds !== undefined && sizeIds.length > 0) {
            for (const sizeId of sizeIds) {
                const size = await this.db.getSizeById(sizeId);
                if (!size) {
                    return this.answer.bad(3004);
                }
            }
        }

        // проверяем существование цветов
        if (colorIds !== undefined && colorIds.length > 0) {
            for (const colorId of colorIds) {
                const color = await this.db.getColorById(colorId);
                if (!color) {
                    return this.answer.bad(3005);
                }
            }
        }

        // собираем только переданные поля
        const fields = {};
        if (name !== undefined) fields.name = name;
        if (price !== undefined) fields.price = price;
        if (brandId !== undefined) fields.brandId = brandId;
        if (genderId !== undefined) fields.genderId = genderId;
        if (typeId !== undefined) fields.typeId = typeId;
        if (sizeIds !== undefined) fields.sizeIds = sizeIds;
        if (colorIds !== undefined) fields.colorIds = colorIds;
        if (stockQuantity !== undefined) fields.stockQuantity = stockQuantity;

        await admin.changeProduct(productId, fields);
        return this.answer.good(true);
    }

    // изменение статуса заказа
    async eventChangeOrderStatus(data) {
        const { guid, orderId, statusId } = data;

        const admin = new Admin({ db: this.db, common: this.common });
        
        // проверяем права админа
        const user = await admin.checkAdminRole(guid);
        if (!user) {
            return this.answer.bad(1004);
        }

        // проверяем существование заказа
        const order = await this.db.getOrderById(orderId);
        if (!order) {
            return this.answer.bad(2003);
        }

        // проверяем существование статуса
        const status = await this.db.getStatusById(statusId);
        if (!status) {
            return this.answer.bad(2007);
        }

        await admin.changeOrderStatus(orderId, statusId);
        return this.answer.good(true);
    }

    // получение словарей
    async eventGetDictionaries(data) {
        const { guid } = data;

        const admin = new Admin({ db: this.db, common: this.common });
        
        // проверяем права админа
        const user = await admin.checkAdminRole(guid);
        if (!user) {
            return this.answer.bad(1004);
        }

        const dictionaries = await admin.getDictionaries();
        return this.answer.good(dictionaries);
    }

    // добавление в словарь
    async eventAddDictionaryData(data) {
        const { guid, dictionary, data: value } = data;

        const admin = new Admin({ db: this.db, common: this.common });
        
        const user = await admin.checkAdminRole(guid);
        if (!user) {
            return this.answer.bad(1004);
        }

        const id = await admin.addDictionaryData(dictionary, value);
        if (!id) {
            return this.answer.bad(3006);
        }

        return this.answer.good(true);
    }

    // удаление из словаря
    async eventDeleteDictionaryData(data) {
        const { guid, dictionary, dataId } = data;

        const admin = new Admin({ db: this.db, common: this.common });
        
        const user = await admin.checkAdminRole(guid);
        if (!user) {
            return this.answer.bad(1004);
        }

        const result = await admin.deleteDictionaryData(dictionary, dataId);
        if (result === null) {
            return this.answer.bad(3006);
        }
        if (result === false) {
            return this.answer.bad(3007);
        }

        return this.answer.good(true);
    }
}

module.exports = AdminManager;