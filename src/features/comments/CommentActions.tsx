import { AddComment, ArrowDownward, ArrowUpward, Edit } from "@mui/icons-material";
import { CardActions, IconButton, Typography } from "@mui/material";
import { useAuth } from "../auth/useAuth";
import { CommentData, useDownvoteCommentMutation, useNonvoteCommentMutation, useUpvoteCommentMutation } from "./commentSlice";

export const CommentActions = ({ comment, onReply, onEdit }: { comment: CommentData, onReply: () => void, onEdit?: () => void }) => {
    const { protectFunction } = useAuth();
    const [upvote, { isLoading: isLoadingUpvote }] = useUpvoteCommentMutation();
    const [nonvote, { isLoading: isLoadingNonvote }] = useNonvoteCommentMutation();
    const [downvote, { isLoading: isLoadingDownvote }] = useDownvoteCommentMutation();

    const isLoading = isLoadingUpvote && isLoadingNonvote && isLoadingDownvote;

    const upvoteOnClick = protectFunction(() => {
        if (!isLoading) {
            if (!comment.upvoted) {
                upvote({ postId: comment.postId, commentId: comment.id });
            } else {
                nonvote({ postId: comment.postId, commentId: comment.id });
            }
        }
    });

    const downvoteOnClick = protectFunction(() => {
        if (!isLoading) {
            if (!comment.downvoted) {
                downvote({ postId: comment.postId, commentId: comment.id });
            } else {
                nonvote({ postId: comment.postId, commentId: comment.id });
            }
        }
    });

    return (
        <CardActions disableSpacing >
            <IconButton aria-label="upvote" onClick={upvoteOnClick}>
                {comment.upvoted ? <ArrowUpward color="primary" /> : <ArrowUpward />}
            </IconButton>
            <Typography variant="body2" color="text.primary" sx={{ textAlign: 'center', width: 32 }}>
                {comment.score}
            </Typography>
            <IconButton aria-label="downvote" onClick={downvoteOnClick}>
                {comment.downvoted ? <ArrowDownward color="primary" /> : <ArrowDownward />}
            </IconButton>

            <IconButton aria-label="reply" onClick={onReply} sx={{ ml: 1 }}>
                <AddComment />
                <Typography variant="body2" color="text.primary" sx={{ textAlign: 'center', width: 32, ml: 0.5 }}>
                    Reply
                </Typography>
            </IconButton>

            {onEdit
                ? <IconButton aria-label="edit" onClick={onEdit} sx={{ ml: 1 }}>
                    <Edit />
                    <Typography variant="body2" color="text.primary" sx={{ textAlign: 'center', width: 32 }}>
                        Edit
                    </Typography>
                </IconButton>
                : ''
            }

        </CardActions>
    )
}

// export const CommentActionsSkeleton = () => {
//     const mockComment: CommentData = {
//         id: "0",
//         title: "abc",
//         author: {
//             id: "0",
//             username: "abc"
//         },
//         score: 999,
//         upvoted: false,
//         downvoted: false
//     };

//     return (
//         <Skeleton sx={{ ml: 2}}>
//             <CommentActions post={mockComment} />
//         </Skeleton>
//     )
// }