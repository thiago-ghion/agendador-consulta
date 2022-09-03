import React from "react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { renderWithProviders } from "../util/test-utils";

import ParametrizacaoPacienteManutencao from "./ParametrizacaoPacienteManutencao";
import { screen, fireEvent, waitFor } from "@testing-library/react";

let mockConsultar = {};
let estadoConsultar = 200;
let mockRegistrar = {};
let estadoRegistrar = 201;
let mockAlterar = {};
let estadoAlterar = 200;

export const handlers = [
  rest.get("http://localhost:5000/v1/paciente/consultar", (req, res, ctx) => {
    return res(ctx.status(estadoConsultar), ctx.json(mockConsultar));
  }),
  rest.get("http://localhost:5000/v1/paciente/consultar", (req, res, ctx) => {
    return res(ctx.status(estadoConsultar), ctx.json(mockConsultar));
  }),
  rest.post("http://localhost:5000/v1/paciente/registrar", (req, res, ctx) => {
    return res(ctx.status(estadoRegistrar), ctx.json(mockRegistrar));
  }),
  rest.post("http://localhost:5000/v1/paciente/alterar/1", (req, res, ctx) => {
    return res(ctx.status(estadoAlterar), ctx.json(mockAlterar));
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
  mockConsultar = {};
  estadoConsultar = 200;
  mockRegistrar = {};
  estadoRegistrar = 201;
  mockAlterar = {};
  estadoAlterar = 200;
});

test("Renderização componente", async () => {
  expect(
    renderWithProviders(<ParametrizacaoPacienteManutencao />)
  ).toMatchSnapshot();
});

test("Renderizar em modo de alteração - Telefone móvel", async () => {
  mockConsultar = {
    nomePaciente: "Teste",
    numeroCPF: "12345678901",
    dataNascimento: "01.01.2020",
    numeroTelefone: "11912345678",
    enderecoEmail: "teste@teste.com",
  };
  renderWithProviders(
    <ParametrizacaoPacienteManutencao
      modoAlteracao
      idPaciente={1}
      setTelaAtiva={() => {}}
    />
  );
});

test("Renderizar em modo de alteração - Telefone fixo", async () => {
  mockConsultar = {
    nomePaciente: "Teste",
    numeroCPF: "12345678901",
    dataNascimento: "01.01.2020",
    numeroTelefone: "1112345678",
    enderecoEmail: "teste@teste.com",
  };
  renderWithProviders(
    <ParametrizacaoPacienteManutencao
      modoAlteracao
      idPaciente={1}
      setTelaAtiva={() => {}}
    />
  );
});

test("Renderizar em modo de alteração - Erro", async () => {
  estadoConsultar = 400;
  mockConsultar = {};
  renderWithProviders(
    <ParametrizacaoPacienteManutencao
      modoAlteracao
      idPaciente={1}
      setTelaAtiva={() => {}}
    />
  );
});

test("Cancelar manutenção", async () => {
  renderWithProviders(
    <ParametrizacaoPacienteManutencao setTelaAtiva={() => {}} />
  );
  const cancelar = await waitFor(() =>
    screen.findByRole("button", { name: /Cancelar/i })
  );
  fireEvent.click(cancelar);
});

test("Preencher o formulário", async () => {
  renderWithProviders(
    <ParametrizacaoPacienteManutencao setTelaAtiva={() => {}} />
  );

  fireEvent.change(screen.getByPlaceholderText("Informe o nome do paciente"), {
    target: { value: "teste" },
  });
  fireEvent.change(screen.getByPlaceholderText("Informe o CPF do paciente"), {
    target: { value: "12345678901" },
  });
  fireEvent.change(
    screen.getByPlaceholderText("Informe a data de nascimento"),
    { target: { value: "01012020" } }
  );
  fireEvent.change(screen.getByPlaceholderText("Informe a telefone"), {
    target: { value: "11912345678" },
  });
  fireEvent.change(screen.getByPlaceholderText("Informe a email"), {
    target: { value: "teste@teste.com" },
  });
});

test("Inclusão do paciente com sucesso", async () => {
  renderWithProviders(
    <ParametrizacaoPacienteManutencao setTelaAtiva={() => {}} />
  );

  fireEvent.change(screen.getByPlaceholderText("Informe o nome do paciente"), {
    target: { value: "teste" },
  });
  fireEvent.change(screen.getByPlaceholderText("Informe o CPF do paciente"), {
    target: { value: "123.456.789-01" },
  });
  fireEvent.change(
    screen.getByPlaceholderText("Informe a data de nascimento"),
    { target: { value: "01/01/2020" } }
  );
  fireEvent.change(screen.getByPlaceholderText("Informe a telefone"), {
    target: { value: "(11)91234-5678" },
  });
  fireEvent.change(screen.getByPlaceholderText("Informe a email"), {
    target: { value: "teste@teste.com" },
  });

  const botaoSalvar = await waitFor(() =>
    screen.findByRole("button", { name: /Salvar/i })
  );
  fireEvent.click(botaoSalvar);
});

test("Alteração do paciente com sucesso", async () => {
  renderWithProviders(
    <ParametrizacaoPacienteManutencao
      idPaciente={1}
      modoAlteracao
      setTelaAtiva={() => {}}
    />
  );

  fireEvent.change(screen.getByPlaceholderText("Informe o nome do paciente"), {
    target: { value: "teste" },
  });
  fireEvent.change(screen.getByPlaceholderText("Informe o CPF do paciente"), {
    target: { value: "123.456.789-01" },
  });
  fireEvent.change(
    screen.getByPlaceholderText("Informe a data de nascimento"),
    { target: { value: "01/01/2020" } }
  );
  fireEvent.change(screen.getByPlaceholderText("Informe a telefone"), {
    target: { value: "(11)91234-5678" },
  });
  fireEvent.change(screen.getByPlaceholderText("Informe a email"), {
    target: { value: "teste@teste.com" },
  });

  const botaoSalvar = await waitFor(() =>
    screen.findByRole("button", { name: /Salvar/i })
  );
  fireEvent.click(botaoSalvar);
});

test("Manutenção do paciente erro no formulário", async () => {
  renderWithProviders(
    <ParametrizacaoPacienteManutencao
      modoAlteracao
      idPaciente={1}
      setTelaAtiva={() => {}}
    />
  );

  fireEvent.change(screen.getByPlaceholderText("Informe o nome do paciente"), {
    target: { value: "teste" },
  });
  fireEvent.change(screen.getByPlaceholderText("Informe o CPF do paciente"), {
    target: { value: "" },
  });
  fireEvent.change(
    screen.getByPlaceholderText("Informe a data de nascimento"),
    { target: { value: "01/01/2020" } }
  );
  fireEvent.change(screen.getByPlaceholderText("Informe a telefone"), {
    target: { value: "(11)91234-5678" },
  });
  fireEvent.change(screen.getByPlaceholderText("Informe a email"), {
    target: { value: "teste@teste.com" },
  });

  const botaoSalvar = await waitFor(() =>
    screen.findByRole("button", { name: /Salvar/i })
  );
  fireEvent.click(botaoSalvar);
});

test("Manutenção do paciente - erro - nome", async () => {
  estadoRegistrar = 400;
  mockRegistrar = { campo: 1 };

  renderWithProviders(
    <ParametrizacaoPacienteManutencao setTelaAtiva={() => {}} />
  );

  fireEvent.change(screen.getByPlaceholderText("Informe o nome do paciente"), {
    target: { value: "teste" },
  });
  fireEvent.change(screen.getByPlaceholderText("Informe o CPF do paciente"), {
    target: { value: "123.456.789-01" },
  });
  fireEvent.change(
    screen.getByPlaceholderText("Informe a data de nascimento"),
    { target: { value: "01/01/2020" } }
  );
  fireEvent.change(screen.getByPlaceholderText("Informe a telefone"), {
    target: { value: "(11)91234-5678" },
  });
  fireEvent.change(screen.getByPlaceholderText("Informe a email"), {
    target: { value: "teste@teste.com" },
  });

  const botaoSalvar = await waitFor(() =>
    screen.findByRole("button", { name: /Salvar/i })
  );
  fireEvent.click(botaoSalvar);
});

test("Manutenção do paciente - erro - cpf", async () => {
  estadoRegistrar = 400;
  mockRegistrar = { campo: 2 };

  renderWithProviders(
    <ParametrizacaoPacienteManutencao setTelaAtiva={() => {}} />
  );

  fireEvent.change(screen.getByPlaceholderText("Informe o nome do paciente"), {
    target: { value: "teste" },
  });
  fireEvent.change(screen.getByPlaceholderText("Informe o CPF do paciente"), {
    target: { value: "123.456.789-01" },
  });
  fireEvent.change(
    screen.getByPlaceholderText("Informe a data de nascimento"),
    { target: { value: "01/01/2020" } }
  );
  fireEvent.change(screen.getByPlaceholderText("Informe a telefone"), {
    target: { value: "(11)91234-5678" },
  });
  fireEvent.change(screen.getByPlaceholderText("Informe a email"), {
    target: { value: "teste@teste.com" },
  });

  const botaoSalvar = await waitFor(() =>
    screen.findByRole("button", { name: /Salvar/i })
  );
  fireEvent.click(botaoSalvar);
});

test("Manutenção do paciente - erro - data nascimento", async () => {
  estadoRegistrar = 400;
  mockRegistrar = { campo: 3 };

  renderWithProviders(
    <ParametrizacaoPacienteManutencao setTelaAtiva={() => {}} />
  );

  fireEvent.change(screen.getByPlaceholderText("Informe o nome do paciente"), {
    target: { value: "teste" },
  });
  fireEvent.change(screen.getByPlaceholderText("Informe o CPF do paciente"), {
    target: { value: "123.456.789-01" },
  });
  fireEvent.change(
    screen.getByPlaceholderText("Informe a data de nascimento"),
    { target: { value: "01/01/2020" } }
  );
  fireEvent.change(screen.getByPlaceholderText("Informe a telefone"), {
    target: { value: "(11)91234-5678" },
  });
  fireEvent.change(screen.getByPlaceholderText("Informe a email"), {
    target: { value: "teste@teste.com" },
  });

  const botaoSalvar = await waitFor(() =>
    screen.findByRole("button", { name: /Salvar/i })
  );
  fireEvent.click(botaoSalvar);
});

test("Manutenção do paciente - erro - telefone", async () => {
  estadoRegistrar = 400;
  mockRegistrar = { campo: 4 };

  renderWithProviders(
    <ParametrizacaoPacienteManutencao setTelaAtiva={() => {}} />
  );

  fireEvent.change(screen.getByPlaceholderText("Informe o nome do paciente"), {
    target: { value: "teste" },
  });
  fireEvent.change(screen.getByPlaceholderText("Informe o CPF do paciente"), {
    target: { value: "123.456.789-01" },
  });
  fireEvent.change(
    screen.getByPlaceholderText("Informe a data de nascimento"),
    { target: { value: "01/01/2020" } }
  );
  fireEvent.change(screen.getByPlaceholderText("Informe a telefone"), {
    target: { value: "(11)91234-5678" },
  });
  fireEvent.change(screen.getByPlaceholderText("Informe a email"), {
    target: { value: "teste@teste.com" },
  });

  const botaoSalvar = await waitFor(() =>
    screen.findByRole("button", { name: /Salvar/i })
  );
  fireEvent.click(botaoSalvar);
});

test("Manutenção do paciente - erro - email", async () => {
  estadoRegistrar = 400;
  mockRegistrar = { campo: 5 };

  renderWithProviders(
    <ParametrizacaoPacienteManutencao setTelaAtiva={() => {}} />
  );

  fireEvent.change(screen.getByPlaceholderText("Informe o nome do paciente"), {
    target: { value: "teste" },
  });
  fireEvent.change(screen.getByPlaceholderText("Informe o CPF do paciente"), {
    target: { value: "123.456.789-01" },
  });
  fireEvent.change(
    screen.getByPlaceholderText("Informe a data de nascimento"),
    { target: { value: "01/01/2020" } }
  );
  fireEvent.change(screen.getByPlaceholderText("Informe a telefone"), {
    target: { value: "(11)91234-5678" },
  });
  fireEvent.change(screen.getByPlaceholderText("Informe a email"), {
    target: { value: "teste@teste.com" },
  });

  const botaoSalvar = await waitFor(() =>
    screen.findByRole("button", { name: /Salvar/i })
  );
  fireEvent.click(botaoSalvar);
});
