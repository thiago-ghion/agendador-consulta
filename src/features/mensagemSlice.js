import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mensagem: null,
  tipoMensagem: null,
};

export const mensagemSlice = createSlice({
  name: "mensagem",
  initialState,
  reducers: {
    setErro: (state, { payload }) => {
      state.mensagem = payload;
      if (payload === null) {
        state.tipoMensagem = null;
      } else {
        state.tipoMensagem = 1;
      }
    },
    setSucesso: (state, { payload }) => {
      state.mensagem = payload;
      if (payload === null) {
        state.tipoMensagem = null;
      } else {
        state.tipoMensagem = 2;
      }
    },
  },
  extraReducers: {},
});

export const { setErro, setSucesso } = mensagemSlice.actions;
export default mensagemSlice.reducer;
