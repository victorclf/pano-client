import { Button, Stack } from "@mui/material";
import { FormContainer, TextFieldElement } from "react-hook-form-mui";
// import { useNavigate } from "react-router-dom";
// import { CreateCommentData, PostData, useCreateCommentMutation } from "./postSlice";


export const CreateCommentForm = () => {
    // const navigate = useNavigate();
    // const [addNewComment, { isLoading }] = useCreateCommentMutation();

    const submitForm = async (data: any) => {
        // if (!isLoading) {
        //     try {
        //         const newPost: PostData = await addNewPost(data).unwrap();

        //         navigate("../" + newPost.id);
        //     } catch (err) {
        //         // FIXME Show proper error dialog
        //         alert('Failed to save the post: + err');
        //     }
        // }
    };

    return (
            <FormContainer
                defaultValues={{ body: '' }}
                onSuccess={submitForm}
            >
                <Stack direction="column" spacing={2} sx={{ m: 1, mb: 3 }}>
                    <TextFieldElement id="body" label="Add your comment..." name="body" variant="outlined" fullWidth multiline minRows={1} />
                    <Stack direction="row-reverse">
                        <Button type="submit" variant="contained" size="medium">Add Comment</Button>
                    </Stack>
                </Stack>
            </FormContainer>
    )
}

