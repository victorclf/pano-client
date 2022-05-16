import { Card, CardActionArea, CardContent, Container, Stack } from "@mui/material";
import { Link } from "react-router-dom";
import { PostActions, PostActionsSkeleton } from "./PostActions";
import { PostAuthor, PostAuthorSkeleton } from "./PostAuthor";
import { useGetPostsQuery } from "./postSlice";
import { PostTitle, PostTitleSkeleton } from "./PostTitle";


export const PostsList = () => {
    const {
        data: posts = [],
        // isLoading,
        // isFetching,
        isSuccess,
        // isError,
        // error,
        // refetch
    } = useGetPostsQuery();

    const content = isSuccess
        ? posts.map((post) => (
            <Card id={post.id} key={post.id}>
                <Link className="linkButton" to={`/posts/${post.id}`}>
                    <CardActionArea>
                        <CardContent>
                            <PostAuthor username={post.author.username} date={post.date} />
                            <PostTitle title={post.title} />
                        </CardContent>
                    </CardActionArea>
                </Link>
                <PostActions post={post} />
            </Card>
        ))
        : Array.from(new Array(5), (_, i) => (
            <Card key={i}>
                <CardActionArea>
                    <CardContent>
                        <PostAuthorSkeleton />
                        <PostTitleSkeleton />
                    </CardContent>
                </CardActionArea>
                <PostActionsSkeleton />
            </Card>
        ));

    return (
        <Container maxWidth="sm">
            <Stack spacing={1} sx={{ pt: 1 }}>
                {content}
            </Stack>
        </Container>
    )
}