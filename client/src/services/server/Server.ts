import md5 from 'md5';
import { io, Socket } from 'socket.io-client';
import CONFIG, { MEDIATOR, EMESSAGES } from '../../config';
import { IDictionaries, IOrder, IProduct, IProductInCart, TAnswer, TUser } from "./types";
import Mediator from '../Mediator/Mediator';

const HOST = CONFIG.HOST;

class Server {
    socket: Socket;
    chatInterval: NodeJS.Timer | null = null;
    mediator: Mediator;
    user: any;

    constructor(mediator: Mediator) {
        this.mediator = mediator;
        this.socket = io(HOST);

        this.socket.on('connect', () => console.log('КОНнЕНКШОН!!! id:', this.socket.id));
        this.socket.on("disconnect", () => console.log('дисконнект. id:', this.socket.id));

        this.socket.on(MEDIATOR.EVENTS.LOGIN, (data: TAnswer<TUser>) => {
            const result = this._validate(data);
            if (result) {
                const { LOGIN } = this.mediator.getEventTypes();
                this.mediator.call(LOGIN, result);
                this.user = result;
            }
        });

        this.socket.on(MEDIATOR.EVENTS.REGISTRATION, (data: TAnswer<TUser>) => {
            const result = this._validate(data);
            if (result) {
                const { REGISTRATION } = this.mediator.getEventTypes();
                this.mediator.call(REGISTRATION, result);
            }
        });

        this.socket.on(MEDIATOR.EVENTS.LOGOUT, (data: TAnswer<TUser>) => {
            const result = this._validate(data);
            if (result) {
                const { LOGOUT } = this.mediator.getEventTypes();
                this.mediator.call(LOGOUT, result);
            }
        });

        this.socket.on(MEDIATOR.EVENTS.UPDATE_USER_ADDRESS, (data: TAnswer<Boolean>) => {
            const result = this._validate(data);
            if (result) {
                const { UPDATE_USER_ADDRESS } = this.mediator.getEventTypes();
                this.mediator.call(UPDATE_USER_ADDRESS, result);
            }
        });
        this.socket.on(MEDIATOR.EVENTS.CREATE_ORDER, (data: TAnswer<Boolean>) => {
            const result = this._validate(data);
            if (result) {
                const { CREATE_ORDER } = this.mediator.getEventTypes();
                this.mediator.call(CREATE_ORDER, result);
            }
        });

    }

    private _validate(data: any) {
        if (data.result === "ok") {
            return data.data;
        }
        const { SHOW_ERROR } = this.mediator.getEventTypes();
        this.mediator.call(SHOW_ERROR, data.error);
        return null;
    }

    private async request<T>(method: string, params: { [key: string]: any } = {}): Promise<T | null> {
        try {
            params.method = method;
            const token = this.mediator.get<string>(MEDIATOR.TRIGGERS.GET_TOKEN);
            const guid = this.mediator.get<string>(MEDIATOR.TRIGGERS.GET_GUID);
            if (token) {
                params.token = token;
            }
            const response = await fetch(`${HOST}/${method}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token,
                    guid,
                    ...params,
                }),
            });
            const answer: TAnswer<T> = await response.json();
            if (answer.result === 'ok' && answer.data) {
                return answer.data;
            }
            //answer.error && this.setError(answer.error);
            return null;
        } catch (e) {
            console.log(e);
            /*this.setError({
                code: 9000,
                text: 'Unknown error',
            });*/
            return null;
        }
    }

    login(login: string, password: string): void {
        const passwordHash = md5(`${login}${password}`);
        this.socket.emit(MEDIATOR.EVENTS.LOGIN, { login, passwordHash });
    };

    registration(login: string, password: string): void {
        const passwordHash = md5(`${login}${password}`);
        this.socket.emit(MEDIATOR.EVENTS.REGISTRATION, { login, passwordHash });
    }

    updateUserAddress(deliveryAddress: string): void {
        this.socket.emit(MEDIATOR.EVENTS.UPDATE_USER_ADDRESS, { deliveryAddress });
    }

    logout(): void {
        this.socket.emit(MEDIATOR.EVENTS.LOGOUT);
    }

    async getProductList(): Promise<IProduct[] | null> {
        return this.request<IProduct[]>('getProductList', {});
    }

    async getProduct(productId: number): Promise<IProduct | null> {
        return this.request<IProduct>('getProduct', { productId });
    }

    async getDictionaries(): Promise<IDictionaries | null> {
        return this.request<IDictionaries>('getDictionaries', {});
    }

    async createOrder(products: IProductInCart[]): Promise<Boolean | null> {
        return this.request<Boolean>('createOrder', { products });
    }

    async getOrders(): Promise<IOrder[] | null> {
        return this.request<IOrder[]>('getOrdersByUser', {});
    }

    async setOrders() {
        const orders = await this.getOrders();
        if (orders) {
            this.mediator.call(MEDIATOR.EVENTS.SET_ORDERS, [...orders]);
        }
    }

    async cancelOrder(orderId: number) {
        return this.request<Boolean>('cancelOrder', { orderId });
    }

    async createProduct(props: {
        name: string,
        price: number,
        brandId: number,
        genderId: number,
        typeId: number,
        sizeIds: number[],
        colorIds: number[],
        stockQuantity: number,
        description: string,
        image: string
    }) {
        return this.request<Boolean>('createProduct', { props });
    }

    async changeProduct(props: {
        productId: number;
        name?: string,
        price?: number,
        brandId?: number,
        genderId?: number,
        typeId?: number,
        sizeIds?: number[],
        colorIds?: number[],
        stockQuantity?: number,
        description?: string,
        image?: string
    }) {
        return this.request<Boolean>('changeProduct', { props });
    }

    async changeOrderStatus(props: {
        orderId: number,
        statusId: number,
    }) {
        return this.request<Boolean>('changeOrderStatus', { props });
    }

    async addDictionaryData(props: {
        dictionary: string
        data: any
    }) {
        return this.request<Boolean>('addDictionaryData', { props });
    }

    async deleteDictionaryData(props: {
        dictionary: string,
        dataId: number,
    }) {
        return this.request<Boolean>('deleteDictionaryData', { props });
    }
}

export default Server;
