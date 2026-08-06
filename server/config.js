class CONFIG {
    static SERVER_PORT = '1001'; // Хост сервера
    static SERVER_NAME = 'PANTY_SHOP';  // Имя сервера

    static SQLITE_PATH = './application/modules/db/pantyShop.db'; // Путь к бд

    static TEST1 = {
        TEST: '/test',
    }

    static ROLES = {
        GUEST: 'guest',
        USER: 'user',
        ADMIN: 'admin',
    }

    //events
    static EVENTS = {
    }

    static TRIGGERS = {
    }

    // сокетные сообщения
   static MESSAGES = {
    }

}

module.exports = CONFIG;