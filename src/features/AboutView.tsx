import { Container, Divider, Typography } from "@mui/material";
import { useCustomAppBar } from "./gui/useCustomAppBar";


export const AboutView = () => {
    useCustomAppBar('About', true);

    return (
        <Container maxWidth="md">
            <Typography padding={1} paddingTop={2} variant="h6" color="text.primary">The Problem</Typography>
            <Typography padding={1} variant="body1" color="text.primary">Tired of reading about negative news and politics everywhere?</Typography>
            <Typography padding={1} variant="body1" color="text.primary">Looked for your favorite hobbies online only to find more pessimism and fearmongering?</Typography>
            <Typography padding={1} paddingBottom={3} variant="body1" color="text.primary">Feeling down from being bombarded 24/7 about climate change, social issues, economic woes and doomsday predictions?</Typography>
            
            <Divider />
            
            <Typography padding={1} paddingTop={2} variant="h6" color="text.primary">Our Solution</Typography>
            <Typography padding={1} variant="body1" color="text.primary">Welcome to Pano (Politics And Negativity Omitted)!</Typography>
            <Typography padding={1} variant="body1" color="text.primary">Pano is a place without endless political discussion, negativity and bitter criticism.</Typography>
            <Typography padding={1} variant="body1" color="text.primary">Share, discuss, learn and relax in Pano.</Typography>
        </Container>
    )
}

