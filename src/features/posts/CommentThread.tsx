import { Comment, CommentSkeleton } from "./Comment";
import { CommentData } from "./postSlice"

export const CommentThread = ({ comment }: { comment: CommentData }) => {
    return (
        <>
            <Comment comment={comment} />

            {comment.replies?.map((reply) => (
                <Comment key={reply.id} comment={reply} />
            ))}
        </>
    );
};

export const CommentThreadSkeleton = () => {
    return (
        <>
            {Array.from(new Array(5), (_, i) => (
                <CommentSkeleton key={i} />
            ))}
        </>
    );
}