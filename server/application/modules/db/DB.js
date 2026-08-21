const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const CONFIG = require('../../../config.js');
const ORM = require('./ORM.js');

class DB {
    constructor(db) {
        this.db = db;
        this.orm = new ORM(this);
    }

    // ============ BASE METHODS ============
    async execute(sql, params = []) {
        return this.db.run(sql, params);
    }

    async query(sql, params = []) {
        return this.db.get(sql, params);
    }

    async queryAll(sql, params = []) {
        return this.db.all(sql, params);
    }

    // ============ USER METHODS ============
    async getUserByGuid(guid) {
        const sql = `
            SELECT 
                id,
                login,
                password,
                guid,
                token,
                role_id as roleId,
                delivery_address as deliveryAddress
            FROM users
            WHERE guid = ?
        `;
        return this.query(sql, [guid]);
    }

    async getUserByLogin(login) {
        return this.orm.get('users', { login });
    }

    async getUserByToken(token) {
        return this.orm.get('users', { token });
    }

    async updateToken(userGuid, token) {
        return this.orm.update('users', { guid: userGuid }, { token });
    }

    async createUser(login, passwordHash, guid, token) {
        return this.orm.insert('users', {
            login,
            password: passwordHash,
            guid,
            token,
            role_id: 1,
        });
    }

    async clearToken(userGuid) {
        return this.orm.update('users', { guid: userGuid }, { token: null });
    }

    // ============ ORDER METHODS ============
    async getProductById(id) {
        const sql = `
            SELECT 
                id,
                name,
                price,
                brand_id as brandId,
                gender_id as genderId,
                type_id as typeId,
                stock_quantity as stockQuantity
            FROM products
            WHERE id = ?
        `;
        return this.query(sql, [id]);
    }

    async getOrderById(id) {
        const sql = `
            SELECT 
                id,
                user_id as userId,
                order_time as orderTime,
                status_id as statusId
            FROM orders
            WHERE id = ?
        `;
        return this.query(sql, [id]);
    }

    async getOrdersByUserId(userId) {
        const sql = `
            SELECT 
                id,
                user_id as userId,
                order_time as orderTime,
                status_id as statusId
            FROM orders
            WHERE user_id = ?
            ORDER BY order_time DESC
        `;
        return this.queryAll(sql, [userId]);
    }

    async getOrderProducts(orderId) {
        const sql = `
            SELECT 
                op.product_id as productId,
                op.quantity,
                p.name,
                p.price,
                p.stock_quantity as stockQuantity,
                b.type as brand,
                g.type as gender,
                ut.type as underwearType
            FROM order_product op
            JOIN products p ON op.product_id = p.id
            LEFT JOIN brands b ON p.brand_id = b.id
            LEFT JOIN genders g ON p.gender_id = g.id
            LEFT JOIN underwear_types ut ON p.type_id = ut.id
            WHERE op.order_id = ?
        `;
        return this.queryAll(sql, [orderId]);
    }

    async createOrder(userId, orderTime, statusId) {
        return this.orm.insert('orders', {
            user_id: userId,
            order_time: orderTime,
            status_id: statusId,
        });
    }

    async addOrderProduct(orderId, productId, quantity) {
        return this.orm.insert('order_product', {
            order_id: orderId,
            product_id: productId,
            quantity: quantity,
        });
    }

    async updateProductStock(productId, quantityChange) {
        const sql = `
            UPDATE products 
            SET stock_quantity = stock_quantity + ? 
            WHERE id = ? AND stock_quantity + ? >= 0
        `;
        
        try {
            const result = await this.execute(sql, [quantityChange, productId, quantityChange]);
            return result.changes > 0;
        } catch (error) {
            return false;
        }
    }

    async updateOrderStatus(orderId, statusId) {
        return this.orm.update('orders', { id: orderId }, { status_id: statusId });
    }

    async deleteOrder(orderId) {
        await this.orm.delete('order_product', { order_id: orderId });
        return this.orm.delete('orders', { id: orderId });
    }

    // ============ CATALOG METHODS ============
    async getProducts() {
        const sql = `
            SELECT 
                id,
                name,
                price,
                brand_id as brandId,
                gender_id as genderId,
                type_id as typeId,
                stock_quantity as stockQuantity
            FROM products
            ORDER BY name
        `;
        return this.queryAll(sql);
    }

    async getProductFullById(id) {
        const sql = `
            SELECT 
                p.id,
                p.name,
                p.price,
                p.brand_id as brandId,
                p.gender_id as genderId,
                p.type_id as typeId,
                p.stock_quantity as stockQuantity,
                b.type as brand,
                g.type as gender,
                ut.type as type
            FROM products p
            LEFT JOIN brands b ON p.brand_id = b.id
            LEFT JOIN genders g ON p.gender_id = g.id
            LEFT JOIN underwear_types ut ON p.type_id = ut.id
            WHERE p.id = ?
        `;
        return this.query(sql, [id]);
    }

