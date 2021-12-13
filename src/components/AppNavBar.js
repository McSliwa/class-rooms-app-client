import React, { useState, useEffect } from 'react';
import {
    Paper, AppBar, Toolbar, IconButton, Tabs, Tab
} from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import LogoutIcon from '@mui/icons-material/Logout';
import { getRouterConfig } from "../config/config";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from 'react-router-dom';

const configRouter = getRouterConfig();
const mappingTabToPath = {
    1: configRouter.aliasHome,
    2: configRouter.aliasClassrooms,
    3: configRouter.aliasReservations,
    4: configRouter.aliasClassroomsAdm,
    5: configRouter.aliasItemsAdm
};

function AppNavBar(props) {
    const nav = useNavigate();
    const [value, setValue] = useState(1);
    const {
        user,
        isAuthenticated,
        loginWithRedirect,
        logout
    } = useAuth0();

    useEffect(() => {
    });

    const handleTabChange = (event, newValue) => {
        nav(mappingTabToPath[newValue]);
        setValue(newValue);
    };

    const nextTab = (event) => {
        const nextValue = value === 5 ? 1 : (value + 1);
        handleTabChange(event, nextValue);
    };

    return (
        <AppBar component={Paper} variant='elevation' align='left' position="sticky" sx={{
            color: '#007ECC', fontWeight: 'bold',
            background: 'linear-gradient(45deg, #E69A2E 20%,#FFC87A 90%)'
        }}>
            <Toolbar>
                <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}
                    onClick={nextTab}
                >
                    <DoubleArrowIcon />
                </IconButton>
                <Tabs onChange={handleTabChange} aria-label="basic tabs example"
                    sx={{ flexGrow: 1 }} variant='scrollable' scrollButtons='auto'
                    allowScrollButtonsMobile value={value}
                >
                    <Tab label="O aplikacji" value={1} />
                    <Tab label="Szukaj" value={2} />
                    <Tab label="Rezerwacje" value={3} />
                    <Tab label="Pomieszczenia" value={4} />
                    <Tab label="Wyposażenie" value={5} />
                </Tabs>
                {
                    isAuthenticated ?
                        (
                            <>
                                <IconButton aria-label="account of current user" aria-controls="menu-appbar"
                                    aria-haspopup="true" color="inherit" edge='end' size='large' sx={{ mr: 1 }}
                                    onClick={logout}
                                >
                                    <LogoutIcon sx={{ fontSize: 40 }} />
                                </IconButton>
                                <img
                                    src={user.picture}
                                    alt="Profile"
                                    className="nav-user-profile rounded-circle"
                                    width="40" />
                            </>
                        ) :
                        (
                            <IconButton aria-label="account of current user" aria-controls="menu-appbar"
                                aria-haspopup="true" color="inherit" edge='end' size='large'
                                onClick={loginWithRedirect}
                            >
                                <AccountCircle sx={{ fontSize: 40 }} />
                            </IconButton>
                        )
                }
            </Toolbar>
        </AppBar>
    );
}

export default AppNavBar;