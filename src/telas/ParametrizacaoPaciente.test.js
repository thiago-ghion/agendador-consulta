import React from "react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { renderWithProviders } from "../util/test-utils";

import ParametrizacaoPaciente from "./ParametrizacaoPaciente";
import { fireEvent, screen, waitFor } from "@testing-library/react";

jest.mock("./ParametrizacaoPacienteManutencao", () => () => <></>);
jest.mock("./ParametrizacaoPacienteHistorico", () => () => <></>);

let mockListaPaciente = [];

export const handlers = [
  rest.get("http://localhost:5000/v1/paciente/listar", (req, res, ctx) => {
    return res(ctx.json(mockListaPaciente));
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
  mockListaPaciente = [];
});

test("Renderização componente", async () => {
  const tela = renderWithProviders(<ParametrizacaoPaciente />);
  expect(tela.firstChild).toMatchSnapshot();
});

test("Modo inclusão de paciente", async () => {
  renderWithProviders(<ParametrizacaoPaciente />);
  const incluir = await waitFor(() =>
    screen.findByRole("button", { name: /Incluir/i })
  );
  fireEvent.click(incluir);
});

test("Modo alteração de paciente", async () => {
  mockListaPaciente = [{ idPaciente: 1, nomePaciente: "Maria da Silva" }];

  renderWithProviders(<ParametrizacaoPaciente />);
  const alterar = await waitFor(() =>
    screen.findByRole("button", { name: /Maria da Silva/i })
  );
  fireEvent.click(alterar);
});

test("Modo histórico de consulta do paciente", async () => {
  mockListaPaciente = [{ idPaciente: 1, nomePaciente: "Maria da Silva" }];

  renderWithProviders(<ParametrizacaoPaciente />);
  const historico = await waitFor(() =>
    screen.findByRole("button", { name: /Histórico Consulta/i })
  );
  fireEvent.click(historico);
});
