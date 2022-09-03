import React from "react";
import { Routes, Route } from "react-router-dom";

import "./App.css";
import LoginColaborador from "./telas/LoginColaborador";
import TelaPrincipalColaborador from "./telas/TelaPrincipalColaborador";
import TrocaSenhaColaborador from "./telas/TrocaSenhaColaborador";

function App() {
  return (
    <div className="container">
      <Routes>
        <Route path="/" element={<LoginColaborador />} />
        <Route path="/menuColaborador" element={<TelaPrincipalColaborador />} />
        <Route
          path="/trocaSenhaColaborador"
          element={<TrocaSenhaColaborador />}
        />
      </Routes>
    </div>
  );
}

export default App;
