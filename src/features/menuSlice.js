import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  colunaAtiva: 1,
};

export const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    alterarColuna: (state, { payload }) => {
      state.colunaAtiva = payload;
    },
  },
  extraReducers: {},
});

export const { alterarColuna } = menuSlice.actions;

export default menuSlice.reducer;
