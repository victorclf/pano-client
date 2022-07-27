import { apiSlice } from '../api/apiSlice';
import { cacher } from "../api/rtkQueryCacheUtils";
import { updateDownvote, updateNonvote, updateUpvote, Votable } from '../common/Votable';
import { ShallowUser } from '../users/userSlice';

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

export const extendedApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getPosts: builder.query<ShallowPostData[], { cursor?: string | null, size?: number }>({
            query: ({ cursor = null, size = 20 }) => ({
                url: '/posts',
                params: { 
                    cursor: cursor ?? undefined, 
                    size }
            }),
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
                const getPostCacheUpdate = dispatch(
                    extendedApiSlice.util.updateQueryData('getPost', postId, (post) => {
                        updateUpvote(post);
                    })
                );
                try {
                    await queryFulfilled;
                } catch {
                    getPostCacheUpdate.undo();
                }
            },
            invalidatesTags: cacher.invalidatesList("Post"),
        }),
        nonvote: builder.mutation<void, string>({
            query: (postId) => ({
                url: `/posts/${postId}/nonvote`,
                method: 'POST'
            }),
            async onQueryStarted(postId, { dispatch, queryFulfilled }) {
                const getPostCacheUpdate = dispatch(
                    extendedApiSlice.util.updateQueryData('getPost', postId, (post) => {
                        updateNonvote(post);
                    })
                );
                try {
                    await queryFulfilled;
                } catch {
                    getPostCacheUpdate.undo();
                }
            },
            invalidatesTags: cacher.invalidatesList("Post"),
        }),
        downvote: builder.mutation<void, string>({
            query: (postId) => ({
                url: `/posts/${postId}/downvote`,
                method: 'POST'
            }),
            async onQueryStarted(postId, { dispatch, queryFulfilled }) {
                const getPostCacheUpdate = dispatch(
                    extendedApiSlice.util.updateQueryData('getPost', postId, (post) => {
                        updateDownvote(post);
                    })
                );
                try {
                    await queryFulfilled;
                } catch {
                    getPostCacheUpdate.undo();
                }
            },
            invalidatesTags: cacher.invalidatesList("Post"),
        }),
    }),
})

export const {
    useGetPostsQuery,
    useLazyGetPostsQuery,
    useGetPostQuery,
    useCreatePostMutation,
    useUpvoteMutation,
    useNonvoteMutation,
    useDownvoteMutation } = extendedApiSlice
