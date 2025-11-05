import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProductPlan, PRODUCT_PLANS } from "../types/ProductTypes";

export interface ProductsState {
    productPlans: ProductPlan[];
    selectedProductPlan: ProductPlan | null;
}

const initialState: ProductsState = {
    productPlans: PRODUCT_PLANS,
    selectedProductPlan: null,
};

const productsSlice = createSlice({
    name: "products",
    initialState,
    reducers: {
        setProductPlans: (state, action: PayloadAction<ProductPlan[]>) => {
            state.productPlans = action.payload;
        },
        setSelectedPlan: (state, action: PayloadAction<ProductPlan>) => {
            state.selectedProductPlan = action.payload;
        },
        clearSelectedPlan: (state) => {
            state.selectedProductPlan = null;
        },
    },
});

export const { setProductPlans, setSelectedPlan, clearSelectedPlan } =
    productsSlice.actions;

export default productsSlice.reducer;
