import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  agendar,
  cancelar,
  listarConsultaTodasProfissional,
} from "../servicos/ConsultaServicos";

const initialState = {
  listaConsultaProfissional: [],
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
    removerListaConsultaProfissional: (state, { payload }) => {
      state.listaConsultaProfissional = state.listaConsultaProfissional
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

    [cancelarAction.pending]: () => {},
    [cancelarAction.fulfilled]: (state, { payload }) => {},
    [cancelarAction.rejected]: () => {},
  },
});

export const {
  limparListaConsultaProfissional,
  removerListaConsultaProfissional,
} = consultaSlice.actions;

export default consultaSlice.reducer;
