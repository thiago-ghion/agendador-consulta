import React, { useState, useEffect, useRef } from "react";
import { isMobile } from "react-device-detect";
import { useDispatch, useSelector } from "react-redux";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import DatePicker from "../componentes/DatePicker";
import { Button } from "react-bootstrap";

import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import {
  limparConsultasAtivasVersusCanceladas,
  limparListaConsultasDiasSemana,
  limparListaHorariosMaisUtilizados,
  limparListaProfissionaisMaisConsultas,
  limparLoginProprioVersusOauth,
  listarConsultasAtivasVersusCanceladasAction,
  listarConsultasDiasSemanaAction,
  listarHorariosMaisUtilizadosAction,
  listarLoginProprioVersusOauthAction,
  listarProfissionaisMaisConsultasAction,
} from "../features/estatisticaSlice";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const formatadorPie = (value, entry, index) => entry.payload.rotulo;

function Estatisticas() {
  //TODO: useEffect para limpar a lista ao carregar a tela
  const dispatch = useDispatch();

  const {
    listaHorariosMaisUtilizados,
    listaConsultasDiasSemana,
    listaProfissionaisMaisConsultas,
    consultasAtivasVersusCanceladas,
    loginProprioVersusOauth,
  } = useSelector((state) => state.estatistica);

  const [dataInicio, setDataInicio] = useState(null);
  const [dataFim, setDataFim] = useState(null);
  const [isGraficoPronto, setGraficoPronto] = useState(false);

  const isTelaCarregada = useRef(false);

  useEffect(() => {
    if (isTelaCarregada.current === false) {
      dispatch(limparListaHorariosMaisUtilizados());
      dispatch(limparListaConsultasDiasSemana());
      dispatch(limparListaProfissionaisMaisConsultas());
      dispatch(limparConsultasAtivasVersusCanceladas());
      dispatch(limparLoginProprioVersusOauth());
      isTelaCarregada.current = true;
    }
  });

  const pesquisar = async () => {
    await Promise.all([
      dispatch(
        listarHorariosMaisUtilizadosAction({
          dataInicio: dataInicio,
          dataFim: dataFim,
        })
      ),

      dispatch(
        listarConsultasDiasSemanaAction({
          dataInicio: dataInicio,
          dataFim: dataFim,
        })
      ),

      dispatch(
        listarProfissionaisMaisConsultasAction({
          dataInicio: dataInicio,
          dataFim: dataFim,
        })
      ),

      dispatch(
        listarConsultasAtivasVersusCanceladasAction({
          dataInicio: dataInicio,
          dataFim: dataFim,
        })
      ),

      dispatch(
        listarLoginProprioVersusOauthAction({
          dataInicio: dataInicio,
          dataFim: dataFim,
        })
      ),
    ]);

    setGraficoPronto(true);
  };

  return (
    <>
      {" "}
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
            <Col>
              <Button onClick={pesquisar}>Pesquisar</Button>
            </Col>
          </Row>
        </>
      ) : (
        <>
          <br></br>
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
            </Col>
          </Row>
        </>
      )}
      <br></br>
      {isGraficoPronto ? (
        <>
          <Row>
            <Col md={6}>
              <Row>
                <Col md={12}>
                  <center>
                    <h4>Horários mais utilizados</h4>
                  </center>
                </Col>
              </Row>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  width="100%"
                  height="100%"
                  data={listaHorariosMaisUtilizados}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="textoHorario" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="quantidade" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Col>
            <Col md={6}>
              <Row>
                <Col md={12}>
                  <center>
                    <h4>Consultas por dia da semana</h4>
                  </center>
                </Col>
              </Row>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  width="100%"
                  height="100%"
                  data={listaConsultasDiasSemana}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="texto" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="quantidade" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Col>
          </Row>
          <br></br>
          <Row>
            <Col md={6}>
              <Row>
                <Col md={12}>
                  <center>
                    <h4>Profissionais com mais consultas</h4>
                  </center>
                </Col>
              </Row>

              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  width="100%"
                  height="100%"
                  data={listaProfissionaisMaisConsultas}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="nomeProfissional" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="quantidade" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Col>
          </Row>
          <br></br>
          <Row>
            <Col md={6}>
              <Row>
                <Col md={12}>
                  <center>
                    <h4>Consultas Canceladas X Ativas</h4>
                  </center>
                </Col>
              </Row>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart width="100%" height="100%">
                  <Pie
                    data-testid="consultas_canceladas_ativas"
                    data={consultasAtivasVersusCanceladas}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="quantidade"
                  >
                    {consultasAtivasVersusCanceladas.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Legend formatter={formatadorPie} />
                </PieChart>
              </ResponsiveContainer>
            </Col>
            <Col md={6}>
              <Row>
                <Col md={12}>
                  <center>
                    <h4>Login Próprio X OAuth</h4>
                  </center>
                </Col>
              </Row>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart width="100%" height="100%">
                  <Pie
                    data={loginProprioVersusOauth}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="quantidade"
                  >
                    {loginProprioVersusOauth.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Legend formatter={formatadorPie} />
                </PieChart>
              </ResponsiveContainer>
            </Col>
          </Row>
        </>
      ) : (
        <></>
      )}
    </>
  );
}

export default Estatisticas;
