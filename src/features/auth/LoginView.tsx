import { Button, Container, Stack } from "@mui/material";
import { FormContainer, PasswordElement, TextFieldElement } from "react-hook-form-mui";
import { Location, useLocation, useNavigate } from "react-router-dom";
import { testAuthenticatedUser } from "../../mocks/handlers";
import { LoginRequest, LoginResponse, setCredentials, useLoginMutation } from "../auth/authSlice";
import { useCustomAppBar } from "../gui/useCustomAppBar";
import { useAppDispatch } from '../../app/hooks';

export interface RedirectLocationState {
    from?: Location;
}

export default function LoginView() {
    useCustomAppBar("Log In", true);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [login, { isLoading }] = useLoginMutation();
    const location = useLocation();

    const submitForm = async (data: LoginRequest) => {
        if (!isLoading) {
            try {
                const loginResponse: LoginResponse = await login(data).unwrap();
                dispatch(setCredentials(loginResponse));
                navigate((location.state as RedirectLocationState)?.from?.pathname ?? "/");
            } catch (err) {
                // TODO Show proper error dialog
                alert('Failed to log in! \n\n' + JSON.stringify(err, null, 2));
            }
        }
    };

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

