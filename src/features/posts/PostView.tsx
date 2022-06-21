import { Card, CardContent, Container } from "@mui/material"
import { useParams } from "react-router-dom"
import { useCustomAppBar } from "../gui/useCustomAppBar"
import { ServerErrorView } from "../ServerErrorView"
import { Comments, CommentsSkeleton } from "./Comments"
import { PostActions, PostActionsSkeleton } from "./PostActions"
import { PostAuthor, PostAuthorSkeleton } from "./PostAuthor"
import { PostBody, PostBodySkeleton } from "./PostBody"
import { useGetCommentsQuery, useGetPostQuery } from "./postSlice"
import { PostTitle, PostTitleSkeleton } from "./PostTitle"


export const PostView = () => {
    const { postId } = useParams();
    
    const {
        data: post,
        error,
        isError,
        isSuccess: isSuccessPost,
    } = useGetPostQuery(postId!);  // router only leads here if postId not null

    const {
        data: comments,
        isSuccess: isSuccessComments,
    } = useGetCommentsQuery(postId!);  // router only leads here if postId not null

    useCustomAppBar(post?.title ?? '', true);

    if (isError) {
        console.log(error);
        return <ServerErrorView rtkError={error} />
    }

    let postContent = (
            <Card sx={{ mt: 2 }}>
                <CardContent>
                    {isSuccessPost ? <PostAuthor username={post.author.username} date={post.date} /> : <PostAuthorSkeleton />}
                    {isSuccessPost ? <PostTitle title={post.title} /> : <PostTitleSkeleton />}
                    {isSuccessPost ? <PostBody body={post.body} /> : <PostBodySkeleton />}
                </CardContent>
                {isSuccessPost ? <PostActions post={post} /> : <PostActionsSkeleton />}
            </Card>
    )
    
    let commentsContent = isSuccessComments 
        ? <Comments comments={comments} />
        : <CommentsSkeleton />;

    return (
        <Container maxWidth="md">
            { postContent } 
            { commentsContent }
        </Container>
    )
}

