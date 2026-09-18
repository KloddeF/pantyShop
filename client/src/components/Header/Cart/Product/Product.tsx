import React, { useContext } from 'react';
import { MediatorContext } from "../../../../App";
import { IProduct } from '../../../../services/server/types';
import styles from './Product.module.scss';

const Product: React.FC<{ p: IProduct }> = ({ p }) => {
    const mediator = useContext(MediatorContext);
    const { DEL_PRODUCT_FROM_CART } = mediator.getEventTypes();
    const delButtonHandler = () => mediator.call(DEL_PRODUCT_FROM_CART, p);

    return (
        <div className={styles.divProduct}>
            <p>{p.name}</p>
            <p>{p.price} ₽</p>
            <button onClick={delButtonHandler}>Убрать</button>
        </div>
    );
};

export default Product;