import React from "react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { renderWithProviders } from "../util/test-utils";

import ParametrizacaoProfissional from "./ParametrizacaoProfissional";

let mockListaPaciente = [];

export const handlers = [
  rest.get("http://localhost:5000/v1/horario/listar", (req, res, ctx) => {
    return res(ctx.json(mockListaPaciente));
  }),
  rest.get(
    "http://localhost:5000/v1/profissional/listarTodos",
    (req, res, ctx) => {
      return res(ctx.json(mockListaPaciente));
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
  mockListaPaciente = [];
});

test("Renderização componente", async () => {
  const tela = renderWithProviders(<ParametrizacaoProfissional />);
  expect(tela.firstChild).toMatchSnapshot();
});