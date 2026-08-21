const BaseManager = require("../BaseManager");
const Catalog = require("./Catalog");

class CatalogManager extends BaseManager {
    constructor(options) {
        super(options);
        
        this.mediator.subscribe(this.EVENTS.GET_PRODUCT_LIST, (data) => this.eventGetProductList(data));
        this.mediator.subscribe(this.EVENTS.GET_PRODUCT, (data) => this.eventGetProduct(data));
        this.mediator.subscribe(this.EVENTS.GET_DICTIONARIES, (data) => this.eventGetDictionaries(data));
    }

    // ============ EVENTS ============

    // получение списка всех товаров
    async eventGetProductList(data) {
        const { guid } = data;
        
        // проверяем существование пользователя
        const user = await this.db.getUserByGuid(guid);
        if (!user) {
            return this.answer.bad(1001);
        }

        const catalog = new Catalog({ db: this.db, common: this.common });
        const products = await catalog.getProductList();
        
        return this.answer.good(products);
    }

    // получение информации о конкретном товаре
    async eventGetProduct(data) {
        const { guid, productId } = data;
        
        // проверяем существование пользователя
        const user = await this.db.getUserByGuid(guid);
        if (!user) {
            return this.answer.bad(1001);
        }

        const catalog = new Catalog({ db: this.db, common: this.common });
        const product = await catalog.getProduct(productId);
        
        if (!product) {
            return this.answer.bad(2001);
        }

        return this.answer.good(product);
    }

    // получение словарей
    async eventGetDictionaries(data) {
        const { guid } = data;

        // проверяем существование пользователя
        const user = await this.db.getUserByGuid(guid);
        if (!user) {
            return this.answer.bad(1001);
        }

        const catalog = new Catalog({ db: this.db, common: this.common });
        const dictionaries = await catalog.getDictionaries();
        return this.answer.good(dictionaries);
    }
}

module.exports = CatalogManager;