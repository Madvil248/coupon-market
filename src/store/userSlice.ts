import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppScreen } from "../types/ScreenTypes";

export interface UserState {
    email: string;
    name: string;
    pricePaid: number;
    lastPurchaseTimestamp: number | null;
    discountStartTime: number | null;
    promoCode: string | null;
    currentScreen: AppScreen;
}

const initialState: UserState = {
    email: "",
    name: "",
    pricePaid: 0,
    lastPurchaseTimestamp: null,
    discountStartTime: null,
    promoCode: null,
    currentScreen: AppScreen.EmailInput,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        updateUserData: (state, action: PayloadAction<Partial<UserState>>) => {
            return { ...state, ...action.payload };
        },
        setScreen: (state, action: PayloadAction<AppScreen>) => {
            state.currentScreen = action.payload;
        },
        setDiscountState: (
            state,
            action: PayloadAction<{
                discountStartTime: number;
                promoCode: string;
            }>
        ) => {
            state.discountStartTime = action.payload.discountStartTime;
            state.promoCode = action.payload.promoCode;
        },
        logSuccessfulPurchase: (
            state,
            action: PayloadAction<{
                name: string;
                email: string;
                pricePaid: number;
            }>
        ) => {
            state.name = action.payload.name;
            state.email = action.payload.email;
            state.pricePaid = action.payload.pricePaid;
            state.lastPurchaseTimestamp = Date.now();
            state.discountStartTime = null;
            state.promoCode = null;
            state.currentScreen = AppScreen.ThankYou;
        },
        resetFunnel: (state) => {
            state.email = "";
            state.name = "";
            state.pricePaid = 0;
            state.discountStartTime = null;
            state.promoCode = null;
            state.currentScreen = AppScreen.Logo;
        },
    },
});

export const {
    updateUserData,
    setScreen,
    setDiscountState,
    logSuccessfulPurchase,
    resetFunnel,
} = userSlice.actions;

export default userSlice.reducer;
