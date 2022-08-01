import { Add } from "@mui/icons-material";
import { CircularProgress, Container, Fab, Stack, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Link } from "react-router-dom";
import { useAppDispatch } from "../../app/hooks";
import { extendedApiSlice, useLazyGetPostsQuery } from "./postSlice";
import { PostsPage, PostsPageSkeleton } from "./PostsPage";


export const PostsList = () => {
    const [visibleCursors, setVisibleCursors] = useState<Array<string | null>>([]);
    const [numPosts, setNumPosts] = useState(0);
    const [nextCursor, setNextCursor] = useState<string | null>(null);
    const [trigger] = useLazyGetPostsQuery();
    const dispatch = useAppDispatch();

    const fetchMore = useCallback(
        async () => {
            try {
                const newPosts = await trigger({ cursor: nextCursor }, true).unwrap();
                setNumPosts(numPosts + newPosts.length);
                setVisibleCursors([...visibleCursors!, nextCursor!]);
                setNextCursor(newPosts.at(-1)?.id ?? null);
            } catch (err) {
                alert(`Failed to fetch posts! \n\n` + JSON.stringify(err, null, 2));
            }
        }, [nextCursor, numPosts, trigger, visibleCursors]);

    const hasMoreData = nextCursor !== null;
    const refresh = () => {
        setVisibleCursors([]);
        setNextCursor(null);
        dispatch(extendedApiSlice.util.invalidateTags(['Post']));
    };

    // Triggers the initial fetch b/c InfiniteScroll only triggers the subsequent fetches, i.e. when the scroll reaches bottom.
    useEffect(() => {
        if (visibleCursors.length === 0) {
            fetchMore();
        }
    }, [fetchMore, visibleCursors]);

    const content = visibleCursors.length > 0
        ? (
            <InfiniteScroll
                className="myInfiniteScroll"
                dataLength={numPosts}
                next={fetchMore}
                hasMore={hasMoreData}
                loader={<PostsPageSkeleton />}
                endMessage={<Typography variant="body1" color="text.primary" align="center" sx={{ m: 3 }}>No more posts :-(</Typography>}

                refreshFunction={refresh}
                pullDownToRefresh
                pullDownToRefreshThreshold={50}
                pullDownToRefreshContent={
                    <Typography variant="body1" color="text.primary" align="center">&#8595; Pull down to refresh</Typography>
                }
                releaseToRefreshContent={
                    <Stack spacing={5} alignItems="center">
                        <CircularProgress size={32} sx={{ textAlign: "center" }} />
                    </Stack>
                }
            >
                <Stack spacing={1} sx={{ pt: 1, }}>
                    {visibleCursors.map((cursor) => (
                        <PostsPage key={cursor} cursor={cursor} />
                    ))}
                </Stack>
            </InfiniteScroll>
        )
        : <PostsPageSkeleton />;

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