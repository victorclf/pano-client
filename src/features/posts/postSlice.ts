import { apiSlice } from '../api/apiSlice'

export interface CommentReplyData {
    id: number;
    author: string;
    body: string;
    score: number;
}

export interface CommentData {
    id: number;
    author: string;
    body: string;
    score: number;
    replies?: Array<CommentReplyData>;
}

export interface PostData {
    id: number;
    title: string;
    body: string;
    author: {
        id: number;
        username: string;
    };
    score: number;
}

export const extendedApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getPosts: builder.query<PostData[], void>({
            query: () => '/posts',
            providesTags: ['Post'],
        }),
    }),
})

export const { useGetPostsQuery } = extendedApiSlice
