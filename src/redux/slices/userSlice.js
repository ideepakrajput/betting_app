import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    isLoading: false,
    error: null,
    isLoggedIn: false,
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            state.isLoggedIn = true;
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        setIsLoggedIn: (state, action) => {
            state.isLoggedIn = action.payload;
        },
        logout: (state) => {
            state.user = null;
            state.isLoggedIn = false;
        },
    },
});

export const { setUser, setLoading, setError, setIsLoggedIn, logout } = userSlice.actions;

export default userSlice.reducer;