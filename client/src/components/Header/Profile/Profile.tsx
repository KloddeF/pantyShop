import React, { useEffect, useState, useContext } from 'react';
import { MediatorContext } from "../../../App";
import Login from './Login/Login';
import Registration from './Registration/Registration';
import Account from './Account/Account';
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

    useEffect(() => {
        const {
            LOGIN,
            REGISTRATION,
            LOGOUT,
            PROFILE_BUTTON,
            SET_TO_LOGIN,
            SET_TO_REGISTRATION,
            SET_TO_ACCOUNT_INFO
        } = mediator.getEventTypes();

        const profileButtonHandler = () => setVisible(isVisible => !isVisible);

        const accountEnterHandler = () => setMod(MODS.ACCOUNT);
        const logoutHandler = () => setMod(MODS.LOGIN);
        const setToLoginButtonHandler = () => setMod(MODS.LOGIN);
        const setToRegisterButtonHandler = () => setMod(MODS.REGISTRATION);
        const setToAccountInfoButtonHandler = () => setMod(MODS.ACCOUNT_INFO);

        mediator.subscribe(LOGIN, accountEnterHandler);
        mediator.subscribe(REGISTRATION, accountEnterHandler);
        mediator.subscribe(LOGOUT, logoutHandler);
        mediator.subscribe(PROFILE_BUTTON, profileButtonHandler);
        mediator.subscribe(SET_TO_LOGIN, setToLoginButtonHandler);
        mediator.subscribe(SET_TO_REGISTRATION, setToRegisterButtonHandler);
        mediator.subscribe(SET_TO_ACCOUNT_INFO, setToAccountInfoButtonHandler);

        return () => {
            mediator.unsubscribe(LOGIN, accountEnterHandler);
            mediator.unsubscribe(REGISTRATION, accountEnterHandler);
            mediator.unsubscribe(LOGOUT, logoutHandler);
            mediator.unsubscribe(PROFILE_BUTTON, profileButtonHandler);
            mediator.unsubscribe(SET_TO_LOGIN, setToLoginButtonHandler);
            mediator.unsubscribe(SET_TO_REGISTRATION, setToRegisterButtonHandler);
            mediator.unsubscribe(SET_TO_ACCOUNT_INFO, setToRegisterButtonHandler);
        };
    }, [mediator]);

    if (!isVisible) return null;

    return (
        <div className={styles.popup}>
            {mod === MODS.LOGIN && <Login />}
            {mod === MODS.REGISTRATION && <Registration />}
            {mod === MODS.ACCOUNT && <Account />}
            {/*mod === MODS.ACCOUNT_INFO && <AccountInfo />*/}
        </div>
    );
};

export default Profile;