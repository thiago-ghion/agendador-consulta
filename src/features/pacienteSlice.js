import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  alterarPaciente,
  consultarPaciente,
  listarPaciente,
  registrarPaciente,
} from "../servicos/PacienteServicos";

const initialState = {
  listaPaciente: [],
  paciente: {},
};

export const registrarPacienteAction = createAsyncThunk(
  "paciente/registrar",
  async ({ requisicao }, { fulfillWithValue, rejectWithValue }) => {
    try {
      const { data } = await registrarPaciente(requisicao);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const alterarPacienteAction = createAsyncThunk(
  "paciente/alterar",
  async ({ idPaciente, requisicao }, { fulfillWithValue, rejectWithValue }) => {
    try {
      const { data } = await alterarPaciente(idPaciente, requisicao);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const listarPacienteAction = createAsyncThunk(
  "paciente/listar",
  async (payload, { fulfillWithValue, rejectWithValue }) => {
    try {
      const { data } = await listarPaciente();
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const consultarPacienteAction = createAsyncThunk(
  "paciente/consultar",
  async ({ idPaciente }, { fulfillWithValue, rejectWithValue }) => {
    try {
      const { data } = await consultarPaciente(idPaciente);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const pacienteSlice = createSlice({
  name: "paciente",
  initialState,
  reducers: {},
  extraReducers: {
    [registrarPacienteAction.pending]: () => {},
    [registrarPacienteAction.fulfilled]: (state, { payload }) => {},
    [registrarPacienteAction.rejected]: () => {},

    [alterarPacienteAction.pending]: () => {},
    [alterarPacienteAction.fulfilled]: (state, { payload }) => {},
    [alterarPacienteAction.rejected]: () => {},

    [listarPacienteAction.pending]: () => {},
    [listarPacienteAction.fulfilled]: (state, { payload }) => {
      state.listaPaciente = payload;
    },
    [listarPacienteAction.rejected]: () => {},

    [consultarPacienteAction.pending]: () => {},
    [consultarPacienteAction.fulfilled]: (state, { payload }) => {
      state.paciente = payload;
    },
    [consultarPacienteAction.rejected]: () => {},
  },
});

export default pacienteSlice.reducer;
