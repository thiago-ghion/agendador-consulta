import React from "react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { renderWithProviders } from "../util/test-utils";
import { BrowserRouter as Router } from "react-router-dom";
import { fireEvent, screen, waitFor } from "@testing-library/react";

import TelaPrincipalColaborador from "./TelaPrincipalColaborador";

let mockIntrospect = {};
let estadoIntrospect = 200;

jest.mock("../telas/AgendarConsulta", () => () => <></>);
jest.mock("../telas/ParametrizacaoPaciente", () => () => <></>);
jest.mock("../telas/ParametrizacaoUsuario", () => () => <></>);
jest.mock("../telas/TrocaSenhaInternaColaborador", () => () => <></>);
jest.mock("../telas/ParametrizacaoHorario", () => () => <></>);
jest.mock("../telas/ParametrizacaoProfissional", () => () => <></>);
jest.mock("../telas/ListarRegistroAcesso", () => () => <></>);
jest.mock("../telas/ListarConsulta", () => () => <></>);

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
        <TelaPrincipalColaborador />
      </Router>
    )
  ).toMatchSnapshot();
});

test("Sem token na sessão", async () => {
  renderWithProviders(
    <Router>
      <TelaPrincipalColaborador />
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
      <TelaPrincipalColaborador />
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
      <TelaPrincipalColaborador />
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
          },
        },
      },
    }
  );
});

test("Menu carregado - Administrador", async () => {
  renderWithProviders(
    <Router>
      <TelaPrincipalColaborador navigate={() => {}}></TelaPrincipalColaborador>
    </Router>,
    {
      preloadedState: {
        login: {
          usuario: {
            access_token: "12345678",
            id: 1,
            nivelUsuario: 3,
            nome: "Teste",
            usuario: "teste",
          },
        },
      },
    }
  );

  await waitFor(() => screen.findAllByRole("navigation"));

  const agenda = await waitFor(() =>
    screen.findByRole("button", { name: /Agendar consulta/i })
  );
  fireEvent.click(agenda);

  const cadastroPaciente = await waitFor(() =>
    screen.findByRole("button", { name: /Cadastro paciente/i })
  );
  fireEvent.click(cadastroPaciente);

  const listarConsulta = await waitFor(() =>
    screen.findByRole("button", { name: /Listar consultas/i })
  );
  fireEvent.click(listarConsulta);

  const parametrizacaoHorario = await waitFor(() =>
    screen.findByRole("button", { name: /Parametrização horário/i })
  );
  fireEvent.click(parametrizacaoHorario);

  const parametrizacaoProfissional = await waitFor(() =>
    screen.findByRole("button", { name: /Parametrização profissional/i })
  );
  fireEvent.click(parametrizacaoProfissional);

  const parametrizacaoUsuario = await waitFor(() =>
    screen.findByRole("button", { name: /Parametrização usuário/i })
  );
  fireEvent.click(parametrizacaoUsuario);

  const estatistica = await waitFor(() =>
    screen.findByRole("button", { name: /Estatísticas/i })
  );
  fireEvent.click(estatistica);

  const trocarSenha = await waitFor(() =>
    screen.findByRole("button", { name: /Trocar senha/i })
  );
  fireEvent.click(trocarSenha);

  const registroAcesso = await waitFor(() =>
    screen.findByRole("button", { name: /Registros de acesso/i })
  );
  fireEvent.click(registroAcesso);
});

test("Menu carregado - Colaborador", async () => {
  renderWithProviders(
    <Router>
      <TelaPrincipalColaborador navigate={() => {}}></TelaPrincipalColaborador>
    </Router>,
    {
      preloadedState: {
        login: {
          usuario: {
            access_token: "12345678",
            id: 1,
            nivelUsuario: 2,
            nome: "Teste",
            usuario: "teste",
          },
        },
      },
    }
  );

  await waitFor(() => screen.findAllByRole("navigation"));

  const agenda = await waitFor(() =>
    screen.findByRole("button", { name: /Agendar consulta/i })
  );
  fireEvent.click(agenda);

  const cadastroPaciente = await waitFor(() =>
    screen.findByRole("button", { name: /Cadastro paciente/i })
  );
  fireEvent.click(cadastroPaciente);

  const listarConsulta = await waitFor(() =>
    screen.findByRole("button", { name: /Listar consultas/i })
  );
  fireEvent.click(listarConsulta);

  const parametrizacaoHorario = await waitFor(() =>
    screen.findByRole("button", { name: /Parametrização horário/i })
  );
  fireEvent.click(parametrizacaoHorario);

  const parametrizacaoProfissional = await waitFor(() =>
    screen.findByRole("button", { name: /Parametrização profissional/i })
  );
  fireEvent.click(parametrizacaoProfissional);

  const parametrizacaoUsuario = await waitFor(() =>
    screen.findByRole("button", { name: /Parametrização usuário/i })
  );
  fireEvent.click(parametrizacaoUsuario);

  const estatistica = await waitFor(() =>
    screen.findByRole("button", { name: /Estatísticas/i })
  );
  fireEvent.click(estatistica);

  const trocarSenha = await waitFor(() =>
    screen.findByRole("button", { name: /Trocar senha/i })
  );
  fireEvent.click(trocarSenha);

  const registroAcesso = await waitFor(() =>
    screen.findByRole("button", { name: /Registros de acesso/i })
  );
  fireEvent.click(registroAcesso);
});

test("Menu carregado - Administrador", async () => {
  renderWithProviders(
    <Router>
      <TelaPrincipalColaborador navigate={() => {}}></TelaPrincipalColaborador>
    </Router>,
    {
      preloadedState: {
        login: {
          usuario: {
            access_token: "12345678",
            id: 1,
            nivelUsuario: 3,
            nome: "Teste",
            usuario: "teste",
          },
        },
      },
    }
  );

  await waitFor(() => screen.findAllByRole("navigation"));

  const agenda = await waitFor(() =>
    screen.findByRole("button", { name: /Agendar consulta/i })
  );
  fireEvent.click(agenda);

  const cadastroPaciente = await waitFor(() =>
    screen.findByRole("button", { name: /Cadastro paciente/i })
  );
  fireEvent.click(cadastroPaciente);

  const listarConsulta = await waitFor(() =>
    screen.findByRole("button", { name: /Listar consultas/i })
  );
  fireEvent.click(listarConsulta);

  const parametrizacaoHorario = await waitFor(() =>
    screen.findByRole("button", { name: /Parametrização horário/i })
  );
  fireEvent.click(parametrizacaoHorario);

  const parametrizacaoProfissional = await waitFor(() =>
    screen.findByRole("button", { name: /Parametrização profissional/i })
  );
  fireEvent.click(parametrizacaoProfissional);

  const parametrizacaoUsuario = await waitFor(() =>
    screen.findByRole("button", { name: /Parametrização usuário/i })
  );
  fireEvent.click(parametrizacaoUsuario);

  const estatistica = await waitFor(() =>
    screen.findByRole("button", { name: /Estatísticas/i })
  );
  fireEvent.click(estatistica);

  const trocarSenha = await waitFor(() =>
    screen.findByRole("button", { name: /Trocar senha/i })
  );
  fireEvent.click(trocarSenha);

  const registroAcesso = await waitFor(() =>
    screen.findByRole("button", { name: /Registros de acesso/i })
  );
  fireEvent.click(registroAcesso);

  const sair = await waitFor(() =>
    screen.findByRole("button", { name: /Sair/i })
  );
  fireEvent.click(sair);
});
