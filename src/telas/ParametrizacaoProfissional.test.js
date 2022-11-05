import React from "react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { renderWithProviders } from "../util/test-utils";

import ParametrizacaoProfissional from "./ParametrizacaoProfissional";
import { fireEvent, screen, waitFor } from "@testing-library/react";

jest.mock("./ParametrizacaoProfissionalInclusao", () => () => <></>);
jest.mock("./ListarHorarioProfissional", () => () => <></>);
jest.mock("./ParametrizacaoProfissionalAlteracao", () => () => <></>);

let estadoListaHorario = 200;
let mockListaHorario = [];

let estadoListaProfissional = 200;
let mockListaProfissional = [];

let estadoDesativar = 200;
let mockDesativar = {};

let estadoAtivar = 200;
let mockAtivar = {};

export const handlers = [
  rest.get("http://localhost:5000/v1/horario/listar", (req, res, ctx) => {
    return res(ctx.status(estadoListaHorario), ctx.json(mockListaHorario));
  }),
  rest.get(
    "http://localhost:5000/v1/profissional/listarTodos",
    (req, res, ctx) => {
      return res(
        ctx.status(estadoListaProfissional),
        ctx.json(mockListaProfissional)
      );
    }
  ),
  rest.post(
    "http://localhost:5000/v1/profissional/desativar/1",
    (req, res, ctx) => {
      return res(ctx.status(estadoDesativar), ctx.json(mockDesativar));
    }
  ),
  rest.post(
    "http://localhost:5000/v1/profissional/ativar/1",
    (req, res, ctx) => {
      return res(ctx.status(estadoAtivar), ctx.json(mockAtivar));
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
  estadoListaHorario = 200;
  mockListaHorario = [];

  estadoListaProfissional = 200;
  mockListaProfissional = [];

  estadoDesativar = 200;
  mockDesativar = {};

  estadoAtivar = 200;
  mockAtivar = {};
});

test("Renderização componente", async () => {
  expect(
    renderWithProviders(<ParametrizacaoProfissional />)
  ).toMatchSnapshot();
});

test("Entrou em modo de inclusão", async () => {
  renderWithProviders(<ParametrizacaoProfissional />);
  const incluir = await waitFor(() =>
    screen.findByRole("button", { name: /Incluir profissional/i })
  );
  fireEvent.click(incluir);
});

test("Entrou em modo de alteração", async () => {
  mockListaHorario = [
    { idHorario: 1, horario: "08:00", indicadorAtivo: "S" },
    { idHorario: 2, horario: "08:30", indicadorAtivo: "S" },
    { idHorario: 3, horario: "09:00", indicadorAtivo: "N" },
  ];
  mockListaProfissional = [
    {
      idProfissional: 1,
      nomeProfissional: "Maria da Silva",
      indicadorAtivo: "S",
    },
  ];

  renderWithProviders(<ParametrizacaoProfissional />);

  const alterar = await waitFor(() =>
    screen.findByRole("button", { name: /Maria da Silva/i })
  );

  fireEvent.click(alterar);
});

test("Entrou em modo de listar horário", async () => {
  mockListaHorario = [
    { idHorario: 1, horario: "08:00", indicadorAtivo: "S" },
    { idHorario: 2, horario: "08:30", indicadorAtivo: "S" },
    { idHorario: 3, horario: "09:00", indicadorAtivo: "N" },
  ];
  mockListaProfissional = [
    {
      idProfissional: 1,
      nomeProfissional: "Maria da Silva",
      indicadorAtivo: "S",
    },
  ];

  renderWithProviders(<ParametrizacaoProfissional />);

  const listar = await waitFor(() =>
    screen.findByRole("button", { name: /Listar Horário/i })
  );

  fireEvent.click(listar);
});

test("Desativar profissional", async () => {
  mockDesativar = {
    idProfissional: 1,
    nomeProfissional: "Maria da Silva",
    indicadorAtivo: "S",
  };
  mockListaHorario = [
    { idHorario: 1, horario: "08:00", indicadorAtivo: "S" },
    { idHorario: 2, horario: "08:30", indicadorAtivo: "S" },
    { idHorario: 3, horario: "09:00", indicadorAtivo: "N" },
  ];
  mockListaProfissional = [
    {
      idProfissional: 1,
      nomeProfissional: "Maria da Silva",
      indicadorAtivo: "S",
    },
  ];

  renderWithProviders(<ParametrizacaoProfissional />);

  const desativar = await waitFor(() =>
    screen.findByRole("button", { name: /Desativar/i })
  );

  fireEvent.click(desativar);
});

test("Lista de horário carregada", async () => {
  mockListaHorario = [
    { idHorario: 1, horario: "08:00", indicadorAtivo: "S" },
    { idHorario: 2, horario: "08:30", indicadorAtivo: "S" },
    { idHorario: 3, horario: "09:00", indicadorAtivo: "N" },
  ];
  mockListaProfissional = [
    {
      idProfissional: 1,
      nomeProfissional: "Maria da Silva",
      indicadorAtivo: "N",
    },
  ];

  renderWithProviders(<ParametrizacaoProfissional />, {
    preloadedState: {
      horario: {
        lista: [
          { idHorario: 1, horario: "08:00", indicadorAtivo: "S" },
          { idHorario: 2, horario: "08:30", indicadorAtivo: "S" },
          { idHorario: 3, horario: "09:00", indicadorAtivo: "N" },
        ],
      },
    },
  });
});
