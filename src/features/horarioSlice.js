import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  listarHorarios,
  ativarHorario,
  desativarHorario,
  registrarHorario,
} from "../servicos/HorarioServicos";

const initialState = {
  lista: [],
};

export const listarHorarioAction = createAsyncThunk(
  "horario/listar",
  async (payload, { fulfillWithValue, rejectWithValue }) => {
    try {
      const { data } = await listarHorarios();
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const ativarHorarioAction = createAsyncThunk(
  "horario/ativar",
  async (payload, { fulfillWithValue, rejectWithValue }) => {
    try {
      const { data } = await ativarHorario(payload.idHorario);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const desativarHorarioAction = createAsyncThunk(
  "horario/desativar",
  async (payload, { fulfillWithValue, rejectWithValue }) => {
    try {
      const { data } = await desativarHorario(payload.idHorario);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const registrarHorarioAction = createAsyncThunk(
  "horario/registrar",
  async (payload, { fulfillWithValue, rejectWithValue }) => {
    try {
      const { data } = await registrarHorario(payload.idHorario);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const horarioSlice = createSlice({
  name: "horario",
  initialState,
  reducers: {},
  extraReducers: {
    [listarHorarioAction.pending]: () => {},
    [listarHorarioAction.fulfilled]: (state, { payload }) => {
      state.lista = payload;
    },
    [listarHorarioAction.rejected]: () => {},

    [ativarHorarioAction.pending]: () => {},
    [ativarHorarioAction.fulfilled]: (state, { payload }) => {
      const horario = state.lista.find(
        (item) => item.idHorario === payload.idHorario
      );
      console.log(`@@@@ ativar ${payload.idHorario} - ${horario}`)
      if (horario !== undefined) {
        horario.indicadorAtivo = "S";
      }
    },
    [ativarHorarioAction.rejected]: () => {},

    [desativarHorarioAction.pending]: () => {},
    [desativarHorarioAction.fulfilled]: (state, { payload }) => {
      const horario = state.lista.find(
        (item) => item.idHorario === payload.idHorario
      );
      console.log(`@@@@ desativar ${payload.idHorario} - ${horario}`)
      if (horario !== undefined) {
        horario.indicadorAtivo = "N";
      }
    },
    [desativarHorarioAction.rejected]: () => {},

    [registrarHorarioAction.pending]: () => {},
    [registrarHorarioAction.fulfilled]: (state, { payload }) => {},
    [registrarHorarioAction.rejected]: () => {},
  },
});

export default horarioSlice.reducer;
