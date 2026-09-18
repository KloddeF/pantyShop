import React, { useState, useContext, useEffect } from 'react';
import { MediatorContext } from '../App';
import Catalogue from './Catalogue/Catalogue';
import AdminPanel from './AdminPanel/AdminPanel';

import { TError } from '../services/server/types';

export enum PAGES {
    CATALOGUE,
    ADMIN_PANEL
}

export interface IBasePage {
    setPage: (name: PAGES) => void;
}

const PageManager: React.FC = () => {
    const mediator = useContext(MediatorContext);
    const [page, setPage] = useState<PAGES>(PAGES.CATALOGUE);

    const props = {
        setPage
    }

    const { SHOW_ERROR, SET_PAIGE_ADMIN_PANEL } = mediator.getEventTypes();

    useEffect(() => {

        const showErrorHandler = (data: TError) => console.log(data);
        const setPaigeAdminPanelhandler = () => setPage(PAGES.ADMIN_PANEL);

        mediator.subscribe(SHOW_ERROR, showErrorHandler);
        mediator.subscribe(SET_PAIGE_ADMIN_PANEL, setPaigeAdminPanelhandler)
    })

    return (
        <>
            {page === PAGES.CATALOGUE && <Catalogue {...props} />}
            {page === PAGES.ADMIN_PANEL && <AdminPanel {...props} />}
        </>
    );
}

export default PageManager;