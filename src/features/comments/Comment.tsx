import { Card, Skeleton, Typography } from "@mui/material"
import { useState } from "react"
import { CommentActions } from "./CommentActions"
import { CommentContent } from "./CommentContent"
import { CreateCommentForm } from "./CreateCommentForm"
import { CommentData } from "./commentSlice"
import { useAuth } from "../auth/useAuth"
import { EditCommentForm } from "./EditCommentForm"

export const Comment = ({ comment }: { comment: CommentData }) => {
    const { user, protectFunction } = useAuth();
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const onReply = protectFunction(() => {
        setShowReplyForm((prevState: boolean) => !prevState);
    });
    const onEdit = user && user.id === comment.author.id
        ? () => {
            setEditMode(!editMode);
        }
        : undefined;
    const onCommentAdded = () => {
        setShowReplyForm(false);
    };
    const onCommentEditFinished = () => {
        setEditMode(false);
    }

    // HACK Checking for NULL_WORKAROUND to deal with limitation from mswjs. Remove this later.
    const isReply = comment.parentCommentId !== 'NULL_WORKAROUND' ? Boolean(comment.parentCommentId) : false;

    const topCommentSx = { m: 1, mt: 2 };
    const replySx = { m: 1, mt: 0, ml: 6 };
    const cardSx = isReply
        ? replySx
        : topCommentSx;

    const content = editMode
        ? (
            <Card sx={cardSx}>
                <EditCommentForm commentId={comment.id} body={comment.body} onEdited={onCommentEditFinished} onEditAborted={onCommentEditFinished} />
            </Card>
        )
        : (
            <Card sx={cardSx}>
                <CommentContent comment={comment} />
                <CommentActions comment={comment} onReply={onReply} onEdit={onEdit} />
            </Card>
        );

    return (
        <>
            {content}

            {showReplyForm
                ? <Card sx={replySx}><CreateCommentForm parentCommentId={isReply ? comment.parentCommentId : comment.id} onCreated={onCommentAdded} /></Card>
                : ''}
        </>
    );
}

export const CommentSkeleton = () => {
    return (
        <Skeleton>
            <Typography variant="body1" color="text.primary">
                {"haha djah dha dhaksd hahd haskjd hakhd khbh jkbhdkjfs hkjhsdg jkhdfjk gj gjdsfg jkhsglh skjlfghjk hsgj hsg jksfgjk hsfjgh skhgkl sfjghs haha  djah dha dhaksd hahd haskjd hakhd khbh jkbhdkjfs hkjhsdg jkhdfjk gj gjdsfg jkhsglh"}
            </Typography>
        </Skeleton>
    )
}