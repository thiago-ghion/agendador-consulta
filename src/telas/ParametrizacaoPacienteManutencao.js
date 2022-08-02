import React, { useState, useRef, useEffect } from "react";
import { Button } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputMask from "react-input-mask";
import { useDispatch, useSelector } from "react-redux";

import {
  registrarPacienteAction,
  consultarPacienteAction,
  alterarPacienteAction,
} from "../features/pacienteSlice";

function ParametrizacaoPacienteManutencao(props) {
  const dispatch = useDispatch();

  const { paciente } = useSelector((state) => state.paciente);

  const [nomePaciente, setNomePaciente] = useState("");
  const [cpf, setCPF] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");

  const telaCarregada = useRef(false);

  useEffect(() => {
    if (telaCarregada.current === false) {
      if (props.modoAlteracao) {
        const acao = async () => {
          const resposta = await dispatch(
            consultarPacienteAction({ idPaciente: props.idPaciente })
          );
          if (resposta.error === undefined) {
            setNomePaciente(resposta.payload.nomePaciente);
            setCPF(resposta.payload.numeroCPF);
            setDataNascimento(resposta.payload.dataNascimento);
            if (resposta.payload.numeroTelefone.length === 10) {
              setTelefone(
                `${resposta.payload.numeroTelefone.substring(
                  0,
                  2
                )} ${resposta.payload.numeroTelefone.substring(2, 10)}`
              );
            } else {
              setTelefone(resposta.payload.numeroTelefone);
            }
            setEmail(resposta.payload.enderecoEmail);
          }
        };
        acao();
      }
    }
    telaCarregada.current = true;
  });

  let nomePacienteInput;
  let cpfInput;
  let dataNascimentoInput;
  let telefoneInput;
  let emailInput;

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
    };
    let resposta;

    if (props.modoAlteracao) {
      resposta = await dispatch(
        alterarPacienteAction({ idPaciente: props.idPaciente, requisicao })
      );
    } else {
      resposta = await dispatch(registrarPacienteAction({ requisicao }));
    }

    if (resposta.error === undefined) {
      props.setTelaAtiva(1);
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
          default:
            break;
        }
      }
    }
  };

  return (
    <div>
      <br></br>
      <Row>
        <Col>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
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
      <Row>
        <Col md={1}>
          <Button variant="success" onClick={salvar}>
            Salvar
          </Button>
        </Col>
        <Col md={1}>
          <Button
            variant="danger"
            onClick={() => {
              props.setTelaAtiva(1);
            }}
          >
            Cancelar
          </Button>
        </Col>
      </Row>
    </div>
  );
}

export default ParametrizacaoPacienteManutencao;
