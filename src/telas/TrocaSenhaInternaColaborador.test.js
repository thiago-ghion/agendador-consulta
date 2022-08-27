import React from "react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { renderWithProviders } from "../util/test-utils";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import TrocaSenhaInternaColaborador from "./TrocaSenhaInternaColaborador";

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
  expect(
    renderWithProviders(<TrocaSenhaInternaColaborador />)
  ).toMatchSnapshot();
});

test("Falha no preenchimento", async () => {
  renderWithProviders(<TrocaSenhaInternaColaborador />);

  //Nada preenchido
  fireEvent.click(screen.getByRole("button"), { name: /Trocar/i });

  //Senha inicial
  fireEvent.change(screen.getByPlaceholderText("Informe a senha atual"), {
    target: { value: "12345678" },
  });
  fireEvent.click(screen.getByRole("button"), { name: /Trocar/i });

  //Senha inicial, senha nova
  fireEvent.change(screen.getByPlaceholderText("Informe a senha nova"), {
    target: { value: "87654321" },
  });
  fireEvent.click(screen.getByRole("button"), { name: /Trocar/i });

  //Senha inicial, senha nova, senha repetida
  fireEvent.change(screen.getByPlaceholderText("Repita a senha nova"), {
    target: { value: "abcdefgh" },
  });
  fireEvent.click(screen.getByRole("button"), { name: /Trocar/i });
});

test("Sucesso no preenchimento", async () => {
  renderWithProviders(<TrocaSenhaInternaColaborador />);

  fireEvent.change(screen.getByPlaceholderText("Informe a senha atual"), {
    target: { value: "12345678" },
  });

  fireEvent.change(screen.getByPlaceholderText("Informe a senha nova"), {
    target: { value: "87654321" },
  });

  fireEvent.change(screen.getByPlaceholderText("Repita a senha nova"), {
    target: { value: "87654321" },
  });
  fireEvent.click(screen.getByRole("button"), { name: /Trocar/i });
});

test("Falha na alteração - I", async () => {
  estadoAlteracao = 400;
  mockAlteracao = { campo: 1 };

  renderWithProviders(<TrocaSenhaInternaColaborador />);

  fireEvent.change(screen.getByPlaceholderText("Informe a senha atual"), {
    target: { value: "12345678" },
  });

  fireEvent.change(screen.getByPlaceholderText("Informe a senha nova"), {
    target: { value: "87654321" },
  });

  fireEvent.change(screen.getByPlaceholderText("Repita a senha nova"), {
    target: { value: "87654321" },
  });
  fireEvent.click(screen.getByRole("button"), { name: /Trocar/i });
});

test("Falha na alteração - II", async () => {
  estadoAlteracao = 400;
  mockAlteracao = { campo: 2 };

  renderWithProviders(<TrocaSenhaInternaColaborador />);

  fireEvent.change(screen.getByPlaceholderText("Informe a senha atual"), {
    target: { value: "12345678" },
  });

  fireEvent.change(screen.getByPlaceholderText("Informe a senha nova"), {
    target: { value: "87654321" },
  });

  fireEvent.change(screen.getByPlaceholderText("Repita a senha nova"), {
    target: { value: "87654321" },
  });
  fireEvent.click(screen.getByRole("button"), { name: /Trocar/i });
});
