import React from "react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { renderWithProviders } from "../util/test-utils";

import ListarHorarioProfissional from "./ListarHorarioProfissional";

let mockListaProfissionalVigente = [];

export const handlers = [
  rest.get(
    "http://localhost:5000/v1/profissional/listarVigente",
    (req, res, ctx) => {
      return res(ctx.json(mockListaProfissionalVigente));
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
  mockListaProfissionalVigente = [];
});

test("Renderização componente", async () => {
  const tela = renderWithProviders(<ListarHorarioProfissional />);
  expect(tela.firstChild).toMatchSnapshot();
});
