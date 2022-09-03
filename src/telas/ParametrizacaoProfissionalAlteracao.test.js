import React from "react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { renderWithProviders } from "../util/test-utils";

import ParametrizacaoProfissionalAlteracao from "./ParametrizacaoProfissionalAlteracao";
import { fireEvent, screen, waitFor } from "@testing-library/react";

let estadoAlteracao = 200;
let mockAlteracao = {};
let estadoListaConfiguracao = 200;
let mockListaConfiguracao = [];

export const handlers = [
  rest.post(
    "http://localhost:5000/v1/profissional/alterar/1",
    (req, res, ctx) => {
      return res(ctx.status(estadoAlteracao), ctx.json(mockAlteracao));
    }
  ),
  rest.get(
    "http://localhost:5000/v1/profissional/listarConfiguracaoHorario",
    (req, res, ctx) => {
      return res(
        ctx.status(estadoListaConfiguracao),
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
  estadoAlteracao = 200;
  mockAlteracao = {};
  estadoListaConfiguracao = 200;
  mockListaConfiguracao = [];
});

test("Renderização componente", async () => {
  expect(<ParametrizacaoProfissionalAlteracao />).toMatchSnapshot();
});

test("Somente troca nome do profissional - sucesso", async () => {
  renderWithProviders(
    <ParametrizacaoProfissionalAlteracao
      idProfissional={1}
      setTelaAtiva={() => {}}
      listaHorario={[]}
    />
  );

  const nomeProfissional = await waitFor(() =>
    screen.findByPlaceholderText("Informe o nome do profissional")
  );
  fireEvent.change(nomeProfissional, { target: { value: "Novo nome" } });

  const salvar = await waitFor(() =>
    screen.findByRole("button", {
      name: /Salvar/i,
    })
  );

  fireEvent.click(salvar);
});

test("Somente troca nome do profissional - falha", async () => {
  estadoAlteracao = 400;
  mockAlteracao = { campo: 1 };

  renderWithProviders(
    <ParametrizacaoProfissionalAlteracao
      idProfissional={1}
      setTelaAtiva={() => {}}
      listaHorario={[]}
    />
  );

  const nomeProfissional = await waitFor(() =>
    screen.findByPlaceholderText("Informe o nome do profissional")
  );
  fireEvent.change(nomeProfissional, { target: { value: "Novo nome" } });

  const salvar = await waitFor(() =>
    screen.findByRole("button", {
      name: /Salvar/i,
    })
  );

  fireEvent.click(salvar);
});

test("Carregar lista de horário - lista vazia", async () => {
  mockListaConfiguracao = [
    { idHorario: 1, horario: "08:00" },
    { idHorario: 2, horario: "08:30" },
  ];
  renderWithProviders(
    <ParametrizacaoProfissionalAlteracao
      idProfissional={1}
      setTelaAtiva={() => {}}
      listaHorario={[]}
    />
  );

  const caixaData = await waitFor(() =>
    screen.findByPlaceholderText("Informe a data")
  );
  fireEvent.change(caixaData, { target: { value: "02/05/2022" } });
});

test("Carregar lista de horário - lista preenchida", async () => {
  mockListaConfiguracao = [
    { idHorario: 1, horario: "08:00" },
    { idHorario: 2, horario: "08:30" },
  ];
  renderWithProviders(
    <ParametrizacaoProfissionalAlteracao
      idProfissional={1}
      setTelaAtiva={() => {}}
      listaHorario={[
        { idHorario: 1, horario: "08:00" },
        { idHorario: 3, horario: "09:00" },
      ]}
    />
  );

  const caixaData = await waitFor(() =>
    screen.findByPlaceholderText("Informe a data")
  );
  fireEvent.change(caixaData, { target: { value: "02/05/2022" } });
});

test("Carregar lista de horário - Seleciona na lista", async () => {
  mockListaConfiguracao = [
    { idHorario: 1, horario: "08:00" },
    { idHorario: 2, horario: "08:30" },
  ];
  renderWithProviders(
    <ParametrizacaoProfissionalAlteracao
      idProfissional={1}
      setTelaAtiva={() => {}}
      listaHorario={[
        { data: "01.05.2022", idHorario: 1, horario: "08:00" },
        { data: "01.05.2022", idHorario: 3, horario: "09:00" },
      ]}
    />
  );

  const caixaData = await waitFor(() =>
    screen.findByPlaceholderText("Informe a data")
  );
  fireEvent.change(caixaData, { target: { value: "02/05/2022" } });

  const desativar = await waitFor(() =>
    screen.findByRole("button", { name: /Desativar/i })
  );
  fireEvent.click(desativar);

  const select = await waitFor(() =>
    screen.findByTestId("listaHorarioCarregado")
  );
  fireEvent.change(select, { target: { value: "01/05/2022" } });
});

test("Desativar horário - salvar", async () => {
  mockListaConfiguracao = [
    { idHorario: 1, horario: "08:00" },
    { idHorario: 2, horario: "08:30" },
  ];
  renderWithProviders(
    <ParametrizacaoProfissionalAlteracao
      idProfissional={1}
      setTelaAtiva={() => {}}
      listaHorario={[
        { data: "01.05.2022", idHorario: 1, horario: "08:00" },
        { data: "01.05.2022", idHorario: 3, horario: "09:00" },
      ]}
    />
  );

  const caixaData = await waitFor(() =>
    screen.findByPlaceholderText("Informe a data")
  );
  fireEvent.change(caixaData, { target: { value: "02/05/2022" } });

  const desativar = await waitFor(() =>
    screen.findByRole("button", { name: /Desativar/i })
  );
  fireEvent.click(desativar);

  const salvar = await waitFor(() =>
    screen.findByRole("button", { name: /Salvar/i })
  );
  fireEvent.click(salvar);
});

test("Desativar horário - cancelar", async () => {
  mockListaConfiguracao = [
    { idHorario: 1, horario: "08:00" },
    { idHorario: 2, horario: "08:30" },
  ];
  renderWithProviders(
    <ParametrizacaoProfissionalAlteracao
      idProfissional={1}
      setTelaAtiva={() => {}}
      listaHorario={[
        { data: "01.05.2022", idHorario: 1, horario: "08:00" },
        { data: "01.05.2022", idHorario: 3, horario: "09:00" },
      ]}
    />
  );

  const caixaData = await waitFor(() =>
    screen.findByPlaceholderText("Informe a data")
  );
  fireEvent.change(caixaData, { target: { value: "02/05/2022" } });

  const desativar = await waitFor(() =>
    screen.findByRole("button", { name: /Desativar/i })
  );
  fireEvent.click(desativar);

  const cancelar = await waitFor(() =>
    screen.findByRole("button", { name: /Cancelar/i })
  );
  fireEvent.click(cancelar);
});
