import { createSlice } from "@reduxjs/toolkit";

const betSlice = createSlice({
    name: "bet",
    initialState: {
        bets: [],
        totalBetAmount: 0,
    },
    reducers: {
        setBets: (state, action) => {
            state.bets = action.payload;
        },
        setTotalBetdAmount: (state, action) => {
            state.totalBetAmount = action.payload;
        },
        addBets: (state, action) => {
            state.bets.push(action.payload);
        },
        updateTotalsBetAmount: (state, action) => {
            state.totalBetAmount += action.payload;
        }
    },
});

export const { setBets, setTotalBetdAmount, addBets, updateTotalsBetAmount } = betSlice.actions;

export default betSlice.reducer;