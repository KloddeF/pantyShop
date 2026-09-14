import React, { useEffect, useState, useContext, useRef } from 'react';
import { MediatorContext } from "../../../App";
import Login from './Login/Login';
import Registration from './Registration/Registration';
import Account from './Account/Account';
import AccountInfo from './AccountInfo/AccountInfo';
import styles from './Profile.module.scss';

const enum MODS {
    LOGIN,
    REGISTRATION,
    ACCOUNT,
    ACCOUNT_INFO
}

const Profile: React.FC<{}> = () => {
    const mediator = useContext(MediatorContext);
    const [isVisible, setVisible] = useState<Boolean>(false);
    const [mod, setMod] = useState<MODS>(MODS.LOGIN);
    const divRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const {
            LOGIN,
            REGISTRATION,
            LOGOUT,
            PROFILE_BUTTON,
            SET_TO_LOGIN,
            SET_TO_REGISTRATION,
            SET_TO_ACCOUNT_INFO,
            SET_TO_ACCOUNT
        } = mediator.getEventTypes();

        const profileButtonHandler = () => setVisible(isVisible => !isVisible);
        const logoutHandler = () => setMod(MODS.LOGIN);
        const setToLoginButtonHandler = () => setMod(MODS.LOGIN);
        const setToRegisterButtonHandler = () => setMod(MODS.REGISTRATION);
        const setToAccountButtonHandler = () => setMod(MODS.ACCOUNT);
        const setToAccountInfoButtonHandler = () => setMod(MODS.ACCOUNT_INFO);

        mediator.subscribe(LOGIN, setToAccountButtonHandler);
        mediator.subscribe(REGISTRATION, setToAccountButtonHandler);
        mediator.subscribe(LOGOUT, logoutHandler);
        mediator.subscribe(PROFILE_BUTTON, profileButtonHandler);
        mediator.subscribe(SET_TO_LOGIN, setToLoginButtonHandler);
        mediator.subscribe(SET_TO_REGISTRATION, setToRegisterButtonHandler);
        mediator.subscribe(SET_TO_ACCOUNT, setToAccountButtonHandler);
        mediator.subscribe(SET_TO_ACCOUNT_INFO, setToAccountInfoButtonHandler);

        return () => {
            mediator.unsubscribe(LOGIN, setToAccountButtonHandler);
            mediator.unsubscribe(REGISTRATION, setToAccountButtonHandler);
            mediator.unsubscribe(LOGOUT, logoutHandler);
            mediator.unsubscribe(PROFILE_BUTTON, profileButtonHandler);
            mediator.unsubscribe(SET_TO_LOGIN, setToLoginButtonHandler);
            mediator.unsubscribe(SET_TO_REGISTRATION, setToRegisterButtonHandler);
            mediator.unsubscribe(SET_TO_ACCOUNT_INFO, setToRegisterButtonHandler);
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
            {mod === MODS.LOGIN && <Login />}
            {mod === MODS.REGISTRATION && <Registration />}
            {mod === MODS.ACCOUNT && <Account />}
            {mod === MODS.ACCOUNT_INFO && <AccountInfo />}
        </div>
    );
};

export default Profile;