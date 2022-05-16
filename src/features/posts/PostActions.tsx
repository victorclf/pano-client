import { ArrowDownward, ArrowUpward } from "@mui/icons-material";
import { CardActions, IconButton, Skeleton, Typography } from "@mui/material";
import { ShallowPostData, useDownvoteMutation, useNonvoteMutation, useUpvoteMutation } from "./postSlice";

export const PostActions = ({post}: {post: ShallowPostData}) => {
    const [upvote, {isLoading: isLoadingUpvote}] = useUpvoteMutation();
    const [nonvote, {isLoading: isLoadingNonvote}] = useNonvoteMutation();
    const [downvote, {isLoading: isLoadingDownvote}] = useDownvoteMutation();

    const isLoading = isLoadingUpvote && isLoadingNonvote && isLoadingDownvote;

    const upvoteOnClick = () => {
        if (!isLoading) {
            if (!post.upvoted) {
                upvote(post.id);
            } else {
                nonvote(post.id);
            }
        }
    };

    const downvoteOnClick = () => {
        if (!isLoading) {
            if (!post.downvoted) {
                downvote(post.id);
            } else {
                nonvote(post.id);
            }
        }
    };
    
    return (
        <CardActions disableSpacing sx={{ pt: 0.5, pb: 0.5 }}>
            <IconButton aria-label="upvote" onClick={upvoteOnClick}>
                {post.upvoted ? <ArrowUpward color="primary" /> : <ArrowUpward  />}
            </IconButton>
            <Typography variant="body2" color="text.primary" sx={{ textAlign: 'center', width: 32 }}>
                {post.score}
            </Typography>
            <IconButton aria-label="downvote" onClick={downvoteOnClick}>
                {post.downvoted ? <ArrowDownward color="primary" /> : <ArrowDownward  />}
            </IconButton>
        </CardActions>
    )
}

export const PostActionsSkeleton = () => {
    const mockPost: ShallowPostData = {
        id: "0",
        title: "abc",
        author: {
            id: "0",
            username: "abc"
        },
        score: 999,
        upvoted: false,
        downvoted: false
    };

    return (
        <Skeleton sx={{ ml: 2}}>
            <PostActions post={mockPost} />
        </Skeleton>
    )
}