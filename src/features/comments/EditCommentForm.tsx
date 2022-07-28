import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import { useParams } from "react-router-dom";
import { useHandleDefaultAPIError } from "../api/useHandleDefaultAPIError";
import { CommentForm } from "./CommentForm";
import { EditCommentData, useEditCommentMutation } from "./commentSlice";


export const EditCommentForm = ({ commentId, body, onEdited, onEditAborted }: { commentId: string, body?: string, onEdited?: () => void, onEditAborted: () => void }) => {
    const { postId } = useParams();
    const [editComment, { isLoading }] = useEditCommentMutation();
    const handleDefaultAPIError = useHandleDefaultAPIError();

    const onSubmit = async ({ body }: { body: string }): Promise<boolean> => {
        if (!isLoading) {
            const data: EditCommentData = {
                body,
                postId: postId!, // this form is only shown when displaying a Post, so postId is never null
                commentId: commentId! // same reasoning here
            };

            try {
                await editComment(data).unwrap();
                if (onEdited) {
                    onEdited();
                }
                return true;
            } catch (err) {
                if (!handleDefaultAPIError(err as FetchBaseQueryError)) {
                    // TODO Show proper error dialog
                    alert('Failed to edit the post! \n\n' + JSON.stringify(err, null, 2));
                }
            }
        }
        return false;
    };

    return (
        <CommentForm commentId={commentId} body={body} onSubmit={onSubmit} onCancel={onEditAborted} />
    );
}