    async getProductSizes(productId) {
        const sql = `
            SELECT 
                s.id,
                s.type as size
            FROM product_size ps
            JOIN sizes s ON ps.size_id = s.id
            WHERE ps.product_id = ?
            ORDER BY s.id
        `;
        return this.queryAll(sql, [productId]);
    }

    async getProductColors(productId) {
        const sql = `
            SELECT 
                c.id,
                c.type as color
            FROM product_color pc
            JOIN colors c ON pc.color_id = c.id
            WHERE pc.product_id = ?
            ORDER BY c.id
        `;
        return this.queryAll(sql, [productId]);
    }

    async getAllStatuses() {
        return this.orm.all('statuses', null, 'id, type');
    }

    async getAllBrands() {
        return this.orm.all('brands', null, 'id, type');
    }

    async getAllGenders() {
        return this.orm.all('genders', null, 'id, type');
    }

    async getAllUnderwearTypes() {
        return this.orm.all('underwear_types', null, 'id, type');
    }

    async getAllSizes() {
        return this.orm.all('sizes', null, 'id, type');
    }

    async getAllColors() {
        return this.orm.all('colors', null, 'id, type');
    }

    // ============ ADMIN METHODS ============
    async createProduct(name, price, brandId, genderId, typeId, stockQuantity) {
        return this.orm.insert('products', {
            name,
            price,
            brand_id: brandId,
            gender_id: genderId,
            type_id: typeId,
            stock_quantity: stockQuantity,
        });
    }

    async updateProduct(productId, fields) {
        const updateData = {};
        if (fields.name !== undefined) updateData.name = fields.name;
        if (fields.price !== undefined) updateData.price = fields.price;
        if (fields.brandId !== undefined) updateData.brand_id = fields.brandId;
        if (fields.genderId !== undefined) updateData.gender_id = fields.genderId;
        if (fields.typeId !== undefined) updateData.type_id = fields.typeId;
        if (fields.stockQuantity !== undefined) updateData.stock_quantity = fields.stockQuantity;
        
        return this.orm.update('products', { id: productId }, updateData);
    }

    async addProductSize(productId, sizeId) {
        return this.orm.insert('product_size', {
            product_id: productId,
            size_id: sizeId,
        });
    }

    async deleteProductSizes(productId) {
        return this.orm.delete('product_size', { product_id: productId });
    }

    async addProductColor(productId, colorId) {
        return this.orm.insert('product_color', {
            product_id: productId,
            color_id: colorId,
        });
    }

    async deleteProductColors(productId) {
        return this.orm.delete('product_color', { product_id: productId });
    }

    async getStatusById(id) {
        const sql = `SELECT id, type FROM statuses WHERE id = ?`;
        return this.query(sql, [id]);
    }

    async getSizeById(id) {
        const sql = `SELECT id, type FROM sizes WHERE id = ?`;
        return this.query(sql, [id]);
    }

    async getColorById(id) {
        const sql = `SELECT id, type FROM colors WHERE id = ?`;
        return this.query(sql, [id]);
    }

    async getBrandById(id) {
        const sql = `SELECT id, type FROM brands WHERE id = ?`;
        return this.query(sql, [id]);
    }

    async getGenderById(id) {
        const sql = `SELECT id, type FROM genders WHERE id = ?`;
        return this.query(sql, [id]);
    }

    async getTypeById(id) {
        const sql = `SELECT id, type FROM underwear_types WHERE id = ?`;
        return this.query(sql, [id]);
    }

    async addDictionaryItem(tableName, value) {
        return this.orm.insert(tableName, { type: value });
    }

    async deleteDictionaryItem(tableName, id) {
        return this.orm.delete(tableName, { id });
    }

    async checkDictionaryUsage(tableName, id) {
        const usageMap = CONFIG.DICTIONARY_USAGE_MAP;
        const usage = usageMap[tableName];
        if (!usage) {
            return false;
        }

        const sql = `SELECT id FROM ${usage.table} WHERE ${usage.field} = ? LIMIT 1`;
        const result = await this.query(sql, [id]);
        return result !== undefined;
    }
}

// функция для создания экземпляра БД
async function createDB() {
    const db = await open({
        filename: CONFIG.SQLITE_PATH,
        driver: sqlite3.Database,
        mode: sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE
    });
    await db.run('PRAGMA foreign_keys = ON');
    return new DB(db);
}

module.exports = { DB, createDB };