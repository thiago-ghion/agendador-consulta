import React, { useEffect, useState, useRef } from "react";
import BootstrapTable from "react-bootstrap-table-next";
import { Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";

import CampoSenha from "../componentes/CampoSenha";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, {
  Search,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min";

import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.css";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css";

import {
  listarUsuariosAction,
  registrarUsuarioAction,
  alterarUsuarioAction,
  resetarSenhaAction,
} from "../features/usuarioSlice";
import { setErro, setSucesso } from "../features/mensagemSlice";

import BotaoExportar from "../componentes/BotaoExportar";

function ParametrizacaoUsuario() {
  const dispatch = useDispatch();
  const { lista } = useSelector((state) => state.usuario);

  const [telaApresentacao, setTelaApresentacao] = useState(1);
  const telaApresentacaoAnterior = useRef(0);

  const [usuario, setUsuario] = useState("");
  let usuarioInput;

  const [nome, setNome] = useState("");
  let nomeInput;

  const [administrador, setAdministrador] = useState(false);
  let administradorInput;

  const [senha, setSenha] = useState("");
  let senhaInput;

  const setSenhaInput = (input) => {
    senhaInput = input;
  };

  const [senhaRepete, setSenhaRepete] = useState("");
  let senhaRepeteInput;

  const setSenhaRepeteInput = (input) => {
    senhaRepeteInput = input;
  };

  const [ativo, setAtivo] = useState(false);
  const [objetoOriginal, setObjetoOriginal] = useState({});

  useEffect(() => {
    if (telaApresentacao === 1 && telaApresentacaoAnterior.current !== 1) {
      const prepararListaUsuario = async () => {
        await dispatch(listarUsuariosAction());
      };
      prepararListaUsuario();
    }
    telaApresentacaoAnterior.current = telaApresentacao;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [telaApresentacao]);

  function listaFormatter(cell, row, rowIndex, formatExtraData) {
    return (
      <Button
        variant="link"
        onClick={() => {
          setObjetoOriginal(row);
          setUsuario(row.nomeUsuario);
          setNome(row.nomeColaborador);
          setAdministrador(row.indicadorAdministrador === "S" ? true : false);
          setAtivo(row.indicadorAtivo === "S" ? true : false);
          setTelaApresentacao(3);
        }}
      >
        {row.nomeUsuario}
      </Button>
    );
  }

  const colunas = [
    {
      dataField: "idUsuario",
      text: "#",
      sort: true,
      style: { cursor: "pointer" },
      headerStyle: () => {
        return { width: "80px" };
      },
    },
    {
      dataField: "nomeUsuario",
      text: "Usuário",
      sort: true,
      formatter: listaFormatter,
    },
  ];

  const defaultSorted = [
    {
      dataField: "idUsuario",
      order: "asc",
      style: { cursor: "pointer" },
    },
  ];

  const pagination = paginationFactory({
    page: 1,
    sizePerPage: 10,
    lastPageText: ">>",
    firstPageText: "<<",
    nextPageText: ">",
    prePageText: "<",
    showTotal: true,
    paginationTotalRenderer: (from, to, size) => {
      return ` Exibindo registros ${from} até ${to} de ${size}`;
    },
    alwaysShowAllBtns: true,
  });

  const { SearchBar } = Search;

  const telaInicial = () => (
    <div>
      <br></br>
      <div className={["d-flex", "justify-content-end"].join(" ")}>
        <Button
          variant="success"
          onClick={() => {
            setUsuario("");
            setNome("");
            setSenha("");
            setTelaApresentacao(2);
          }}
        >
          Incluir usuário
        </Button>
      </div>
      <br></br>
      <div>
        <ToolkitProvider
          keyField="idUsuario"
          data={lista}
          columns={colunas}
          search
          exportCSV={{
            fileName: "usuarios.csv",
          }}
        >
          {(props) => (
            <div>
              <SearchBar
                srText="Filtre os resultados"
                placeholder="Informe o critério"
                {...props.searchProps}
              />
              <br></br>
              <BootstrapTable
                classes="react-bootstrap-table"
                keyField="idUsuario"
                striped={true}
                hover={true}
                defaultSorted={defaultSorted}
                pagination={pagination}
                {...props.baseProps}
              />
              <div className={["d-flex", "justify-content-end"].join(" ")}>
                <BotaoExportar {...props.csvProps}></BotaoExportar>
              </div>
            </div>
          )}
        </ToolkitProvider>
      </div>
    </div>
  );

  const salvarInclusao = async () => {
    const resposta = await dispatch(
      registrarUsuarioAction({
        usuario,
        nome,
        isUsuarioAdministrador: administrador ? "S" : "N",
        senha,
      })
    );
    if (resposta.error === undefined) {
      setTelaApresentacao(1);
    } else {
      if (resposta.payload === undefined) {
        return;
      }
      switch (resposta.payload.campo) {
        case 1:
          usuarioInput.focus();
          break;
        case 2:
          nomeInput.focus();
          break;
        case 3:
          senhaInput.focus();
          break;
        default:
          break;
      }
    }
  };

  const telaInclusao = () => (
    <Container className="paddingContainer">
      <Row>
        <Col md="8">
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder="Informe o usuário"
              value={usuario}
              autoFocus
              maxLength="15"
              onChange={(event) => {
                setUsuario(event.target.value);
              }}
              ref={(input) => {
                if (input !== null) {
                  usuarioInput = input;
                }
              }}
            />
          </Form.Group>
        </Col>
        <Col md="4">
          <Form.Check
            type="checkbox"
            id={`chkAdministador`}
            label={`Administrador`}
            value={administrador}
            defaultChecked={administrador}
            onChange={(event) => {
              setAdministrador(event.target.checked);
            }}
          />
        </Col>
      </Row>

      <Row>
        <Col md="12">
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder="Informe o nome do colaborador"
              value={nome}
              maxLength="150"
              onChange={(event) => {
                setNome(event.target.value);
              }}
              ref={(input) => {
                if (input !== null) {
                  nomeInput = input;
                }
              }}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md="4">
          <CampoSenha
            senha={senha}
            setSenha={setSenha}
            senhaInput={setSenhaInput}
          ></CampoSenha>
        </Col>
      </Row>

      <Row className="justify-content-md-start">
        <Col md="1">
          <Button
            variant="primary"
            onClick={() => {
              salvarInclusao();
            }}
          >
            Salvar
          </Button>
        </Col>
        <Col md="1">
          <Button
            variant="danger"
            onClick={() => {
              setTelaApresentacao(1);
            }}
          >
            Cancelar
          </Button>
        </Col>
      </Row>
    </Container>
  );

  const temAlteracao = () => {
    if (objetoOriginal.nomeColaborador !== nome) {
      return true;
    }

    if (objetoOriginal.indicadorAdministrador !== (administrador ? "S" : "N")) {
      return true;
    }

    if (objetoOriginal.indicadorAtivo !== (ativo ? "S" : "N")) {
      return true;
    }

    return false;
  };

  const salvarAlteracao = async () => {
    const resposta = await dispatch(
      alterarUsuarioAction({
        idUsuario: objetoOriginal.idUsuario,
        nomeColaborador: nome,
        isUsuarioAtivo: ativo ? "S" : "N",
        isUsuarioAdministrador: administrador ? "S" : "N",
      })
    );
    if (resposta.error === undefined) {
      setTelaApresentacao(1);
    } else {
      if (resposta.payload === undefined) {
        return;
      }
      switch (resposta.payload.campo) {
        case 1:
          usuarioInput.focus();
          break;
        case 2:
          nomeInput.focus();
          break;
        case 3:
          senhaInput.focus();
          break;
        default:
          break;
      }
    }
  };

  const telaAlteracao = () => (
    <Container className="paddingContainer">
      <Row>
        <Col md="4">
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder="Informe o usuário"
              value={usuario}
              maxLength="15"
              readOnly
              ref={(input) => {
                if (input !== null) {
                  usuarioInput = input;
                }
              }}
            />
          </Form.Group>
        </Col>
        <Col md="2">
          <Form.Check
            type="checkbox"
            id={`chkAdministador`}
            label={`Administrador`}
            value={administrador}
            defaultChecked={administrador}
            onChange={(event) => {
              setAdministrador(event.target.checked);
            }}
            disabled={objetoOriginal.idUsuario === 1}
          />
        </Col>
        <Col md="2">
          <Form.Check
            type="checkbox"
            id={`chkAtivo`}
            label={`Ativo`}
            value={ativo}
            defaultChecked={ativo}
            onChange={(event) => {
              setAtivo(event.target.checked);
            }}
            disabled={objetoOriginal.idUsuario === 1}
          />
        </Col>
        <Col md="4" align="end">
          <Button
            variant="warning"
            onClick={() => {
              setTelaApresentacao(4);
            }}
          >
            Resetar Senha
          </Button>
        </Col>
      </Row>

      <Row>
        <Col md="12">
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder="Informe o nome do colaborador"
              value={nome}
              autoFocus
              maxLength="150"
              onChange={(event) => {
                setNome(event.target.value);
              }}
              ref={(input) => {
                if (input !== null) {
                  nomeInput = input;
                }
              }}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row className="justify-content-md-start">
        <Col md="1">
          <Button
            variant="primary"
            disabled={!temAlteracao()}
            onClick={() => {
              salvarAlteracao();
            }}
          >
            Salvar
          </Button>
        </Col>
        <Col md="1">
          <Button
            variant="danger"
            onClick={() => {
              setTelaApresentacao(1);
            }}
          >
            Cancelar
          </Button>
        </Col>
      </Row>
    </Container>
  );

  const resetarSenha = async () => {
    if (senha !== senhaRepete) {
      dispatch(setErro(""));
      return;
    }

    const resposta = await dispatch(
      resetarSenhaAction({
        idUsuario: objetoOriginal.idUsuario,
        senha,
      })
    );

    if (resposta.error === undefined) {
      setTelaApresentacao(1);
    }
  };

  const telaResetarSenha = () => (
    <Container className="paddingContainer">
      <Row>
        <Col md="8">
          <Form.Group className="mb-3">
            <Form.Control type="text" readOnly disabled value={usuario} />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col md="4">
          <CampoSenha
            senha={senha}
            setSenha={setSenha}
            senhaInput={setSenhaInput}
          ></CampoSenha>
        </Col>
      </Row>
      <Row>
        <Col md="4">
          <CampoSenha
            textoPlaceholder="Repita a senha"
            senha={senhaRepete}
            setSenha={setSenhaRepete}
            senhaInput={setSenhaRepeteInput}
          ></CampoSenha>
        </Col>
      </Row>
      <Row className="justify-content-md-start">
        <Col md="1">
          <Button
            variant="primary"
            onClick={() => {
              resetarSenha();
            }}
          >
            Salvar
          </Button>
        </Col>
        <Col md="1">
          <Button
            variant="danger"
            onClick={() => {
              setTelaApresentacao(3);
            }}
          >
            Cancelar
          </Button>
        </Col>
      </Row>
    </Container>
  );

  switch (telaApresentacao) {
    case 1:
      return telaInicial();
    case 2:
      return telaInclusao();
    case 3:
      return telaAlteracao();
    case 4:
      return telaResetarSenha();
    default:
      return null;
  }
}

export default ParametrizacaoUsuario;
