import React from "react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { renderWithProviders } from "../util/test-utils";

import ParametrizacaoPacienteHistorico from "./ParametrizacaoPacienteHistorico";
import { fireEvent, screen, waitFor } from "@testing-library/react";

export const handlers = [];

const server = setupServer(...handlers);

// Enable API mocking before tests.
beforeAll(() => server.listen());

// Reset any runtime request handlers we may add during the tests.
afterEach(() => server.resetHandlers());

// Disable API mocking after the tests are done.
afterAll(() => server.close());

beforeEach(() => {});

test("Renderização componente", async () => {
  expect(
    renderWithProviders(<ParametrizacaoPacienteHistorico />)
  ).toMatchSnapshot();
});

test("Botão voltar", async () => {
  renderWithProviders(
    <ParametrizacaoPacienteHistorico setTelaAtiva={() => {}} />
  );
  const voltar = await waitFor(() =>
    screen.findByRole("button", { name: /Voltar/ })
  );
  fireEvent.click(voltar);
});
