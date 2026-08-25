import md5 from 'md5';
import { io, Socket } from 'socket.io-client';
import CONFIG, { MEDIATOR, EMESSAGES } from '../../config';
import { IDictionaries, IProduct, TAnswer, TUser } from "./types";
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

        this.socket.on(EMESSAGES.CHECK, (data: string) => {
            this.mediator.call(EMESSAGES.CHECK, data);
        });

        this.socket.on(EMESSAGES.SEND_TO_ALL, (data: { name: string, text: string }) => {
            this.mediator.call(EMESSAGES.SEND_TO_ALL, data);
        });

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


    }

    private _validate(data: any) {
        if (data.result === "ok") {
            return data.data;
        }
        const { SHOW_ERROR } = this.mediator.getEventTypes();
        this.mediator.call(SHOW_ERROR, data.error);
        return null;
    }

    private async request<T>(method: string, params: { [key: string]: string | number } = {}): Promise<T | null> {
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

    check(name: string, text: string): void {
        this.socket.emit(EMESSAGES.CHECK, { name, text });
    }

    login(login: string, password: string): void {
        const passwordHash = md5(`${login}${password}`);
        this.socket.emit(MEDIATOR.EVENTS.LOGIN, { login, passwordHash });
    };

    registration(login: string, password: string): void {
        const passwordHash = md5(`${login}${password}`);
        this.socket.emit(MEDIATOR.EVENTS.REGISTRATION, { login, passwordHash });
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

}

export default Server;
