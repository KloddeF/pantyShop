import { IOrder, IProduct, TUser  } from "../server/types";
import Mediator from '../Mediator/Mediator';
import { MEDIATOR } from "../../config";

const TOKEN = 'token';

class Store {
    user: TUser | null = null;
    currentCart: IProduct[] = [];
    orders: IOrder[] = [];
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
        this.mediator.subscribe(MEDIATOR.EVENTS.CLEAR_CART, () => this.handleClearCart());
        this.mediator.subscribe(MEDIATOR.EVENTS.SET_ORDERS, (orders) => this.handleSetOrders(orders));


        this.mediator.set(MEDIATOR.TRIGGERS.GET_TOKEN, () => this.getToken());
        this.mediator.set(MEDIATOR.TRIGGERS.GET_GUID, () => this.getGuid());
        this.mediator.set(MEDIATOR.TRIGGERS.GET_USER, () => this.getUser());
        this.mediator.set(MEDIATOR.TRIGGERS.GET_CURRENT_CART, () => this.getCurrentCart());
        this.mediator.set(MEDIATOR.TRIGGERS.GET_ORDERS, () => this.getOrders());

    }

    handleLogin(data: TUser): void {
        console.log('Login:', data);
        this.user = data;
        if (this.user.roleId === 2) {
            this.mediator.call(MEDIATOR.EVENTS.SHOW_ADMIN_PANEL_BUTTON);
        }
        if (data.token) {
            localStorage.setItem(TOKEN, data.token);
        }
    }

    handleRegistration(data: TUser): void {
        console.log('Registration:', data);
        this.user = data;
        if (this.user.roleId === 2) {
            this.mediator.call(MEDIATOR.EVENTS.SHOW_ADMIN_PANEL_BUTTON);
        }
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

    handleClearCart(): void {
        this.currentCart.length = 0;
        this.mediator.call(MEDIATOR.EVENTS.UPDATE_CART);
    }

    handleSetOrders(orders: IOrder[]): void {
        this.orders = orders;
        this.mediator.call(MEDIATOR.EVENTS.UPDATE_CART);
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

    getOrders(): IOrder[] {
        return this.orders;
    }
}

export default Store;