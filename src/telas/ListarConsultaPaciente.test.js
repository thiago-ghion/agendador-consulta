import React from "react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { renderWithProviders } from "../util/test-utils";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { default as userEvent } from "@testing-library/user-event";
import ListarConsultaPaciente from "./ListarConsultaPaciente";
import * as deviceDetect from "react-device-detect";

let mockListaConsultaTodasPaciente = [];
let mockCancelar = {};
let estadoCancelar = 200;

export const handlers = [
  rest.get(
    "http://localhost:5000/v1/consulta/listarConsultaTodasPaciente",
    (req, res, ctx) => {
      return res(ctx.json(mockListaConsultaTodasPaciente));
    }
  ),
  rest.post("http://localhost:5000/v1/consulta/cancelar", (req, res, ctx) => {
    return res(ctx.status(estadoCancelar).json(mockCancelar));
  }),
];

const server = setupServer(...handlers);

// Enable API mocking before tests.
beforeAll(() => server.listen());

// Reset any runtime request handlers we may add during the tests.
afterEach(() => server.resetHandlers());

// Disable API mocking after the tests are done.
afterAll(() => server.close());

beforeEach(() => {
  mockListaConsultaTodasPaciente = [];
  mockCancelar = {};
  estadoCancelar = 200;
});

test("Renderização componente", async () => {
  expect(renderWithProviders(<ListarConsultaPaciente />)).toMatchSnapshot();
});

test("Pesquisar consultas", async () => {
  let user = userEvent.setup();
  deviceDetect.isMobile = false;

  mockListaConsultaTodasPaciente = [
    { dataConsulta: "02.02.2022", indicadorPermissaoCancelar: "S" },
    { dataConsulta: "02.02.2022", indicadorPermissaoCancelar: "N" },
  ];

  renderWithProviders(<ListarConsultaPaciente setTelaAtiva={() => {}} />);

  const dataInicio = await screen.findByLabelText("dataInicio");
  fireEvent.change(dataInicio, { target: { value: "02/05/2022" } });

  const dataFim = await screen.findByLabelText("dataFim");
  fireEvent.change(dataFim, { target: { value: "12/05/2022" } });

  const pesquisar = await screen.findByRole("button", { name: /Pesquisar/i });
  await user.click(pesquisar);
});

test("Cancelar consulta", async () => {
  let user = userEvent.setup();
  deviceDetect.isMobile = false;

  mockListaConsultaTodasPaciente = [
    { dataConsulta: "02.02.2022", indicadorPermissaoCancelar: "S" },
    { dataConsulta: "02.02.2022", indicadorPermissaoCancelar: "N" },
  ];

  renderWithProviders(<ListarConsultaPaciente setTelaAtiva={() => {}} />);

  const dataInicio = await screen.findByLabelText("dataInicio");
  fireEvent.change(dataInicio, { target: { value: "02/05/2022" } });

  const dataFim = await screen.findByLabelText("dataFim");
  fireEvent.change(dataFim, { target: { value: "12/05/2022" } });

  const pesquisar = await screen.findByRole("button", { name: /Pesquisar/i });
  await user.click(pesquisar);

  const cancelar = await screen.findByTestId("cancelar");
  await user.click(cancelar);
});

test("Cancelar consulta - Erro", async () => {
  let user = userEvent.setup();
  deviceDetect.isMobile = false;

  mockListaConsultaTodasPaciente = [
    { dataConsulta: "02.02.2022", indicadorPermissaoCancelar: "S" },
    { dataConsulta: "02.02.2022", indicadorPermissaoCancelar: "N" },
  ];

  renderWithProviders(<ListarConsultaPaciente setTelaAtiva={() => {}} />);

  const dataInicio = await screen.findByLabelText("dataInicio");
  fireEvent.change(dataInicio, { target: { value: "02/05/2022" } });

  const dataFim = await screen.findByLabelText("dataFim");
  fireEvent.change(dataFim, { target: { value: "12/05/2022" } });

  const pesquisar = await screen.findByRole("button", { name: /Pesquisar/i });
  await user.click(pesquisar);

  estadoCancelar = 400;
  const cancelar = await screen.findByTestId("cancelar");
  await user.click(cancelar);
});

test("Pesquisar consultas - mobile", async () => {
  let user = userEvent.setup();
  deviceDetect.isMobile = true;

  mockListaConsultaTodasPaciente = [
    { dataConsulta: "02.02.2022", indicadorPermissaoCancelar: "S" },
    { dataConsulta: "02.02.2022", indicadorPermissaoCancelar: "N" },
  ];

  renderWithProviders(<ListarConsultaPaciente setTelaAtiva={() => {}} />);

  const dataInicio = await screen.findByLabelText("dataInicio");
  fireEvent.change(dataInicio, { target: { value: "02/05/2022" } });

  const dataFim = await screen.findByLabelText("dataFim");
  fireEvent.change(dataFim, { target: { value: "12/05/2022" } });

  const pesquisar = await screen.findByRole("button", { name: /Pesquisar/i });
  await user.click(pesquisar);
});

test("Cancelar consulta - Mobile", async () => {
    let user = userEvent.setup();
    deviceDetect.isMobile = true;
  
    mockListaConsultaTodasPaciente = [
      { dataConsulta: "02.02.2022", indicadorPermissaoCancelar: "S" },
      { dataConsulta: "02.02.2022", indicadorPermissaoCancelar: "N" },
    ];
  
    renderWithProviders(<ListarConsultaPaciente setTelaAtiva={() => {}} />);
  
    const dataInicio = await screen.findByLabelText("dataInicio");
    fireEvent.change(dataInicio, { target: { value: "02/05/2022" } });
  
    const dataFim = await screen.findByLabelText("dataFim");
    fireEvent.change(dataFim, { target: { value: "12/05/2022" } });
  
    const pesquisar = await screen.findByRole("button", { name: /Pesquisar/i });
    await user.click(pesquisar);
  
    const cancelar = await screen.findByTestId("cancelar");
    await user.click(cancelar);
  });
  