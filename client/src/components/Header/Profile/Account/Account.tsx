import React, { useEffect, useRef, useState, useContext } from 'react';
import { MediatorContext, ServerContext } from "../../../../App";
import Button from '../../../Button/Button';
import styles from './Account.module.scss';
import { TUser } from '../../../../services/server/types';

const Account: React.FC<{}> = () => {
    const server = useContext(ServerContext);
    const mediator = useContext(MediatorContext);
    const [ login, setLogin ] = useState<String | null>(null);
    const { 
        SET_TO_ACCOUNT_INFO,
        
    } = mediator.getEventTypes(); 
    const { GET_USER } = mediator.getTriggerTypes();   
    const accountInfoClickHandler = () => mediator.call(SET_TO_ACCOUNT_INFO);

    const logoutClickHandler = () => server.logout();

    useEffect(() => {
        setLogin(mediator.get<TUser>(GET_USER)!.login);
    });

    useEffect(() => {
        server.setOrders();
    }, [])

    return (
        <div className={styles.content}>
            <p className={styles.p}>Добро пожаловать, {login}!</p>
            <div>
            <Button
                onClick={accountInfoClickHandler}
                text='Изменить информацию об аккаунте'
                className={styles.button}
            />
            <Button
                onClick={logoutClickHandler}
                text='Выход'
                className={styles.button}
            />
            </div>
        </div>
    );
};

export default Account;
