import { ArrowDownward, ArrowUpward } from "@mui/icons-material"
import { Card, CardActions, CardContent, CircularProgress, Container, IconButton, Paper, Typography } from "@mui/material"
import { useParams } from "react-router-dom"
import { useCustomAppBar } from "../gui/useCustomAppBar"
import { Comment } from "./Comment"
import { useGetCommentsQuery, useGetPostQuery } from "./postSlice"


export const Post = () => {
    const { postId } = useParams();
    
    const {
        data: post,
        isSuccess: isSuccessPost,
    } = useGetPostQuery(postId!);  // router only leads here if postId not null

    const {
        data: comments,
        isSuccess: isSuccessComments,
    } = useGetCommentsQuery(postId!);  // router only leads here if postId not null

    useCustomAppBar(post?.title ?? '', true);

    let postContent;
    if (isSuccessPost) {
        postContent = (
            <Card sx={{ mt: 2 }}>
                <CardContent>
                    <Typography variant="caption" color="text.secondary">
                        Posted by {post.author.username}
                    </Typography>
                    <Typography paddingTop={0} variant="h6" color="text.primary">
                        {post.title}
                    </Typography>
                    <Typography paddingTop={2} variant="body1" color="text.primary">
                        {post.body}
                    </Typography>
                </CardContent>
                <CardActions disableSpacing sx={{ pt: 0 }}>
                    <IconButton aria-label="upvote">
                        <ArrowUpward />
                    </IconButton>
                    <Typography variant="body2" color="text.primary" sx={{ textAlign: 'center', width: 32 }}>
                        {post.score}
                    </Typography>
                    <IconButton aria-label="downvote">
                        <ArrowDownward />
                    </IconButton>
                </CardActions>
            </Card>
        )
    } else {
        postContent = <CircularProgress />
    }

    let commentsContent;
    if (isSuccessComments) {
        commentsContent = (
            <Paper sx={{ mt: 3, mb: 3, pb: 1 }}>
                <Typography padding={2} variant="h6" color="text.primary">
                    {comments.length} comments
                </Typography>

                {comments.map((comment) => (
                    <Comment key={comment.id} comment={comment} />
                ))}
            </Paper>
        )
    } else {
        commentsContent = <CircularProgress />
    }

    return (
        <Container maxWidth="md">
            { postContent } 
            { commentsContent }
        </Container>
    )
}

