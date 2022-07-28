import { Menu, ArrowBack } from '@mui/icons-material';
import { AppBar, IconButton, Toolbar, Typography } from '@mui/material';
import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { selectAppBarShowBackButton, selectAppBarTitle } from './guiSlice';
import MenuDrawer from './MenuDrawer';

const DEFAULT_APP_TITLE = 'Pano';

export const MyAppBar = () => {
    const title = useAppSelector(selectAppBarTitle);
    const showBackButton = useAppSelector(selectAppBarShowBackButton);
    const [opened, setOpened] = useState(false);

    const onMenuOpen = () => {
        setOpened(true);
    }

    const onMenuClose = () => {
        setOpened(false);
    }

    let button;
    if (showBackButton) {
        button = (
            <Link className="linkButton" to={-1 as any}>
            <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="back"
                sx={{ mr: 2 }}
            >
                <ArrowBack />
            </IconButton>
            </Link>
        )
    } else {
        button = (
            <>
                <IconButton
                    onClick={onMenuOpen}
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                >
                    <Menu />
                </IconButton>
                <MenuDrawer opened={opened} onClose={onMenuClose} />
            </>
        )
    }

    return (
        <>
            <AppBar position="sticky" sx={{ top: 0, left: 0 }}>
                <Toolbar>
                    {button}
                    <Typography variant="h6" component="div" noWrap={true} sx={{ flexGrow: 1 }}>
                        {title ?? DEFAULT_APP_TITLE}
                    </Typography>
                </Toolbar>
            </AppBar>

            <Outlet />
        </>
    );
}