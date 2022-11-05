import React from "react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { renderWithProviders } from "../util/test-utils";
import { BrowserRouter as Router } from "react-router-dom";

import LoginPaciente from "./LoginPaciente";
import { screen } from "@testing-library/react";
import { default as userEvent } from "@testing-library/user-event";

let mockLoginPacienteInterno = {};
let mockFuncaoNavigate = () => {};
let mockLoginGoogle = {};
let mockLoginFacebook = {};
let mockExecutarHandleGoogle = false;
let mockExecutarHandleFacebook = false;
let estadoGoogle = 200;
let estadoFacebook = 200;
let estadoLogin = 200;

jest.mock("react-facebook-login");
jest.mock("../componentes/GoogleAuth", () => ({
  __esModule: true,
  default: ({ handleCredentialResponse, children }) => {
    if (mockExecutarHandleGoogle) {
      handleCredentialResponse("teste");
    }
    return children;
  },
}));

jest.mock("react-facebook-login", () => ({
  __esModule: true,
  default: ({ callback, children }) => {
    if (mockExecutarHandleFacebook) {
      callback("teste");
    }
    return children;
  },
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => {
    return mockFuncaoNavigate;
  },
}));

export const handlers = [
  rest.post(
    "http://localhost:5000/v1/seguranca/loginPacienteInterno",
    (req, res, ctx) => {
      return res(ctx.status(estadoLogin), ctx.json(mockLoginPacienteInterno));
    }
  ),
  rest.post(
    "http://localhost:5000/v1/seguranca/oauth/google",
    (req, res, ctx) => {
      return res(ctx.status(estadoGoogle), ctx.json(mockLoginGoogle));
    }
  ),
  rest.post(
    "http://localhost:5000/v1/seguranca/oauth/facebook",
    (req, res, ctx) => {
      return res(ctx.status(estadoFacebook), ctx.json(mockLoginFacebook));
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

beforeAll(() => {
  mockLoginPacienteInterno = {};
  mockFuncaoNavigate = () => {};
  mockExecutarHandleGoogle = false;
  mockExecutarHandleFacebook = false;
  mockLoginGoogle = {};
  mockLoginFacebook = {};
  estadoGoogle = 200;
  estadoLogin = 200;
  estadoFacebook = 200;
});

test("Renderização componente", async () => {
  expect(
    renderWithProviders(
      <Router>
        <LoginPaciente />
      </Router>
    )
  ).toMatchSnapshot();
});

test("Login com campos inválido - Email não preenchido", async () => {
  let user = userEvent.setup();

  renderWithProviders(
    <Router>
      <LoginPaciente />
    </Router>
  );

  const botao = await screen.findByRole("button", { name: /Login/i });

  await user.click(botao);
});

test("Login com campos inválido - Senha não preenchido", async () => {
  let user = userEvent.setup();

  renderWithProviders(
    <Router>
      <LoginPaciente />
    </Router>
  );

  const email = await screen.findByPlaceholderText("Informe o email");
  await user.type(email, "teste@teste.com");
  const botao = await screen.findByRole("button", { name: /Login/i });

  await user.click(botao);
});

test("Login com sucesso", async () => {
  let user = userEvent.setup();

  renderWithProviders(
    <Router>
      <LoginPaciente />
    </Router>
  );

  const email = await screen.findByPlaceholderText("Informe o email");
  await user.type(email, "teste@teste.com");

  const senha = await screen.findByPlaceholderText("Informe a senha");
  await user.type(senha, "12345678");

  const botao = await screen.findByRole("button", { name: /Login/i });

  await user.click(botao);
});

test("Login com erro", async () => {
  let user = userEvent.setup();
  estadoLogin = 400;
  mockLoginPacienteInterno = { error: {} };

  renderWithProviders(
    <Router>
      <LoginPaciente />
    </Router>
  );

  const email = await screen.findByPlaceholderText("Informe o email");
  await user.type(email, "teste@teste.com");

  const senha = await screen.findByPlaceholderText("Informe a senha");
  await user.type(senha, "12345678");

  const botao = await screen.findByRole("button", { name: /Login/i });

  await user.click(botao);
});

test("Acesso colaborador", async () => {
  let user = userEvent.setup();
  mockFuncaoNavigate = jest.fn();

  renderWithProviders(
    <Router>
      <LoginPaciente />
    </Router>
  );

  const botao = await screen.findByRole("button", {
    name: /Acesso colaborador/i,
  });

  await user.click(botao);

  expect(mockFuncaoNavigate).toHaveBeenCalled();
});

test("Cadastrar paciente", async () => {
  let user = userEvent.setup();
  mockFuncaoNavigate = jest.fn();

  renderWithProviders(
    <Router>
      <LoginPaciente />
    </Router>
  );

  const botao = await screen.findByTestId("cadastrar");

  await user.click(botao);

  expect(mockFuncaoNavigate).toHaveBeenCalled();
});

test("Login Google com sucesso", async () => {
  mockFuncaoNavigate = jest.fn();
  mockExecutarHandleGoogle = true;
  mockLoginGoogle = {};

  renderWithProviders(
    <Router>
      <LoginPaciente />
    </Router>
  );

  const botao = await screen.findByTestId("cadastrar");

  expect(botao).toBeDefined();
});

test("Login Google com erro", async () => {
  mockFuncaoNavigate = jest.fn();
  mockExecutarHandleGoogle = true;
  estadoGoogle = 400;
  mockLoginGoogle = { error: {} };

  renderWithProviders(
    <Router>
      <LoginPaciente />
    </Router>
  );

  const botao = await screen.findByTestId("cadastrar");

  expect(botao).toBeDefined();
});

test("Login Facebook com sucesso", async () => {
  mockFuncaoNavigate = jest.fn();
  mockExecutarHandleFacebook = true;
  mockLoginFacebook = {};

  renderWithProviders(
    <Router>
      <LoginPaciente />
    </Router>
  );

  const botao = await screen.findByTestId("cadastrar");

  expect(botao).toBeDefined();
});

test("Login Facebook com erro", async () => {
  mockFuncaoNavigate = jest.fn();
  mockExecutarHandleFacebook = true;
  mockLoginFacebook = { error: {} };
  estadoFacebook = 400;

  renderWithProviders(
    <Router>
      <LoginPaciente />
    </Router>
  );

  const botao = await screen.findByTestId("cadastrar");

  expect(botao).toBeDefined();
});
