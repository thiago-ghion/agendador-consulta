import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  loginColaborador,
  trocarSenhaColaborador,
  introspectToken,
  listarRegistroAcesso,
} from "../servicos/LoginServicos";

const initialState = {
  usuario: {},
  loading: false,
  listaAcesso: [],
};

export const logarColaborador = createAsyncThunk(
  "login/colaborador",
  async (payload, { dispatch, fulfillWithValue, rejectWithValue }) => {
    try {
      const { data } = await loginColaborador(payload.usuario, payload.senha);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const trocarSenhaColaboradorAction = createAsyncThunk(
  "login/trocarSenhaColaborador",
  async (payload, { dispatch, fulfillWithValue, rejectWithValue }) => {
    try {
      const { data } = await trocarSenhaColaborador(
        payload.usuario,
        payload.senhaAnterior,
        payload.senhaNova
      );
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const introspectTokenAction = createAsyncThunk(
  "login/introspectToken",
  async (payload, { dispatch, fulfillWithValue, rejectWithValue }) => {
    try {
      const { data } = await introspectToken(payload);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const listarRegistroAcessoAction = createAsyncThunk(
  "login/listarRegistroAcesso",
  async (
    { dataInicio, dataFim },
    { dispatch, fulfillWithValue, rejectWithValue }
  ) => {
    try {
      const { data } = await listarRegistroAcesso(dataInicio, dataFim);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    deslogarUsuario: (state, { payload }) => {
      state.usuario = {};
    },
    limparListaAcesso: (state, { payload }) => {
      state.listaAcesso = [];
    },
  },
  extraReducers: {
    [logarColaborador.pending]: () => {},
    [logarColaborador.fulfilled]: (state, { payload }) => {
      const { access_token, id, nivelUsuario, nome, usuario } = payload;
      state.usuario = {
        access_token,
        id,
        nivelUsuario,
        nome,
        usuario,
      };
    },
    [logarColaborador.rejected]: () => {},

    [trocarSenhaColaboradorAction.pending]: () => {},
    [trocarSenhaColaboradorAction.fulfilled]: (state, { payload }) => {},
    [trocarSenhaColaboradorAction.rejected]: () => {},

    [introspectTokenAction.pending]: () => {},
    [introspectTokenAction.fulfilled]: (state, { payload }) => {},
    [introspectTokenAction.rejected]: (state) => {
      state.usuario = {};
    },

    [listarRegistroAcessoAction.pending]: () => {},
    [listarRegistroAcessoAction.fulfilled]: (state, { payload }) => {
      state.listaAcesso = payload;
    },
    [listarRegistroAcessoAction.rejected]: (state) => {
      state.listaAcesso = [];
    },
  },
});

export const { deslogarUsuario, limparListaAcesso } = loginSlice.actions;

export default loginSlice.reducer;
