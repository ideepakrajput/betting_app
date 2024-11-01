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
        updateBalance: (state, action) => {
            state.user.wallet_balance = action.payload;
        },
        updateBankDetails: (state, action) => {
            state.user.bank_accounts = action.payload;
        },
        updateUPIDetails: (state, action) => {
            state.user.upi_details = action.payload;
        }
    },
});

export const { setUser, setLoading, setError, setIsLoggedIn, logout, updateBalance, updateBankDetails, updateUPIDetails } = userSlice.actions;

export default userSlice.reducer;