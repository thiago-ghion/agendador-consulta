import React from "react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { renderWithProviders } from "../util/test-utils";

import AgendarConsulta from "./AgendarConsulta";
import { fireEvent, screen, waitFor, within } from "@testing-library/react";
import { default as userEvent } from "@testing-library/user-event";
import moment from "moment";

let mockListaProfissionalVigente = [];

let estadoListaDataDisponivel = 200;
let mockListaDataDisponivel = [];

let estadoListaHoraDisponivel = 200;
let mockListaHoraDisponivel = [];

let estadoListaParcial = 200;
let mockListaParcial = [];

let estadoAgendar = 200;
let mockAgendar = {};

export const handlers = [
  rest.get(
    "http://localhost:5000/v1/profissional/listarVigente",
    (req, res, ctx) => {
      return res(ctx.json(mockListaProfissionalVigente));
    }
  ),
  rest.get(
    "http://localhost:5000/v1/profissional/listarDataDisponivel",
    (req, res, ctx) => {
      return res(
        ctx.status(estadoListaDataDisponivel),
        ctx.json(mockListaDataDisponivel)
      );
    }
  ),
  rest.get(
    "http://localhost:5000/v1/profissional/listarHorarioDisponivel",
    (req, res, ctx) => {
      return res(
        ctx.status(estadoListaHoraDisponivel),
        ctx.json(mockListaHoraDisponivel)
      );
    }
  ),
  rest.get(
    "http://localhost:5000/v1/paciente/listarParcial",
    (req, res, ctx) => {
      return res(ctx.status(estadoListaParcial), ctx.json(mockListaParcial));
    }
  ),
  rest.post("http://localhost:5000/v1/consulta/agendar", (req, res, ctx) => {
    return res(ctx.status(estadoAgendar), ctx.json(mockAgendar));
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
  estadoListaDataDisponivel = 200;
  mockListaDataDisponivel = [];
  estadoListaHoraDisponivel = 200;
  mockListaHoraDisponivel = [];
  estadoListaParcial = 200;
  mockListaParcial = [];
  estadoAgendar = 200;
  mockAgendar = {};
});

test("Renderização componente", async () => {
  expect(renderWithProviders(<AgendarConsulta />)).toMatchSnapshot();
});

test("Selecionar paciente", async () => {
  mockListaParcial = [{ idPaciente: 1, nomePaciente: "Jean Baumer" }];
  let user = userEvent.setup();
  renderWithProviders(<AgendarConsulta />);

  const paciente = screen.getByPlaceholderText("Escolha o paciente...");

  await user.type(paciente, "Jean");

  await waitFor(() => new Promise((r) => setTimeout(r, 950)));

  const lista = await waitFor(() => screen.findByRole("option", /Jean/i));
  await user.click(lista);
});

test("Selecionar profissional - sem falha", async () => {
  mockListaProfissionalVigente = [
    { idProfissional: 1, nomeProfissional: "Maria da Silva" },
  ];
  let user = userEvent.setup();
  renderWithProviders(<AgendarConsulta />);

  const profissional = screen.getByPlaceholderText("Escolha o profissional...");

  await user.type(profissional, "Maria", { delay: 20 });
  await user.click(screen.getByRole("option", /Maria/i));
});

test("Selecionar profissional - com falha", async () => {
  estadoListaDataDisponivel = 400;
  mockListaProfissionalVigente = [
    { idProfissional: 1, nomeProfissional: "Maria da Silva" },
  ];
  let user = userEvent.setup();
  renderWithProviders(<AgendarConsulta />);

  const profissional = screen.getByPlaceholderText("Escolha o profissional...");

  await user.type(profissional, "Maria", { delay: 20 });
  await user.click(screen.getByRole("option", /Maria/i));
});

test("Selecionar data na grade de horário", async () => {
  mockListaProfissionalVigente = [
    { idProfissional: 1, nomeProfissional: "Maria da Silva" },
  ];
  mockListaDataDisponivel = [
    { data: moment().format("DD.MM.YYYY") },
    { data: moment().add(1, "day").format("DD.MM.YYYY") },
  ];
  mockListaHoraDisponivel = [{ horario: "08:00" }, { horario: "08:30" }];
  let user = userEvent.setup();
  renderWithProviders(<AgendarConsulta />);

  const profissional = screen.getByPlaceholderText("Escolha o profissional...");

  await user.type(profissional, "Maria", { delay: 20 });
  await user.click(screen.getByRole("option", /Maria/i));
  const blocoData = await waitFor(() => screen.findByTestId("blocoData"));

  const celulas = await waitFor(() =>
    within(blocoData).findAllByText(moment().get("date"))
  );

  let celula;

  celulas.forEach((item) => {
    if (
      item.getAttribute("data-value") == moment().get("date") &&
      item.getAttribute("data-month") == moment().get("month") &&
      item.getAttribute("data-year") == moment().get("year")
    )
      celula = item;
  });

  expect(celula).not.toBeNull();
  await user.click(celula);

  await waitFor(() => screen.findByText("08:00"));
});

test("Carregamento da grade de horário com falha", async () => {
  mockListaProfissionalVigente = [
    { idProfissional: 1, nomeProfissional: "Maria da Silva" },
  ];
  mockListaDataDisponivel = [
    { data: moment().format("DD.MM.YYYY") },
    { data: moment().add(1, "day").format("DD.MM.YYYY") },
  ];
  estadoListaHoraDisponivel = 400;
  let user = userEvent.setup();
  renderWithProviders(<AgendarConsulta />);

  const profissional = screen.getByPlaceholderText("Escolha o profissional...");

  await user.type(profissional, "Maria", { delay: 20 });
  await user.click(screen.getByRole("option", /Maria/i));
  const blocoData = await waitFor(() => screen.findByTestId("blocoData"));

  const celulas = await waitFor(() =>
    within(blocoData).findAllByText(moment().get("date"))
  );

  let celula;

  celulas.forEach((item) => {
    if (
      item.getAttribute("data-value") == moment().get("date") &&
      item.getAttribute("data-month") == moment().get("month") &&
      item.getAttribute("data-year") == moment().get("year")
    )
      celula = item;
  });

  expect(celula).not.toBeNull();
  await user.click(celula);

  await waitFor(() => {
    expect(screen.queryByText("08:00")).not.toBeInTheDocument();
  });
});

test("Agendar consulta - sucesso", async () => {
  mockListaParcial = [{ idPaciente: 1, nomePaciente: "Jean Baumer" }];
  mockListaProfissionalVigente = [
    { idProfissional: 1, nomeProfissional: "Maria da Silva" },
  ];
  mockListaDataDisponivel = [
    { data: moment().format("DD.MM.YYYY") },
    { data: moment().add(1, "day").format("DD.MM.YYYY") },
  ];
  mockListaHoraDisponivel = [{ horario: "08:00" }];

  let user = userEvent.setup();
  renderWithProviders(<AgendarConsulta />);

  const paciente = screen.getByPlaceholderText("Escolha o paciente...");

  await user.type(paciente, "Jean");

  await waitFor(() => new Promise((r) => setTimeout(r, 950)));

  const lista = await waitFor(() => screen.findByRole("option", /Jean/i));
  await user.click(lista);

  const profissional = screen.getByPlaceholderText("Escolha o profissional...");

  await user.type(profissional, "Maria", { delay: 20 });
  await user.click(screen.getByRole("option", /Maria/i));
  const blocoData = await waitFor(() => screen.findByTestId("blocoData"));

  const celulas = await waitFor(() =>
    within(blocoData).findAllByText(moment().get("date"))
  );

  let celula;

  celulas.forEach((item) => {
    if (
      item.getAttribute("data-value") == moment().get("date") &&
      item.getAttribute("data-month") == moment().get("month") &&
      item.getAttribute("data-year") == moment().get("year")
    )
      celula = item;
  });

  expect(celula).not.toBeNull();
  await user.click(celula);

  await waitFor(() => screen.findByText("08:00"));

  await user.click(screen.queryByRole("button"), { name: /Agendar/i });
});

test("Agendar consulta - falha", async () => {
  estadoAgendar = 400;
  mockListaParcial = [{ idPaciente: 1, nomePaciente: "Jean Baumer" }];
  mockListaProfissionalVigente = [
    { idProfissional: 1, nomeProfissional: "Maria da Silva" },
  ];
  mockListaDataDisponivel = [
    { data: moment().format("DD.MM.YYYY") },
    { data: moment().add(1, "day").format("DD.MM.YYYY") },
  ];
  mockListaHoraDisponivel = [{ horario: "08:00" }];

  let user = userEvent.setup();
  renderWithProviders(<AgendarConsulta />);

  const paciente = screen.getByPlaceholderText("Escolha o paciente...");

  await user.type(paciente, "Jean");

  await waitFor(() => new Promise((r) => setTimeout(r, 950)));

  const lista = await waitFor(() => screen.findByRole("option", /Jean/i));
  await user.click(lista);

  const profissional = screen.getByPlaceholderText("Escolha o profissional...");

  await user.type(profissional, "Maria", { delay: 20 });
  await user.click(screen.getByRole("option", /Maria/i));
  const blocoData = await waitFor(() => screen.findByTestId("blocoData"));

  const celulas = await waitFor(() =>
    within(blocoData).findAllByText(moment().get("date"))
  );

  let celula;

  celulas.forEach((item) => {
    if (
      item.getAttribute("data-value") == moment().get("date") &&
      item.getAttribute("data-month") == moment().get("month") &&
      item.getAttribute("data-year") == moment().get("year")
    )
      celula = item;
  });

  expect(celula).not.toBeNull();
  await user.click(celula);

  await waitFor(() => screen.findByText("08:00"));

  await user.click(screen.queryByRole("button"), { name: /Agendar/i });
});
