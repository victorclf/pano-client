import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../../app/store';
import { cacher } from "../api/rtkQueryCacheUtils";
import { loggedOut } from '../auth/authSlice';

const baseQuery = fetchBaseQuery({
    baseUrl: '/',
    prepareHeaders: (headers, { getState }) => {
        // Append auth token if there is one in store
        const token = (getState() as RootState).auth.token;
        if (token) {
            headers.set('authorization', `Bearer ${token}`);
        }
        return headers;
    },
});

// Based on https://redux-toolkit.js.org/rtk-query/usage/customizing-queries#automatic-re-authorization-by-extending-fetchbasequery
const baseQueryWithErrorHandler: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);
    if (result.error && result.error.status === 401) {
        api.dispatch(loggedOut());
    }
    return result;
};

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithErrorHandler,
    tagTypes: [...cacher.defaultTags, 'Post', 'Comment'],
    endpoints: (builder) => ({})
});
