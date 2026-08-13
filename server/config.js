class CONFIG {
    static SERVER_PORT = '1001'; // Хост сервера
    static SERVER_NAME = 'PANTY_SHOP';  // Имя сервера

    static SQLITE_PATH = './application/modules/db/pantyShop.db'; // Путь к бд

    static ROLES = {
        USER: 'user',
        ADMIN: 'admin',
    }

    // ивенты
    static EVENTS = {
        CREATE_ORDER: 'createOrder',
        GET_ORDERS_BY_USER: 'getOrdersByUser',
        CANCEL_ORDER: 'cancelOrder',
    }

    // триггеры
    static TRIGGERS = {
    }

    // сокетные сообщения
    static MESSAGES = {
    }

}

module.exports = CONFIG;