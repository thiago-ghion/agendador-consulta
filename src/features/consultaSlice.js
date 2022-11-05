import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  agendar,
  cancelar,
  listarConsultaTodasPaciente,
  listarConsultaTodasProfissional,
} from "../servicos/ConsultaServicos";

const initialState = {
  listaConsultaProfissional: [],
  listaConsultaPaciente: [],
};

export const agendarAction = createAsyncThunk(
  "consulta/agendar",
  async (
    { idPaciente, idProfissional, dataConsulta, idHorario },
    { fulfillWithValue, rejectWithValue }
  ) => {
    try {
      const { data } = await agendar(
        idPaciente,
        idProfissional,
        dataConsulta,
        idHorario
      );
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const listarConsultaTodasProfissionalAction = createAsyncThunk(
  "consulta/listarConsultaTodasProfissional",
  async (
    { idProfissional, dataInicio, dataFim },
    { fulfillWithValue, rejectWithValue }
  ) => {
    try {
      const { data } = await listarConsultaTodasProfissional(
        idProfissional,
        dataInicio,
        dataFim
      );
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const listarConsultaTodasPacienteAction = createAsyncThunk(
  "consulta/listarConsultaTodasPaciente",
  async (
    { idPaciente, dataInicio, dataFim },
    { fulfillWithValue, rejectWithValue }
  ) => {
    try {
      const { data } = await listarConsultaTodasPaciente(
        idPaciente,
        dataInicio,
        dataFim
      );
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const cancelarAction = createAsyncThunk(
  "consulta/cancelar",
  async (
    { idPaciente, idProfissional, dataConsulta, idHorario },
    { fulfillWithValue, rejectWithValue }
  ) => {
    try {
      const { data } = await cancelar(
        idPaciente,
        idProfissional,
        dataConsulta,
        idHorario
      );
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const consultaSlice = createSlice({
  name: "consulta",
  initialState,
  reducers: {
    limparListaConsultaProfissional: (state, { payload }) => {
      state.listaConsultaProfissional = [];
    },
    limparListaConsultaPaciente: (state, { payload }) => {
      state.listaConsultaPaciente = [];
    },
    removerListaConsultaProfissional: (state, { payload }) => {
      state.listaConsultaProfissional = state.listaConsultaProfissional
        .filter((item) => item.id !== payload.id)
        .map((item) => ({
          ...item,
        }));
    },
    removerListaConsultaPaciente: (state, { payload }) => {
      state.listaConsultaPaciente = state.listaConsultaPaciente
        .filter((item) => item.id !== payload.id)
        .map((item) => ({
          ...item,
        }));
    },
  },
  extraReducers: {
    [agendarAction.pending]: () => {},
    [agendarAction.fulfilled]: (state, { payload }) => {},
    [agendarAction.rejected]: () => {},

    [listarConsultaTodasProfissionalAction.pending]: () => {},
    [listarConsultaTodasProfissionalAction.fulfilled]: (state, { payload }) => {
      state.listaConsultaProfissional = payload.map((item, index) => ({
        ...item,
        id: index,
        dataConsulta: item.dataConsulta.replaceAll(".", "/"),
      }));
    },
    [listarConsultaTodasProfissionalAction.rejected]: () => {},

    [listarConsultaTodasPacienteAction.pending]: () => {},
    [listarConsultaTodasPacienteAction.fulfilled]: (state, { payload }) => {
      state.listaConsultaPaciente = payload.map((item, index) => ({
        ...item,
        id: index,
        dataConsulta: item.dataConsulta.replaceAll(".", "/"),
      }));
    },
    [listarConsultaTodasPacienteAction.rejected]: () => {},

    [cancelarAction.pending]: () => {},
    [cancelarAction.fulfilled]: (state, { payload }) => {},
    [cancelarAction.rejected]: () => {},
  },
});

export const {
  limparListaConsultaProfissional,
  removerListaConsultaProfissional,
  removerListaConsultaPaciente,
  limparListaConsultaPaciente,
} = consultaSlice.actions;

export default consultaSlice.reducer;
