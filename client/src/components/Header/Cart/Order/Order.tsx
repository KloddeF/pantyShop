import React, { useContext, useState } from 'react';
import { MediatorContext, ServerContext } from "../../../../App";
import { IOrder } from '../../../../services/server/types';
import styles from './Order.module.scss';

const Order: React.FC<{ o: IOrder }> = ({ o }) => {
    const mediator = useContext(MediatorContext);
    const server = useContext(ServerContext);
    const [canceled, setCanceled] = useState(false); 

    const cancelOrderButtonHandler = async () => {
        setCanceled(true);
        await server.cancelOrder(o.id);
        const { UPDATE_CART } = mediator.getEventTypes();
        mediator.call(UPDATE_CART);
    }

    if (canceled) return null;

    return (
        <div className={styles.divOrder}>
            <p className={styles.pOrder}>Заказ {o.id} cтатус {o.statusId}</p>
            <button onClick={cancelOrderButtonHandler} className={styles.buttonOrder}>X</button>
        </div>
    );
};

export default Order;