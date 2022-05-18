import { apiSlice } from '../api/apiSlice'
import { cacher } from "../api/rtkQueryCacheUtils";

export interface Votable {
    score: number;
    upvoted: boolean;
    downvoted: boolean;
}

export interface ShallowUser {
    id: string;
    username: string;
}

export interface CommentData extends Votable {
    id: string;
    body: string;
    post: {
        id: string;
    }
    author: ShallowUser;
    replies?: Array<CommentData>;
    parentComment?: string;
    date: string;
}

export interface CreatePostData {
    title: string;
    body: string;
}

export interface ShallowPostData extends Votable {
    id: string;
    title: string;
    author: ShallowUser;
    date: string;
}

export interface PostData extends ShallowPostData {
    body: string;
}



const updateUpvote = (e?: Votable) => {
    if (e) {
        e.upvoted = true;
        e.score += 1;
        if (e.downvoted) {
            e.downvoted = false;
            e.score += 1;
        }
    }
};

const updateNonvote = (e?: Votable) => {
    if (e) {
        if (e.upvoted) {
            e.upvoted = false;
            e.score -= 1;
        } else if (e.downvoted) {
            e.downvoted = false;
            e.score += 1;
        }
    }
};

const updateDownvote = (e?: Votable) => {
    if (e) {
        e.downvoted = true;
        e.score -= 1;
        if (e.upvoted) {
            e.upvoted = false;
            e.score -= 1;
        }
    }
};

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
        getPosts: builder.query<ShallowPostData[], void>({
            query: () => '/posts',
            providesTags: cacher.providesList("Post")
            // (result = [], error, arg) => [
            //     { type: 'Post' },
            //     ...result.map(({ id }) => ({ type: 'Post', id })),
            //   ],
        }),
        getPost: builder.query<PostData, string>({
            query: (postId) => `/posts/${postId}`,
            providesTags: cacher.cacheByIdArg("Post"),
            //  (result, error, arg) => [{ type: 'Post', id: arg }],
        }),
        getComments: builder.query<CommentData[], string>({
            query: (postId) => `/posts/${postId}/comments`,
        }),
        createPost: builder.mutation<PostData, CreatePostData>({
            query: (newPost) => ({
                url: '/posts',
                method: 'POST',
                body: newPost,
            }),
            invalidatesTags: cacher.invalidatesList("Post"),
        }),
        upvote: builder.mutation<void, string>({
            query: (postId) => ({
                url: `/posts/${postId}/upvote`,
                method: 'POST'
            }),
            async onQueryStarted(postId, { dispatch, queryFulfilled }) {
                const getPostsCacheUpdate = dispatch(
                    extendedApiSlice.util.updateQueryData('getPosts', undefined, (posts) => {
                        const post = posts.find((post) => post.id === postId)
                        updateUpvote(post);
                    })
                );
                const getPostCacheUpdate = dispatch(
                    extendedApiSlice.util.updateQueryData('getPost', postId, (post) => {
                        updateUpvote(post);
                    })
                );
                try {
                    await queryFulfilled;
                } catch {
                    getPostsCacheUpdate.undo();
                    getPostCacheUpdate.undo();
                }
            },
        }),
        nonvote: builder.mutation<void, string>({
            query: (postId) => ({
                url: `/posts/${postId}/nonvote`,
                method: 'POST'
            }),
            async onQueryStarted(postId, { dispatch, queryFulfilled }) {
                const getPostsCacheUpdate = dispatch(
                    extendedApiSlice.util.updateQueryData('getPosts', undefined, (posts) => {
                        const post = posts.find((post) => post.id === postId)
                        updateNonvote(post);
                    })
                );
                const getPostCacheUpdate = dispatch(
                    extendedApiSlice.util.updateQueryData('getPost', postId, (post) => {
                        updateNonvote(post);
                    })
                );
                try {
                    await queryFulfilled;
                } catch {
                    getPostsCacheUpdate.undo();
                    getPostCacheUpdate.undo();
                }
            },
        }),
        downvote: builder.mutation<void, string>({
            query: (postId) => ({
                url: `/posts/${postId}/downvote`,
                method: 'POST'
            }),
            async onQueryStarted(postId, { dispatch, queryFulfilled }) {
                const getPostsCacheUpdate = dispatch(
                    extendedApiSlice.util.updateQueryData('getPosts', undefined, (posts) => {
                        const post = posts.find((post) => post.id === postId);
                        updateDownvote(post);
                    })
                );
                const getPostCacheUpdate = dispatch(
                    extendedApiSlice.util.updateQueryData('getPost', postId, (post) => {
                        updateDownvote(post);
                    })
                );
                try {
                    await queryFulfilled;
                } catch {
                    getPostsCacheUpdate.undo();
                    getPostCacheUpdate.undo();
                }
            },
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
    useGetPostsQuery,
    useGetPostQuery,
    useGetCommentsQuery,
    useCreatePostMutation,
    useUpvoteMutation,
    useNonvoteMutation,
    useDownvoteMutation,
    useUpvoteCommentMutation,
    useNonvoteCommentMutation,
    useDownvoteCommentMutation } = extendedApiSlice
