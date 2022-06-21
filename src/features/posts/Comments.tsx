import { Paper, Skeleton, Typography } from "@mui/material"
import { Comment, CommentSkeleton } from "./Comment"
import { CommentData } from "./postSlice"


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

            {comments.map((comment) => (
                <Comment key={comment.id} comment={comment} />
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
            
            {Array.from(new Array(5), (_, i) => (
                <CommentSkeleton key={i} />
            ))}
        </Paper>
    )
}