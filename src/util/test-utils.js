import React from "react";
import { render } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
// As a basic setup, import your same slice reducers
import loginReducer from "../features/loginSlice";
import profissionalReducer from "../features/profissionalSlice";
import consultaReducer from "../features/consultaSlice";
import pacienteReducer from "../features/pacienteSlice";
import horarioReducer from "../features/horarioSlice";
import usuarioReducer from "../features/usuarioSlice";
import loadingReducer from "../features/loadingSlice";
import mensagemgReducer from "../features/mensagemSlice";

export function renderWithProviders(
  ui,
  {
    preloadedState = {},
    // Automatically create a store instance if no store was passed in
    store = configureStore({
      reducer: {
        login: loginReducer,
        consulta: consultaReducer,
        profissional: profissionalReducer,
        paciente: pacienteReducer,
        horario: horarioReducer,
        usuario: usuarioReducer,
        loading: loadingReducer,
        mensagem: mensagemgReducer,
      },
      preloadedState,
    }),
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }) {
    return <Provider store={store}>{children}</Provider>;
  }

  // Return an object with the store and all of RTL's query functions
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
