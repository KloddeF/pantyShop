import React, { useRef, useContext, useEffect } from 'react';
import { MediatorContext, ServerContext } from "../../App";
import styles from './Header.module.scss';
import Profile from './Profile/Profile';
import Cart from './Cart/Cart';

function Header() {

    const mediator = useContext(MediatorContext);
    const {
        PROFILE_BUTTON,
        CART_BUTTON,
        SHOW_ADMIN_PANEL_BUTTON,
        SET_PAIGE_ADMIN_PANEL
    } = mediator.getEventTypes();
    const profileClickHandler = () => mediator.call(PROFILE_BUTTON);
    const cartClickHandler = () => mediator.call(CART_BUTTON);

    const iconsGroupRef = useRef<HTMLDivElement>(null);

    const addAdminButton = () => {
        const container = iconsGroupRef.current;
        if (!container) return;

        // Prevent adding it twice
        if (container.querySelector('[data-extra-button]')) return;

        const button = document.createElement('button');
        button.className = styles.IconButton;
        button.setAttribute('data-extra-button', 'true');
        button.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
        `;
        button.addEventListener('click', () => mediator.call(SET_PAIGE_ADMIN_PANEL));

        container.appendChild(button);
    };

    // Register the method with the mediator
    useEffect(() => {
        mediator.subscribe(SHOW_ADMIN_PANEL_BUTTON, addAdminButton);
        return () => {
            mediator.unsubscribe(SHOW_ADMIN_PANEL_BUTTON, addAdminButton);
        };
    }, [mediator]);

    return (
        <div>
            <header className={styles.Header}>
                <div className={styles.TopBar}>
                    <div className={styles.EqualSection}>
                        <a href="" className={styles.Logo}>TrusovShop</a>
                    </div>
                    <div className={styles.EqualSection}>
                        <div className={styles.SearchContainer}>
                            <form className={styles.SearchForm} id="searchForm">
                                <input type="search" className={styles.SearchInput} id="searchInput" placeholder="Найти нижнее бельё..." autoComplete="off" />
                            </form>

                            <div className="search-suggestions" id="searchSuggestions">

                            </div>
                        </div>
                    </div>
                    <div className={styles.EqualSection}>
                        <div ref={iconsGroupRef} className={styles.IconsGroup}>
                            <button className={styles.IconButton} onClick={profileClickHandler}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                            </button>
                            <button className={styles.IconButton} onClick={cartClickHandler}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="8" cy="21" r="1"></circle>
                                    <circle cx="19" cy="21" r="1"></circle>
                                    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
                                </svg>
                                <span className="cart-count"></span>
                            </button>
                        </div>
                    </div>
                </div>
                <Profile />
                <Cart />
            </header>
        </div>
    );
}

export default Header;