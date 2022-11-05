import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import InputMask from "react-input-mask";
import { useDispatch } from "react-redux";

import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import { cadastrarPacienteAction } from "../features/pacienteSlice";
import { setErro } from "../features/mensagemSlice";

function CadastrarPaciente() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [nomePaciente, setNomePaciente] = useState("");
  const [cpf, setCPF] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [telefone, setTelefone] = useState("");
  let [senha, setSenha] = useState("");
  let [senhaRepetida, setSenhaRepetida] = useState("");

  let emailInput,
    nomePacienteInput,
    cpfInput,
    dataNascimentoInput,
    telefoneInput,
    senhaInput,
    senhaRepetidaInput;

  const dataPattern = [
    /[0-3]/,
    /[0-9]/,
    "/",
    /[0-1]/,
    /[0-9]/,
    "/",
    /[1-2]/,
    /[0-9]/,
    /[0-9]/,
    /[0-9]/,
  ];

  const telefonePattern = [
    "(",
    /[1-9]/,
    /[1-9]/,
    ")",
    /[9,\s]/,
    /[0-9]/,
    /[0-9]/,
    /[0-9]/,
    /[0-9]/,
    "-",
    /[0-9]/,
    /[0-9]/,
    /[0-9]/,
    /[0-9]/,
  ];

  const confirmar = () => {
    salvar();
  };

  const cancelar = () => {
    dispatch(setErro(null));
    navigate("/");
  };

  const formatarCampo = (texto, isNumerico) => {
    const valor = texto.replaceAll(/[.\-_\(\)\s]/g, "");
    if (valor === "") {
      return undefined;
    }
    if (isNumerico) {
      return +valor;
    }
    return valor;
  };

  const salvar = async () => {
    const requisicao = {
      nomePaciente: nomePaciente,
      numeroCPF: formatarCampo(cpf, true),
      dataNascimento: dataNascimento.replaceAll(/[\/]/g, "."),
      numeroTelefone: formatarCampo(telefone, false),
      enderecoEmail: email,
      senha: senha,
      senhaRepetida: senhaRepetida,
    };
    let resposta;

    resposta = await dispatch(cadastrarPacienteAction({ requisicao }));

    if (resposta.error === undefined) {
      navigate("/");
    } else {
      if (resposta.payload.campo !== undefined) {
        switch (resposta.payload.campo) {
          case 1:
            nomePacienteInput.focus();
            break;
          case 2:
            cpfInput.focus();
            break;
          case 3:
            dataNascimentoInput.focus();
            break;
          case 4:
            telefoneInput.focus();
            break;
          case 5:
            emailInput.focus();
            break;
          case 6:
            senhaInput.focus();
            break;
          case 7:
            senhaRepetidaInput.focus();
            break;
          default:
            break;
        }
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
            <h2>Cadastre-se</h2>
          </center>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              size="lg"
              placeholder="Informe o nome do paciente"
              value={nomePaciente}
              autoFocus
              maxLength="150"
              onChange={(event) => {
                setNomePaciente(event.target.value);
              }}
              ref={(input) => {
                if (input !== null) {
                  nomePacienteInput = input;
                }
              }}
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Control
              placeholder="Informe o CPF do paciente"
              value={cpf}
              size="lg"
              as={InputMask}
              mask="999.999.999-99"
              onChange={(event) => {
                setCPF(event.target.value);
              }}
              ref={(input) => {
                if (input !== null) {
                  cpfInput = input;
                }
              }}
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              size="lg"
              as={InputMask}
              mask={dataPattern}
              placeholder="Informe a data de nascimento"
              value={dataNascimento}
              onChange={(event) => {
                setDataNascimento(event.target.value);
              }}
              ref={(input) => {
                if (input !== null) {
                  dataNascimentoInput = input;
                }
              }}
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              size="lg"
              placeholder="Informe a telefone"
              value={telefone}
              as={InputMask}
              mask={telefonePattern}
              onChange={(event) => {
                setTelefone(event.target.value);
              }}
              ref={(input) => {
                if (input !== null) {
                  telefoneInput = input;
                }
              }}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              size="lg"
              placeholder="Informe a email"
              value={email}
              maxLength="150"
              onChange={(event) => {
                setEmail(event.target.value);
              }}
              ref={(input) => {
                if (input !== null) {
                  emailInput = input;
                }
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
              size="lg"
              placeholder="Informe a senha nova"
              value={senha}
              maxLength="8"
              onChange={(event) => {
                setSenha(event.target.value);
              }}
              ref={(input) => {
                senhaInput = input;
              }}
            />
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-3" controlId="formUsuario">
            <Form.Control
              type="password"
              size="lg"
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

      <Row>
        <Col>
          <div style={{ height: "20px" }}></div>
        </Col>
      </Row>
      <Row className="justify-content-md-center">
        <Col md={6}>
          <Form.Group className="mb-3" controlId="formBotaoLogin">
            <div className="d-grid gap-2">
              <Button
                size="lg"
                onClick={() => {
                  confirmar();
                }}
              >
                Confirmar
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
    </Container>
  );
}

export default CadastrarPaciente;
