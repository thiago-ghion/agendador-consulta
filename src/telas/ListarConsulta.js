import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Button } from "react-bootstrap";
import DatePicker from "../componentes/DatePicker";
import Form from "react-bootstrap/Form";
import { Typeahead } from "react-bootstrap-typeahead";

import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider, {
  Search,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min";

import pagination from "../componentes/Pagination";
import BotaoExportar from "../componentes/BotaoExportar";

import { listarVigenteAction } from "../features/ProfissionalSlice";
import {
  removerListaConsultaProfissional,
  cancelarAction,
  limparListaConsultaProfissional,
  listarConsultaTodasProfissionalAction,
} from "../features/consultaSlice";
import { setErro } from "../features/mensagemSlice";

function ListarConsulta() {
  const dispatch = useDispatch();
  const { SearchBar } = Search;

  const { listaProfissionalVigente } = useSelector(
    (state) => state.profissional
  );

  const { listaConsultaProfissional } = useSelector((state) => state.consulta);

  const isTelaCarregada = useRef(false);
  useEffect(() => {
    if (!isTelaCarregada.current) {
      dispatch(listarVigenteAction());
      dispatch(limparListaConsultaProfissional());
    }
    isTelaCarregada.current = true;
  });

  const [dataInicio, setDataInicio] = useState(null);
  const [dataFim, setDataFim] = useState(null);
  const [profissional, setProfissional] = useState([]);

  const selecionarProfissional = (evento) => {
    setProfissional(evento);
  };

  const filterBy = () => true;

  const pesquisar = () => {
    if (profissional.length === 0) {
      dispatch(setErro("Selecione o profissional para a consulta"));
      return;
    }

    dispatch(
      listarConsultaTodasProfissionalAction({
        idProfissional: profissional[0].idProfissional,
        dataInicio:
          dataInicio === null ? undefined : dataInicio.replaceAll("/", "."),
        dataFim: dataFim === null ? undefined : dataFim.replaceAll("/", "."),
      })
    );
  };

  const cancelar = async (row) => {
    const resposta = await dispatch(
      cancelarAction({
        idPaciente: row.idPaciente,
        idProfissional: row.idProfissional,
        dataConsulta: row.dataConsulta,
        idHorario: row.idHorario,
      })
    );

    if (resposta.error === undefined) {
      dispatch(
        removerListaConsultaProfissional({
          id: row.id,
        })
      );
    }
  };

  const acoesFormatter = (cell, row, rowIndex, formatExtraData) => {
    return row.indicadorPermissaoCancelar === "S" ? (
      <center>
        <Button
          variant="danger"
          onClick={() => {
            cancelar(row);
          }}
        >
          Cancelar
        </Button>
      </center>
    ) : (
      <></>
    );
  };

  const colunasAgendamento = [
    {
      dataField: "nomePaciente",
      text: "Paciente",
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
    },
  ];

  return (
    <div>
      <br></br>
      <Row>
        <Col>
          <Form.Label>Profissional</Form.Label>
          <Typeahead
            filterBy={filterBy}
            id="profissional"
            labelKey="nomeProfissional"
            options={listaProfissionalVigente}
            placeholder="Escolha o profissional..."
            selected={profissional}
            onChange={selecionarProfissional}
          />
        </Col>
      </Row>
      <br></br>
      <Row>
        <Col>
          <DatePicker
            initialValue={null}
            value={dataInicio}
            onChange={(evento) => {
              setDataInicio(evento.format("DD/MM/YYYY"));
            }}
          ></DatePicker>
        </Col>
        <Col>
          <DatePicker
            initialValue={null}
            value={dataFim}
            onChange={(evento) => {
              setDataFim(evento.format("DD/MM/YYYY"));
            }}
          ></DatePicker>
        </Col>
        <Col>
          <Button onClick={pesquisar}>Pesquisar</Button>
        </Col>
      </Row>
      <br></br>
      <Row>
        <Col>
          <ToolkitProvider
            keyField="id"
            data={listaConsultaProfissional}
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

export default ListarConsulta;
