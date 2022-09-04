import React, { useState } from "react";
import { useDispatch } from "react-redux";

import { Button } from "react-bootstrap";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min";
import { isMobile } from "react-device-detect";

import DatePicker from "../componentes/DatePicker";
import pagination from "../componentes/Pagination";
import { listarConfiguracaoHorarioPeriodoAction } from "../features/ProfissionalSlice";
import { setErro } from "../features/mensagemSlice";

function ListarHorarioProfissional(props) {
  const dispatch = useDispatch();
  const [listaConfiguracao, setListaConfiguracao] = useState([]);
  const [dataInicio, setDataInicio] = useState(null);
  const [dataFim, setDataFim] = useState(null);

  const colunasHorario = [
    {
      dataField: "dataVinculo",
      text: "Data",
      sort: true,
      style: { cursor: "pointer" },
      headerStyle: () => {
        return { width: "180px" };
      },
    },
    {
      dataField: "horario",
      text: "Horário",
      style: { cursor: "pointer" },
      sort: true,
    },
  ];

  const pesquisar = async () => {
    if (dataInicio === null) {
      dispatch(setErro("Informe a data início da pesquisa"));
      return;
    }
    if (dataFim === null) {
      dispatch(setErro("Informe a data fim da pesquisa"));
      return;
    }

    const resposta = await dispatch(
      listarConfiguracaoHorarioPeriodoAction({
        idProfissional: props.idProfissional,
        dataInicio: dataInicio.format("DD.MM.YYYY"),
        dataFim: dataFim.format("DD.MM.YYYY"),
      })
    );

    if (resposta.erro === undefined) {
      const grupo = [];
      resposta.payload.forEach((item) => {
        if (grupo[item.dataVinculo] === undefined) {
          grupo[item.dataVinculo] = `${item.horario}`;
        } else {
          grupo[item.dataVinculo] = `${grupo[item.dataVinculo]} ${
            item.horario
          }`;
        }
      });

      const lista = [];
      Object.keys(grupo).forEach((key) => {
        lista.push({
          dataVinculo: key.replaceAll(".", "/"),
          horario: grupo[key],
        });
      });

      setListaConfiguracao(lista);
    }
  };

  const renderTela = () => {
    return (
      <div>
        <br></br>
        <Row>
          <Col>
            <span>
              {props.idProfissional} - {props.nomeProfissional}
            </span>
          </Col>
        </Row>
        <br></br>
        {isMobile ? (
          <>
            <Row>
              <Col>
                <DatePicker
                  initialValue={null}
                  onChange={(evento) => {
                    setDataInicio(evento);
                    setListaConfiguracao([]);
                  }}
                  inputProps={{ placeholder: "Data início pesquisa" }}
                ></DatePicker>
              </Col>
            </Row>
            <Row>
              <Col>
                <DatePicker
                  initialValue={null}
                  onChange={(evento) => {
                    setDataFim(evento);
                    setListaConfiguracao([]);
                  }}
                  inputProps={{ placeholder: "Data fim pesquisa" }}
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
                onChange={(evento) => {
                  setDataInicio(evento);
                  setListaConfiguracao([]);
                }}
                inputProps={{ placeholder: "Data início pesquisa" }}
              ></DatePicker>
            </Col>
            <Col>
              <DatePicker
                initialValue={null}
                onChange={(evento) => {
                  setDataFim(evento);
                  setListaConfiguracao([]);
                }}
                inputProps={{ placeholder: "Data fim pesquisa" }}
              ></DatePicker>
            </Col>
            <Col>
              <Button onClick={pesquisar}>Pesquisar</Button>
            </Col>
          </Row>
        )}
        <Row>
          {listaConfiguracao.length === 0 ? (
            <></>
          ) : (
            <div>
              <ToolkitProvider
                keyField="idHorario"
                data={listaConfiguracao}
                columns={colunasHorario}
              >
                {(props) => (
                  <div>
                    <BootstrapTable
                      classes="react-bootstrap-table"
                      keyField="dataVinculo"
                      striped={true}
                      hover={true}
                      pagination={pagination}
                      {...props.baseProps}
                    />
                  </div>
                )}
              </ToolkitProvider>
            </div>
          )}
        </Row>
        <br></br>
        {isMobile ? (
          <></>
        ) : (
          <Row className="justify-content-md-end">
            <Col md={1}>
              <Button variant="primary" onClick={() => props.setTelaAtiva(1)}>
                Voltar
              </Button>
            </Col>
          </Row>
        )}
      </div>
    );
  };

  return renderTela();
}

export default ListarHorarioProfissional;
