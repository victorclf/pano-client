import { Button, Stack, Typography } from "@mui/material";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import { useForm } from "react-hook-form";
import { FormContainer, TextFieldElement } from "react-hook-form-mui";
import { useParams } from "react-router-dom";
import { useHandleDefaultAPIError } from "../api/useHandleDefaultAPIError";
import LinkToLogin from "../auth/LinkToLogin";
import { useAuth } from "../auth/useAuth";
import { CreateCommentData, useCreateCommentMutation } from "./commentSlice";


export const CreateCommentForm = ({ parentCommentId, onCommentAdded }: { parentCommentId?: string, onCommentAdded?: () => void }) => {
    const { loggedIn } = useAuth();
    const { postId } = useParams();
    const [addNewComment, { isLoading }] = useCreateCommentMutation();
    const formContext = useForm<{ body: string }>({
        defaultValues: {
            body: ''
        }
    });
    const handleDefaultAPIError = useHandleDefaultAPIError();

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
                if (!handleDefaultAPIError(err as FetchBaseQueryError)) {
                    // TODO Show proper error dialog
                    alert('Failed to save the post! \n\n' + JSON.stringify(err, null, 2));
                }
            }
        }
    };

    if (!loggedIn) {
        return (
            <Stack direction="column" spacing={2} sx={{ m: 3 }}>
                <LinkToLogin>
                    <Typography variant="subtitle2" color="text.primary">
                        You must be logged in to comment.
                    </Typography>
                </LinkToLogin>
            </Stack>
        )
    }
    return (
        <FormContainer
            formContext={formContext}
            onSuccess={submitForm}
        >
            <Stack direction="column" spacing={2} sx={{ m: 1, mb: 3 }}>
                <TextFieldElement id="body" label="Add your comment..." name="body" validation={{ required: 'Comment cannot be empty' }}
                    variant="outlined" fullWidth multiline minRows={1} />
                <Stack direction="row-reverse">
                    <Button type="submit" variant="contained" size="medium">Add Comment</Button>
                </Stack>
            </Stack>
        </FormContainer>
    )
}

