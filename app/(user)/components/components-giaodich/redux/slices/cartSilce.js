//cartslices
import { createSlice } from "@reduxjs/toolkit";

const calculateTotal = (items) => {
  return items.reduce(
    (total, item) => total + item.gia_giam * item.so_luong,
    0
  );
};

const initialState = {
  items: [],
  total: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartItems: (state, action) => {
      state.items = action.payload;
      state.total = calculateTotal(action.payload);
    },
    addToCart: (state, action) => {
      const existingItem = state.items.find(
        (item) => item._id === action.payload.item._id
      );

      if (existingItem) {
        existingItem.so_luong += action.payload.so_luong;
      } else {
        state.items.push({
          ...action.payload.item,
          so_luong: action.payload.so_luong,
        });
      }

      state.total = calculateTotal(state.items); // Cập nhật tổng
      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item._id !== action.payload);
      state.total = calculateTotal(state.items);
      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },
    updateCartItemQuantity: (state, action) => {
      const item = state.items.find((item) => item._id === action.payload._id);

      if (item) {
        item.so_luong = action.payload.so_luong;
      }
      state.total = calculateTotal(state.items); // Cập nhật tổng
      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      localStorage.removeItem("cartItems");
    },
  },
});

export const {
  setCartItems,
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice;
