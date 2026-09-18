export type TError = {
    code: number;
    message: string;
}

export type TAnswer<T> = {
    result: 'ok' | 'error';
    data?: T;
    error?: TError;
}

export type TUser = {
    guid: string;
    login: string;
    token: string;
    roleId: number;
    deliveryAddress: string;
}

export interface IProduct {
    id: number;
    name: string;
    price: number;
    brand: string;
    gender: string;
    type: string;
    sizes: string[];
    colors: string[];
    stockQuantity: number;
    description: string;
}


export interface IProductInCart extends IProduct {
    color: string;
    size: string;
}


export interface IDictionaryItem {
    id: number;
    type: string;
}

export interface IDictionaries {
    statuses: IDictionaryItem[];
    brands: IDictionaryItem[];
    genders: IDictionaryItem[];
    underwearTypes: IDictionaryItem[];
    sizes: IDictionaryItem[];
    colors: IDictionaryItem[];
    underwearSizes: IDictionaryItem[];
}

export interface IOrder {
    id: number;
    userId: number;
    orderTime: string;
    statusId: number;
    products: {
        productId: number;
        quantity: number;
        size: number;
        color: number;
    };

}