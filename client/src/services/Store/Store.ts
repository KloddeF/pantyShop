import { IProduct, TUser  } from "../server/types";
import Mediator from '../Mediator/Mediator';
import { MEDIATOR } from "../../config";

const TOKEN = 'token';

class Store {
    user: TUser | null = null;
    currentCart: IProduct[] = [];
    mediator: Mediator;

    constructor(mediator: Mediator) {
        this.mediator = mediator;
        this.initMediator();
    }

    private initMediator(): void {
        this.mediator.subscribe(MEDIATOR.EVENTS.LOGIN, (data) => this.handleLogin(data));
        this.mediator.subscribe(MEDIATOR.EVENTS.REGISTRATION, (data) => this.handleRegistration(data));
        this.mediator.subscribe(MEDIATOR.EVENTS.LOGOUT, (data) => this.handleLogout(data));
        this.mediator.subscribe(MEDIATOR.EVENTS.SHOW_ERROR, (message: string) => this.handleError(message));
        this.mediator.subscribe(MEDIATOR.EVENTS.ADD_PRODUCT_TO_CART, (p) => this.handleAddProductToCart(p));
        this.mediator.subscribe(MEDIATOR.EVENTS.DEL_PRODUCT_FROM_CART, (p) => this.handleDelProductFromCart(p));

        this.mediator.set(MEDIATOR.TRIGGERS.GET_TOKEN, () => this.getToken());
        this.mediator.set(MEDIATOR.TRIGGERS.GET_GUID, () => this.getGuid());
        this.mediator.set(MEDIATOR.TRIGGERS.GET_USER, () => this.getUser())
        this.mediator.set(MEDIATOR.TRIGGERS.GET_CURRENT_CART, () => this.getCurrentCart())
    }

    handleLogin(data: TUser): void {
        console.log('Login:', data);
        this.user = data;
        if (data.token) {
            localStorage.setItem(TOKEN, data.token);
        }
    }

    handleRegistration(data: TUser): void {
        console.log('Registration:', data);
        this.user = data;
        if (data.token) {
            localStorage.setItem(TOKEN, data.token);
        }
    }

    handleLogout(data: TUser): void {
        console.log('Logout:', data);
        this.user = null;
        localStorage.removeItem(TOKEN);
    }

    handleAddProductToCart(p: IProduct): void {
        console.log('add', p);
        this.currentCart.push(p);
    }

    handleDelProductFromCart(p: IProduct): void {
        console.log('del', p);
        this.currentCart.splice(
            this.currentCart.findIndex(prod => prod.id === p.id),
            1
        );
    }

    handleError(message: string): void {
        console.error('Error:', message);
    }

    getToken(): string | null {
        return localStorage.getItem(TOKEN);
    }

    getUser(): TUser | null {
        return this.user;
    }

    getGuid(): string | null {
        return this.user?.guid || null;
    }

    getCurrentCart(): IProduct[] {
        return this.currentCart;
    }
}

export default Store;