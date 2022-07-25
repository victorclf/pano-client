import { Cake, Place } from "@mui/icons-material";
import { Avatar, Card, CardContent, Skeleton, Stack, Typography } from "@mui/material";
import { format } from "date-fns";
import { User } from "./userSlice";


export const UserContent = ({ user }: { user: User }) => {
    return (
        <Stack direction="column" spacing={2}>
            <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                <Avatar sx={{ width: 64, height: 64 }}>{user.username[0].toUpperCase()}</Avatar>
                <Stack direction="column" justifyContent="center">
                    <Typography variant="body1" color="text.primary">{user.username ?? 'abc'}</Typography>
                    <Typography variant="body1" color="text.secondary">{`${user.score ?? '...'} points`}</Typography>
                </Stack>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="flex-end">
                <Cake></Cake>
                <Typography variant="body2" color="text.primary">{`Joined on ${format(new Date(user.date), 'PPP')}`}</Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="flex-end">
                <Place></Place>
                <Typography variant="body2" color="text.primary">{user.country}</Typography>
            </Stack>
        </Stack>
    );
};

export const UserContentSkeleton = () => {
    return (
        <Stack direction="column" spacing={2}>
            <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                <Skeleton variant="circular">
                    <Avatar sx={{ width: 64, height: 64 }}>{"?"}</Avatar>
                </Skeleton>
                <Stack direction="column" justifyContent="center">
                    <Skeleton>
                        <Typography variant="body1" color="text.primary">{'username.123'}</Typography>
                    </Skeleton>
                    <Skeleton>
                        <Typography variant="body1" color="text.secondary">{`XXX points`}</Typography>
                    </Skeleton>
                </Stack>
            </Stack>
            <Skeleton>
                <Stack direction="row" spacing={1} alignItems="flex-end">
                    <Cake></Cake>
                    <Typography variant="body2" color="text.primary">{`Joined on ${format(new Date(), 'PPP')}`}</Typography>
                </Stack>
            </Skeleton>
            <Skeleton>
                <Stack direction="row" spacing={1} alignItems="flex-end">
                    <Place></Place>
                    <Typography variant="body2" color="text.primary">{"United States"}</Typography>
                </Stack>
            </Skeleton>
        </Stack>
    );
};

