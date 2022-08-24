import React from "react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { renderWithProviders } from "../util/test-utils";

import ListarHorarioProfissional from "./ListarHorarioProfissional";
import { fireEvent, screen, waitFor } from "@testing-library/react";

//Polyfill para o replaceAll
if (!String.prototype.replaceAll) {
  String.prototype.replaceAll = function (str, newStr) {
    // If a regex pattern
    if (
      Object.prototype.toString.call(str).toLowerCase() === "[object regexp]"
    ) {
      return this.replace(str, newStr);
    }

    // If a string
    return this.replace(new RegExp(str, "g"), newStr);
  };
}

let estadoConfiguracao = 200;
let mockListaConfiguracao = [];

export const handlers = [
  rest.get(
    "http://localhost:5000/v1/profissional/listarConfiguracaoHorarioPeriodo",
    (req, res, ctx) => {
      return res(
        ctx.status(estadoConfiguracao),
        ctx.json(mockListaConfiguracao)
      );
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
  estadoConfiguracao = 200;
  mockListaConfiguracao = [];
});

test("Renderização componente", async () => {
  const tela = renderWithProviders(<ListarHorarioProfissional />);
  expect(tela.firstChild).toMatchSnapshot();
});

test("Listar horários no período - Sucesso", async () => {
  estadoConfiguracao = 200;
  mockListaConfiguracao = [
    { dataVinculo: "02.05.2022", horario: "08:00" },
    { dataVinculo: "02.05.2022", horario: "08:30" },
  ];

  renderWithProviders(<ListarHorarioProfissional />);

  const dataInicio = await waitFor(() =>
    screen.findByPlaceholderText("Data início pesquisa")
  );
  const dataFim = await waitFor(() =>
    screen.findByPlaceholderText("Data fim pesquisa")
  );
  const pesquisar = await waitFor(() =>
    screen.findByRole("button", { name: /Pesquisar/i })
  );

  fireEvent.change(dataInicio, { target: { value: "02.05.2022" } });
  fireEvent.change(dataFim, { target: { value: "02.05.2022" } });

  fireEvent.click(pesquisar);

  await waitFor(() => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 900);
    });
  });

  await waitFor(() => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 900);
    });
  });

  await waitFor(() => screen.findByRole("row", { name: /08:00 08:30/i }));
});

test("Listar horários no período - Falha", async () => {
  estadoConfiguracao = 400;

  renderWithProviders(<ListarHorarioProfissional />);

  const dataInicio = await waitFor(() =>
    screen.findByPlaceholderText("Data início pesquisa")
  );
  const dataFim = await waitFor(() =>
    screen.findByPlaceholderText("Data fim pesquisa")
  );
  const pesquisar = await waitFor(() =>
    screen.findByRole("button", { name: /Pesquisar/i })
  );

  fireEvent.change(dataInicio, { target: { value: "02.05.2022" } });
  fireEvent.change(dataFim, { target: { value: "02.05.2022" } });

  fireEvent.click(pesquisar);
});

test("Listar horários no período - Falha - Inicio não preenchido", async () => {
  renderWithProviders(<ListarHorarioProfissional />);

  const dataFim = await waitFor(() =>
    screen.findByPlaceholderText("Data fim pesquisa")
  );
  const pesquisar = await waitFor(() =>
    screen.findByRole("button", { name: /Pesquisar/i })
  );

  fireEvent.change(dataFim, { target: { value: "02.05.2022" } });

  fireEvent.click(pesquisar);
});

test("Listar horários no período - Falha - Fim não preenchido", async () => {
  renderWithProviders(<ListarHorarioProfissional />);

  const dataInicio = await waitFor(() =>
    screen.findByPlaceholderText("Data início pesquisa")
  );

  const pesquisar = await waitFor(() =>
    screen.findByRole("button", { name: /Pesquisar/i })
  );

  fireEvent.change(dataInicio, { target: { value: "02.05.2022" } });

  fireEvent.click(pesquisar);
});

test("Voltar para a tela anterior", async () => {
  renderWithProviders(<ListarHorarioProfissional setTelaAtiva={() => {}} />);

  const voltar = await waitFor(() =>
    screen.findByRole("button", { name: /Voltar/i })
  );

  fireEvent.click(voltar);
});
