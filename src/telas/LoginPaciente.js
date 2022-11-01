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
import {
  logarPacienteFacebook,
  logarPacienteGoogle,
  logarPacienteInterno,
} from "../features/loginSlice";
import { setErro } from "../features/mensagemSlice";
import GoogleAuth from "../componentes/GoogleAuth";
import FacebookLogin from "react-facebook-login";

function LoginPaciente() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  let emailInput = {};
  let senhaInput = {};

  let [email, setEmail] = useState("");
  let [senha, setSenha] = useState("");

  const isFormularioValido = () => {
    if (email === "") {
      dispatch(setErro("Preencha o email do paciente"));
      emailInput.focus();
      return false;
    }

    if (senha === "") {
      dispatch(setErro("Preencha a senha do paciente"));
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
      logarPacienteInterno({ usuario: email, senha: senha })
    );

    if (resposta.error === undefined) {
      navigate("/menuPaciente");
    }
  };

  const acessoColaborador = () => {
    navigate("/loginColaborador");
  };

  const cadastrarPaciente = () => {
    dispatch(setErro(null));
    navigate("/cadastrarPaciente");
  };

  const processarLoginGoogle = async (response) => {
    const resposta = await dispatch(
      logarPacienteGoogle({ credential: response.credential })
    );

    if (resposta.error === undefined) {
      navigate("/menuPaciente");
    } else {
      dispatch(setErro("Falha no login pelo Google"));
    }
  };

  const processarLoginFacebook = async (response) => {
    const resposta = await dispatch(
      logarPacienteFacebook({ credential: response.accessToken })
    );

    if (resposta.error === undefined) {
      navigate("/menuPaciente");
    } else {
      dispatch(setErro("Falha no login pelo Facebook"));
    }
  };

  return (
    <Container>
      <Row>
        <Col>
          <div style={{ height: "100px" }}></div>
        </Col>
      </Row>
      <Row>
        <Col md={10}></Col>
        <Col>
          <Button variant="link" onClick={acessoColaborador}>
            Acesso colaborador
          </Button>
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
              <FloatingLabel label="Email" className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Informe o email"
                  value={email}
                  maxLength="255"
                  autoFocus
                  onChange={(event) => {
                    setEmail(event.target.value);
                  }}
                  ref={(input) => {
                    emailInput = input;
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
                  maxLength="8"
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
              <a href="/trocaSenhaPaciente" className="link-primary">
                Trocar a senha
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

        <Row className="justify-content-md-center">
          <Col md={4}>
            <center>
              <FacebookLogin
                appId="1714354318929389"
                autoLoad={false}
                fields="name,email"
                scope="public_profile,email"
                authType="reauthenticate"
                size="small"
                textButton="Login com Facebook"
                language="pt_BR"
                callback={processarLoginFacebook}
                icon="fa-facebook"
              />
            </center>
          </Col>
        </Row>
        <br></br>
        <Row className="justify-content-md-center">
          <Col md={4}>
            <center>
              <GoogleAuth
                credential="483272976648-prjup2c5kf0k8nt35bvq84mcb6dujpl1.apps.googleusercontent.com"
                handleCredentialResponse={processarLoginGoogle}
              ></GoogleAuth>
            </center>
          </Col>
        </Row>

        <Row className="justify-content-md-center">
          <Col md={4}>
            <center>
              <Button
                variant="link"
                data-testid="cadastrar"
                onClick={cadastrarPaciente}
              >
                Não tem uma conta? Cadastre-se
              </Button>
            </center>
          </Col>
        </Row>
      </Form>
    </Container>
  );
}

export default LoginPaciente;
