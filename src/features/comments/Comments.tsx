import { Paper, Skeleton, Typography } from "@mui/material";
import { CommentThread, CommentThreadSkeleton } from "./CommentThread";
import { CreateCommentForm } from "./CreateCommentForm";
import { CommentData } from "./commentSlice";


export const Comments = ({ comments }: { comments: CommentData[] }) => {
    const numComments = comments
        ?.map((comment) => 1 + (comment.replies?.length ?? 0))
        ?.reduce((previousValue, currentValue) => previousValue + currentValue, 0) 
        ?? 0;
    return (
        <Paper sx={{ mt: 3, mb: 3, pb: 1 }}>
            <Typography padding={2} variant="h6" color="text.primary">
                {numComments} comments
            </Typography>

            <CreateCommentForm />

            {comments.map((comment) => (
                <CommentThread key={comment.id} comment={comment} />
            ))}
        </Paper>
    )
}

export const CommentsSkeleton = () => {
    return (
        <Paper sx={{ mt: 3, mb: 3, p: 2 }}>
            <Skeleton>
                <Typography padding={2} variant="h6" color="text.primary">
                    comments
                </Typography>
            </Skeleton>
            
            <CommentThreadSkeleton />
        </Paper>
    )
}