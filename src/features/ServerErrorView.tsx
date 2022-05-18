import { Container } from "@mui/material";

// FIXME declared type for error in RTK query does not include status property. Using 'any' here as a temp workaround.
export const ServerErrorView = ({ rtkError }: {rtkError?: any}) => {
    let errorContent;
    
    if (rtkError?.status === 404) {
        errorContent = <img src="/404.png" alt="error" />;
    } else {
        errorContent = <img src="/error.png" alt="error" />
    }

    return (
        <Container maxWidth="md">
            {errorContent}
        </Container>
    )
}

