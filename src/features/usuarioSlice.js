import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  listarUsuarios,
  registrarUsuario,
  alterarUsuario,
  resetarSenha,
} from "../servicos/UsuarioServicos";

const initialState = {
  lista: [],
  usuario: {},
};

export const listarUsuariosAction = createAsyncThunk(
  "usuario/listar",
  async (payload, { fulfillWithValue, rejectWithValue }) => {
    try {
      const { data } = await listarUsuarios();
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const registrarUsuarioAction = createAsyncThunk(
  "usuario/registrar",
  async (
    { usuario, nome, isUsuarioAdministrador, senha },
    { fulfillWithValue, rejectWithValue }
  ) => {
    try {
      const { data } = await registrarUsuario(
        usuario,
        nome,
        isUsuarioAdministrador,
        senha
      );
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const alterarUsuarioAction = createAsyncThunk(
  "usuario/alterar",
  async (
    { idUsuario, nomeColaborador, isUsuarioAtivo, isUsuarioAdministrador },
    { fulfillWithValue, rejectWithValue }
  ) => {
    try {
      const { data } = await alterarUsuario(
        idUsuario,
        nomeColaborador,
        isUsuarioAtivo,
        isUsuarioAdministrador
      );
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const resetarSenhaAction = createAsyncThunk(
  "usuario/resetar",
  async ({ idUsuario, senha }, { fulfillWithValue, rejectWithValue }) => {
    try {
      const { data } = await resetarSenha(idUsuario, senha);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const usuarioSlice = createSlice({
  name: "usuario",
  initialState,
  reducers: {},
  extraReducers: {
    [listarUsuariosAction.pending]: () => {},
    [listarUsuariosAction.fulfilled]: (state, { payload }) => {
      state.lista = payload;
    },
    [listarUsuariosAction.rejected]: () => {},

    [registrarUsuarioAction.pending]: () => {},
    [registrarUsuarioAction.fulfilled]: (state, { payload }) => {
      state.usuario = payload;
    },
    [registrarUsuarioAction.rejected]: () => {},

    [alterarUsuarioAction.pending]: () => {},
    [alterarUsuarioAction.fulfilled]: (state, { payload }) => {},
    [alterarUsuarioAction.rejected]: () => {},

    [resetarSenhaAction.pending]: () => {},
    [resetarSenhaAction.fulfilled]: (state, { payload }) => {},
    [resetarSenhaAction.rejected]: () => {},
  },
});

export default usuarioSlice.reducer;
