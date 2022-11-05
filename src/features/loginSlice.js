import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  loginColaborador,
  loginPacienteInterno,
  trocarSenhaColaborador,
  introspectToken,
  listarRegistroAcesso,
  loginPacienteGoogle,
  loginPacienteFacebook,
  trocarSenhaPaciente,
} from "../servicos/LoginServicos";
import moment from "moment";

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

export const logarPacienteInterno = createAsyncThunk(
  "login/pacienteInterno",
  async (payload, { dispatch, fulfillWithValue, rejectWithValue }) => {
    try {
      const { data } = await loginPacienteInterno(
        payload.usuario,
        payload.senha
      );
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const logarPacienteGoogle = createAsyncThunk(
  "login/pacienteGoogle",
  async (payload, { dispatch, fulfillWithValue, rejectWithValue }) => {
    try {
      const { data } = await loginPacienteGoogle(payload.credential);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const logarPacienteFacebook = createAsyncThunk(
  "login/pacienteFacebook",
  async (payload, { dispatch, fulfillWithValue, rejectWithValue }) => {
    try {
      const { data } = await loginPacienteFacebook(payload.credential);
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

export const trocarSenhaPacienteAction = createAsyncThunk(
  "login/trocarSenhaPaciente",
  async (payload, { dispatch, fulfillWithValue, rejectWithValue }) => {
    try {
      const { data } = await trocarSenhaPaciente(
        payload.email,
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
      const { access_token, id, nivelUsuario, nome, usuario, isInterno } =
        payload;
      state.usuario = {
        access_token,
        id,
        nivelUsuario,
        nome,
        usuario,
        isInterno,
      };
    },
    [logarColaborador.rejected]: () => {},

    [logarPacienteInterno.pending]: () => {},
    [logarPacienteInterno.fulfilled]: (state, { payload }) => {
      const { access_token, id, nivelUsuario, nome, usuario, isInterno } =
        payload;
      state.usuario = {
        access_token,
        id,
        nivelUsuario,
        nome,
        usuario,
        isInterno,
      };
    },
    [logarPacienteInterno.rejected]: () => {},

    [logarPacienteGoogle.pending]: () => {},
    [logarPacienteGoogle.fulfilled]: (state, { payload }) => {
      const { access_token, id, nivelUsuario, nome, usuario, isInterno } =
        payload;
      state.usuario = {
        access_token,
        id,
        nivelUsuario,
        nome,
        usuario,
        isInterno,
      };
    },
    [logarPacienteGoogle.rejected]: () => {},

    [logarPacienteFacebook.pending]: () => {},
    [logarPacienteFacebook.fulfilled]: (state, { payload }) => {
      const { access_token, id, nivelUsuario, nome, usuario, isInterno } =
        payload;
      state.usuario = {
        access_token,
        id,
        nivelUsuario,
        nome,
        usuario,
        isInterno,
      };
    },
    [logarPacienteFacebook.rejected]: () => {},

    [trocarSenhaColaboradorAction.pending]: () => {},
    [trocarSenhaColaboradorAction.fulfilled]: (state, { payload }) => {},
    [trocarSenhaColaboradorAction.rejected]: () => {},

    [trocarSenhaPacienteAction.pending]: () => {},
    [trocarSenhaPacienteAction.fulfilled]: (state, { payload }) => {},
    [trocarSenhaPacienteAction.rejected]: () => {},

    [introspectTokenAction.pending]: () => {},
    [introspectTokenAction.fulfilled]: (state, { payload }) => {},
    [introspectTokenAction.rejected]: (state) => {
      state.usuario = {};
    },

    [listarRegistroAcessoAction.pending]: () => {},
    [listarRegistroAcessoAction.fulfilled]: (state, { payload }) => {
      state.listaAcesso = payload.map((item) => ({
        ...item,
        timestampAcesso: moment(item.timestampAcesso).format(
          "DD/MM/YYYY HH:mm:ss"
        ),
      }));
    },
    [listarRegistroAcessoAction.rejected]: (state) => {
      state.listaAcesso = [];
    },
  },
});

export const { deslogarUsuario, limparListaAcesso } = loginSlice.actions;

export default loginSlice.reducer;
