import React from "react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { renderWithProviders } from "../util/test-utils";

import ParametrizacaoProfissionalInclusao from "./ParametrizacaoProfissionalInclusao";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { default as userEvent } from "@testing-library/user-event";

let estadoAlteracao = 200;
let mockAlteracao = {};
let estadoListaConfiguracao = 200;
let mockListaConfiguracao = [];
let estadoRegistrar = 200;
let mockRegistrar = {};

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
  rest.post(
    "http://localhost:5000/v1/profissional/registrar",
    (req, res, ctx) => {
      return res(ctx.status(estadoRegistrar), ctx.json(mockRegistrar));
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
  estadoRegistrar = 200;
  mockRegistrar = {};
});

test("Renderização componente", async () => {
  expect(<ParametrizacaoProfissionalInclusao />).toMatchSnapshot();
});

test("Informar nome do profissional", async () => {
  let user = userEvent.setup();
  mockListaConfiguracao = [
    { idHorario: 1, horario: "08:00" },
    { idHorario: 2, horario: "08:30" },
  ];

  renderWithProviders(
    <ParametrizacaoProfissionalInclusao
      setTelaAtiva={() => {}}
      listaHorario={[]}
    />
  );
  const profissional = await waitFor(() =>
    screen.findByPlaceholderText("Informe o nome do profissional")
  );

  await user.type(profissional, "Maria da Silva");
});

test("Informar a data", async () => {
  renderWithProviders(
    <ParametrizacaoProfissionalInclusao
      setTelaAtiva={() => {}}
      listaHorario={[{ data: "02.05.2022", isHorario: 1, horario: "08:00" }]}
    />
  );
  const data = await waitFor(() =>
    screen.findByPlaceholderText("Informe a data")
  );

  fireEvent.change(data, { target: { value: "02.05.2022" } });

  await waitFor(() => screen.findByText("08:00"));
});

test("Selecionar uma data já carregada", async () => {
  let user = userEvent.setup();

  renderWithProviders(
    <ParametrizacaoProfissionalInclusao
      setTelaAtiva={() => {}}
      listaHorario={[{ data: "02.05.2022", isHorario: 1, horario: "08:00" }]}
    />
  );

  const data = await waitFor(() =>
    screen.findByPlaceholderText("Informe a data")
  );

  fireEvent.change(data, { target: { value: "02.05.2022" } });

  await waitFor(() => screen.findByText("08:00"));

  const ativar = await waitFor(() => screen.findByText("Ativar"));

  await user.click(ativar);

  const lista = await waitFor(() => screen.findByRole("combobox"));

  await user.selectOptions(lista, "02/05/2022");
});

test("Ativar horário", async () => {
  let user = userEvent.setup();

  renderWithProviders(
    <ParametrizacaoProfissionalInclusao
      setTelaAtiva={() => {}}
      listaHorario={[{ data: "02.05.2022", isHorario: 1, horario: "08:00" }]}
    />
  );

  const data = await waitFor(() =>
    screen.findByPlaceholderText("Informe a data")
  );

  fireEvent.change(data, { target: { value: "02.05.2022" } });

  await waitFor(() => screen.findByText("08:00"));

  const ativar = await waitFor(() => screen.findByText("Ativar"));

  await user.click(ativar);

  await waitFor(() => {
    expect(screen.getByText("Desativar")).toBeInTheDocument();
  });
});

test("Desativar horário", async () => {
  let user = userEvent.setup();

  renderWithProviders(
    <ParametrizacaoProfissionalInclusao
      setTelaAtiva={() => {}}
      listaHorario={[{ data: "02.05.2022", isHorario: 1, horario: "08:00" }]}
    />
  );

  const data = await waitFor(() =>
    screen.findByPlaceholderText("Informe a data")
  );

  fireEvent.change(data, { target: { value: "02.05.2022" } });

  await waitFor(() => screen.findByText("08:00"));

  const ativar = await waitFor(() => screen.findByText("Ativar"));

  await user.click(ativar);

  const desativar = await waitFor(() => screen.findByText("Desativar"));

  await user.click(desativar);

  await waitFor(() => {
    expect(screen.getByText("Ativar")).toBeInTheDocument();
  });
});

