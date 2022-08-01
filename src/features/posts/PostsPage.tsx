import { Card, CardActionArea, CardContent, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { PostActions, PostActionsSkeleton } from "./PostActions";
import { PostAuthor, PostAuthorSkeleton } from "./PostAuthor";
import { ShallowPostData, useGetPostsQuery } from "./postSlice";
import { PostTitle, PostTitleSkeleton } from "./PostTitle";


export const PostsPage = ({ cursor }: { cursor: string | null }) => {
    const navigate = useNavigate();
    const {
        data: posts,
        // error,
        // isError,
        isSuccess,
    } = useGetPostsQuery({ cursor });

    return isSuccess
        ? (
            <Stack spacing={1} sx={{ pt: 1, }}>
                {posts.map((post: ShallowPostData) => (
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
        )
        : <PostsPageSkeleton />;
}

export const PostsPageSkeleton = () => {
    return (
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
}