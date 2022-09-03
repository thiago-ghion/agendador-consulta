import axios from "axios";

import { setLoading } from "./features/loadingSlice";
import { setErro } from "./features/mensagemSlice";

const SetupInterceptors = (navigate, store) => {
  axios.interceptors.request.use(
    function (config) {
      store.dispatch(setErro(null));

      const state = store.getState();

      if (
        state !== undefined &&
        state.login !== undefined &&
        state.login.usuario !== undefined &&
        state.login.usuario.access_token !== undefined
      ) {
        config.headers[
          "Authorization"
        ] = `Bearer ${state.login.usuario.access_token}`;
      }
      store.dispatch(setLoading(true));
      return config;
    },
    function (error) {
      store.dispatch(setLoading(false));
      return Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    function (response) {
      store.dispatch(setLoading(false));
      return response;
    },
    function (error) {
      store.dispatch(setLoading(false));
      store.dispatch(setErro(error.response.data.mensagem));
      if (error.response.status === 401) {
        navigate("/");
      }
      return Promise.reject(error);
    }
  );
};

export default SetupInterceptors;
