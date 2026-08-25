import React, { useState, useContext } from 'react';
import { MediatorContext } from '../App';
import Registration from './Registration/Registration';
import Login from './Login/Login';
import Catalogue from './Catalogue/Catalogue';

import { TError } from '../services/server/types';
import MainPage from './MainPage/MainPage';

export enum PAGES {
    LOGIN,
    REGISTRATION,
    MAIN_PAGE,
    CATALOGUE
}

export interface IBasePage {
    setPage: (name: PAGES) => void;
}

const PageManager: React.FC = () => {
    const mediator = useContext(MediatorContext);
    const [page, setPage] = useState<PAGES>(PAGES.LOGIN);

    const props = {
        setPage
    }

    const { SHOW_ERROR } = mediator.getEventTypes();
    mediator.subscribe(SHOW_ERROR, (data: TError) => {
        console.log(data);
    });

    return (
        <>
            {page === PAGES.REGISTRATION && <Registration {...props} />}
            {page === PAGES.LOGIN && <Login {...props} />}
            {page === PAGES.MAIN_PAGE && <MainPage {...props} />}
            {page === PAGES.CATALOGUE && <Catalogue {...props} />}
        </>
    );
}

export default PageManager;