import { apiSlice } from '../api/apiSlice';
import { cacher } from "../api/rtkQueryCacheUtils";
import { updateDownvote, updateNonvote, updateUpvote, Votable } from '../common/Votable';
import { ShallowUser } from '../users/userSlice';

export interface CreateCommentData {
    postId: string;
    body: string;
    parentCommentId?: string;
}

export interface EditCommentData {
    postId: string;
    commentId: string;
    body: string;
}

export interface CommentData extends Votable {
    id: string;
    body: string;
    postId: string;
    author: ShallowUser;
    replies?: Array<CommentData>;
    parentCommentId?: string;
    date: string;
}

const findCommentOrReply = (comments: CommentData[], commentOrReplyId: string): CommentData | undefined => {
    for (const comment of comments) {
        if (comment.id === commentOrReplyId) {
            return comment;
        }
        if (comment.replies) {
            for (const reply of comment.replies) {
                if (reply.id === commentOrReplyId) {
                    return reply;
                }
            }
        }
    }
    return undefined;
}

export const extendedApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getComments: builder.query<CommentData[], string>({
            query: (postId) => `/posts/${postId}/comments`,
            providesTags: cacher.cacheByIdArg("Comment"),
        }),
        createComment: builder.mutation<CommentData, CreateCommentData>({
            query: ({ postId, ...newComment }) => ({
                url: `/posts/${postId}/comments`,
                method: 'POST',
                body: newComment,
            }),
            invalidatesTags: (result, error, arg) => [{ type: "Comment", id: arg.postId }],
        }),
        editComment: builder.mutation<CommentData, EditCommentData>({
            query: ({ postId, commentId, body }) => ({
                url: `/posts/${postId}/comments/${commentId}`,
                method: 'PATCH',
                body: {body} as EditCommentData
            }),
            invalidatesTags: (result, error, arg) => [{ type: "Comment", id: arg.postId }],
        }),
        upvoteComment: builder.mutation<void, { postId: string, commentId: string }>({
            query: ({ postId, commentId }) => ({
                url: `/posts/${postId}/comments/${commentId}/upvote`,
                method: 'POST'
            }),
            async onQueryStarted({ postId, commentId }, { dispatch, queryFulfilled }) {
                const getCommentsCacheUpdate = dispatch(
                    extendedApiSlice.util.updateQueryData('getComments', postId, (comments) => {
                        const comment = findCommentOrReply(comments, commentId);
                        updateUpvote(comment);
                    })
                );
                try {
                    await queryFulfilled;
                } catch {
                    getCommentsCacheUpdate.undo();
                }
            },
        }),
        nonvoteComment: builder.mutation<void, { postId: string, commentId: string }>({
            query: ({ postId, commentId }) => ({
                url: `/posts/${postId}/comments/${commentId}/nonvote`,
                method: 'POST'
            }),
            async onQueryStarted({ postId, commentId }, { dispatch, queryFulfilled }) {
                const getCommentsCacheUpdate = dispatch(
                    extendedApiSlice.util.updateQueryData('getComments', postId, (comments) => {
                        const comment = findCommentOrReply(comments, commentId);
                        updateNonvote(comment);
                    })
                );
                try {
                    await queryFulfilled;
                } catch {
                    getCommentsCacheUpdate.undo();
                }
            },
        }),
        downvoteComment: builder.mutation<void, { postId: string, commentId: string }>({
            query: ({ postId, commentId }) => ({
                url: `/posts/${postId}/comments/${commentId}/downvote`,
                method: 'POST'
            }),
            async onQueryStarted({ postId, commentId }, { dispatch, queryFulfilled }) {
                const getCommentsCacheUpdate = dispatch(
                    extendedApiSlice.util.updateQueryData('getComments', postId, (comments) => {
                        const comment = findCommentOrReply(comments, commentId);
                        updateDownvote(comment);
                    })
                );
                try {
                    await queryFulfilled;
                } catch {
                    getCommentsCacheUpdate.undo();
                }
            },
        }),
    }),
})

export const {
    useGetCommentsQuery,
    useCreateCommentMutation,
    useEditCommentMutation,
    useUpvoteCommentMutation,
    useNonvoteCommentMutation,
    useDownvoteCommentMutation } = extendedApiSlice
