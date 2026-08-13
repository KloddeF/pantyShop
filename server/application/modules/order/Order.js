class Order {
    constructor({ db, common }) {
        this.db = db;
        this.common = common;
        
        this.id = null;
        this.userGuid = null;
        this.orderTime = null;
        this.statusId = null;
        this.products = [];
        this.totalPrice = 0;
    }

    get() {
        return {
            id: this.id,
            userGuid: this.userGuid,
            orderTime: this.orderTime,
            statusId: this.statusId,
            products: this.products,
            totalPrice: this.totalPrice,
        };
    }

    _fillData(orderData, products = []) {
        this.id = orderData.id;
        this.userGuid = orderData.userGuid;
        this.orderTime = orderData.orderTime;
        this.statusId = orderData.statusId;
        this.products = products;
        
        this.totalPrice = products.reduce((sum, product) => {
            return sum + (product.price * product.quantity);
        }, 0);
    }
}

module.exports = Order;