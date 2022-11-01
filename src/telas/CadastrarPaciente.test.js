import React from "react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { renderWithProviders } from "../util/test-utils";
import { BrowserRouter as Router } from "react-router-dom";

import CadastrarPaciente from "./CadastrarPaciente";
import { fireEvent, screen, waitFor, within } from "@testing-library/react";
import { default as userEvent } from "@testing-library/user-event";

let estadoCadastrar = 200;
let mockCadastrar = {};

const handlers = [
  rest.post("http://localhost:5000/v1/paciente/cadastrar", (req, res, ctx) => {
    return res(ctx.status(estadoCadastrar), ctx.json(mockCadastrar));
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
  estadoCadastrar = 200;
  mockCadastrar = {};
});

test("Renderização componente", async () => {
  expect(
    renderWithProviders(
      <Router>
        <CadastrarPaciente />
      </Router>
    )
  ).toMatchSnapshot();
});

test("Nome do paciente não preenchido", async () => {
  estadoCadastrar = 400;
  mockCadastrar = { campo: 1 };

  let user = userEvent.setup();
  renderWithProviders(
    <Router>
      <CadastrarPaciente />
    </Router>
  );

  await user.click(await screen.findByRole("button", { name: /Confirmar/i }));
});

test("CPF do paciente não preenchido", async () => {
  estadoCadastrar = 400;
  mockCadastrar = { campo: 2 };

  let user = userEvent.setup();
  renderWithProviders(
    <Router>
      <CadastrarPaciente />
    </Router>
  );

  await user.type(
    await screen.findByPlaceholderText("Informe o nome do paciente"),
    "Nome"
  );
  await user.click(await screen.findByRole("button", { name: /Confirmar/i }));
});

test("Data de nascimento do paciente não preenchido", async () => {
  estadoCadastrar = 400;
  mockCadastrar = { campo: 3 };

  let user = userEvent.setup();
  renderWithProviders(
    <Router>
      <CadastrarPaciente />
    </Router>
  );

  await user.type(
    await screen.findByPlaceholderText("Informe o nome do paciente"),
    "Nome"
  );
  await user.type(
    await screen.findByPlaceholderText("Informe o CPF do paciente"),
    "11111111111"
  );

  await user.click(await screen.findByRole("button", { name: /Confirmar/i }));
});

test("Telefone do paciente não preenchido", async () => {
  estadoCadastrar = 400;
  mockCadastrar = { campo: 4 };

  let user = userEvent.setup();
  renderWithProviders(
    <Router>
      <CadastrarPaciente />
    </Router>
  );

  await user.type(
    await screen.findByPlaceholderText("Informe o nome do paciente"),
    "Nome"
  );
  await user.type(
    await screen.findByPlaceholderText("Informe o CPF do paciente"),
    "11111111111"
  );
  await user.type(
    await screen.findByPlaceholderText("Informe a data de nascimento"),
    "01/01/2022"
  );

  await user.click(await screen.findByRole("button", { name: /Confirmar/i }));
});

test("Email do paciente não preenchido", async () => {
  estadoCadastrar = 400;
  mockCadastrar = { campo: 5 };

  let user = userEvent.setup();
  renderWithProviders(
    <Router>
      <CadastrarPaciente />
    </Router>
  );

  await user.type(
    await screen.findByPlaceholderText("Informe o nome do paciente"),
    "Nome"
  );
  await user.type(
    await screen.findByPlaceholderText("Informe o CPF do paciente"),
    "11111111111"
  );
  await user.type(
    await screen.findByPlaceholderText("Informe a data de nascimento"),
    "01/01/2022"
  );
  await user.type(
    await screen.findByPlaceholderText("Informe a telefone"),
    "11912345678"
  );
  await user.click(await screen.findByRole("button", { name: /Confirmar/i }));
});

test("Senha do paciente não preenchido", async () => {
  estadoCadastrar = 400;
  mockCadastrar = { campo: 6 };

  let user = userEvent.setup();
  renderWithProviders(
    <Router>
      <CadastrarPaciente />
    </Router>
  );

  await user.type(
    await screen.findByPlaceholderText("Informe o nome do paciente"),
    "Nome"
  );
  await user.type(
    await screen.findByPlaceholderText("Informe o CPF do paciente"),
    "11111111111"
  );
  await user.type(
    await screen.findByPlaceholderText("Informe a data de nascimento"),
    "01/01/2022"
  );
  await user.type(
    await screen.findByPlaceholderText("Informe a telefone"),
    "11912345678"
  );
  await user.type(
    await screen.findByPlaceholderText("Informe a email"),
    "teste@teste.com"
  );
  await user.click(await screen.findByRole("button", { name: /Confirmar/i }));
});

test("Repetição da senha do paciente não preenchido", async () => {
  estadoCadastrar = 400;
  mockCadastrar = { campo: 7 };

  let user = userEvent.setup();
  renderWithProviders(
    <Router>
      <CadastrarPaciente />
    </Router>
  );

  await user.type(
    await screen.findByPlaceholderText("Informe o nome do paciente"),
    "Nome"
  );
  await user.type(
    await screen.findByPlaceholderText("Informe o CPF do paciente"),
    "11111111111"
  );
  await user.type(
    await screen.findByPlaceholderText("Informe a data de nascimento"),
    "01/01/2022"
  );
  await user.type(
    await screen.findByPlaceholderText("Informe a telefone"),
    "11912345678"
  );
  await user.type(
    await screen.findByPlaceholderText("Informe a email"),
    "teste@teste.com"
  );
  await user.type(
    await screen.findByPlaceholderText("Informe a email"),
    "teste@teste.com"
  );
  await user.type(
    await screen.findByPlaceholderText("Informe a senha nova"),
    "abcDE12#"
  );
  await user.click(await screen.findByRole("button", { name: /Confirmar/i }));
});

test("Cadastro com sucesso", async () => {
  estadoCadastrar = 200;

  let user = userEvent.setup();
  renderWithProviders(
    <Router>
      <CadastrarPaciente />
    </Router>
  );

  await user.type(
    await screen.findByPlaceholderText("Informe o nome do paciente"),
    "Nome"
  );
  await user.type(
    await screen.findByPlaceholderText("Informe o CPF do paciente"),
    "11111111111"
  );
  await user.type(
    await screen.findByPlaceholderText("Informe a data de nascimento"),
    "01/01/2022"
  );
  await user.type(
    await screen.findByPlaceholderText("Informe a telefone"),
    "11912345678"
  );
  await user.type(
    await screen.findByPlaceholderText("Informe a email"),
    "teste@teste.com"
  );
  await user.type(
    await screen.findByPlaceholderText("Informe a email"),
    "teste@teste.com"
  );
  await user.type(
    await screen.findByPlaceholderText("Informe a senha nova"),
    "abcDE12#"
  );
  await user.type(
    await screen.findByPlaceholderText("Repetir a senha nova"),
    "abcDE12#"
  );
  await user.click(await screen.findByRole("button", { name: /Confirmar/i }));
});

test("Erro sem enviar o campo", async () => {
  estadoCadastrar = 400;
  mockCadastrar = {};

  let user = userEvent.setup();
  renderWithProviders(
    <Router>
      <CadastrarPaciente />
    </Router>
  );

  await user.click(await screen.findByRole("button", { name: /Confirmar/i }));
});

test("Campo de erro não esperado", async () => {
  estadoCadastrar = 400;
  mockCadastrar = { campo: 99 };

  let user = userEvent.setup();
  renderWithProviders(
    <Router>
      <CadastrarPaciente />
    </Router>
  );

  await user.click(await screen.findByRole("button", { name: /Confirmar/i }));
});

test("Cancelar a operação", async () => {
  estadoCadastrar = 400;
  mockCadastrar = { campo: 99 };

  let user = userEvent.setup();
  renderWithProviders(
    <Router>
      <CadastrarPaciente />
    </Router>
  );

  await user.click(await screen.findByRole("button", { name: /Cancelar/i }));
});
