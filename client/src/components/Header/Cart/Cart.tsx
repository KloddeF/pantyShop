import React, { useEffect, useState, useContext, useRef } from 'react';
import { MediatorContext, ServerContext } from "../../../App";
import styles from './Cart.module.scss';
import { IOrder, IProductInCart, TUser } from '../../../services/server/types';
import Product from './Product/Product';
import Button from '../../Button/Button';
import Order from './Order/Order';

const Cart: React.FC<{}> = () => {
    const mediator = useContext(MediatorContext);
    const server = useContext(ServerContext);
    const [isVisible, setVisible] = useState<Boolean>(false);
    const [, setToggle] = useState<Boolean>(false);
    const divRef = useRef<HTMLDivElement>(null);
    const {
        GET_CURRENT_CART,
        GET_USER,
        GET_ORDERS
    } = mediator.getTriggerTypes();
    const {
        CLEAR_CART
    } = mediator.getEventTypes();

    const orderList: IOrder[] | null = mediator.get(GET_ORDERS);
    const productList: IProductInCart[] | null = mediator.get(GET_CURRENT_CART);

    const createOrder = async (): Promise<void> => {
        if (mediator.get(GET_USER)) {
            const order = await server.createOrder([...productList!]);
            if (order) {
                mediator.call(CLEAR_CART);
            }
        } else {
            alert ("Для заказа необходимо быть в учетной записи");
        }
    }

    useEffect(() => {
        const {
            CART_BUTTON,
            ADD_PRODUCT_TO_CART,
            DEL_PRODUCT_FROM_CART,
            UPDATE_CART
        } = mediator.getEventTypes();

        const cartButtonHandler = () => setVisible(isVisible => !isVisible);
        const updateComponent = () => setToggle(val => !val);

        mediator.subscribe(CART_BUTTON, cartButtonHandler);
        mediator.subscribe(ADD_PRODUCT_TO_CART, updateComponent);
        mediator.subscribe(DEL_PRODUCT_FROM_CART, updateComponent);
        mediator.subscribe(UPDATE_CART, updateComponent);

        return () => {
            mediator.unsubscribe(CART_BUTTON, cartButtonHandler);
            mediator.unsubscribe(ADD_PRODUCT_TO_CART, updateComponent);
            mediator.unsubscribe(DEL_PRODUCT_FROM_CART, updateComponent);
            mediator.unsubscribe(UPDATE_CART, updateComponent);
        };
    }, [mediator]);

    useEffect(() => {
        if (!isVisible) return;
        const handleClickOutside = (e: MouseEvent) => {
            if (divRef.current && !divRef.current.contains(e.target as Node)) {
                setVisible(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isVisible]);

    if (!isVisible) return null;

    return (
        <div ref={divRef} className={styles.popup}>
            <p>Заказы</p>
            {orderList?.length === 0 ? (
                <p className={styles.p}>Заказов нет!</p>
            ) : (
                orderList!.map(o => (
                    <div key={o.id} className="">
                        <Order o={o} />
                    </div>
                ))
            )}
            <p>Корзина</p>
            {productList?.length === 0 ? (
                <p className={styles.p}>Здесь пока ничего нет!</p>
            ) : (
                productList!.map(p => (
                    <div key={p.id} className="">
                        <Product p={p} />
                    </div>
                ))
            )}

            <Button 
                className={styles.cartButton}
                onClick={createOrder}
                text='Заказать'
            />
        </div>
    );
};

export default Cart;