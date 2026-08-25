import React, { useContext, useEffect, useRef, useState } from 'react';
import { MediatorContext, ServerContext } from "../../App";
import { IBasePage, PAGES } from '../PageManager';
import { TError } from '../../services/server/types';
import Button from '../../components/Button/Button';

const MainPage: React.FC<IBasePage> = (props) => {

    const goToCatalogue = () => {
        props.setPage(PAGES.CATALOGUE);
    };

    return (
        <div className="main-page">
            <h3>Главная страница</h3>
            <button className="catalog-button" onClick={goToCatalogue}>
                Перейти в каталог
            </button>
        </div>
    );
}

export default MainPage;