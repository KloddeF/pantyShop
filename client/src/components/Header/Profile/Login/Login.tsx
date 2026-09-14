import React, { useEffect, useRef, useState, useContext } from 'react';
import { MediatorContext, ServerContext } from "../../../../App";
import { TError } from '../../../../services/server/types';
import Button from '../../../Button/Button';
import useCheckLogin from './hooks/useCheckLogin';
import styles from './Login.module.scss';

const Login: React.FC<{}> = () => {
    const server = useContext(ServerContext);
    const mediator = useContext(MediatorContext);

    const loginRef = useRef<HTMLInputElement>(null!);
    const passwordRef = useRef<HTMLInputElement>(null!);

    const { isFormValid, clientError, setClientError, checkFilled, showError } = useCheckLogin();
    const [error, setError] = useState<TError | null>(null);
    const { SET_TO_REGISTRATION } = mediator.getEventTypes();
    const displayError = error?.message || clientError;

    const hideErrorOnInput = () => {
        setClientError('');
        checkFilled(loginRef.current.value, passwordRef.current.value);
    };

    const loginClickHandler = () => {
        setError(null);
        const login = loginRef.current.value;
        const password = passwordRef.current.value;

        if (!showError(login, password)) return;

        server.login(login, password);
    };

    const registerClickHandler = () => mediator.call(SET_TO_REGISTRATION);

    return (
        <div className={styles.content}>
            <div className="input-group login-group">
                <p className={styles.p}>Логин</p>
                <input
                    ref={loginRef}
                    type="text"
                    placeholder="Ваш логин"
                    onChange={hideErrorOnInput}
                    className={styles.input}
                    id='test-input-login'
                    autoComplete='off'
                />
            </div>

            <div className="input-group password-group">
                <p className={styles.p}>Пароль</p>
                <input
                    ref={passwordRef}
                    type="password"
                    placeholder="Ваш пароль"
                    onChange={hideErrorOnInput}
                    className={styles.input}
                    id='test-input-password'
                    autoComplete='off'
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && isFormValid) {
                            loginClickHandler();
                        }
                    }}
                />
            </div>

            {displayError && (
                <p id='test-errors-login' className={styles.error}>
                    {displayError}
                </p>
            )}

            <Button
                onClick={loginClickHandler}
                text='Войти'
                isDisabled={!isFormValid}
                className={styles.button}
            />
            <Button
                onClick={registerClickHandler}
                text='Создать аккаунт'
                className={styles.button}
            />
        </div>
    );
};

export default Login;
