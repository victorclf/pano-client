import { Logout } from '@mui/icons-material';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';
import { useAppDispatch } from '../../app/hooks';
import { loggedOut, useLogoutMutation } from '../auth/authSlice';
import { useAuth } from '../auth/useAuth';

export default function MenuLogout() {
    const { user } = useAuth();
    const dispatch = useAppDispatch();
    const [logout, { isLoading }] = useLogoutMutation();

    const handleLogout = async () => {
        if (!isLoading) {
            try {
                await logout().unwrap();
                dispatch(loggedOut());
            } catch (err) {
                if ((err as FetchBaseQueryError)?.status !== 401) {
                    // TODO Show proper error dialog
                    alert('Failed to logout! \n\n' + JSON.stringify(err, null, 2));
                }
            }
        }
    };

    return user 
        ? (
            <ListItem key={'Log out'} disablePadding >
                <ListItemButton onClick={handleLogout}>
                    <ListItemIcon>
                        <Logout></Logout>
                    </ListItemIcon>
                    <ListItemText primary={'Log Out'} />
                </ListItemButton>
            </ListItem>
        )
        : null;
}
