import React, { useRef, useState, useContext } from 'react';
import { MediatorContext, ServerContext } from "../../../../App";
import { TError } from '../../../../services/server/types';
import Button from '../../../Button/Button';
import useCheckRegistration from '../../../../pages/Registration/hooks/useCheckRegistration';
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

    return (<div className='registration'>
        <div className='registration-wrapper'>
            <p className='registration-label-log'>логин</p>
            <input
                ref={loginRef}
                type="text"
                placeholder="ваш логин"
                onChange={hideErrorOnInput}
                onKeyUp={() => checkFilled(loginRef.current.value, passwordRef.current.value, confirmPasswordRef.current.value)}
                className='input-loginReg'
                id='test-input-loginReg'
                autoComplete='off'
            />
            <p className='registration-label-pass'>пароль</p>
            <input
                ref={passwordRef}
                type="password"
                placeholder="ваш пароль"
                onChange={hideErrorOnInput}
                onKeyUp={() => checkFilled(loginRef.current.value, passwordRef.current.value, confirmPasswordRef.current.value)}
                className='input-passwordReg'
                id='test-input-passwordReg'
                autoComplete='off'
            />
            <p className='registration-label-certpass'>подтверждение пароля</p>
            <input
                ref={confirmPasswordRef}
                type="password"
                placeholder="повторите ваш пароль"
                onChange={hideErrorOnInput}
                onKeyUp={() => checkFilled(loginRef.current.value, passwordRef.current.value, confirmPasswordRef.current.value)}
                className='input-certpasswordReg'
                id='test-input-certpasswordReg'
                autoComplete='off'
            />
            <div>
            </div>
            {displayError && <div id='test-errors-registration' className='errors'>{displayError}</div>}
            <div className='registration-buttons'>
                <Button
                    onClick={registrationClickHandler}
                    text='зарегистрироваться'
                    isDisabled={!isFormValid}
                    className='registration-button'
                    id='test-registration-button'
                />
                <Button
                    onClick={loginButtonHandler}
                    text='есть аккаунт?'
                    className='haveAccount-Button'
                    id='test-haveAccount-Button'
                />
            </div>
        </div>
    </div>)
};

export default Registration;
