import React, { useState, useContext } from 'react';
import { MediatorContext } from '../App';
import Catalogue from './Catalogue/Catalogue';

import { TError } from '../services/server/types';

export enum PAGES {
    CATALOGUE
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

    const { SHOW_ERROR } = mediator.getEventTypes();
    mediator.subscribe(SHOW_ERROR, (data: TError) => {
        console.log(data);
    });

    return (
        <>
            {page === PAGES.CATALOGUE && <Catalogue {...props} />}
        </>
    );
}

export default PageManager;