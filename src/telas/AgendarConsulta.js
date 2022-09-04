import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import { Button } from "react-bootstrap";
import { isMobile } from "react-device-detect";

import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min";

import { AsyncTypeahead, Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";
import DatePicker from "../componentes/DatePicker";

import { setSucesso } from "../features/mensagemSlice";
import {
  limparListaPaciente,
  listarParcialPacienteAction,
} from "../features/pacienteSlice";
import {
  listarVigenteAction,
  limparListaDataDisponivel,
  listarDataDisponivelAction,
  listarHorarioDisponivelAction,
  limparListaHorarioDisponivel,
} from "../features/ProfissionalSlice";
import { agendarAction } from "../features/consultaSlice";

function AgendarConsulta() {
  const dispatch = useDispatch();

  const { listaPaciente } = useSelector((state) => state.paciente);
  const {
    listaProfissionalVigente,
    listaDataDisponivel,
    listaHorarioDisponivel,
  } = useSelector((state) => state.profissional);

  const [isLoading, setIsLoading] = useState(false);
  const [isGradeDataCarregada, setIsGradeDataCarregada] = useState(false);
  const [isGradeHorarioCarregada, setIsGradeHorarioCarregada] = useState(false);
  const [paciente, setPaciente] = useState(null);
  const [profissional, setProfissional] = useState(null);
  const [comboPaciente, setComboPaciente] = useState([]);
  const [comboProfissional, setComboProfissional] = useState([]);

  const [data, setData] = useState(null);

  const isTelaCarregada = useRef(false);

  useEffect(() => {
    if (!isTelaCarregada.current) {
      dispatch(listarVigenteAction());
      dispatch(limparListaPaciente());
      dispatch(limparListaDataDisponivel());
      dispatch(limparListaHorarioDisponivel());
    }
    isTelaCarregada.current = true;
  });

  const filterBy = () => true;

  const procuraPaciente = async (nomeParcial) => {
    setIsLoading(true);
    await dispatch(listarParcialPacienteAction({ nomeParcial }));
    setIsLoading(false);
  };

  const carregarGradeData = async (profissional) => {
    setComboProfissional(profissional);
    dispatch(setSucesso(null));
    setProfissional(profissional[0]);
    const resposta = await dispatch(
      listarDataDisponivelAction({
        idProfissional: profissional[0].idProfissional,
        dataInicio: moment().format("DD.MM.YYYY"),
        dataFim: moment().startOf("day").add(60, "days").format("DD.MM.YYYY"),
      })
    );
    if (resposta.error === undefined) {
      setIsGradeDataCarregada(true);
    }
  };

  const isDataValida = (currentDate, selectedDate) => {
    let isValido = false;
    listaDataDisponivel.forEach((item) => {
      if (item.data === currentDate.format("DD.MM.YYYY")) {
        isValido = true;
      }
    });
    return isValido;
  };

  const carregarPaciente = (evento) => {
    dispatch(setSucesso(null));
    setPaciente(evento[0]);
    setComboPaciente(evento);
  };

  const carregarListaHorario = async (evento) => {
    setIsGradeHorarioCarregada(false);
    const dataPesquisa = evento.format("DD.MM.YYYY");
    const resposta = await dispatch(
      listarHorarioDisponivelAction({
        idProfissional: profissional.idProfissional,
        dataPesquisa,
      })
    );

    if (resposta.error === undefined) {
      setIsGradeHorarioCarregada(true);
    }
  };

  const agendar = (row) => async () => {
    const resposta = await dispatch(
      agendarAction({
        idPaciente: paciente.idPaciente,
        idProfissional: profissional.idProfissional,
        dataConsulta: data.format("DD.MM.YYYY"),
        idHorario: row.idHorario,
      })
    );
    if (resposta.error === undefined) {
      window.scrollTo(0, 0);
      dispatch(setSucesso("Consulta agenda com sucesso"));
      dispatch(limparListaPaciente());
      dispatch(limparListaDataDisponivel());
      dispatch(limparListaHorarioDisponivel());
      setIsGradeDataCarregada(false);
      setIsGradeHorarioCarregada(false);
      setComboPaciente([]);
      setComboProfissional([]);
    }
  };

  const horarioFormatter = (cell, row, rowIndex, formatExtraData) => {
    return (
      <center>
        <Button variant="primary" onClick={agendar(row)}>
          Agendar
        </Button>
      </center>
    );
  };

  const colunasHorario = [
    {
      dataField: "horario",
      text: "Horário",
      style: { cursor: "pointer" },
      sort: true,
      headerStyle: () => {
        return { width: "110px" };
      },
    },
    {
      dataField: "idHorario",
      text: "Ações",
      sort: true,
      style: { cursor: "pointer" },
      formatter: horarioFormatter,
    },
  ];

  return (
    <div>
      <br></br>
      <Row>
        <Col>
          <Form.Label>Paciente</Form.Label>
          <AsyncTypeahead
            filterBy={filterBy}
            id="paciente"
            isLoading={isLoading}
            onSearch={procuraPaciente}
            labelKey="nomePaciente"
            options={listaPaciente}
            minLength={3}
            placeholder="Escolha o paciente..."
            onChange={carregarPaciente}
            selected={comboPaciente}
          />
        </Col>
      </Row>
      <br></br>
      <Row>
        <Col>
          <Form.Label>Profissional</Form.Label>
          <Typeahead
            filterBy={filterBy}
            id="profissional"
            dropup={true}
            labelKey="nomeProfissional"
            options={listaProfissionalVigente}
            placeholder="Escolha o profissional..."
            onChange={carregarGradeData}
            selected={comboProfissional}
          />
        </Col>
      </Row>
      <br></br>
      {isGradeDataCarregada ? (
        <Row data-testid="blocoData">
          <Col>
            <DatePicker
              input={false}
              isValidDate={isDataValida}
              value={data}
              onChange={(evento) => {
                dispatch(setSucesso(null));
                setData(evento);
                carregarListaHorario(evento);
              }}
            ></DatePicker>
          </Col>
        </Row>
      ) : (
        <></>
      )}
      {isGradeHorarioCarregada ? (
        <div>
          <br></br>
          <Row>
            {isMobile ? <></> : <Col></Col>}
            <Col>
              <ToolkitProvider
                keyField="horario"
                data={listaHorarioDisponivel}
                columns={colunasHorario}
              >
                {(props) => (
                  <div>
                    <BootstrapTable
                      classes="react-bootstrap-table"
                      keyField="horario"
                      striped={true}
                      hover={true}
                      {...props.baseProps}
                    />
                  </div>
                )}
              </ToolkitProvider>
            </Col>
            {isMobile ? <></> : <Col></Col>}
          </Row>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

export default AgendarConsulta;
