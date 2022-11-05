import React, { useState, useEffect, useRef } from "react";
import { Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import "../App.css";
import { setErro } from "../features/mensagemSlice";
import {
  trocarSenhaPacienteAction,
} from "../features/loginSlice";

function TrocaSenhaPaciente() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  let emailInput;
  let senhaAnteriorInput;
  let senhaNovaInput;
  let senhaRepetidaInput;

  let [email, setEmail] = useState("");
  let [senhaAnterior, setSenhaAnterior] = useState("");
  let [senhaNova, setSenhaNova] = useState("");
  let [senhaRepetida, setSenhaRepetida] = useState("");

  const isTelaCarregada = useRef(false);

  useEffect(() => {
    if (isTelaCarregada.current === false) {
      dispatch(setErro());
    }
    isTelaCarregada.current = true;
  });

  const isFormularioValido = () => {
    dispatch(setErro(null));

    if (email === "") {
      dispatch(setErro("Preencha o email do paciente"));
      emailInput.focus();
      return false;
    }

    if (senhaAnterior === "") {
      dispatch(setErro("Preencha a senha do paciente"));
      senhaAnteriorInput.focus();
      return false;
    }

    if (senhaNova === "") {
      dispatch(setErro("Preencha a nova senha do paciente"));
      senhaNovaInput.focus();
      return false;
    }

    if (senhaRepetida === "") {
      dispatch(setErro("Repita a nova senha do paciente"));
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
      trocarSenhaPacienteAction({ email, senhaAnterior, senhaNova })
    );

    if (resposta.error === undefined) {
      navigate("/");
    }
  };

  const cancelar = async () => {
    dispatch(setErro());
    navigate("/");
  };

  return (
    <Container>
      <Row>
        <Col>
          <div style={{ height: "100px" }}></div>
        </Col>
      </Row>
      <Row className="justify-content-md-center">
        <Col md={4}>
          <center>
            <h2>Trocar senha</h2>
          </center>
        </Col>
      </Row>
      <Row>
        <Col>
          <div style={{ height: "20px" }}></div>
        </Col>
      </Row>
      <Form>
        <Row className="justify-content-md-center">
          <Col md={6}>
            <Form.Group className="mb-3" controlId="formPaciente">
              <Form.Control
                type="text"
                placeholder="Informe o email"
                value={email}
                maxLength="255"
                onChange={(event) => {
                  setEmail(event.target.value);
                }}
                ref={(input) => {
                  emailInput = input;
                }}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="justify-content-md-center">
          <Col md={6}>
            <Form.Group className="mb-3" controlId="formPaciente">
              <Form.Control
                type="password"
                placeholder="Informe a senha anterior"
                maxLength="8"
                value={senhaAnterior}
                onChange={(event) => {
                  setSenhaAnterior(event.target.value);
                }}
                ref={(input) => {
                  senhaAnteriorInput = input;
                }}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="justify-content-md-center">
          <Col md={6}>
            <Form.Group className="mb-3" controlId="formPaciente">
              <Form.Control
                type="password"
                placeholder="Informe a senha nova"
                value={senhaNova}
                maxLength="8"
                onChange={(event) => {
                  setSenhaNova(event.target.value);
                }}
                ref={(input) => {
                  senhaNovaInput = input;
                }}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="justify-content-md-center">
          <Col md={6}>
            <Form.Group className="mb-3" controlId="formUsuario">
              <Form.Control
                type="password"
                placeholder="Repetir a senha nova"
                value={senhaRepetida}
                maxLength="8"
                onChange={(event) => {
                  setSenhaRepetida(event.target.value);
                }}
                ref={(input) => {
                  senhaRepetidaInput = input;
                }}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="justify-content-md-center">
          <Col md={6}>
            <Form.Group className="mb-3" controlId="formBotaoLogin">
              <div className="d-grid gap-2">
                <Button
                  size="lg"
                  onClick={() => {
                    trocarSenha();
                  }}
                >
                  Trocar
                </Button>
                <Button
                  variant="danger"
                  size="lg"
                  onClick={() => {
                    cancelar();
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </Form.Group>
          </Col>
        </Row>
      </Form>
    </Container>
  );
}

export default TrocaSenhaPaciente;
