import React from "react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { renderWithProviders } from "../util/test-utils";

import ParametrizacaoHorario from "./ParametrizacaoHorario";
import { fireEvent, screen, waitFor } from "@testing-library/react";

let mockListaHorario = [];
let estadoRegistrar = 201;
let mockRegistrar = {};
let estadoAtivar = 200;
let mockAtivar = {};
let estadoDesativar = 200;
let mockDesativar = {};

export const handlers = [
  rest.get("http://localhost:5000/v1/horario/listar", (req, res, ctx) => {
    return res(ctx.json(mockListaHorario));
  }),
  rest.post(
    "http://localhost:5000/v1/horario/registrar/08:00",
    (req, res, ctx) => {
      return res(ctx.status(estadoRegistrar), ctx.json(mockRegistrar));
    }
  ),
  rest.post("http://localhost:5000/v1/horario/ativar/1", (req, res, ctx) => {
    return res(ctx.status(estadoAtivar), ctx.json(mockAtivar));
  }),
  rest.post("http://localhost:5000/v1/horario/desativar/1", (req, res, ctx) => {
    return res(ctx.status(estadoDesativar), ctx.json(mockDesativar));
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
  mockListaHorario = [];
  estadoRegistrar = 201;
  mockRegistrar = {};
  estadoAtivar = 200;
  mockAtivar = {};
  estadoDesativar = 200;
  mockDesativar = {};
});

test("Renderização componente", async () => {
  expect(renderWithProviders(<ParametrizacaoHorario />)).toMatchSnapshot();
});

test("Registrar horário - Sucesso", async () => {
  renderWithProviders(<ParametrizacaoHorario />);
  const horario = await waitFor(() =>
    screen.findByPlaceholderText("Informe o horário")
  );

  fireEvent.change(horario, { target: { value: "08:00" } });

  const incluir = await waitFor(() =>
    screen.findByRole("button", { name: /Incluir/i })
  );
  fireEvent.click(incluir);
});

test("Registrar horário - Falha", async () => {
  estadoRegistrar = 400;
  renderWithProviders(<ParametrizacaoHorario />);
  const horario = await waitFor(() =>
    screen.findByPlaceholderText("Informe o horário")
  );

  fireEvent.change(horario, { target: { value: "08:00" } });

  const incluir = await waitFor(() =>
    screen.findByRole("button", { name: /Incluir/i })
  );
  fireEvent.click(incluir);
});

test("Ativar horário", async () => {
  mockListaHorario = [{ idHorario: 1, horario: "08:00", indicadorAtivo: "N" }];
  renderWithProviders(<ParametrizacaoHorario />);

  const ativar = await waitFor(() =>
    screen.findByRole("button", { name: /Ativar/i })
  );
  fireEvent.click(ativar);
});

test("Desativar horário", async () => {
  mockListaHorario = [{ idHorario: 1, horario: "08:00", indicadorAtivo: "S" }];
  renderWithProviders(<ParametrizacaoHorario />);

  const desativar = await waitFor(() =>
    screen.findByRole("button", { name: /Desativar/i })
  );
  fireEvent.click(desativar);
});
