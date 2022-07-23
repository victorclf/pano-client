import { Button, Container, Stack } from "@mui/material";
import { FormContainer, PasswordElement, TextFieldElement } from "react-hook-form-mui";
import { Location, Navigate, useLocation } from "react-router-dom";
import { useAppDispatch } from '../../app/hooks';
import { testAuthenticatedUser } from "../../mocks/handlers";
import { LoginRequest, LoginResponse, loggedIn, useLoginMutation } from "../auth/authSlice";
import { useCustomAppBar } from "../gui/useCustomAppBar";
import { useAuth } from "./useAuth";

export interface RedirectLocationState {
    from?: Location;
}

export default function LoginView() {
    const { loggedIn: isLoggedIn } = useAuth();
    useCustomAppBar("Log In", true);
    const dispatch = useAppDispatch();
    const [login, { isLoading }] = useLoginMutation();
    const location = useLocation();

    const submitForm = async (data: LoginRequest) => {
        if (!isLoading) {
            try {
                const loginResponse: LoginResponse = await login(data).unwrap();
                dispatch(loggedIn(loginResponse));
                // Navigation is handled by the <Navigate> component during rerender with a valid user.
            } catch (err) {
                // TODO Show proper error dialog
                alert('Failed to log in! \n\n' + JSON.stringify(err, null, 2));
            }
        }
    };

    if (isLoggedIn) {
        return <Navigate to={(location.state as RedirectLocationState)?.from?.pathname ?? "/"} replace />
    }
    return (
        <Container maxWidth="xs">
            <FormContainer
                defaultValues={{ username: testAuthenticatedUser.username, password: testAuthenticatedUser.password}}
                onSuccess={submitForm}
            >
                <Stack direction="column" spacing={2} sx={{ mt: 2 }}>
                    <TextFieldElement required label="Username" name="username" variant="outlined" />
                    <PasswordElement required label={'Password'} name={'password'}  />
                    <Stack direction="row">
                        <Button type="submit" variant="contained" size="large">Log In</Button>
                    </Stack>
                </Stack>
            </FormContainer>
        </Container>
    )
}

