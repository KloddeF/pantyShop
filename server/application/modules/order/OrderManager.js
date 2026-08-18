const BaseManager = require("../BaseManager");
const Order = require("./Order");

class OrderManager extends BaseManager {
    constructor(options) {
        super(options);
        
        this.mediator.subscribe(this.EVENTS.CREATE_ORDER, (data) => this.eventCreateOrder(data));
        this.mediator.subscribe(this.EVENTS.GET_ORDERS_BY_USER, (data) => this.eventGetOrdersByUser(data));
        this.mediator.subscribe(this.EVENTS.CANCEL_ORDER, (data) => this.eventCancelOrder(data));
    }

    // ============ EVENTS ============

    // создание заказа
    async eventCreateOrder(data) {
        const { guid, products } = data;
        
        // проверяем каждый товар в корзине
        for (const item of products) {
            if (!item.productId || !item.quantity || item.quantity <= 0) {
                return this.answer.bad(242);
            }
        }

        // проверяем существование пользователя
        const user = await this.db.getUserByGuid(guid);
        if (!user) {
            return this.answer.bad(1001);
        }

        // проверяем наличие адреса доставки у пользователя
        if (!user.deliveryAddress) {
            return this.answer.bad(2006);
        }

        // проверяем наличие товаров на складе
        for (const item of products) {
            const product = await this.db.getProductById(item.productId);
            if (!product) {
                return this.answer.bad(2001);
            }
            if (product.stockQuantity < item.quantity) {
                return this.answer.bad(2002);
            }
        }

        // создаем заказ со статусом 1 - Оформлен
        const orderTime = new Date().toISOString();
        const statusId = 1;
        
        const orderId = await this.db.createOrder(user.id, orderTime, statusId);

        // добавляем товары в заказ и обновляем склад
        for (const item of products) {
            const result = await this.db.addOrderProduct(orderId, item.productId, item.quantity);
            await this.db.updateProductStock(item.productId, -item.quantity);
        }

        return this.answer.good(true);
    }

    // получение всех заказов пользователя
    async eventGetOrdersByUser(data) {
        const { guid } = data;
        
        // получаем пользователя по guid
        const user = await this.db.getUserByGuid(guid);
        if (!user) {
            return this.answer.bad(1001);
        }

        // получаем все заказы пользователя
        const orders = await this.db.getOrdersByUserId(user.id);
        if (!orders || orders.length === 0) {
            return this.answer.good([]);
        }

        // формируем результат с товарами для каждого заказа
        const result = [];
        for (const orderData of orders) {
            const products = await this.db.getOrderProducts(orderData.id);
            const order = new Order({ db: this.db, common: this.common });
            order._fillData(orderData, products);
            result.push(order.get());
        }

        return this.answer.good(result);
    }

    // отмена заказа
    async eventCancelOrder(data) {
        const { guid, orderId } = data;
        
        // получаем пользователя по guid
        const user = await this.db.getUserByGuid(guid);
        if (!user) {
            return this.answer.bad(1001);
        }

        // получаем заказ по id
        const order = await this.db.getOrderById(orderId);
        if (!order) {
            return this.answer.bad(2003);
        }

        // проверяем, что заказ принадлежит пользователю
        if (order.userId !== user.id) {
            return this.answer.bad(2004);
        }

        // проверяем, что статус заказа 1 - Оформлен
        if (order.statusId !== 1) {
            return this.answer.bad(2005);
        }

        // получаем все товары из заказа
        const products = await this.db.getOrderProducts(orderId);
        
        // возвращаем товары на склад
        for (const product of products) {
            await this.db.updateProductStock(product.productId, product.quantity);
        }

        // меняем статус заказа на 6 - Отменен
        await this.db.updateOrderStatus(orderId, 6);
        
        return this.answer.good(true);
    }
}

module.exports = OrderManager;