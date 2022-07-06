import { Button, Stack } from "@mui/material";
import { useForm } from "react-hook-form";
import { FormContainer, TextFieldElement } from "react-hook-form-mui";
import { useParams } from "react-router-dom";
import { CreateCommentData, useCreateCommentMutation } from "./commentSlice";


export const CreateCommentForm = ({ parentCommentId, onCommentAdded }: { parentCommentId?: string, onCommentAdded?: () => void }) => {
    const { postId } = useParams();
    const [addNewComment, { isLoading }] = useCreateCommentMutation();
    const formContext = useForm<{ body: string }>({
        defaultValues: {
            body: ''
        }
    });

    const submitForm = async (data: CreateCommentData) => {
        if (!isLoading) {
            data.parentCommentId = parentCommentId;
            data.postId = postId!; // this form is only shown when displaying a Post, so postId is never null

            try {
                await addNewComment(data).unwrap();
                formContext.reset();
                if (onCommentAdded) {
                    onCommentAdded();
                }
            } catch (err) {
                // TODO Show proper error dialog
                alert('Failed to save the post! \n\n' + JSON.stringify(err, null, 2));
            }
        }
    };

    return (
        <FormContainer
            formContext={formContext}
            onSuccess={submitForm}
        >
            <Stack direction="column" spacing={2} sx={{ m: 1, mb: 3 }}>
                <TextFieldElement id="body" label="Add your comment..." name="body" validation={{required: 'Comment cannot be empty'}}
                    variant="outlined" fullWidth multiline minRows={1} />
                <Stack direction="row-reverse">
                    <Button type="submit" variant="contained" size="medium">Add Comment</Button>
                </Stack>
            </Stack>
        </FormContainer>
    )
}

