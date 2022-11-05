import React from "react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { renderWithProviders } from "../util/test-utils";
import { BrowserRouter as Router } from "react-router-dom";

import TelaPrincipalPaciente from "./TelaPrincipalPaciente";
import { screen } from "@testing-library/react";
import { default as userEvent } from "@testing-library/user-event";

jest.mock("../telas/AgendarConsulta", () => () => <></>);
jest.mock("../telas/ListarConsultaPaciente", () => () => <></>);
jest.mock("../telas/TrocaSenhaInternaPaciente", () => () => <></>);

let mockIntrospect = {};
let estadoIntrospect = 200;

export const handlers = [
  rest.post(
    "http://localhost:5000/v1/seguranca/token/introspect/12345678",
    (req, res, ctx) => {
      return res(ctx.status(estadoIntrospect), ctx.json(mockIntrospect));
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
  mockIntrospect = {};
  estadoIntrospect = 200;
});

test("Renderização componente", async () => {
  expect(
    renderWithProviders(
      <Router>
        <TelaPrincipalPaciente />
      </Router>
    )
  ).toMatchSnapshot();
});

test("Sem token na sessão", async () => {
  renderWithProviders(
    <Router>
      <TelaPrincipalPaciente />
    </Router>,
    {
      preloadedState: {
        login: {
          usuario: {
            access_token: undefined,
            id: 1,
            nivelUsuario: 3,
            nome: "Teste",
            usuario: "teste",
          },
        },
      },
    }
  );
});

test("Token inválido", async () => {
  estadoIntrospect = 400;

  renderWithProviders(
    <Router>
      <TelaPrincipalPaciente />
    </Router>,
    {
      preloadedState: {
        login: {
          usuario: {
            access_token: "12345678",
            id: 1,
            nivelUsuario: undefined,
            nome: "Teste",
            usuario: "teste",
          },
        },
      },
    }
  );
});

test("Nível de acesso de usuário inválido", async () => {
  renderWithProviders(
    <Router>
      <TelaPrincipalPaciente />
    </Router>,
    {
      preloadedState: {
        login: {
          usuario: {
            access_token: "12345678",
            id: 1,
            nivelUsuario: 0,
            nome: "Teste",
            usuario: "teste",
          },
        },
      },
    }
  );
});

test("Menu carregado - Paciente", async () => {
  let user = userEvent.setup();

  renderWithProviders(
    <Router>
      <TelaPrincipalPaciente navigate={() => {}}></TelaPrincipalPaciente>
    </Router>,
    {
      preloadedState: {
        login: {
          usuario: {
            access_token: "12345678",
            id: 1,
            nivelUsuario: 1,
            nome: "Teste",
            usuario: "teste",
            isInterno: true,
          },
        },
      },
    }
  );

  await screen.findAllByRole("navigation");

  const agenda = await screen.findByRole("button", {
    name: /Agendar consulta/i,
  });

  await user.click(agenda);

  const listar = await screen.findByRole("button", {
    name: /Listar consultas/i,
  });

  await user.click(listar);

  const senha = await screen.findByRole("button", {
    name: /Trocar senha/i,
  });

  await user.click(senha);

  const sair = await screen.findByRole("button", {
    name: /Sair/i,
  });

  await user.click(sair);
});
