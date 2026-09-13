import React, { useRef, useContext } from 'react';
import { MediatorContext, ServerContext } from "../../App";
import styles from './Header.module.scss';
import Profile from './Profile/Profile';

function Header() {

    const mediator = useContext(MediatorContext);
    const { PROFILE_BUTTON } = mediator.getEventTypes();
    const profileClickHandler = () => mediator.call(PROFILE_BUTTON);

    return (
        <div>
            <header className={styles.Header}>
                <div className={styles.TopBar}>
                    <a href="" className={styles.Logo}>TrusovShop</a>
                    <div className={styles.SearchContainer}>
                        <form className={styles.SearchForm} id="searchForm">
                            <input type="search" className={styles.SearchInput} id="searchInput" placeholder="Найти нижнее бельё..." autoComplete="off"/>
                        </form>

                        <div className="search-suggestions" id="searchSuggestions">
                            
                        </div>
                    </div>

                    <div className={styles.IconsGroup}>
                        <button className={styles.IconButton} onClick={profileClickHandler}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                        </button>
                        <button className={styles.IconButton}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="8" cy="21" r="1"></circle>
                                <circle cx="19" cy="21" r="1"></circle>
                                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
                            </svg>
                            <span className="cart-count"></span>
                        </button>
                    </div>
                </div>
                <Profile/>
            </header>

            <script>

            </script>
        </div>
    );
}

export default Header;