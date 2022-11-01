import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  listarHorariosMaisUtilizados,
  listarConsultasDiasSemana,
  listarProfissionaisMaisConsultas,
  listarConsultasAtivasVersusCanceladas,
  listarLoginProprioVersusOauth,
} from "../servicos/EstatisticaServicos";

const initialState = {
  listaHorariosMaisUtilizados: [],
  listaConsultasDiasSemana: [],
  listaProfissionaisMaisConsultas: [],
  consultasAtivasVersusCanceladas: [],
  loginProprioVersusOauth: [],
};

export const listarHorariosMaisUtilizadosAction = createAsyncThunk(
  "estatistica/listarHorariosMaisUtilizados",
  async (payload, { fulfillWithValue, rejectWithValue }) => {
    try {
      const { data } = await listarHorariosMaisUtilizados(
        payload.dataInicio,
        payload.dataFim
      );
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const listarConsultasDiasSemanaAction = createAsyncThunk(
  "estatistica/listarConsultasDiasSemana",
  async (payload, { fulfillWithValue, rejectWithValue }) => {
    try {
      const { data } = await listarConsultasDiasSemana(
        payload.dataInicio,
        payload.dataFim
      );
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const listarProfissionaisMaisConsultasAction = createAsyncThunk(
  "estatistica/listarProfissionaisMaisConsultas",
  async (payload, { fulfillWithValue, rejectWithValue }) => {
    try {
      const { data } = await listarProfissionaisMaisConsultas(
        payload.dataInicio,
        payload.dataFim
      );
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const listarConsultasAtivasVersusCanceladasAction = createAsyncThunk(
  "estatistica/listarConsultasAtivasVersusCanceladas",
  async (payload, { fulfillWithValue, rejectWithValue }) => {
    try {
      const { data } = await listarConsultasAtivasVersusCanceladas(
        payload.dataInicio,
        payload.dataFim
      );
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const listarLoginProprioVersusOauthAction = createAsyncThunk(
  "estatistica/listarLoginProprioVersusOauth",
  async (payload, { fulfillWithValue, rejectWithValue }) => {
    try {
      const { data } = await listarLoginProprioVersusOauth(
        payload.dataInicio,
        payload.dataFim
      );
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const formatarNome = (dia) => {
  switch (dia) {
    case "0":
      return "Dom";
    case "1":
      return "Seg";
    case "2":
      return "Ter";
    case "3":
      return "Qua";
    case "4":
      return "Qui";
    case "5":
      return "Sex";
    case "6":
      return "Sab";
    default:
      return "";
  }
};

//TODO: Limpar as listas
export const estatisticaSlice = createSlice({
  name: "estatistica",
  initialState,
  reducers: {
    limparListaHorariosMaisUtilizados: (state, { payload }) => {
      state.listaHorariosMaisUtilizados = [];
    },
    limparListaConsultasDiasSemana: (state, { payload }) => {
      state.listaConsultasDiasSemana = [];
    },
    limparListaProfissionaisMaisConsultas: (state, { payload }) => {
      state.listaProfissionaisMaisConsultas = [];
    },
    limparConsultasAtivasVersusCanceladas: (state, { payload }) => {
      state.consultasAtivasVersusCanceladas = [];
    },
    limparLoginProprioVersusOauth: (state, { payload }) => {
      state.loginProprioVersusOauth = [];
    },
  },
  extraReducers: {
    [listarHorariosMaisUtilizadosAction.pending]: () => {},
    [listarHorariosMaisUtilizadosAction.fulfilled]: (state, { payload }) => {
      state.listaHorariosMaisUtilizados = payload;
    },
    [listarHorariosMaisUtilizadosAction.rejected]: () => {},

    [listarConsultasDiasSemanaAction.pending]: () => {},
    [listarConsultasDiasSemanaAction.fulfilled]: (state, { payload }) => {
      state.listaConsultasDiasSemana = payload.map((item) => ({
        ...item,
        texto: formatarNome(item.dia),
      }));
    },
    [listarConsultasDiasSemanaAction.rejected]: () => {},

    [listarProfissionaisMaisConsultasAction.pending]: () => {},
    [listarProfissionaisMaisConsultasAction.fulfilled]: (
      state,
      { payload }
    ) => {
      state.listaProfissionaisMaisConsultas = payload;
    },
    [listarProfissionaisMaisConsultasAction.rejected]: () => {},

    [listarConsultasAtivasVersusCanceladasAction.pending]: () => {},
    [listarConsultasAtivasVersusCanceladasAction.fulfilled]: (
      state,
      { payload }
    ) => {
      state.consultasAtivasVersusCanceladas = payload;
    },
    [listarConsultasAtivasVersusCanceladasAction.rejected]: () => {},

    [listarLoginProprioVersusOauthAction.pending]: () => {},
    [listarLoginProprioVersusOauthAction.fulfilled]: (state, { payload }) => {
      state.loginProprioVersusOauth = payload;
    },
    [listarLoginProprioVersusOauthAction.rejected]: () => {},
  },
});

export const {
  limparListaHorariosMaisUtilizados,
  limparListaConsultasDiasSemana,
  limparListaProfissionaisMaisConsultas,
  limparConsultasAtivasVersusCanceladas,
  limparLoginProprioVersusOauth,
} = estatisticaSlice.actions;

export default estatisticaSlice.reducer;
