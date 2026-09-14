import React, { useEffect, useRef, useState, useContext } from 'react';
import { MediatorContext, ServerContext } from "../../../../App";
import Button from '../../../Button/Button';
import styles from './AccountInfo.module.scss';
import { TUser } from '../../../../services/server/types';

const AccountInfo: React.FC<{}> = () => {
    const server = useContext(ServerContext);
    const mediator = useContext(MediatorContext);
    const deliveryAddressInputRef = useRef<HTMLInputElement>(null!);
    const [ user, setUser ] = useState<TUser | null>(null);
    const { SET_TO_ACCOUNT, UPDATE_USER_ADDRESS } = mediator.getEventTypes(); 
    const { GET_USER } = mediator.getTriggerTypes();   

    const accountClickHandler = () => mediator.call(SET_TO_ACCOUNT);
    const setDeliveryAddressButtonHandler = () => {
        const deliveryAddres = deliveryAddressInputRef.current.value;
        server.updateUserAddress(deliveryAddres);
    };

    useEffect(() => {
        setUser(mediator.get<TUser>(GET_USER));
        const userAddressUpdatedHandler = () => {
            alert(
                'Адресс пользователя был установлен как ' + deliveryAddressInputRef.current.value
            );
        }   
        mediator.subscribe(UPDATE_USER_ADDRESS, userAddressUpdatedHandler);

        return () => {
            mediator.unsubscribe(UPDATE_USER_ADDRESS, userAddressUpdatedHandler);
        }
    });

    return (
        <div className={styles.content}>
            <p className={styles.p}>Ваш логин: {user?.login}</p>
            <p className={styles.p}>Адресс доставки</p>
            <input
                type="text"
                ref={deliveryAddressInputRef}
                className={styles.input}
                defaultValue={user?.deliveryAddress ?? ''}
            />
            <Button 
                onClick={setDeliveryAddressButtonHandler}
                text='Обновить'
                className={styles.button}
            />
            <Button
                onClick={accountClickHandler}
                text='Обратно'
                className={styles.button}
            />
        </div>
    );
};

export default AccountInfo;
