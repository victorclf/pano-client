import { Button, Stack } from "@mui/material";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import { useForm } from "react-hook-form";
import { FormContainer, TextFieldElement } from "react-hook-form-mui";
import { useParams } from "react-router-dom";
import { useHandleDefaultAPIError } from "../api/useHandleDefaultAPIError";
import { EditCommentData, useEditCommentMutation } from "./commentSlice";


export const EditCommentForm = ({ commentId, body, onCommentEdited, onCommentEditAborted }: { commentId: string, body?: string, onCommentEdited?: () => void, onCommentEditAborted: () => void }) => {
    const { postId } = useParams();
    const [editComment, { isLoading }] = useEditCommentMutation();
    const formContext = useForm<{ body: string }>({
        defaultValues: {
            body: body ?? ''
        }
    });
    const handleDefaultAPIError = useHandleDefaultAPIError();

    const submitForm = async (data: EditCommentData) => {
        if (!isLoading) {
            data.postId = postId!; // this form is only shown when displaying a Post, so postId is never null
            data.commentId = commentId!; // same reasoning here

            try {
                await editComment(data).unwrap();
                formContext.reset();
                if (onCommentEdited) {
                    onCommentEdited();
                }
            } catch (err) {
                if (!handleDefaultAPIError(err as FetchBaseQueryError)) {
                    // TODO Show proper error dialog
                    alert('Failed to edit the post! \n\n' + JSON.stringify(err, null, 2));
                }
            }
        }
    };
    
    return (
        <FormContainer
            formContext={formContext}
            onSuccess={submitForm}
        >
            <Stack direction="column" spacing={2} sx={{ m: 1, mb: 3 }}>
                <TextFieldElement id="body" label="Add your comment..." name="body" validation={{ required: 'Comment cannot be empty' }}
                    variant="outlined" fullWidth multiline minRows={1} />
                <Stack spacing={1} direction="row-reverse">
                    <Button type="submit" variant="contained" size="medium">Edit Comment</Button>
                    <Button variant="outlined" size="medium" onClick={onCommentEditAborted}>Cancel</Button>
                </Stack>
            </Stack>
        </FormContainer>
    )
}

