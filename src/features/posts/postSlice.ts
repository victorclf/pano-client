import { apiSlice } from '../api/apiSlice'
import { cacher } from "../api/rtkQueryCacheUtils";

export interface ShallowUser {
    id: number;
    username: string;
}

export interface CommentData {
    id: number;
    author: ShallowUser;
    body: string;
    score: number;
    replies?: Array<CommentData>;
}

export interface PostData {
    id: number;
    title: string;
    body: string;
    author: ShallowUser;
    score: number;
}

export const extendedApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getPosts: builder.query<PostData[], void>({
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
    }),
})

export const { 
    useGetPostsQuery,
    useGetPostQuery,
    useGetCommentsQuery } = extendedApiSlice
