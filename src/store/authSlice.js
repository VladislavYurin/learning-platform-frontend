import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    token: null,
    refreshToken: null,
    isAuthenticated: false,
    loading: false,
    error: null
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginStart(state) {
            state.loading = true;
            state.error = null;
        },
        loginSuccess(state, action) {
            state.user = action.payload.user;
            state.token = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
            state.isAuthenticated = true;
            state.loading = false;
        },
        loginFailure(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        logout(state) {
            state.user = null;
            state.token = null;
            state.refreshToken = null;
            state.isAuthenticated = false;
        },
        refreshTokenSuccess(state, action) {
            state.token = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
        }
    }
});

export const { loginStart, loginSuccess, loginFailure, logout, refreshTokenSuccess } = authSlice.actions;
export default authSlice.reducer;