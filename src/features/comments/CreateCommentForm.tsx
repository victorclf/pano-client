import { Stack, Typography } from "@mui/material";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import { useParams } from "react-router-dom";
import { useHandleDefaultAPIError } from "../api/useHandleDefaultAPIError";
import LinkToLogin from "../auth/LinkToLogin";
import { useAuth } from "../auth/useAuth";
import { CommentForm } from "./CommentForm";
import { CreateCommentData, useCreateCommentMutation } from "./commentSlice";


export const CreateCommentForm = ({ parentCommentId, onCreated }: { parentCommentId?: string, onCreated?: () => void }) => {
    const { loggedIn } = useAuth();
    const { postId } = useParams();
    const [addNewComment, { isLoading }] = useCreateCommentMutation();
    const handleDefaultAPIError = useHandleDefaultAPIError();

    const onSubmit = async ({ body }: { body: string }): Promise<boolean> => {
        if (!isLoading) {
            const data: CreateCommentData = {
                body,
                parentCommentId,
                postId: postId! // this form is only shown when displaying a Post, so postId is never null
            };

            try {
                await addNewComment(data).unwrap();
                if (onCreated) {
                    onCreated();
                }
                return true;
            } catch (err) {
                if (!handleDefaultAPIError(err as FetchBaseQueryError)) {
                    // TODO Show proper error dialog
                    alert('Failed to save the post! \n\n' + JSON.stringify(err, null, 2));
                }
            }
        }
        return false;
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
        <CommentForm onSubmit={onSubmit} />
    );
}

