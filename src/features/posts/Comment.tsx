import { Card, Skeleton, Typography } from "@mui/material"
import { useState } from "react"
import { CommentActions } from "./CommentActions"
import { CommentContent } from "./CommentContent"
import { CreateCommentForm } from "./CreateCommentForm"
import { CommentData } from "./postSlice"

export const Comment = ({ comment }: { comment: CommentData }) => {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const onReply = () => {
        setShowReplyForm((prevState: boolean) => !prevState);
    };

    // HACK Checking for NULL_WORKAROUND to deal with limitation from mswjs. Remove this later.
    const isReply = comment.parentCommentId !== 'NULL_WORKAROUND' ? Boolean(comment.parentCommentId) : false;

    const topCommentSx = { m: 1, mt: 2 };
    const replySx = { m: 1, mt: 0, ml: 6 };
    const cardSx = isReply 
        ? replySx
        : topCommentSx;
    return (
            <>
                <Card sx={cardSx}>
                    <CommentContent comment={comment} />
                    <CommentActions comment={comment} onReply={onReply} />
                </Card>

                {showReplyForm 
                    ? <Card sx={replySx}><CreateCommentForm /></Card>
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