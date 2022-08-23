import React from "react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { renderWithProviders } from "../util/test-utils";
import { BrowserRouter as Router } from "react-router-dom";
import { fireEvent, screen, waitFor } from "@testing-library/react";

import TrocaSenhaColaborador from "./TrocaSenhaColaborador";

let mockAlteracao = {};
let estadoAlteracao = 200;

export const handlers = [
  rest.post(
    "http://localhost:5000/v1/seguranca/trocarSenhaColaborador",
    (req, res, ctx) => {
      return res(ctx.status(estadoAlteracao), ctx.json(mockAlteracao));
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
  mockAlteracao = {};
  estadoAlteracao = 200;
});

test("Renderização componente", async () => {
  const tela = renderWithProviders(
    <Router>
      <TrocaSenhaColaborador useNavigate={() => {}} />
    </Router>
  );
  expect(tela.firstChild).toMatchSnapshot();
});

test("Falha no preenchimento", async () => {
  renderWithProviders(
    <Router>
      <TrocaSenhaColaborador useNavigate={() => {}} />
    </Router>
  );

  //Nada preenchido
  fireEvent.click(screen.getByRole("button"), { name: /Trocar/i });

  //Usuário
  fireEvent.change(screen.getByPlaceholderText("Informe o usuário"), {
    target: { value: "teste" },
  });
  fireEvent.click(screen.getByRole("button"), { name: /Trocar/i });

  //Usuário, Senha inicial
  fireEvent.change(screen.getByPlaceholderText("Informe a senha anterior"), {
    target: { value: "12345678" },
  });
  fireEvent.click(screen.getByRole("button"), { name: /Trocar/i });

  //Usuário, Senha inicial, senha nova
  fireEvent.change(screen.getByPlaceholderText("Informe a senha nova"), {
    target: { value: "87654321" },
  });
  fireEvent.click(screen.getByRole("button"), { name: /Trocar/i });

  //Usuário, Senha inicial, senha nova, senha repetida
  fireEvent.change(screen.getByPlaceholderText("Repetir a senha nova"), {
    target: { value: "abcdefgh" },
  });
  fireEvent.click(screen.getByRole("button"), { name: /Trocar/i });
});

test("Sucesso na alteração", async () => {
  renderWithProviders(
    <Router>
      <TrocaSenhaColaborador useNavigate={() => {}} />
    </Router>
  );

  fireEvent.change(screen.getByPlaceholderText("Informe o usuário"), {
    target: { value: "teste" },
  });

  fireEvent.change(screen.getByPlaceholderText("Informe a senha anterior"), {
    target: { value: "12345678" },
  });

  fireEvent.change(screen.getByPlaceholderText("Informe a senha nova"), {
    target: { value: "87654321" },
  });

  fireEvent.change(screen.getByPlaceholderText("Repetir a senha nova"), {
    target: { value: "87654321" },
  });

  fireEvent.click(screen.getByRole("button"), { name: /Trocar/i });
});

test("Falha na alteração", async () => {
  estadoAlteracao = 400;
  renderWithProviders(
    <Router>
      <TrocaSenhaColaborador useNavigate={() => {}} />
    </Router>
  );

  fireEvent.change(screen.getByPlaceholderText("Informe o usuário"), {
    target: { value: "teste" },
  });

  fireEvent.change(screen.getByPlaceholderText("Informe a senha anterior"), {
    target: { value: "12345678" },
  });

  fireEvent.change(screen.getByPlaceholderText("Informe a senha nova"), {
    target: { value: "87654321" },
  });

  fireEvent.change(screen.getByPlaceholderText("Repetir a senha nova"), {
    target: { value: "87654321" },
  });

  fireEvent.click(screen.getByRole("button"), { name: /Trocar/i });
});
