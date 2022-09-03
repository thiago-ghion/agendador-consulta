import React from "react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { renderWithProviders } from "../util/test-utils";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { default as userEvent } from "@testing-library/user-event";
import ListarConsulta from "./ListarConsulta";

let mockListaProfissionalVigente = [];
let estadoListaConsulta = 200;
let mockListaConsulta = [];
let estadoCancelar = 200;
let mockCancelar = {};

export const handlers = [
  rest.get(
    "http://localhost:5000/v1/profissional/listarVigente",
    (req, res, ctx) => {
      return res(ctx.json(mockListaProfissionalVigente));
    }
  ),
  rest.get(
    "http://localhost:5000/v1/consulta/listarConsultaTodasProfissional",
    (req, res, ctx) => {
      return res(ctx.status(estadoListaConsulta), ctx.json(mockListaConsulta));
    }
  ),
  rest.post("http://localhost:5000/v1/consulta/cancelar", (req, res, ctx) => {
    return res(ctx.status(estadoCancelar), ctx.json(mockCancelar));
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
  mockListaProfissionalVigente = [];
  estadoListaConsulta = 200;
  mockListaConsulta = [];
  estadoCancelar = 200;
  mockCancelar = {};
});

test("Renderização componente", async () => {
  expect(renderWithProviders(<ListarConsulta />)).toMatchSnapshot();
});

test("Selecionar profissional", async () => {
  mockListaProfissionalVigente = [
    { idProfissional: 1, nomeProfissional: "Maria da Silva" },
  ];

  let user = userEvent.setup();

  renderWithProviders(<ListarConsulta />);

  const profissional = screen.getByPlaceholderText("Escolha o profissional...");

  await user.type(profissional, "Maria", { delay: 20 });
  const lista = await waitFor(() => screen.findByRole("option", /Maria/i));
  await user.click(lista);
});

test("Listar consultar", async () => {
  mockListaProfissionalVigente = [
    { idProfissional: 1, nomeProfissional: "Maria da Silva" },
  ];

  let user = userEvent.setup();

  renderWithProviders(<ListarConsulta />);

  const profissional = screen.getByPlaceholderText("Escolha o profissional...");

  await user.type(profissional, "Maria", { delay: 20 });
  const lista = await waitFor(() => screen.findByRole("option", /Maria/i));
  await user.click(lista);

  const datas = screen
    .getAllByPlaceholderText("Informe a data")
    .map((item) => item);

  fireEvent.change(datas[0], { target: { value: "02/05/2022" } });
  fireEvent.change(datas[1], { target: { value: "03/05/2022" } });

  const pesquisar = await screen.findByRole("button", { name: /Pesquisar/i });
  await userEvent.click(pesquisar);
});

test("Listar consultar - Nenhuma consulta pode ser cancelada", async () => {
  mockListaConsulta = [
    {
      nomePaciente: "Maria da Silva",
      dataConsulta: "02.05.2022",
      horario: "08:00",
      id: 1,
      indicadorPermissaoCancelar: "N",
    },
  ];
  mockListaProfissionalVigente = [
    { idProfissional: 1, nomeProfissional: "Maria da Silva" },
  ];

  let user = userEvent.setup();

  renderWithProviders(<ListarConsulta />);

  const profissional = screen.getByPlaceholderText("Escolha o profissional...");

  await user.type(profissional, "Maria", { delay: 20 });
  const lista = await waitFor(() => screen.findByRole("option", /Maria/i));
  await user.click(lista);

  const datas = screen
    .getAllByPlaceholderText("Informe a data")
    .map((item) => item);

  fireEvent.change(datas[0], { target: { value: "02/05/2022" } });
  fireEvent.change(datas[1], { target: { value: "03/05/2022" } });

  const pesquisar = await screen.findByRole("button", { name: /Pesquisar/i });
  await userEvent.click(pesquisar);

  await waitFor(() => screen.findByText("Maria da Silva"));

  await waitFor(() => {
    expect(
      screen.queryByRole("button", { name: /Cancelar/i })
    ).not.toBeInTheDocument();
  });
});

test("Listar consultar - Sem escolher o profissional", async () => {
  mockListaProfissionalVigente = [
    { idProfissional: 1, nomeProfissional: "Maria da Silva" },
  ];

  renderWithProviders(<ListarConsulta />);

  const datas = screen
    .getAllByPlaceholderText("Informe a data")
    .map((item) => item);

  fireEvent.change(datas[0], { target: { value: "02/05/2022" } });
  fireEvent.change(datas[1], { target: { value: "03/05/2022" } });

  const pesquisar = await screen.findByRole("button", { name: /Pesquisar/i });
  await userEvent.click(pesquisar);
});

test("Cancelar consultar - Sucesso", async () => {
  mockListaConsulta = [
    {
      nomePaciente: "Maria da Silva",
      dataConsulta: "02.05.2022",
      horario: "08:00",
      id: 1,
      indicadorPermissaoCancelar: "S",
    },
  ];
  mockListaProfissionalVigente = [
    { idProfissional: 1, nomeProfissional: "Maria da Silva" },
  ];

  let user = userEvent.setup();

  renderWithProviders(<ListarConsulta />);

  const profissional = screen.getByPlaceholderText("Escolha o profissional...");

  await user.type(profissional, "Maria", { delay: 20 });
  const lista = await waitFor(() => screen.findByRole("option", /Maria/i));
  await user.click(lista);

  const datas = screen
    .getAllByPlaceholderText("Informe a data")
    .map((item) => item);

  fireEvent.change(datas[0], { target: { value: "02/05/2022" } });
  fireEvent.change(datas[1], { target: { value: "03/05/2022" } });

  const pesquisar = await screen.findByRole("button", { name: /Pesquisar/i });
  await userEvent.click(pesquisar);

  await waitFor(() => screen.findByText("Maria da Silva"));

  const cancelar = await waitFor(() =>
    screen.findByRole("button", { name: /Cancelar/i })
  );
  await userEvent.click(cancelar);

  await waitFor(() => {
    expect(
      screen.queryByRole("button", { name: /Cancelar/i })
    ).not.toBeInTheDocument();
  });
});

test("Cancelar consultar - Falha", async () => {
  estadoCancelar = 400;
  mockListaConsulta = [
    {
      nomePaciente: "Maria da Silva",
      dataConsulta: "02.05.2022",
      horario: "08:00",
      id: 1,
      indicadorPermissaoCancelar: "S",
    },
  ];
  mockListaProfissionalVigente = [
    { idProfissional: 1, nomeProfissional: "Maria da Silva" },
  ];

  let user = userEvent.setup();

  renderWithProviders(<ListarConsulta />);

  const profissional = screen.getByPlaceholderText("Escolha o profissional...");

  await user.type(profissional, "Maria", { delay: 20 });
  const lista = await waitFor(() => screen.findByRole("option", /Maria/i));
  await user.click(lista);

  const datas = screen
    .getAllByPlaceholderText("Informe a data")
    .map((item) => item);

  fireEvent.change(datas[0], { target: { value: "02/05/2022" } });
  fireEvent.change(datas[1], { target: { value: "03/05/2022" } });

  const pesquisar = await screen.findByRole("button", { name: /Pesquisar/i });
  await userEvent.click(pesquisar);

  await waitFor(() => screen.findByText("Maria da Silva"));

  const cancelar = await waitFor(() =>
    screen.findByRole("button", { name: /Cancelar/i })
  );
  await userEvent.click(cancelar);

  await waitFor(() => {
    expect(
      screen.getByRole("button", { name: /Cancelar/i })
    ).toBeInTheDocument();
  });
});
