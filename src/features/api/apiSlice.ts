import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { cacher } from "../api/rtkQueryCacheUtils";

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery(),
    tagTypes: [...cacher.defaultTags, 'Post'],
    endpoints: (builder) => ({ })
});
