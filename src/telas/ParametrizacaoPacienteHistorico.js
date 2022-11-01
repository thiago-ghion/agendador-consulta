import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isMobile } from "react-device-detect";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import DatePicker from "../componentes/DatePicker";
import { Button } from "react-bootstrap";

import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider, {
  Search,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min";
import pagination from "../componentes/Pagination";
import BotaoExportar from "../componentes/BotaoExportar";
import {
  limparListaConsultaPaciente,
  listarConsultaTodasPacienteAction,
} from "../features/consultaSlice";

function ParametrizacaoPacienteHistorico(props) {
  const { SearchBar } = Search;
  const dispatch = useDispatch();

  const { listaConsultaPaciente } = useSelector((state) => state.consulta);

  const [dataInicio, setDataInicio] = useState(null);
  const [dataFim, setDataFim] = useState(null);

  const isTelaCarregada = useRef(false);

  useEffect(() => {
    if (isTelaCarregada.current === false) {
      dispatch(limparListaConsultaPaciente());
    }
    isTelaCarregada.current = true;
  });

  const pesquisar = async () => {
    await dispatch(
      listarConsultaTodasPacienteAction({
        idPaciente: props.idPaciente,
        dataInicio: dataInicio,
        dataFim: dataFim,
      })
    );
  };

  const voltar = () => {
    props.setTelaAtiva(1);
  };

  const colunas = [
    {
      dataField: "nomeProfissional",
      text: "Profissional",
      style: { cursor: "pointer" },
      sort: true,
    },
    {
      dataField: "dataConsulta",
      text: "Data",
      style: { cursor: "pointer" },
      sort: true,
    },
    {
      dataField: "horario",
      text: "Horário",
      style: { cursor: "pointer" },
      sort: true,
    },
  ];

  return (
    <>
      {" "}
      {isMobile ? "true" : "false"}
      {isMobile ? (
        <>
          {" "}
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
                aria-label="dataFim"
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
            {" "}
            <Col>
              <Button onClick={pesquisar}>Pesquisar</Button>
            </Col>
            <Col>
              <Button variant="danger" onClick={voltar}>
                Voltar
              </Button>
            </Col>
          </Row>
        </>
      ) : (
        <>
          <br></br>
          <Row>
            <Col>
              <DatePicker
                aria-label="dataInicio"
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
                aria-label="dataFim"
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
              {"  "}
              <Button variant="danger" onClick={voltar}>
                Voltar
              </Button>
            </Col>
          </Row>
        </>
      )}
      <Row>
        <Col>
          <div>
            <ToolkitProvider
              keyField="id"
              data={listaConsultaPaciente.filter(
                (item) => item.indicadorPermissaoCancelar === `S`
              )}
              columns={colunas}
              search
              exportCSV={{
                fileName: "historico_consulta.csv",
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
    </>
  );
}

export default ParametrizacaoPacienteHistorico;
