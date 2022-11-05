import React from "react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { renderWithProviders } from "../util/test-utils";

import ParametrizacaoPacienteHistorico from "./ParametrizacaoPacienteHistorico";
import { fireEvent, screen } from "@testing-library/react";
import { default as userEvent } from "@testing-library/user-event";
import * as deviceDetect from "react-device-detect";

let mockListaConsultaTodasPaciente = [];

const handlers = [
  rest.get(
    "http://localhost:5000/v1/consulta/listarConsultaTodasPaciente",
    (req, res, ctx) => {
      return res(ctx.json(mockListaConsultaTodasPaciente));
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

beforeEach(() => {
  mockListaConsultaTodasPaciente = [];
});

test("Renderização componente", async () => {
  expect(
    renderWithProviders(<ParametrizacaoPacienteHistorico />)
  ).toMatchSnapshot();
});

test("Botão voltar", async () => {
  renderWithProviders(
    <ParametrizacaoPacienteHistorico setTelaAtiva={() => {}} />
  );
  const voltar = await screen.findByRole("button", { name: /Voltar/ });

  fireEvent.click(voltar);
});

test("Pesquisar histórico", async () => {
  let user = userEvent.setup();
  deviceDetect.isMobile = false;

  mockListaConsultaTodasPaciente = [
    {
      dataConsulta: "01.01.2022",
      indicadorPermissaoCancelar: "S",
    },
    {
      dataConsulta: "01.01.2022",
      indicadorPermissaoCancelar: "N",
    },
  ];

  renderWithProviders(
    <ParametrizacaoPacienteHistorico setTelaAtiva={() => {}} />
  );

  const dataInicio = await screen.findByLabelText("dataInicio");
  fireEvent.change(dataInicio, { target: { value: "02/05/2022" } });

  const dataFim = await screen.findByLabelText("dataFim");
  fireEvent.change(dataFim, { target: { value: "12/05/2022" } });

  const pesquisar = await screen.findByRole("button", { name: /Pesquisar/i });
  await user.click(pesquisar);
});

test("Pesquisar histórico - mobile", async () => {
  let user = userEvent.setup();

  deviceDetect.isMobile = true;

  mockListaConsultaTodasPaciente = [
    {
      dataConsulta: "01.01.2022",
      indicadorPermissaoCancelar: "S",
    },
    {
      dataConsulta: "01.01.2022",
      indicadorPermissaoCancelar: "N",
    },
  ];

  renderWithProviders(
    <ParametrizacaoPacienteHistorico setTelaAtiva={() => {}} />
  );

  const dataInicio = await screen.findByLabelText("dataInicio");
  fireEvent.change(dataInicio, { target: { value: "02/05/2022" } });

  const dataFim = await screen.findByLabelText("dataFim");
  fireEvent.change(dataFim, { target: { value: "12/05/2022" } });

  const pesquisar = await screen.findByRole("button", { name: /Pesquisar/i });
  await user.click(pesquisar);
});
