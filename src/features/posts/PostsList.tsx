import { Add } from "@mui/icons-material";
import { Card, CardActionArea, CardContent, Container, Fab, Stack, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Link, useNavigate } from "react-router-dom";
import { PostActions, PostActionsSkeleton } from "./PostActions";
import { PostAuthor, PostAuthorSkeleton } from "./PostAuthor";
import { ShallowPostData, useLazyGetPostsQuery } from "./postSlice";
import { PostTitle, PostTitleSkeleton } from "./PostTitle";


export const PostsList = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState<ShallowPostData[]>([]);
    const [nextCursor, setNextCursor] = useState<string | null>(null);
    const [trigger] = useLazyGetPostsQuery();

    const fetchMore = useCallback(
        async () => {
            try {
                const newPosts = await trigger({ cursor: nextCursor }, true).unwrap();
                setPosts([...posts, ...newPosts]);
                setNextCursor(newPosts.at(-1)?.id ?? null);
            } catch (err) {
                alert(`Failed to fetch posts! \n\n` + JSON.stringify(err, null, 2));
            }
        }, [nextCursor, posts, trigger]);


    // Triggers the initial fetch which must only happen when component first renders b/c
    // InfiniteScroll only triggers the subsequent fetches, i.e. when the scroll reaches bottom.
    useEffect(() => {
        if (posts.length <= 0) {
            fetchMore();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const hasMoreData = nextCursor !== null;

    const postsSkeleton = (
        <Stack spacing={1} sx={{ pt: 1 }}>
            {Array.from(new Array(10), (_, i) => (
                <Card key={i}>
                    <CardActionArea>
                        <CardContent>
                            <PostAuthorSkeleton />
                            <PostTitleSkeleton />
                        </CardContent>
                    </CardActionArea>
                    <PostActionsSkeleton />
                </Card>
            ))}
        </Stack>
    );

    const content = posts.length > 0
        ? (
            <InfiniteScroll
                className="myInfiniteScroll"
                dataLength={posts.length}
                next={fetchMore}
                hasMore={hasMoreData}
                loader={postsSkeleton}
                endMessage={<Typography variant="body1" color="text.primary" sx={{ textAlign: 'center', m: 3 }}>No more posts :-(</Typography>}
            >
                <Stack spacing={1} sx={{ pt: 1, }}>
                    {posts.map((post) => (
                        <Card id={post.id} key={post.id}>
                            <CardActionArea onClick={() => { navigate(`/posts/${post.id}`) }}>
                                <CardContent>
                                    <PostAuthor author={post.author} date={post.date} />
                                    <PostTitle title={post.title} />
                                </CardContent>
                            </CardActionArea>
                            <PostActions post={post} />
                        </Card>
                    ))}
                </Stack>
            </InfiniteScroll>
        )
        : postsSkeleton;

    return (
        <Container maxWidth="md">
            {content}

            <Link className="linkButton" to={'/posts/new'}>
                <Fab color="primary" aria-label="add" sx={{ m: 0, position: "fixed", top: "auto", left: "auto", bottom: 12, right: 12, zIndex: "modal" }}>
                    <Add />
                </Fab>
            </Link>
        </Container>
    )
}