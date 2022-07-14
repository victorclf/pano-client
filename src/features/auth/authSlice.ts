import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import { User } from '../users/userSlice';
import { apiSlice } from '../api/apiSlice';
import { testAuthenticatedUser, testAuthenticatedUserSession } from '../../mocks/handlers';

export interface LoginResponse {
    user: User;
    token: string;
};

export interface LoginRequest {
    username: string;
    password: string;
};

type AuthState = {
    user: User | null;
    token: string | null;
};

const initialState = (process.env.NODE_ENV === 'development')
    ? { user: testAuthenticatedUser, token: testAuthenticatedUserSession.token } as AuthState
    : { user: null, token: null } as AuthState;

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (
            state,
            { payload: { user, token } }: PayloadAction<{ user: User; token: string }>
        ) => {
            state.user = user;
            state.token = token;
        },
    },
});

export const extendedApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<LoginResponse, LoginRequest>({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                body: credentials,
            }),
        }),
    })
});

export const {
    useLoginMutation } = extendedApiSlice;

export const { setCredentials } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state: RootState) => state.auth.user;
