export enum EMESSAGES {
    CHECK = 'CHECK',
    SEND_TO_ALL = 'SEND_TO_ALL',
    GET_LOBBIES = 'GET_LOBBIES',
    DROP_FROM_LOBBY = 'DROP_FROM_LOBBY',
    GAME_STARTED = 'GAME_STARTED',
    GET_CURRENT_LOBBY = 'GET_CURRENT_LOBBY'
};

export const MEDIATOR = {
    EVENTS: {
        REGISTRATION: 'REGISTRATION',
        LOGIN: 'LOGIN',
        LOGOUT: 'LOGOUT',
        SHOW_ERROR: 'SHOW_ERROR',
        PROFILE_BUTTON: 'PROFILE_BUTTON',
        SET_TO_REGISTRATION: 'SET_TO_REGISTRATION',
        SET_TO_LOGIN: 'SET_TO_LOGIN',
        SET_TO_ACCOUNT: 'SET_TO_ACCOUNT',
        SET_TO_ACCOUNT_INFO: 'SET_TO_ACCOUNT_INFO'
    },
    TRIGGERS: {
        GET_TOKEN: 'GET_TOKEN',
        GET_GUID: 'GET_GUID',
        GET_USER: 'GET_USER'
    }
};

export type TWINDOW = {
    LEFT: number;
    TOP: number;
    HEIGHT: number;
    WIDTH: number;
}

const CONFIG = {
    HOST: 'http://localhost:3001', // Адрес сервера

    // игровое окно, видимое пользователю
    WINDOW: {
        LEFT: 0,
        TOP: 0,
        HEIGHT: 800,
        WIDTH: 800,
    },
    WIDTH: 100,
    HEIGHT: 100
};

export default CONFIG;