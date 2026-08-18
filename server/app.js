const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: "http://localhost:3000",
    }
});

const Router = require('./application/router/Router.js');
const { createDB } = require('./application/modules/db/DB.js');
const Mediator = require('./application/modules/Mediator.js');
const Common = require('./application/modules/common/Common.js');
const Answer = require('./application/router/Answer.js');
const UserManager = require('./application/modules/user/UserManager.js');
const OrderManager = require('./application/modules/order/OrderManager.js');
const CatalogManager = require('./application/modules/catalog/CatalogManager.js');
const { EVENTS, TRIGGERS, SERVER_PORT, SERVER_NAME } = require('./config.js');

// запуск асинхронной функции для инициализации
(async () => {
    // создаем экз БД
    const db = await createDB(); 
    
    // создание медиатора
    const mediator = new Mediator({ EVENTS, TRIGGERS });
    const common = new Common();
    const answer = new Answer();
    
    // создаем менеджеры
    const userManager = new UserManager({ mediator, db, common, answer, io });
    const orderManager = new OrderManager({ mediator, db, common, answer });
    const catalogManager = new CatalogManager({ mediator, db, common, answer });

    // настройка CORS для всех запросов
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
        res.header('Content-Type', 'application/json; charset=utf-8');
        if (req.method === 'OPTIONS') {
            return res.sendStatus(200);
        }
        
        next();
    });

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // создаем роутер
    const router = new Router(mediator, answer, common);
    app.use('/', router);

    // запуск сервака
    server.listen(SERVER_PORT, () => {
        console.log(`Server ${SERVER_NAME} running on port ${SERVER_PORT}`);
    });
})();