test("Cancelar inclusão", async () => {
  let user = userEvent.setup();
  const funcao = jest.fn();

  renderWithProviders(
    <ParametrizacaoProfissionalInclusao
      setTelaAtiva={funcao}
      listaHorario={[{ data: "02.05.2022", isHorario: 1, horario: "08:00" }]}
    />
  );

  const cancelar = await waitFor(() =>
    screen.findByRole("button", { name: /Cancelar/i })
  );
  await user.click(cancelar);

  expect(funcao).toHaveBeenCalled();
});

test("Ativar horário - salvar", async () => {
  let user = userEvent.setup();

  renderWithProviders(
    <ParametrizacaoProfissionalInclusao
      setTelaAtiva={() => {}}
      listaHorario={[{ data: "02.05.2022", isHorario: 1, horario: "08:00" }]}
    />
  );

  const profissional = await waitFor(() =>
    screen.findByPlaceholderText("Informe o nome do profissional")
  );

  await user.type(profissional, "Maria da Silva");
  const data = await waitFor(() =>
    screen.findByPlaceholderText("Informe a data")
  );

  fireEvent.change(data, { target: { value: "02.05.2022" } });

  await waitFor(() => screen.findByText("08:00"));

  const ativar = await waitFor(() => screen.findByText("Ativar"));

  await user.click(ativar);

  await waitFor(() => {
    expect(screen.getByText("Desativar")).toBeInTheDocument();
  });

  const salvar = await waitFor(() => screen.findByText("Salvar"));

  await user.click(salvar);
});

test("Ativar horário - salvar - falha", async () => {
  let user = userEvent.setup();
  estadoRegistrar = 400;

  renderWithProviders(
    <ParametrizacaoProfissionalInclusao
      setTelaAtiva={() => {}}
      listaHorario={[{ data: "02.05.2022", isHorario: 1, horario: "08:00" }]}
    />
  );

  const profissional = await waitFor(() =>
    screen.findByPlaceholderText("Informe o nome do profissional")
  );

  await user.type(profissional, "Maria da Silva");
  const data = await waitFor(() =>
    screen.findByPlaceholderText("Informe a data")
  );

  fireEvent.change(data, { target: { value: "02.05.2022" } });

  await waitFor(() => screen.findByText("08:00"));

  const ativar = await waitFor(() => screen.findByText("Ativar"));

  await user.click(ativar);

  await waitFor(() => {
    expect(screen.getByText("Desativar")).toBeInTheDocument();
  });

  const salvar = await waitFor(() => screen.findByText("Salvar"));

  await user.click(salvar);
});

test("Ativar horário - salvar - Faltou preencher nome do profissional", async () => {
  let user = userEvent.setup();
  estadoRegistrar = 400;
  mockRegistrar = { campo: 1 };

  renderWithProviders(
    <ParametrizacaoProfissionalInclusao
      setTelaAtiva={() => {}}
      listaHorario={[{ data: "02.05.2022", isHorario: 1, horario: "08:00" }]}
    />
  );

  const data = await waitFor(() =>
    screen.findByPlaceholderText("Informe a data")
  );

  fireEvent.change(data, { target: { value: "02.05.2022" } });

  await waitFor(() => screen.findByText("08:00"));

  const ativar = await waitFor(() => screen.findByText("Ativar"));

  await user.click(ativar);

  await waitFor(() => {
    expect(screen.getByText("Desativar")).toBeInTheDocument();
  });

  const salvar = await waitFor(() => screen.findByText("Salvar"));

  await user.click(salvar);
});

test("Ordernar lista de datas", async () => {
  let user = userEvent.setup();
  estadoRegistrar = 400;
  mockRegistrar = { campo: 1 };

  renderWithProviders(
    <ParametrizacaoProfissionalInclusao
      setTelaAtiva={() => {}}
      listaHorario={[{ data: "02.05.2022", isHorario: 1, horario: "08:00" }]}
    />
  );

  const data = await waitFor(() =>
    screen.findByPlaceholderText("Informe a data")
  );

  fireEvent.change(data, { target: { value: "02.05.2022" } });

  await waitFor(() => screen.findByText("08:00"));

  let ativar = await waitFor(() => screen.findByText("Ativar"));

  await user.click(ativar);

  await waitFor(() => {
    expect(screen.getByText("Desativar")).toBeInTheDocument();
  });

  fireEvent.change(data, { target: { value: "01.05.2022" } });
  await waitFor(() => screen.findByText("08:00"));
  ativar = await waitFor(() => screen.findByText("Ativar"));

  await user.click(ativar);
});
