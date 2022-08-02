import React from "react";
import Alert from "react-bootstrap/Alert";
import { useSelector } from "react-redux";

function Mensagem() {
  const { mensagem, tipoMensagem } = useSelector((state) => state.mensagem);

  return (
    <div>
      {mensagem == null ? (
        <div></div>
      ) : (
        <div>
          <Alert variant={tipoMensagem === 1 ? "danger" : "success"}>
            {mensagem}
          </Alert>
        </div>
      )}
    </div>
  );
}

export default Mensagem;
