import { Card, CardContent, Container } from "@mui/material"
import { useParams } from "react-router-dom"
import { useCustomAppBar } from "../gui/useCustomAppBar"
import { ServerErrorView } from "../ServerErrorView"
import { UserContent, UserContentSkeleton } from "./UserContent"
import { useGetUserQuery } from "./userSlice"


export const UserView = () => {
    const { userId } = useParams();

    const {
        data: user,
        error,
        isError,
        isSuccess,
    } = useGetUserQuery(userId!);  // router only leads here if userId not null

    useCustomAppBar(`Profile`, true);

    if (isError) {
        console.log(error);
        return <ServerErrorView rtkError={error} />
    }

    return (
        <Container maxWidth="xs">
            <Card sx={{ mt: 2 }}>
                <CardContent>
                    {isSuccess ? <UserContent user={user} /> : <UserContentSkeleton />}
                </CardContent>
            </Card>
        </Container>
    )
}

