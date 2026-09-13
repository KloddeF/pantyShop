import React from 'react';
import styles from './Footer.module.scss';

const devs = [
    { name: "Гунчев А.А.", role: "BackEnd" },
    { name: "Слотин А.С.", role: "FrontEnd" },
    { name: "Дик Е.Э.", role: "FrontEnd" }
];

const renderDevsList = (styles: any) => (
    <ul className={styles.Devs}>
        {devs.map((dev, index) => (
            <li key={index}>
                {dev.name} — <a> {dev.role} </a>
            </li>
        ))}
    </ul>
);

function Footer() {
    return (
        <div>
            <footer className={styles.Footer}>
                <div className={styles.FooterWrap}>
                    <div className={styles.MainInfo}>
                        <h1 className={styles.Heading}>TrusovShop</h1>
                        <p className={styles.About}>
                            О проекте:
                            </p>
                        <p className={styles.Text}>
                            Проект сделан в рамках учебной проектно-технологической стационарной практики 2026 года
                        </p>
                        <p className={styles.Text}>
                            с 29.06 по 11.07 студентами группы ОБ-09.03.02.01-21 
                        </p>
                    </div>
                    <div className={styles.Developers}>
                        <p className={styles.TeamHeading}>Разработано командой:</p>
                        <div className={styles.Roles}>
                            {renderDevsList(styles)}
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Footer;