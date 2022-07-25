import InboxIcon from '@mui/icons-material/MoveToInbox';
import InfoIcon from '@mui/icons-material/Info';
import { Avatar, ListItemAvatar } from '@mui/material';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import MenuLogout from './MenuLogout';

export default function MenuDrawer({ opened, onClose }: { opened: boolean, onClose: () => void }) {
    const { user } = useAuth();
    const location = useLocation();

    const userDisplay = user
        ? (<List>
            <Link className="linkButton" to={`/users/${user.id}`}>
                <ListItem key={user!.username} >
                    <ListItemButton>
                        <ListItemAvatar>
                            <Avatar>{user!.username[0].toUpperCase()}</Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={user!.username} secondary={`${user.score} points`} />
                    </ListItemButton>
                </ListItem>
            </Link>
        </List>)
        : (<List>
            <Link className="linkButton" to={'/login'} state={{ from: location }}>
                <ListItem key={'login'} disablePadding >
                    <ListItemButton>
                        <ListItemIcon>
                            <Avatar></Avatar>
                        </ListItemIcon>
                        <ListItemText primary={'Log In'} />
                    </ListItemButton>
                </ListItem>
            </Link>
        </List>);

    return (
        <div>
            <>
                <Drawer
                    anchor="left"
                    open={opened}
                    onClose={onClose}
                >
                    <Box
                        sx={{ width: 250 }}
                        role="presentation"
                        onClick={onClose}
                    // onKeyDown={closeMenu}
                    >
                        {userDisplay}

                        <Divider />

                        <List>
                            <Link className="linkButton" to={'/messages'}>
                                <ListItem key={'inbox'} disablePadding >
                                    <ListItemButton>
                                        <ListItemIcon>
                                            <InboxIcon></InboxIcon>
                                        </ListItemIcon>
                                        <ListItemText primary={'Inbox'} />
                                    </ListItemButton>
                                </ListItem>
                            </Link>

                            <MenuLogout></MenuLogout>
                        </List>

                        <Divider />

                        <List>
                            <Link className="linkButton" to={'/about'}>
                                <ListItem key={'about'} disablePadding >
                                    <ListItemButton>
                                        <ListItemIcon>
                                            <InfoIcon></InfoIcon>
                                        </ListItemIcon>
                                        <ListItemText primary={'About Pano'} />
                                    </ListItemButton>
                                </ListItem>
                            </Link>
                        </List>
                    </Box>
                </Drawer>
            </>
        </div>
    );
}
