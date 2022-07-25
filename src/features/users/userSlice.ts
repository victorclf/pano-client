import { apiSlice } from "../api/apiSlice";
import { cacher } from "../api/rtkQueryCacheUtils";

export interface ShallowUser {
    id: string;
    username: string;
}

export interface User extends ShallowUser {
    score: number;
    date: string;
    country: string;
}

export const extendedApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getUser: builder.query<User, string>({
            query: (userId) => `/users/${userId}`,
            providesTags: cacher.cacheByIdArg("User"),
        }),
    }),
});

export const {
    useGetUserQuery } = extendedApiSlice;