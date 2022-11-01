import React from "react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { renderWithProviders } from "../util/test-utils";
import { BrowserRouter as Router } from "react-router-dom";

import LoginColaborador from "./LoginColaborador";
import { fireEvent, screen, waitFor } from "@testing-library/react";

let mockLogin = {};
let estadoLogin = 200;

export const handlers = [
  rest.post(
    "http://localhost:5000/v1/seguranca/loginColaborador",
    (req, res, ctx) => {
      return res(ctx.status(estadoLogin), ctx.json(mockLogin));
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
  mockLogin = {};
  estadoLogin = 200;
});

test("Renderização componente", async () => {
  expect(
    renderWithProviders(
      <Router>
        <LoginColaborador />
      </Router>
    )
  ).toMatchSnapshot();
});

test("Usuário não preenchido ", async () => {
  renderWithProviders(
    <Router>
      <LoginColaborador />
    </Router>
  );

  const login = await screen.findByRole("button", { name: /Login/i });
  fireEvent.click(login);
});

test("Senha não preenchida", async () => {
  renderWithProviders(
    <Router>
      <LoginColaborador />
    </Router>
  );

  const usuario = await screen.findByPlaceholderText("Informe o usuário");
  fireEvent.change(usuario, { target: { value: "usuarioteste" } });
  const login = await screen.findByRole("button", { name: /Login/i });
  fireEvent.click(login);
});

test("Login com falha", async () => {
  estadoLogin = 400;

  renderWithProviders(
    <Router>
      <LoginColaborador />
    </Router>
  );

  const usuario = await screen.findByPlaceholderText("Informe o usuário");
  fireEvent.change(usuario, { target: { value: "usuarioteste" } });

  const senha = await screen.findByPlaceholderText("Informe a senha");
  fireEvent.change(senha, { target: { value: "12345678" } });

  const login = await screen.findByRole("button", { name: /Login/i });
  fireEvent.click(login);
});

test("Login com falha - senha resetada", async () => {
  estadoLogin = 400;
  mockLogin = { senhaResetada: true };

  renderWithProviders(
    <Router>
      <LoginColaborador />
    </Router>
  );

  const usuario = await screen.findByPlaceholderText("Informe o usuário");
  fireEvent.change(usuario, { target: { value: "usuarioteste" } });

  const senha = await screen.findByPlaceholderText("Informe a senha");
  fireEvent.change(senha, { target: { value: "12345678" } });

  const login = await screen.findByRole("button", { name: /Login/i });
  fireEvent.click(login);
});

test("Login com sucesso", async () => {
  renderWithProviders(
    <Router>
      <LoginColaborador />
    </Router>
  );

  const usuario = await screen.findByPlaceholderText("Informe o usuário");
  fireEvent.change(usuario, { target: { value: "usuarioteste" } });

  const senha = await screen.findByPlaceholderText("Informe a senha");
  fireEvent.change(senha, { target: { value: "12345678" } });

  const login = await screen.findByRole("button", { name: /Login/i });
  fireEvent.click(login);
});
