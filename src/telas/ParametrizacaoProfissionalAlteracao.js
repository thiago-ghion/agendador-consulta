import React, { useState } from "react";
import moment from "moment";
import { Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";

import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min";

import {
  alterarProfissionalAction,
  listarConfiguracaoHorarioAction,
} from "../features/ProfissionalSlice";

import DatePicker from "../componentes/DatePicker";
import pagination from "../componentes/Pagination";

function ParametrizacaoProfissionaAlteracao(props) {
  const dispatch = useDispatch();

  const [nomeProfissional, setNomeProfissional] = useState(
    props.nomeProfissional
  );
  const [listaVinculo, setListaVinculo] = useState([]);
  const [data, setData] = useState(null);

  let nomeProfissionalInput;
  let datePickerRef;

  const setRef = (input) => {
    datePickerRef = input;
  };

  const isHorarioAtivo = (idHorario) => {
    const vinculo = listaVinculo.find(
      (item) => item.idHorario === idHorario && item.data === data
    );
    return vinculo.estado;
  };

  const horarioFormatter = (cell, row, rowIndex, formatExtraData) => {
    return (
      <div>
        <Button
          variant={isHorarioAtivo(row.idHorario) ? "danger" : "success"}
          onClick={() => {
            setListaVinculo((current) =>
              current.map((obj) => {
                if (obj.idHorario === row.idHorario && obj.data === data) {
                  return { ...obj, estado: !obj.estado };
                }
                return obj;
              })
            );
          }}
        >
          {isHorarioAtivo(row.idHorario)
            ? "Desativar"
            : "\u00a0\u00a0\u00a0Ativar\u00a0\u00a0\u00a0"}
        </Button>
      </div>
    );
  };

  const colunasHorario = [
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
      text: "Ações",
      formatter: horarioFormatter,
      style: { cursor: "pointer" },
    },
  ];

  const carregarLista = async (evento) => {
    const data = evento.format("DD/MM/YYYY");

    if (listaVinculo.find((item) => item.data === data) === undefined) {
      console.log("data", data.replaceAll("/", "."));
      const resposta = await dispatch(
        listarConfiguracaoHorarioAction({
          idProfissional: props.idProfissional,
          dataPesquisa: data.replaceAll("/", "."),
        })
      );
      console.log("resposta", resposta);
      setListaVinculo((current) =>
        current.concat(
          props.listaHorario.map((obj) => {
            if (
              resposta.payload.find(
                (item) => obj.idHorario === item.idHorario
              ) !== undefined
            ) {
              return {
                ...obj,
                data,
                estadoOriginal: true,
                estado: true,
              };
            }

            return {
              ...obj,
              data,
            };
          })
        )
      );
    }
  };

  const montarListaData = () => {
    const lista = {};

    listaVinculo.forEach((item) => {
      lista[item.data] = {};
    });

    return Object.keys(lista)
      .sort((a, b) => {
        return (
          moment(a, "DD/MM/YYYY").valueOf() - moment(b, "DD/MM/YYYY").valueOf()
        );
      })
      .map((item) => (
        <option selected={item === data} value={item}>
          {item}
        </option>
      ));
  };

  const salvar = async () => {
    const requisicao = {
      nomeProfissional: nomeProfissional,
      vinculoDataHorario: [],
    };

    const grupo = {};

    listaVinculo
      .filter((item) => item.estadoOriginal !== item.estado)
      .forEach((item) => {
        if (grupo[item.data] === undefined) {
          grupo[item.data] = [];
        }
        grupo[item.data].push(item);
      });

    Object.keys(grupo).forEach((item) => {
      requisicao.vinculoDataHorario.push({
        data: item.replaceAll("/", "."),
        listaHorario: grupo[item].map((vinculo) => ({
          idHorario: vinculo.idHorario,
          acao: vinculo.estado ? "A" : "D",
        })),
      });
    });

    console.log(requisicao);
    const resposta = await dispatch(
      alterarProfissionalAction({
        idProfissional: props.idProfissional,
        requisicao,
      })
    );

    console.log("resposta", resposta);
    if (resposta.error !== undefined) {
      if (resposta.payload.campo === 1) {
        nomeProfissionalInput.focus();
      }
    } else {
      props.setTelaAtiva(1);
    }
  };

  const isDataValida = (currentDate, selectedDate) => {
    return currentDate.startOf("day").isSameOrAfter(moment().startOf("day"));
  };

  const renderInclusao = () => {
    return (
      <div>
        <br></br>
        <Row>
          <Col>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                placeholder="Informe o nome do profissional"
                value={nomeProfissional}
                autoFocus
                maxLength="150"
                onChange={(event) => {
                  setNomeProfissional(event.target.value);
                }}
                ref={(input) => {
                  if (input !== null) {
                    nomeProfissionalInput = input;
                  }
                }}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={3}>
            <DatePicker
              initialValue={null}
              setRef={setRef}
              value={data}
              onChange={(evento) => {
                setData(evento.format("DD/MM/YYYY"));
                carregarLista(evento);
              }}
              isValidDate={isDataValida}
            ></DatePicker>
          </Col>
          <Col md={6}></Col>
          <Col>
            <Form.Select
              onChange={(evento) => {
                const dataSelecionada = moment(
                  evento.target.value,
                  "DD/MM/YYYY"
                );
                setData(dataSelecionada.format("DD/MM/YYYY"));
              }}
            >
              {montarListaData()}
            </Form.Select>
          </Col>
        </Row>
        <Row>
          <Col>
            {listaVinculo.length === 0 ? (
              <></>
            ) : (
              <div>
                <ToolkitProvider
                  keyField="idHorario"
                  data={listaVinculo.filter((item) => {
                    return item.data === data;
                  })}
                  columns={colunasHorario}
                >
                  {(props) => (
                    <div>
                      <BootstrapTable
                        classes="react-bootstrap-table"
                        keyField="idHorario"
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
          </Col>
        </Row>
        <br></br>
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
  };

  return renderInclusao();
}

export default ParametrizacaoProfissionaAlteracao;
