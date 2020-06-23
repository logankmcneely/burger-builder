import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import Aux from '../Auxillary/Auxillary';
import styles from './Layout.module.css';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';

const Layout = props => {

    //STATE
    const [sideDrawerIsVisible, setSideDrawerIsVisible] = useState(false);

    //SELECTORS
    const isAuthenticated = useSelector(state => state.auth.token !== null);

    const sideDrawerClosedHandler = () => {
        setSideDrawerIsVisible(false);
    }

    const sideDrawerToggleHandler = () => {
        setSideDrawerIsVisible(!sideDrawerIsVisible);
    }


    return (
        <Aux>
            <Toolbar
                isAuth={isAuthenticated}
                toggleMenu={sideDrawerToggleHandler} />
            <SideDrawer
                isAuth={isAuthenticated}
                open={sideDrawerIsVisible}
                closed={sideDrawerClosedHandler} />
            <main className={styles.Content}>
                {props.children}
            </main>
        </Aux>
    )

};

export default Layout;