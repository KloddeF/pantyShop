class CONFIG {
    static SERVER_PORT = '3001'; // Хост сервера
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

        GET_PRODUCT_LIST: 'getProductList',
        GET_PRODUCT: 'getProduct',
        GET_DICTIONARIES: 'getDictionaries',

        CREATE_PRODUCT: 'createProduct',
        CHANGE_PRODUCT: 'changeProduct',
        CHANGE_ORDER_STATUS: 'changeOrderStatus',
        ADD_DICTIONARY_DATA: 'addDictionaryData',
        DELETE_DICTIONARY_DATA: 'deleteDictionaryData',
    }

    // триггеры
    static TRIGGERS = {
    }

    // сокетные сообщения
    static MESSAGES = {
        // user sockets
        LOGIN: 'LOGIN',
        REGISTRATION: 'REGISTRATION',
        LOGOUT: 'LOGOUT',
    }

    // маппинг названий словарей
    static DICTIONARY_TABLE_MAP = {
        'statuses': 'statuses',
        'brands': 'brands',
        'genders': 'genders',
        'underwearTypes': 'underwear_types',
        'sizes': 'sizes',
        'colors': 'colors'
    }

    // маппинг таблиц на поля для проверок
    static DICTIONARY_USAGE_MAP = {
        'statuses': { table: 'orders', field: 'status_id' },
        'brands': { table: 'products', field: 'brand_id' },
        'genders': { table: 'products', field: 'gender_id' },
        'underwear_types': { table: 'products', field: 'type_id' },
        'sizes': { table: 'product_size', field: 'size_id' },
        'colors': { table: 'product_color', field: 'color_id' }
    }

}

module.exports = CONFIG;