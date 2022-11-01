import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Button } from "react-bootstrap";
import DatePicker from "../componentes/DatePicker";
import { isMobile } from "react-device-detect";

import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider, {
  Search,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min";

import pagination from "../componentes/Pagination";
import BotaoExportar from "../componentes/BotaoExportar";

import {
  cancelarAction,
  removerListaConsultaPaciente,
  limparListaConsultaPaciente,
  listarConsultaTodasPacienteAction,
} from "../features/consultaSlice";

function ListarConsultaPaciente() {
  const dispatch = useDispatch();
  const { SearchBar } = Search;

  const { listaConsultaPaciente } = useSelector((state) => state.consulta);
  const { usuario } = useSelector((state) => state.login);

  const isTelaCarregada = useRef(false);
  useEffect(() => {
    if (!isTelaCarregada.current) {
      dispatch(limparListaConsultaPaciente());
    }
    isTelaCarregada.current = true;
  });

  const [dataInicio, setDataInicio] = useState(null);
  const [dataFim, setDataFim] = useState(null);

  const pesquisar = () => {
    dispatch(
      listarConsultaTodasPacienteAction({
        idPaciente: usuario.id,
        dataInicio:
          dataInicio === null ? undefined : dataInicio.replaceAll("/", "."),
        dataFim: dataFim === null ? undefined : dataFim.replaceAll("/", "."),
      })
    );
  };

  const cancelar = async (row) => {
    const resposta = dispatch(
      cancelarAction({
        idPaciente: usuario.id,
        idProfissional: row.idProfissional,
        dataConsulta: row.dataConsulta,
        idHorario: row.idHorario,
      })
    );

    if (resposta.error === undefined) {
      window.scrollTo(0, 0);
      dispatch(
        removerListaConsultaPaciente({
          id: row.id,
        })
      );
    }
  };

  const acoesFormatter = (cell, row, rowIndex, formatExtraData) => {
    return row.indicadorPermissaoCancelar === "S" ? (
      isMobile ? (
        <>
          {row.dataConsulta} {row.horario}
          <Button
            variant="danger"
            data-testid="cancelar"
            onClick={() => {
              cancelar(row);
            }}
          >
            Cancelar
          </Button>
        </>
      ) : (
        <center>
          <Button
            variant="danger"
            data-testid="cancelar"
            onClick={() => {
              cancelar(row);
            }}
          >
            Cancelar
          </Button>
        </center>
      )
    ) : (
      <></>
    );
  };

  let colunasAgendamento = [];

  if (isMobile) {
    colunasAgendamento = [
      {
        dataField: "nomeProfissional",
        text: "Profissional",
        style: { cursor: "pointer" },
        sort: true,
      },
      {
        dataField: "id",
        text: "",
        sort: false,
        style: { cursor: "pointer" },
        formatter: acoesFormatter,
        isDummyField: true,
        csvExport: false,
      },
    ];
  } else {
    colunasAgendamento = [
      {
        dataField: "nomeProfissional",
        text: "Profissional",
        style: { cursor: "pointer" },
        sort: true,
      },
      {
        dataField: "dataConsulta",
        text: "Data",
        sort: true,
        style: { cursor: "pointer" },
        headerStyle: () => {
          return { width: "100px" };
        },
      },
      {
        dataField: "horario",
        text: "Horário",
        sort: true,
        style: { cursor: "pointer" },
        headerStyle: () => {
          return { width: "100px" };
        },
      },
      {
        dataField: "id",
        text: "Ações",
        sort: true,
        style: { cursor: "pointer" },
        formatter: acoesFormatter,
        headerStyle: () => {
          return { width: "110px" };
        },
        csvExport: false,
      },
    ];
  }

  return (
    <div>
      <br></br>
      {isMobile ? (
        <>
          <Row>
            <Col>
              <DatePicker
                initialValue={null}
                value={dataInicio}
                onChange={(evento) => {
                  setDataInicio(evento.format("DD/MM/YYYY"));
                }}
                test={{ "aria-label": "dataInicio" }}
              ></DatePicker>
            </Col>
          </Row>
          <Row>
            <Col>
              <DatePicker
                initialValue={null}
                value={dataFim}
                onChange={(evento) => {
                  setDataFim(evento.format("DD/MM/YYYY"));
                }}
                test={{ "aria-label": "dataFim" }}
              ></DatePicker>
            </Col>
          </Row>
          <Row>
            <Col>
              <Button onClick={pesquisar}>Pesquisar</Button>
            </Col>
          </Row>
        </>
      ) : (
        <Row>
          <Col>
            <DatePicker
              initialValue={null}
              value={dataInicio}
              onChange={(evento) => {
                setDataInicio(evento.format("DD/MM/YYYY"));
              }}
              test={{ "aria-label": "dataInicio" }}
            ></DatePicker>
          </Col>
          <Col>
            <DatePicker
              initialValue={null}
              value={dataFim}
              onChange={(evento) => {
                setDataFim(evento.format("DD/MM/YYYY"));
              }}
              test={{ "aria-label": "dataFim" }}
            ></DatePicker>
          </Col>
          <Col>
            <Button onClick={pesquisar}>Pesquisar</Button>
          </Col>
        </Row>
      )}
      <br></br>
      <Row>
        <Col>
          <ToolkitProvider
            keyField="id"
            data={listaConsultaPaciente}
            columns={colunasAgendamento}
            search
            exportCSV={{
              fileName: "consultas.csv",
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
                  striped={true}
                  hover={true}
                  pagination={pagination}
                  {...props.baseProps}
                />
                <div className={["d-flex", "justify-content-end"].join(" ")}>
                  <BotaoExportar {...props.csvProps}></BotaoExportar>
                </div>
              </div>
            )}
          </ToolkitProvider>
        </Col>
      </Row>
    </div>
  );
}

export default ListarConsultaPaciente;
