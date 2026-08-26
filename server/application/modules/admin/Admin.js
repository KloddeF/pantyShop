const CONFIG = require('../../../config');

class Admin {
    constructor({ db, common }) {
        this.db = db;
        this.common = common;
        this.tableMap = CONFIG.DICTIONARY_TABLE_MAP;
    }

    // проверка роли пользователя
    async checkAdminRole(guid) {
        const user = await this.db.getUserByGuid(guid);
        if (!user) {
            return null;
        }
        if (user.roleId !== 2) {
            return null;
        }
        return user;
    }

    // создание товара
    async createProduct(name, price, brandId, genderId, typeId, sizeIds, colorIds, stockQuantity, description) {
        // создаем товар
        const productId = await this.db.createProduct(name, price, brandId, genderId, typeId, stockQuantity, description);
        if (!productId) {
            return null;
        }

        // добавляем размеры
        if (sizeIds && sizeIds.length > 0) {
            for (const sizeId of sizeIds) {
                await this.db.addProductSize(productId, sizeId);
            }
        }

        // добавляем цвета
        if (colorIds && colorIds.length > 0) {
            for (const colorId of colorIds) {
                await this.db.addProductColor(productId, colorId);
            }
        }

        return productId;
    }

    // изменение товара
    async changeProduct(productId, fields) {
        const { name, price, brandId, genderId, typeId, sizeIds, colorIds, stockQuantity, description } = fields;
        
        // обновляем основные поля
        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (price !== undefined) updateData.price = price;
        if (brandId !== undefined) updateData.brandId = brandId;
        if (genderId !== undefined) updateData.genderId = genderId;
        if (typeId !== undefined) updateData.typeId = typeId;
        if (stockQuantity !== undefined) updateData.stockQuantity = stockQuantity;
        if (description !== undefined) updateData.description = description;

        if (Object.keys(updateData).length > 0) {
            await this.db.updateProduct(productId, updateData);
        }

        // обновляем размеры
        if (sizeIds !== undefined) {
            // удаляем старые размеры
            await this.db.deleteProductSizes(productId);
            // добавляем новые
            if (sizeIds.length > 0) {
                for (const sizeId of sizeIds) {
                    await this.db.addProductSize(productId, sizeId);
                }
            }
        }

        // обновляем цвета
        if (colorIds !== undefined) {
            // удаляем старые цвета
            await this.db.deleteProductColors(productId);
            // добавляем новые
            if (colorIds.length > 0) {
                for (const colorId of colorIds) {
                    await this.db.addProductColor(productId, colorId);
                }
            }
        }

        return true;
    }

    // изменение статуса заказа
    async changeOrderStatus(orderId, statusId) {
        return this.db.updateOrderStatus(orderId, statusId);
    }

    // добавление в словарь
    async addDictionaryData(dictionary, data) {
        const tableName = this.tableMap[dictionary];
        if (!tableName) {
            return null;
        }

        const id = await this.db.addDictionaryItem(tableName, data);
        return id;
    }

    // удаление из словаря
    async deleteDictionaryData(dictionary, dataId) {
        const tableName = this.tableMap[dictionary];
        if (!tableName) {
            return null;
        }

        // проверяем, используется ли значение
        const isUsed = await this.db.checkDictionaryUsage(tableName, dataId);
        if (isUsed) {
            return false;
        }

        return this.db.deleteDictionaryItem(tableName, dataId);
    }
}

module.exports = Admin;