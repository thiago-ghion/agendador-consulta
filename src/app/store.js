import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import logger from "redux-logger";

import loginReducer from "../features/loginSlice";
import mensagemReducer from "../features/mensagemSlice";
import loadingReducer from "../features/loadingSlice";
import usuarioReducer from "../features/usuarioSlice";
import horarioReducer from "../features/horarioSlice";
import profissionalReducer from "../features/ProfissionalSlice";
import pacienteReducer from "../features/pacienteSlice";
import consultaReducer from "../features/consultaSlice";

const persistConfig = {
  key: "agendador",
  storage,
  whitelist: ["login"],
};

const reducers = combineReducers({
  login: loginReducer,
  mensagem: mensagemReducer,
  loading: loadingReducer,
  usuario: usuarioReducer,
  horario: horarioReducer,
  profissional: profissionalReducer,
  paciente: pacienteReducer,
  consulta: consultaReducer,
});

const persistedReducer = persistReducer(persistConfig, reducers);

export default configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(logger),
});
