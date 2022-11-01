import React from "react";
import { Routes, Route } from "react-router-dom";

import "./App.css";
import LoginPaciente from "./telas/LoginPaciente";
import LoginColaborador from "./telas/LoginColaborador";
import TelaPrincipalColaborador from "./telas/TelaPrincipalColaborador";
import TrocaSenhaColaborador from "./telas/TrocaSenhaColaborador";
import CadastrarPaciente from "./telas/CadastrarPaciente";
import TelaPrincipalPaciente from "./telas/TelaPrincipalPaciente";
import TrocaSenhaPaciente from "./telas/TrocaSenhaPaciente";

function App() {
  return (
    <div className="container">
      <Routes>
        <Route path="/" element={<LoginPaciente />} />
        <Route path="/cadastrarPaciente" element={<CadastrarPaciente />} />
        <Route path="/loginColaborador" element={<LoginColaborador />} />
        <Route path="/menuColaborador" element={<TelaPrincipalColaborador />} />
        <Route path="/menuPaciente" element={<TelaPrincipalPaciente />} />
        <Route
          path="/trocaSenhaColaborador"
          element={<TrocaSenhaColaborador />}
        />
        <Route path="/trocaSenhaPaciente" element={<TrocaSenhaPaciente />} />
      </Routes>
    </div>
  );
}

export default App;
