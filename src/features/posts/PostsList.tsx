import { ArrowDownward, ArrowUpward } from "@mui/icons-material"
import { Card, CardActions, CardContent, CircularProgress, Container, IconButton, Stack, Typography } from "@mui/material"
import { useGetPostsQuery } from "./postSlice";


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

    let content;
    if (isSuccess) {
        content = (
            <>
                {posts.map((post) => (
                    <Card key={post.id} sx={{ pt: 0.5 }}>
                        <CardContent>
                            <Typography variant="caption" color="text.secondary">
                                Posted by {post.author.username}
                            </Typography>
                            <Typography paddingTop={0} variant="h6" color="text.primary">
                                {post.title}
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
                ))}
            </>
        )
    } else {
        content = <CircularProgress />
    }

    return (
        <Container maxWidth="sm">
            <Stack spacing={1} sx={{ pt: 1 }}>
                {content}
            </Stack>
        </Container>
    )
}