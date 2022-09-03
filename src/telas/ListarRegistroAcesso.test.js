import React from "react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { renderWithProviders } from "../util/test-utils";
import { fireEvent, screen, waitFor, within } from "@testing-library/react";

import ListarRegistroAcesso from "../telas/ListarRegistroAcesso";

let mockListaAcesso = [];

export const handlers = [
  rest.get(
    "http://localhost:5000/v1/seguranca/listaAcesso",
    (req, res, ctx) => {
      return res(ctx.json(mockListaAcesso));
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
  mockListaAcesso = [];
});

test("Lista Vazia", async () => {
  renderWithProviders(<ListarRegistroAcesso />);

  const dataInicio = screen.getByLabelText("dataInicio");
  const dataFim = screen.getByLabelText("dataFim");

  fireEvent.change(dataInicio, {
    target: { value: "02.05.2020" },
  });
  fireEvent.change(dataFim, {
    target: { value: "03.05.2020" },
  });

  fireEvent.click(screen.getByRole("button", { name: /Pesquisar/i }));

  let tabela;
  screen.queryAllByRole("table").map((item) => {
    if (item.classList.contains("react-bootstrap-table")) {
      tabela = item;
    }
  });

  const linhas = within(tabela)
    .queryAllByRole("row")
    .map((item) => item);

  expect(linhas.length).toBe(1);
});

test("Lista com conteúdo", async () => {
  mockListaAcesso = [
    {
      timestampAcesso: "2022-08-22T00:33:34.604Z",
      tipoAcesso: 3,
      textoTipoAcesso: "Colaborador",
      credencialAcesso: "admin",
    },
  ];

  renderWithProviders(<ListarRegistroAcesso />);

  const dataInicio = screen.getByLabelText("dataInicio");
  const dataFim = screen.getByLabelText("dataFim");

  fireEvent.change(dataInicio, {
    target: { value: "02.05.2020" },
  });
  fireEvent.change(dataFim, {
    target: { value: "03.05.2020" },
  });

  fireEvent.click(screen.getByRole("button", { name: /Pesquisar/i }));

  await waitFor(async () => {
    let tabela;
    const elementos = screen.queryAllByRole("table");
    elementos.map((item) => {
      if (item.classList.contains("react-bootstrap-table")) {
        tabela = item;
      }
    });

    const linhas = within(tabela)
      .queryAllByRole("row")
      .map((item) => item);

    expect(linhas).toHaveLength(2);
  });
});
