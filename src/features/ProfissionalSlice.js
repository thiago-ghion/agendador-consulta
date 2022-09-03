import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  registrarProfissional,
  alterarProfissional,
  ativarProfissional,
  desativarProfissional,
  listarVigente,
  listarTodos,
  listarHorarioDisponivel,
  consultarVinculo,
  listarConfiguracaoHorario,
  listarConfiguracaoHorarioPeriodo,
  listarDataDisponivel,
} from "../servicos/ProfissionalServicos";

const initialState = {
  listaTodos: [],
  listaProfissionalVigente: [],
  listaHorario: [],
  listaConfiguracaoPeriodo: [],
  listaConfiguracao: [],
  listaDataDisponivel: [],
  listaHorarioDisponivel: [],
};

initialState.listaHorario[""] = {};

export const registrarProfissionalAction = createAsyncThunk(
  "profissional/registrar",
  async ({ requisicao }, { fulfillWithValue, rejectWithValue }) => {
    try {
      const { data } = await registrarProfissional(requisicao);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const alterarProfissionalAction = createAsyncThunk(
  "profissional/alterar",
  async (
    { idProfissional, requisicao },
    { fulfillWithValue, rejectWithValue }
  ) => {
    try {
      const { data } = await alterarProfissional(idProfissional, requisicao);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const ativarProfissionalAction = createAsyncThunk(
  "profissional/ativar",
  async ({ idProfissional }, { fulfillWithValue, rejectWithValue }) => {
    try {
      const { data } = await ativarProfissional(idProfissional);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const desativarProfissionalAction = createAsyncThunk(
  "profissional/desativar",
  async ({ idProfissional }, { fulfillWithValue, rejectWithValue }) => {
    try {
      const { data } = await desativarProfissional(idProfissional);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const listarVigenteAction = createAsyncThunk(
  "profissional/listarVigente",
  async (payload, { fulfillWithValue, rejectWithValue }) => {
    try {
      const { data } = await listarVigente();
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const listarTodosAction = createAsyncThunk(
  "profissional/listarTodos",
  async (payload, { fulfillWithValue, rejectWithValue }) => {
    try {
      const { data } = await listarTodos();
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const listarHorarioDisponivelAction = createAsyncThunk(
  "profissional/listarHorarioDisponivel",
  async (
    { idProfissional, dataPesquisa },
    { fulfillWithValue, rejectWithValue }
  ) => {
    try {
      const { data } = await listarHorarioDisponivel(
        idProfissional,
        dataPesquisa
      );
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const consultarVinculoAction = createAsyncThunk(
  "profissional/consultarVinculo",
  async (
    { idProfissional, dataPesquisa },
    { fulfillWithValue, rejectWithValue }
  ) => {
    try {
      const { data } = await consultarVinculo(idProfissional, dataPesquisa);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const listarConfiguracaoHorarioAction = createAsyncThunk(
  "profissional/listarConfiguracaoHorario",
  async (
    { idProfissional, dataPesquisa },
    { fulfillWithValue, rejectWithValue }
  ) => {
    try {
      const { data } = await listarConfiguracaoHorario(
        idProfissional,
        dataPesquisa
      );
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const listarConfiguracaoHorarioPeriodoAction = createAsyncThunk(
  "profissional/listarConfiguracaoHorarioPeriodo",
  async (
    { idProfissional, dataInicio, dataFim },
    { fulfillWithValue, rejectWithValue }
  ) => {
    try {
      const { data } = await listarConfiguracaoHorarioPeriodo(
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

export const listarDataDisponivelAction = createAsyncThunk(
  "profissional/listarDataDisponivel",
  async (
    { idProfissional, dataInicio, dataFim },
    { fulfillWithValue, rejectWithValue }
  ) => {
    try {
      const { data } = await listarDataDisponivel(
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

export const profissionalSlice = createSlice({
  name: "profissional",
  initialState,
  reducers: {
    limparListaDataDisponivel: (state, { payload }) => {
      state.listaDataDisponivel = [];
    },
    limparListaHorarioDisponivel: (state, { payload }) => {
      state.listaHorarioDisponivel = [];
    },
  },
  extraReducers: {
    [registrarProfissionalAction.pending]: () => {},
    [registrarProfissionalAction.fulfilled]: (state, { payload }) => {},
    [registrarProfissionalAction.rejected]: () => {},

    [alterarProfissionalAction.pending]: () => {},
    [alterarProfissionalAction.fulfilled]: (state, { payload }) => {},
    [alterarProfissionalAction.rejected]: () => {},

    [ativarProfissionalAction.pending]: () => {},
    [ativarProfissionalAction.fulfilled]: (state, { payload }) => {
      const profissional = state.listaTodos.find(
        (item) => item.idProfissional === payload.idProfissional
      );
      if (profissional !== null) {
        profissional.indicadorAtivo = "S";
      }
    },
    [ativarProfissionalAction.rejected]: () => {},

    [desativarProfissionalAction.pending]: () => {},
    [desativarProfissionalAction.fulfilled]: (state, { payload }) => {
      const profissional = state.listaTodos.find(
        (item) => item.idProfissional === payload.idProfissional
      );
      if (profissional !== null) {
        profissional.indicadorAtivo = "N";
      }
    },
    [desativarProfissionalAction.rejected]: () => {},

    [listarVigenteAction.pending]: () => {},
    [listarVigenteAction.fulfilled]: (state, { payload }) => {
      state.listaProfissionalVigente = payload;
    },
    [listarVigenteAction.rejected]: () => {},

    [listarTodosAction.pending]: () => {},
    [listarTodosAction.fulfilled]: (state, { payload }) => {
      state.listaTodos = payload;
    },
    [listarTodosAction.rejected]: () => {},

    [listarHorarioDisponivelAction.pending]: () => {},
    [listarHorarioDisponivelAction.fulfilled]: (state, { payload }) => {
      state.listaHorarioDisponivel = payload;
    },
    [listarHorarioDisponivelAction.rejected]: () => {},

    [consultarVinculoAction.pending]: () => {},
    [consultarVinculoAction.fulfilled]: (state, { payload }) => {},
    [consultarVinculoAction.rejected]: () => {},

    [listarConfiguracaoHorarioAction.pending]: () => {},
    [listarConfiguracaoHorarioAction.fulfilled]: (state, { payload }) => {
      state.listaConfiguracao = payload;
    },
    [listarConfiguracaoHorarioAction.rejected]: () => {},

    [listarConfiguracaoHorarioPeriodoAction.pending]: () => {},
    [listarConfiguracaoHorarioPeriodoAction.fulfilled]: (
      state,
      { payload }
    ) => {
      state.listaConfiguracaoPeriodo = payload;
    },
    [listarConfiguracaoHorarioPeriodoAction.rejected]: () => {},

    [listarDataDisponivelAction.pending]: () => {},
    [listarDataDisponivelAction.fulfilled]: (state, { payload }) => {
      state.listaDataDisponivel = payload;
    },
    [listarDataDisponivelAction.rejected]: (state) => {
      state.listaDataDisponivel = [];
    },
  },
});

export const { limparListaDataDisponivel, limparListaHorarioDisponivel } =
  profissionalSlice.actions;

export default profissionalSlice.reducer;
