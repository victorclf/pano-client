import { Card, CardContent, Container, Paper, Skeleton, Typography } from "@mui/material"
import { useParams } from "react-router-dom"
import { useCustomAppBar } from "../gui/useCustomAppBar"
import { Comment, CommentSkeleton } from "./Comment"
import { PostActions, PostActionsSkeleton } from "./PostActions"
import { PostAuthor, PostAuthorSkeleton } from "./PostAuthor"
import { PostBody, PostBodySkeleton } from "./PostBody"
import { useGetCommentsQuery, useGetPostQuery } from "./postSlice"
import { PostTitle, PostTitleSkeleton } from "./PostTitle"


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

    let postContent = (
            <Card sx={{ mt: 2 }}>
                <CardContent>
                    {isSuccessPost ? <PostAuthor username={post.author.username} /> : <PostAuthorSkeleton />}
                    {isSuccessPost ? <PostTitle title={post.title} /> : <PostTitleSkeleton />}
                    {isSuccessPost ? <PostBody body={post.body} /> : <PostBodySkeleton />}
                </CardContent>
                {isSuccessPost ? <PostActions score={post.score} /> : <PostActionsSkeleton />}
            </Card>
    )

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
        commentsContent = (
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

    return (
        <Container maxWidth="md">
            { postContent } 
            { commentsContent }
        </Container>
    )
}

