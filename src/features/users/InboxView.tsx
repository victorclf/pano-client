import { Container, Typography } from "@mui/material"
import { useCustomAppBar } from "../gui/useCustomAppBar"


export const InboxView = () => {
    useCustomAppBar('Inbox', true);

    return (
        <Container maxWidth="md">
            <Typography paddingTop={2} variant="h6" color="text.primary">No messages.</Typography>
        </Container>
    )
}

