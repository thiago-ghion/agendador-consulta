import React from "react";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";

const CampoSenha = (props) => {
  const isSenhaValida = (senha) => {
    const patternSenha =
      "^(?=.*[A-Z].*[A-Z])(?=.*[!@#<% swaggerOptions %>*])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{8}$";

    if (!senha.match(patternSenha)) {
      return false;
    }

    return true;
  };

  return (
    <div>
      <InputGroup className="mb-3">
        <Form.Control
          type="password"
          placeholder={props.textoPlaceholder || "Informe a senha inicial"}
          value={props.senha}
          maxLength="8"
          onChange={(event) => {
            props.setSenha(event.target.value);
          }}
          ref={(input) => {
            if (input !== null) {
              props.senhaInput(input);
            }
          }}
        />
        {isSenhaValida(props.senha) ? (
          <InputGroup.Text
            style={{
              color: "#fff",
              backgroundColor: "green",
              fontWeight: "bold",
            }}
          >
            &#10003;
          </InputGroup.Text>
        ) : (
          <InputGroup.Text
            style={{
              color: "#fff",
              backgroundColor: "red",
              fontWeight: "bold",
            }}
          >
            &#10006;
          </InputGroup.Text>
        )}
      </InputGroup>
    </div>
  );
};

export default CampoSenha;
