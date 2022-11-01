import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Container from "react-bootstrap/Container";
import { Button } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faKey,
  faDoorOpen,
  faCalendarDay,
} from "@fortawesome/free-solid-svg-icons";
import { isMobile } from "react-device-detect";

import "../App.css";

import { introspectTokenAction, deslogarUsuario } from "../features/loginSlice";
import { setErro } from "../features/mensagemSlice";
import { alterarColuna } from "../features/menuSlice";
import AgendarConsulta from "./AgendarConsulta";
import ListarConsultaPaciente from "./ListarConsultaPaciente";
import TrocaSenhaInternaPaciente from "./TrocaSenhaInternaPaciente";

function TelaPrincipalPaciente() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { usuario } = useSelector((state) => state.login);
  const { colunaAtiva } = useSelector((state) => state.menu);

  let [estaPronto, setEstaPronto] = useState(false);
  let [telaAtiva, setTelaAtiva] = useState(1);

  const telaCarregada = useRef(false);

  useEffect(() => {
    if (telaCarregada.current === false) {
      dispatch(alterarColuna(1));
    }
    telaCarregada.current = true;

    const verificarToken = async () => {
      if (usuario.access_token === undefined) {
        navigate("/");
        return;
      }

      dispatch(introspectTokenAction(usuario.access_token));

      if (usuario.nivelUsuario === undefined) {
        navigate("/");
        return;
      }

      if (usuario.nivelUsuario !== 1) {
        navigate("/");
        return;
      }

      setEstaPronto(true);
    };

    verificarToken();
  }, [usuario.nivelUsuario, navigate, usuario, dispatch]);

  const acaoSair = async () => {
    dispatch(deslogarUsuario());
    dispatch(setErro(null));
    navigate("/");
  };

  const formatarHeader = () => {
    return `${usuario.nome}`;
  };

  const escolherTelaAtiva = () => {
    switch (telaAtiva) {
      case 1:
        return <AgendarConsulta></AgendarConsulta>;
      case 3:
        return <ListarConsultaPaciente></ListarConsultaPaciente>;
      case 8:
        return <TrocaSenhaInternaPaciente></TrocaSenhaInternaPaciente>;
      default:
        return <AgendarConsulta></AgendarConsulta>;
    }
  };

  const trocarTelaAtiva = (tela) => {
    dispatch(alterarColuna(2));
    setTelaAtiva(tela);
  };

  const podeExibir = (coluna) => {
    if (!isMobile) {
      return true;
    }
    return colunaAtiva === coluna;
  };

  const acaoVoltar = () => {
    dispatch(setErro());
    dispatch(alterarColuna(1));
  };

  const carregarTela = () => {
    if (estaPronto) {
      return (
        <div>
          <div>
            <Navbar bg="light">
              <Container>
                <Navbar.Brand>{formatarHeader()}</Navbar.Brand>
                {isMobile && colunaAtiva === 2 ? (
                  <Button onClick={acaoVoltar}>Voltar</Button>
                ) : (
                  <></>
                )}
              </Container>
            </Navbar>
          </div>
          <div className={["d-flex"]} id="menu_screen">
            <Row className={["flex-fill"]}>
              {podeExibir(1) ? (
                <Col md={3} className={["h-100"]}>
                  <Nav
                    defaultActiveKey={telaAtiva}
                    className="flex-column"
                    variant="pills"
                  >
                    <Nav.Link
                      eventKey="1"
                      onClick={() => {
                        trocarTelaAtiva(1);
                      }}
                    >
                      <FontAwesomeIcon icon={faCalendar} />
                      {` Agendar consulta`}
                    </Nav.Link>

                    <Nav.Link
                      eventKey="3"
                      onClick={() => {
                        trocarTelaAtiva(3);
                      }}
                    >
                      <FontAwesomeIcon icon={faCalendarDay} />

                      {` Listar consultas`}
                    </Nav.Link>

                    <Nav.Link
                      eventKey="8"
                      onClick={() => {
                        trocarTelaAtiva(8);
                      }}
                      disabled={!usuario.isInterno}
                    >
                      <FontAwesomeIcon icon={faKey} />
                      {` Trocar senha`}
                    </Nav.Link>

                    <Nav.Link
                      eventKey="10"
                      onClick={() => {
                        acaoSair();
                      }}
                    >
                      <FontAwesomeIcon icon={faDoorOpen} />
                      {` Sair`}
                    </Nav.Link>
                  </Nav>
                </Col>
              ) : (
                <></>
              )}
              {podeExibir(2) ? <Col md={9}>{escolherTelaAtiva()}</Col> : <></>}
            </Row>
          </div>
        </div>
      );
    }
    return <></>;
  };

  return carregarTela();
}

export default TelaPrincipalPaciente;
