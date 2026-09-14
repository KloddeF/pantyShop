import React, { useRef, useState, useContext } from 'react';
import { MediatorContext, ServerContext } from "../../../../App";
import { TError } from '../../../../services/server/types';
import Button from '../../../Button/Button';
import useCheckRegistration from './hooks/useCheckRegistration';
import styles from './Registration.module.scss';

const Registration: React.FC<{}> = () => {
    const server = useContext(ServerContext);
    const mediator = useContext(MediatorContext);

    const loginRef = useRef<HTMLInputElement>(null!);
    const passwordRef = useRef<HTMLInputElement>(null!);
    const confirmPasswordRef = useRef<HTMLInputElement>(null!);
    const { isFormValid, clientError, setClientError, checkFilled, showError } = useCheckRegistration();

    const [error, setError] = useState<TError | null>(null);
    const { SET_TO_LOGIN } = mediator.getEventTypes();
    const displayError = error?.message || clientError;

    const hideErrorOnInput = () => {
        setClientError('');
        checkFilled(loginRef.current.value, passwordRef.current.value, confirmPasswordRef.current.value);
    };

    const registrationClickHandler = () => {
        setError(null);
        const login = loginRef.current.value;
        const password = passwordRef.current.value;
        const confirmPassword = confirmPasswordRef.current.value;

        if (!showError(login, password, confirmPassword)) return;

        server.registration(login, password);
    }

    const loginButtonHandler = () => mediator.call(SET_TO_LOGIN);

    return (<div className={styles.content}>
        <div className='registration-wrapper'>
            <p className={styles.p}>Логин</p>
            <input
                ref={loginRef}
                type="text"
                placeholder="Ваш логин"
                onChange={hideErrorOnInput}
                onKeyUp={() => checkFilled(loginRef.current.value, passwordRef.current.value, confirmPasswordRef.current.value)}
                className={styles.input}
                id='test-input-loginReg'
                autoComplete='off'
            />
            <p className={styles.p}>Пароль</p>
            <input
                ref={passwordRef}
                type="password"
                placeholder="Ваш пароль"
                onChange={hideErrorOnInput}
                onKeyUp={() => checkFilled(loginRef.current.value, passwordRef.current.value, confirmPasswordRef.current.value)}
                className={styles.input}
                id='test-input-passwordReg'
                autoComplete='off'
            />
            <p className={styles.p}>Подтверждение пароля</p>
            <input
                ref={confirmPasswordRef}
                type="password"
                placeholder="Повторите ваш пароль"
                onChange={hideErrorOnInput}
                onKeyUp={() => checkFilled(loginRef.current.value, passwordRef.current.value, confirmPasswordRef.current.value)}
                className={styles.input}
                id='test-input-certpasswordReg'
                autoComplete='off'
            />
            <div>
            </div>
            {displayError && <div id='test-errors-registration' className='errors'>{displayError}</div>}
            <div className='registration-buttons'>
                <Button
                    onClick={registrationClickHandler}
                    text='Зарегистрироваться'
                    isDisabled={!isFormValid}
                    className={styles.button}
                    id='test-registration-button'
                />
                <Button
                    onClick={loginButtonHandler}
                    text='Есть аккаунт?'
                    className={styles.button}
                    id='test-haveAccount-Button'
                />
            </div>
        </div>
    </div>)
};

export default Registration;
