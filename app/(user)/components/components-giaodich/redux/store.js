import { configureStore } from "@reduxjs/toolkit";
import cartSlice from "./slices/cartSilce";

export const store = configureStore({
  reducer: {
    cart: cartSlice.reducer,
  },
});
