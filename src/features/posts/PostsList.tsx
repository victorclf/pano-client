import { Add } from "@mui/icons-material";
import { Card, CardActionArea, CardContent, Container, Fab, Stack } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
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
    const navigate = useNavigate();

    const content = isSuccess
        ? posts.map((post) => (
            <Card id={post.id} key={post.id}>
                <CardActionArea onClick={() => {navigate(`/posts/${post.id}`)}}>
                    <CardContent>
                        <PostAuthor author={post.author} date={post.date} />
                        <PostTitle title={post.title} />
                    </CardContent>
                </CardActionArea>
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
        <Container maxWidth="md">
            <Stack spacing={1} sx={{ pt: 1 }}>
                {content}

                <Link className="linkButton" to={'/posts/new'}>
                    <Fab color="primary" aria-label="add" sx={{ m: 0, position: "fixed", top: "auto", left: "auto", bottom: 12, right: 12, zIndex: "modal" }}>
                        <Add />
                    </Fab>
                </Link>
            </Stack>
        </Container>
    )
}