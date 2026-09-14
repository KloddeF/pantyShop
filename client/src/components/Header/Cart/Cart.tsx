import React, { useEffect, useState, useContext, useRef } from 'react';
import { MediatorContext } from "../../../App";
import styles from './Cart.module.scss';
import { IProduct } from '../../../services/server/types';
import Product from './Product/Product';

const Cart: React.FC<{}> = () => {
    const mediator = useContext(MediatorContext);
    const [isVisible, setVisible] = useState<Boolean>(false);
    const [, setToggle ] = useState<Boolean>(false);
    const divRef = useRef<HTMLDivElement>(null);
    const {
        GET_CURRENT_CART
    } = mediator.getTriggerTypes();
    const productList: IProduct[] | null = mediator.get(GET_CURRENT_CART);

    useEffect(() => {
        const {
            CART_BUTTON,
            ADD_PRODUCT_TO_CART,
            DEL_PRODUCT_FROM_CART
        } = mediator.getEventTypes();

        const cartButtonHandler = () => setVisible(isVisible => !isVisible);
        const updateComponent = () => setToggle(val => !val);
        mediator.subscribe(CART_BUTTON, cartButtonHandler);
        mediator.subscribe(ADD_PRODUCT_TO_CART, updateComponent);
        mediator.subscribe(DEL_PRODUCT_FROM_CART, updateComponent);
        
        return () => {
            mediator.unsubscribe(CART_BUTTON, cartButtonHandler);
            mediator.unsubscribe(ADD_PRODUCT_TO_CART, updateComponent);
            mediator.unsubscribe(DEL_PRODUCT_FROM_CART, updateComponent);
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
        </div>
    );
};

export default Cart;