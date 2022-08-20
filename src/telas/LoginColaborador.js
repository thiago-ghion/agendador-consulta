import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import { Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import "../App.css";
import { logarColaborador } from "../features/loginSlice";
import { setErro } from "../features/mensagemSlice";

function LoginColaborador() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  let usuarioInput = {};
  let senhaInput = {};

  let [usuario, setUsuario] = useState("");
  let [senha, setSenha] = useState("");

  const isFormularioValido = () => {
    if (usuario === "") {
      dispatch(setErro("Preencha o usuário do colaborador"));
      usuarioInput.focus();
      return false;
    }

    if (senha === "") {
      dispatch(setErro("Preencha a senha do colaborador"));
      senhaInput.focus();
      return false;
    }

    return true;
  };

  const logar = async () => {
    if (!isFormularioValido()) {
      return;
    }

    const resposta = await dispatch(
      logarColaborador({ usuario: usuario, senha: senha })
    );

    if (resposta.error === undefined) {
      navigate("/menuColaborador");
    } else {
      console.log("resposta", resposta);
      if (resposta.payload.senhaResetada !== undefined) {
        console.log("vai mudar a rota");
        navigate("/trocaSenhaColaborador");
      }
    }
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
            <h2>Login</h2>
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
            <Form.Group className="mb-3" controlId="formUsuario">
              <FloatingLabel label="Usuário" className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Informe o usuário"
                  value={usuario}
                  autoFocus
                  onChange={(event) => {
                    setUsuario(event.target.value);
                  }}
                  ref={(input) => {
                    usuarioInput = input;
                  }}
                />
              </FloatingLabel>
            </Form.Group>
          </Col>
        </Row>
        <Row className="justify-content-md-center">
          <Col md={6}>
            <Form.Group className="mb-3" controlId="formUsuario">
              <FloatingLabel label="Senha" className="mb-3">
                <Form.Control
                  type="password"
                  placeholder="Informe a senha"
                  value={senha}
                  onChange={(event) => {
                    setSenha(event.target.value);
                  }}
                  ref={(input) => {
                    senhaInput = input;
                  }}
                />
              </FloatingLabel>
            </Form.Group>
          </Col>
        </Row>

        <Row className="justify-content-md-center">
          <Col md={6} className="align-self-end">
            <Form.Group className="mb-3" controlId="formBotaoLogin">
              <a href="/trocaSenhaColaborador" className="link-primary">
                Esqueci a senha
              </a>
            </Form.Group>
          </Col>
        </Row>

        <Row className="justify-content-md-center">
          <Col md={6}>
            <Form.Group className="mb-3" controlId="formBotaoLogin">
              <div className="d-grid gap-2">
                <Button size="lg" onClick={logar}>
                  Login
                </Button>
              </div>
            </Form.Group>
          </Col>
        </Row>
      </Form>
    </Container>
  );
}

export default LoginColaborador;
