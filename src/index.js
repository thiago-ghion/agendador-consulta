import React, { useState, useRef } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import { useNavigate } from "react-router-dom";

import SetupInterceptors from "./SetupInterceptor";
import Loading from "./componentes/Loading";
import store from "./app/store";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Mensagem from "./componentes/Mensagem";

let persistor = persistStore(store);
const container = document.getElementById("root");
const root = createRoot(container);

function NavigateFunctionComponent() {
  let navigate = useNavigate();
  const [ran, setRan] = useState(false);

  if (!ran) {
    SetupInterceptors(navigate, store);
    setRan(true);
  }
  return <></>;
}

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <BrowserRouter>
          {<NavigateFunctionComponent />}
          <Mensagem />
          <Loading>
            <App />
          </Loading>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
