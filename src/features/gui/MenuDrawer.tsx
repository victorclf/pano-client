import MailIcon from '@mui/icons-material/Mail';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import { Avatar, ListItemAvatar } from '@mui/material';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

export default function MenuDrawer({ opened, onClose }: { opened: boolean, onClose: () => void }) {
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
                        <List>
                            <ListItem key={'Username.Here'} >
                                {/* <ListItemButton> */}
                                    <ListItemAvatar>
                                        <Avatar>U</Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary={'Username.Here'} secondary={'117 points'} />
                                {/* </ListItemButton> */}
                            </ListItem>
                        </List>
                        <Divider />
                        <List>
                            <ListItem key={'inbox'} disablePadding >
                                <ListItemButton>
                                    <ListItemIcon>
                                        <InboxIcon></InboxIcon>
                                    </ListItemIcon>
                                    <ListItemText primary={'Inbox'} />
                                </ListItemButton>
                            </ListItem>
                            <ListItem key={'Log out'} disablePadding >
                                <ListItemButton>
                                    <ListItemIcon>
                                        <MailIcon></MailIcon>
                                    </ListItemIcon>
                                    <ListItemText primary={'Log out'} />
                                </ListItemButton>
                            </ListItem>
                        </List>
                    </Box>
                </Drawer>
            </>
        </div>
    );
}
