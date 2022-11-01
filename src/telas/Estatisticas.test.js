import React from "react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { renderWithProviders } from "../util/test-utils";

import Estatisticas from "./Estatisticas";
import { fireEvent, screen, waitFor, within } from "@testing-library/react";
import { default as userEvent } from "@testing-library/user-event";

import * as deviceDetect from "react-device-detect";

let mockListaHorariosMaisUtilizados = [];
let mockListaConsultaDiasSemana = [];
let mockListaProfissionaisMaisConsultas = [];
let mockListaConsultasAtivasVersusCanceladas = [];
let mockListaLoginProprioVersusOauth = [];

jest.mock("recharts", () => ({
  XAxis: jest.requireActual("recharts").XAxis,
  YAxis: jest.requireActual("recharts").YAxis,
  CartesianGrid: jest.requireActual("recharts").CartesianGrid,
  Tooltip: jest.requireActual("recharts").Tooltip,
  BarChart: jest.requireActual("recharts").BarChart,
  Bar: jest.requireActual("recharts").Bar,
  PieChart: (props) => <div>{props.children}</div>,
  Pie: (props) => <div>{props.children}</div>,
  Cell: jest.requireActual("recharts").Cell,
  Legend: jest.requireActual("recharts").Legend,
  ResponsiveContainer: (props) => {
    return (
      <div height={100} width={100}>
        {props.children}
      </div>
    );
  },
}));

export const handlers = [
  rest.get(
    "http://localhost:5000/v1/estatistica/listarHorariosMaisUtilizados",
    (req, res, ctx) => {
      return res(ctx.json(mockListaHorariosMaisUtilizados));
    }
  ),
  rest.get(
    "http://localhost:5000/v1/estatistica/listarConsultasDiasSemana",
    (req, res, ctx) => {
      return res(ctx.json(mockListaConsultaDiasSemana));
    }
  ),
  rest.get(
    "http://localhost:5000/v1/estatistica/listarProfissionaisMaisConsultas",
    (req, res, ctx) => {
      return res(ctx.json(mockListaProfissionaisMaisConsultas));
    }
  ),
  rest.get(
    "http://localhost:5000/v1/estatistica/listarConsultasAtivasVersusCanceladas",
    (req, res, ctx) => {
      return res(ctx.json(mockListaConsultasAtivasVersusCanceladas));
    }
  ),
  rest.get(
    "http://localhost:5000/v1/estatistica/listarLoginProprioVersusOauth",
    (req, res, ctx) => {
      return res(ctx.json(mockListaLoginProprioVersusOauth));
    }
  ),
];

const server = setupServer(...handlers);

// Enable API mocking before tests.
beforeAll(() => server.listen());

// Reset any runtime request handlers we may add during the tests.
afterEach(() => server.resetHandlers());

// Disable API mocking after the tests are done.
afterAll(() => server.close());

beforeAll(() => {
  mockListaHorariosMaisUtilizados = [];
  mockListaConsultaDiasSemana = [];
  mockListaProfissionaisMaisConsultas = [];
  mockListaConsultasAtivasVersusCanceladas = [];
  mockListaLoginProprioVersusOauth = [];
});

test("Renderização componente", async () => {
  expect(renderWithProviders(<Estatisticas />)).toMatchSnapshot();
});

test("Carregar gráfico", async () => {
  deviceDetect.isMobile = false;

  mockListaConsultasAtivasVersusCanceladas = [
    { rotulo: "Ativa", quantidade: 1 },
    { rotulo: "Cancelada", quantidade: 1 },
  ];

  mockListaLoginProprioVersusOauth = [
    { rotulo: "Proprio", quantidade: 1 },
    { rotulo: "Externo", quantidade: 1 },
  ];

  let user = userEvent.setup();

  renderWithProviders(<Estatisticas />);

  const dataInicio = await screen.findByLabelText("dataInicio");
  fireEvent.change(dataInicio, { target: { value: "01/01/2022" } });

  const dataFim = await screen.findByLabelText("dataFim");
  fireEvent.change(dataFim, { target: { value: "01/01/2022" } });

  const pesquisar = await screen.findByRole("button", { name: /Pesquisar/i });
  await user.click(pesquisar);

  await screen.findByText("Login Próprio X OAuth");
  //await screen.findByTestId("consultas_canceladas_ativas");
});

test("Carregar gráfico - Mobile", async () => {
  deviceDetect.isMobile = true;

  mockListaConsultasAtivasVersusCanceladas = [
    { rotulo: "Ativa", quantidade: 1 },
    { rotulo: "Cancelada", quantidade: 1 },
  ];

  mockListaLoginProprioVersusOauth = [
    { rotulo: "Proprio", quantidade: 1 },
    { rotulo: "Externo", quantidade: 1 },
  ];

  let user = userEvent.setup();

  renderWithProviders(<Estatisticas />);

  const dataInicio = await screen.findByLabelText("dataInicio");
  fireEvent.change(dataInicio, { target: { value: "01/01/2022" } });

  const dataFim = await screen.findByLabelText("dataFim");
  fireEvent.change(dataFim, { target: { value: "01/01/2022" } });

  const pesquisar = await screen.findByRole("button", { name: /Pesquisar/i });
  await user.click(pesquisar);

  await screen.findByText("Login Próprio X OAuth");
  //await screen.findByTestId("consultas_canceladas_ativas");
});
