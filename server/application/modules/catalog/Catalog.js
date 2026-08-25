class Catalog {
    constructor({ db, common }) {
        this.db = db;
        this.common = common;
    }

    async getProductList() {
        const products = await this.db.getProducts();
        if (!products || products.length === 0) {
            return [];
        }

        const result = [];
        for (const productData of products) {
            const product = await this.getProduct(productData.id);
            if (product) {
                result.push(product);
            }
        }
        return result;
    }

    async getProduct(productId) {
        const productData = await this.db.getProductFullById(productId);
        if (!productData) {
            return null;
        }

        const sizes = await this.db.getProductSizes(productId);
        const colors = await this.db.getProductColors(productId);

        return {
            id: productData.id,
            name: productData.name,
            price: productData.price,
            brand: productData.brand,
            gender: productData.gender,
            type: productData.type,
            sizes: sizes.map(s => s.size),
            colors: colors.map(c => c.color),
            stockQuantity: productData.stockQuantity,
        };
    }

     // получение всех словарей
    async getDictionaries() {
        const statuses = await this.db.getAllStatuses();
        const brands = await this.db.getAllBrands();
        const genders = await this.db.getAllGenders();
        const underwearTypes = await this.db.getAllUnderwearTypes();
        const sizes = await this.db.getAllSizes();
        const colors = await this.db.getAllColors();
        const underwearSizes = await this.db.getAllUnderwearSizes();

         // группируем underwearSizes по типам
        const groupedUnderwearSizes = {};
        for (const item of underwearSizes) {
            const typeName = item.typeName;
            if (!groupedUnderwearSizes[typeName]) {
                groupedUnderwearSizes[typeName] = [];
            }
            groupedUnderwearSizes[typeName].push(item.sizeName);
        }

        return {
            statuses,
            brands,
            genders,
            underwearTypes,
            sizes,
            colors,
            underwearSizes: groupedUnderwearSizes,
        };
    }
}

module.exports = Catalog;