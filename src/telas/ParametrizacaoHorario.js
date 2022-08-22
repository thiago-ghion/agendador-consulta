import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import { Button } from "react-bootstrap";
import ToolkitProvider, {
  Search,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";

import BotaoExportar from "../componentes/BotaoExportar";
import {
  listarHorarioAction,
  registrarHorarioAction,
  ativarHorarioAction,
  desativarHorarioAction,
} from "../features/horarioSlice";

import "react-bootstrap-table-next/dist/react-bootstrap-table2.css";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css";

function ParametrizacaoHorario() {
  const dispatch = useDispatch();

  const { lista } = useSelector((state) => state.horario);
  const [horario, setHorario] = useState("");
  let horarioInput;

  const telaCarregada = useRef(false);

  useEffect(() => {
    if (telaCarregada.current === false) {
      const prepararLista = async () => {
        await dispatch(listarHorarioAction());
      };
      prepararLista();
      telaCarregada.current = true;
    }
  }, [dispatch]);

  const registrar = async () => {
    const resposta = await dispatch(
      registrarHorarioAction({ idHorario: horario })
    );
    if (resposta.error === undefined) {
      setHorario("");
      dispatch(listarHorarioAction());
    } else {
      horarioInput.focus();
    }
  };

  function listaFormatter(cell, row, rowIndex, formatExtraData) {
    return (
      <Button
        variant={row.indicadorAtivo === "S" ? "danger" : "success"}
        onClick={() => {
          if (row.indicadorAtivo === "S") {
            dispatch(desativarHorarioAction({ idHorario: row.idHorario }));
          }

          if (row.indicadorAtivo === "N") {
            dispatch(ativarHorarioAction({ idHorario: row.idHorario }));
          }
        }}
      >
        {row.indicadorAtivo === "S"
          ? "Desativar"
          : "\u00a0\u00a0\u00a0Ativar\u00a0\u00a0\u00a0"}
      </Button>
    );
  }

  const colunas = [
    {
      dataField: "idHorario",
      text: "#",
      sort: true,
      style: { cursor: "pointer" },
      headerStyle: () => {
        return { width: "80px" };
      },
    },
    {
      dataField: "horario",
      text: "Horário",
      style: { cursor: "pointer" },
      sort: true,
    },
    {
      dataField: "indicadorAtivo",
      text: "Ativação",
      style: { cursor: "pointer" },
      sort: true,
      formatter: listaFormatter,
    },
  ];

  const defaultSorted = [
    {
      dataField: "idHorario",
      order: "asc",
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

  return (
    <Container>
      <br></br>
      <Row>
        <Col md={3}>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder="Informe o horário"
              value={horario}
              autoFocus
              maxLength="5"
              onChange={(event) => {
                setHorario(event.target.value);
              }}
              ref={(input) => {
                if (input !== null) {
                  horarioInput = input;
                }
              }}
            />
          </Form.Group>
        </Col>
        <Col md={1}>
          <Button
            variant="primary"
            onClick={() => {
              registrar();
            }}
          >
            Incluir
          </Button>
        </Col>
      </Row>
      <br></br>
      <Row>
        <Col md={12}>
          <div>
            <ToolkitProvider
              keyField="idHorario"
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
                    keyField="idHorario"
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
        </Col>
      </Row>
    </Container>
  );
}

export default ParametrizacaoHorario;
