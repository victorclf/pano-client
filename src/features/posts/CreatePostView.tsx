import { Button, Container, Stack } from "@mui/material";
import { FormContainer, TextFieldElement } from "react-hook-form-mui";
import { useNavigate } from "react-router-dom";
import { useCustomAppBar } from "../gui/useCustomAppBar";
import { CreatePostData, PostData, useCreatePostMutation } from "./postSlice";


export const CreatePostView = () => {
    useCustomAppBar("New Post", true);
    const navigate = useNavigate();
    const [addNewPost, { isLoading }] = useCreatePostMutation();

    const submitForm = async (data: CreatePostData) => {
        if (!isLoading) {
            try {
                const newPost: PostData = await addNewPost(data).unwrap();

                navigate("../" + newPost.id);
            } catch (err) {
                // FIXME Show proper error dialog
                alert('Failed to save the post: + err');
            }
        }
    };

    return (
        <Container maxWidth="md">
            <FormContainer
                defaultValues={{ body: '' }}
                onSuccess={submitForm}
            >
                <Stack direction="column" spacing={2} sx={{ mt: 2 }}>
                    <TextFieldElement required label="Title" name="title" variant="outlined" fullWidth />
                    <TextFieldElement id="body" label="Text" name="body" variant="outlined" fullWidth multiline minRows={5} />
                    <Stack direction="row">
                        <Button type="submit" variant="contained" size="large">Create</Button>
                    </Stack>
                </Stack>
            </FormContainer>

            {/* Render without react-hook-form */}
            {/* <Container maxWidth="md" disableGutters>
            {/* <Card sx={{mt: 0, p: 2}} > */}
            {/* <Box component="form">
                    <Stack direction="column" spacing={2} sx={{mt:2}}>
                        <TextField id="title" label="Title" variant="outlined" fullWidth/>
                        <TextField id="body" label="Text" variant="outlined" fullWidth multiline minRows={5}/>
                        <Stack direction="row">
                            <Button variant="contained" size="large">Create</Button>
                        </Stack>
                    </Stack>
                </Box> */}
            {/* </Card> */}
        </Container>
    )
}
