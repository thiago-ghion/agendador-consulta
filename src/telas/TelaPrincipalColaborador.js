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
  faUser,
  faClock,
  faPerson,
  faKey,
  faUserNurse,
  faDoorOpen,
  faTable,
  faCalendarDay,
  faIdBadge,
} from "@fortawesome/free-solid-svg-icons";
import { isMobile } from "react-device-detect";

import "../App.css";
import ParametrizacaoUsuario from "./ParametrizacaoUsuario";
import TrocaSenhaInternaColaborador from "./TrocaSenhaInternaColaborador";
import { introspectTokenAction, deslogarUsuario } from "../features/loginSlice";
import { setErro } from "../features/mensagemSlice";
import { alterarColuna } from "../features/menuSlice";
import ParametrizacaoHorario from "./ParametrizacaoHorario";
import ParametrizacaoProfissional from "./ParametrizacaoProfissional";
import ParametrizacaoPaciente from "./ParametrizacaoPaciente";
import ListarRegistroAcesso from "./ListarRegistroAcesso";
import AgendarConsulta from "./AgendarConsulta";
import ListarConsulta from "./ListarConsulta";

function TelaPrincipalColaborador() {
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

      await dispatch(introspectTokenAction(usuario.access_token));

      if (usuario.nivelUsuario === undefined) {
        navigate("/");
        return;
      }

      if (usuario.nivelUsuario !== 2 && usuario.nivelUsuario !== 3) {
        navigate("/");
        return;
      }

      setEstaPronto(true);
    };

    verificarToken();
  }, [usuario.nivelUsuario, navigate, usuario, dispatch]);

  const acaoSair = async () => {
    await dispatch(deslogarUsuario());
    dispatch(setErro(null));
    navigate("/");
  };

  const formatarHeader = () => {
    if (!isMobile) {
      if (usuario.nivelUsuario === 2) {
        return `Colaborador: ${usuario.nome}`;
      }
      return `Administrador: ${usuario.nome}`;
    } else {
      return `${usuario.nome}`;
    }
  };

  const escolherTelaAtiva = () => {
    switch (telaAtiva) {
      case 1:
        return <AgendarConsulta></AgendarConsulta>;
      case 2:
        return <ParametrizacaoPaciente></ParametrizacaoPaciente>;
      case 3:
        return <ListarConsulta></ListarConsulta>;
      case 4:
        return <ParametrizacaoHorario></ParametrizacaoHorario>;
      case 5:
        return <ParametrizacaoProfissional></ParametrizacaoProfissional>;
      case 6:
        return <ParametrizacaoUsuario></ParametrizacaoUsuario>;
      case 8:
        return <TrocaSenhaInternaColaborador></TrocaSenhaInternaColaborador>;
      case 9:
        return <ListarRegistroAcesso></ListarRegistroAcesso>;
      default:
        return <ParametrizacaoUsuario></ParametrizacaoUsuario>;
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
                      eventKey="2"
                      onClick={() => {
                        trocarTelaAtiva(2);
                      }}
                    >
                      <FontAwesomeIcon icon={faPerson} />
                      {` Cadastro paciente`}
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
                      eventKey="4"
                      onClick={() => {
                        trocarTelaAtiva(4);
                      }}
                      disabled={usuario.nivelUsuario !== 3}
                    >
                      <FontAwesomeIcon icon={faClock} />
                      {` Parametrização horário`}
                    </Nav.Link>
                    <Nav.Link
                      eventKey="5"
                      onClick={() => {
                        trocarTelaAtiva(5);
                      }}
                      disabled={usuario.nivelUsuario !== 3}
                    >
                      <FontAwesomeIcon icon={faUserNurse} />
                      {` Parametrização profissional`}
                    </Nav.Link>
                    <Nav.Link
                      eventKey="6"
                      onClick={() => {
                        trocarTelaAtiva(6);
                      }}
                      disabled={usuario.nivelUsuario !== 3}
                    >
                      <FontAwesomeIcon icon={faUser} />
                      {` Parametrização usuário`}
                    </Nav.Link>
                    <Nav.Link
                      eventKey="7"
                      onClick={() => {
                        trocarTelaAtiva(7);
                      }}
                      disabled
                    >
                      <FontAwesomeIcon icon={faTable} />
                      {` Estatísticas`}
                    </Nav.Link>
                    <Nav.Link
                      eventKey="8"
                      onClick={() => {
                        trocarTelaAtiva(8);
                      }}
                    >
                      <FontAwesomeIcon icon={faKey} />
                      {` Trocar senha`}
                    </Nav.Link>
                    <Nav.Link
                      eventKey="9"
                      disabled={usuario.nivelUsuario !== 3}
                      onClick={() => {
                        trocarTelaAtiva(9);
                      }}
                    >
                      <FontAwesomeIcon icon={faIdBadge} />
                      {` Registros de acesso`}
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

export default TelaPrincipalColaborador;
