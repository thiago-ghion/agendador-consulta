import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import "../App.css";
import { setErro, setSucesso } from "../features/mensagemSlice";
import { trocarSenhaColaboradorAction } from "../features/loginSlice";
import CampoSenha from "../componentes/CampoSenha";

function TrocaSenhaInternaColaborador() {
  const dispatch = useDispatch();

  const { usuario } = useSelector((state) => state.login);

  let senhaAnteriorInput;
  let senhaNovaInput;
  let senhaRepetidaInput;

  const setSenhaAnteriorInput = (input) => {
    senhaAnteriorInput = input;
  };

  const setSenhaNovaInput = (input) => {
    senhaNovaInput = input;
  };

  const setSenhaRepetidaInput = (input) => {
    senhaRepetidaInput = input;
  };

  let [senhaAnterior, setSenhaAnterior] = useState("");
  let [senhaNova, setSenhaNova] = useState("");
  let [senhaRepetida, setSenhaRepetida] = useState("");

  const isFormularioValido = () => {
    console.log("usuario", usuario);
    dispatch(setErro(null));

    if (senhaAnterior === "") {
      dispatch(setErro("Preencha a senha do colaborador"));
      senhaAnteriorInput.focus();
      return false;
    }

    if (senhaNova === "") {
      dispatch(setErro("Preencha a nova senha do colaborador"));
      senhaNovaInput.focus();
      return false;
    }

    if (senhaRepetida === "") {
      dispatch(setErro("Repita a nova senha do colaborador"));
      senhaRepetidaInput.focus();
      return false;
    }

    if (senhaNova !== senhaRepetida) {
      dispatch(setErro("A senha repetida diverge da senha nova"));
      senhaRepetidaInput.focus();
      return false;
    }

    return true;
  };

  const trocarSenha = async () => {
    if (!isFormularioValido()) {
      return;
    }

    const resposta = await dispatch(
      trocarSenhaColaboradorAction({
        usuario: usuario.usuario,
        senhaAnterior,
        senhaNova,
      })
    );

    if (resposta.error === undefined) {
      setSenhaAnterior("");
      setSenhaNova("");
      setSenhaRepetida("");
      dispatch(setSucesso("Senha trocada com sucesso!"));
    } else {
      switch (resposta.payload.campo) {
        case 1:
          senhaAnteriorInput.focus();
          break;
        case 2:
          senhaNovaInput.focus();
          break;
        default:
          break;
      }
    }
  };

  return (
    <Container>
      <Row>
        <Col>
          <div style={{ height: "20px" }}></div>
        </Col>
      </Row>
      <Form>
        <Row>
          <Col md={6}>
            <CampoSenha
              senha={senhaAnterior}
              setSenha={setSenhaAnterior}
              senhaInput={setSenhaAnteriorInput}
              textoPlaceholder="Informe a senha atual"
            ></CampoSenha>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <CampoSenha
              senha={senhaNova}
              setSenha={setSenhaNova}
              senhaInput={setSenhaNovaInput}
              textoPlaceholder="Informe a senha nova"
            ></CampoSenha>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <CampoSenha
              senha={senhaRepetida}
              setSenha={setSenhaRepetida}
              senhaInput={setSenhaRepetidaInput}
              textoPlaceholder="Repita a senha nova"
            ></CampoSenha>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Button
              onClick={() => {
                trocarSenha();
              }}
            >
              Trocar
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
}

export default TrocaSenhaInternaColaborador;
