import React from "react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { renderWithProviders } from "../util/test-utils";
import { fireEvent, screen, waitFor, within } from "@testing-library/react";

import ParametrizacaoUsuario from "./ParametrizacaoUsuario";

let mockListaUsuario = [];
let mockRespostaRegistro = {};
let estadoRegistro = 201;
let mockRespostaAlteracao = {};
let estadoAlteracao = 200;
let estadoReset = 200;
let mockRespostaReset = {};

export const handlers = [
  rest.get("http://localhost:5000/v1/usuario/listar", (req, res, ctx) => {
    return res(ctx.json(mockListaUsuario));
  }),
  rest.post("http://localhost:5000/v1/usuario/registrar", (req, res, ctx) => {
    return res(ctx.status(estadoRegistro), ctx.json(mockRespostaRegistro));
  }),
  rest.post("http://localhost:5000/v1/usuario/alterar", (req, res, ctx) => {
    return res(ctx.status(estadoAlteracao), ctx.json(mockRespostaAlteracao));
  }),
  rest.post(
    "http://localhost:5000/v1/usuario/resetarSenha",
    (req, res, ctx) => {
      return res(ctx.status(estadoReset), ctx.json(mockRespostaReset));
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
  mockListaUsuario = [];
  mockRespostaRegistro = {};
  estadoRegistro = 201;
  mockRespostaAlteracao = {};
  estadoAlteracao = 200;
  estadoReset = 200;
  mockRespostaReset = {};
});

test("Renderização componente", async () => {
  expect(<ParametrizacaoUsuario />).toMatchSnapshot();
});

test("Lista Vazia", async () => {
  renderWithProviders(<ParametrizacaoUsuario />);

  let tabela;
  screen.queryAllByRole("table").map((item) => {
    if (item.classList.contains("react-bootstrap-table")) {
      tabela = item;
    }
  });

  const linhas = within(tabela)
    .queryAllByRole("row")
    .map((item) => item);

  expect(linhas.length).toBe(1);
});

test("Lista com conteúdo", async () => {
  mockListaUsuario = [
    {
      idUsuario: 1,
      nomeUsuario: "catarina349",
    },
    {
      idUsuario: 2,
      nomeUsuario: "luiz374",
    },
  ];

  renderWithProviders(<ParametrizacaoUsuario />);

  await waitFor(() => {
    let tabela;
    screen.queryAllByRole("table").map((item) => {
      if (item.classList.contains("react-bootstrap-table")) {
        tabela = item;
      }
    });

    const linhas = within(tabela)
      .queryAllByRole("row")
      .map((item) => item);

    expect(linhas.length).toBe(3);
  });
});

test("Incluir usuário - cancelar processo", async () => {
  mockListaUsuario = [
    {
      idUsuario: 1,
      nomeUsuario: "catarina349",
    },
    {
      idUsuario: 2,
      nomeUsuario: "luiz374",
    },
  ];

  renderWithProviders(<ParametrizacaoUsuario />);

  fireEvent.click(screen.getByText("Incluir usuário"));

  await waitFor(() => {
    fireEvent.change(screen.getByPlaceholderText("Informe o usuário"), {
      target: { value: "teste" },
    });

    fireEvent.change(
      screen.getByPlaceholderText("Informe o nome do colaborador"),
      {
        target: { value: "nome do colaborador" },
      }
    );

    fireEvent.click(screen.getByRole("checkbox"));

    fireEvent.click(screen.getByRole("button", { name: /Cancelar/i }));
  });
});

test("Incluir usuário - salvar processo", async () => {
  mockListaUsuario = [
    {
      idUsuario: 1,
      nomeUsuario: "catarina349",
    },
    {
      idUsuario: 2,
      nomeUsuario: "luiz374",
    },
  ];

  renderWithProviders(<ParametrizacaoUsuario />);

  fireEvent.click(screen.getByText("Incluir usuário"));

  await waitFor(() => {
    fireEvent.change(screen.getByPlaceholderText("Informe o usuário"), {
      target: { value: "teste" },
    });

    fireEvent.change(
      screen.getByPlaceholderText("Informe o nome do colaborador"),
      {
        target: { value: "nome do colaborador" },
      }
    );

    fireEvent.click(screen.getByRole("checkbox"));

    fireEvent.click(screen.getByRole("button", { name: /Salvar/i }));
  });
});

test("Incluir usuário - salvar processo - erro usuário não informado", async () => {
  mockListaUsuario = [
    {
      idUsuario: 1,
      nomeUsuario: "catarina349",
    },
    {
      idUsuario: 2,
      nomeUsuario: "luiz374",
    },
  ];
  estadoRegistro = 400;
  mockRespostaRegistro = { campo: 1 };

  renderWithProviders(<ParametrizacaoUsuario />);

  fireEvent.click(screen.getByText("Incluir usuário"));

  await waitFor(() => {
    fireEvent.click(screen.getByRole("button", { name: /Salvar/i }));
  });
});

test("Incluir usuário - salvar processo - erro nome do colaborador não informado", async () => {
  mockListaUsuario = [
    {
      idUsuario: 1,
      nomeUsuario: "catarina349",
    },
    {
      idUsuario: 2,
      nomeUsuario: "luiz374",
    },
  ];
  estadoRegistro = 400;
  mockRespostaRegistro = { campo: 2 };

  renderWithProviders(<ParametrizacaoUsuario />);

  fireEvent.click(screen.getByText("Incluir usuário"));

  await waitFor(() => {
    fireEvent.click(screen.getByRole("button", { name: /Salvar/i }));
  });
});

test("Incluir usuário - salvar processo - erro senha do colaborador não informado", async () => {
  mockListaUsuario = [
    {
      idUsuario: 1,
      nomeUsuario: "catarina349",
    },
    {
      idUsuario: 2,
      nomeUsuario: "luiz374",
    },
  ];
  estadoRegistro = 400;
  mockRespostaRegistro = { campo: 3 };

  renderWithProviders(<ParametrizacaoUsuario />);

  fireEvent.click(screen.getByText("Incluir usuário"));

  await waitFor(() => {
    fireEvent.click(screen.getByRole("button", { name: /Salvar/i }));
  });
});

test("Alterar usuário - cancelar processo", async () => {
  mockListaUsuario = [
    {
      idUsuario: 1,
      nomeUsuario: "catarina349",
      indicadorAdministrador: "S",
      indicadorAtivo: "S",
    },
    {
      idUsuario: 2,
      nomeUsuario: "luiz374",
      indicadorAdministrador: "N",
      indicadorAtivo: "S",
    },
    {
      idUsuario: 3,
      nomeUsuario: "luiz375",
      indicadorAdministrador: "S",
      indicadorAtivo: "N",
    },
    {
      idUsuario: 4,
      nomeUsuario: "luiz376",
      indicadorAdministrador: "N",
      indicadorAtivo: "N",
    },
  ];

  renderWithProviders(<ParametrizacaoUsuario />);

  await waitFor(() => {
    fireEvent.click(screen.getByRole("button", { name: /catarina349/i }));
  });

  await waitFor(() => {
    fireEvent.change(
      screen.getByPlaceholderText("Informe o nome do colaborador"),
      { target: { value: "maria da silva" } }
    );
    fireEvent.click(screen.getAllByRole("checkbox")[0]);
    fireEvent.click(screen.getAllByRole("checkbox")[1]);

    fireEvent.click(screen.getByRole("button", { name: /Cancelar/i }));
  });
});

test("Alterar usuário - salvar processo", async () => {
  mockListaUsuario = [
    {
      idUsuario: 1,
      nomeUsuario: "catarina349",
      indicadorAdministrador: "S",
      indicadorAtivo: "S",
    },
    {
      idUsuario: 2,
      nomeUsuario: "luiz374",
      indicadorAdministrador: "N",
      indicadorAtivo: "S",
    },
    {
      idUsuario: 3,
      nomeUsuario: "luiz375",
      indicadorAdministrador: "S",
      indicadorAtivo: "N",
    },
    {
      idUsuario: 4,
      nomeUsuario: "luiz376",
      indicadorAdministrador: "N",
      indicadorAtivo: "N",
    },
  ];

  renderWithProviders(<ParametrizacaoUsuario />);

  await waitFor(() => {
    fireEvent.click(screen.getByRole("button", { name: /catarina349/i }));
  });

  await waitFor(() => {
    fireEvent.change(
      screen.getByPlaceholderText("Informe o nome do colaborador"),
      { target: { value: "maria da silva" } }
    );
    fireEvent.click(screen.getAllByRole("checkbox")[0]);
    fireEvent.click(screen.getAllByRole("checkbox")[1]);

    fireEvent.click(screen.getByRole("button", { name: /Salvar/i }));
  });
});

test("Alterar usuário - salvar processo - erro usuário", async () => {
  mockListaUsuario = [
    {
      idUsuario: 1,
      nomeUsuario: "catarina349",
      indicadorAdministrador: "S",
      indicadorAtivo: "S",
    },
    {
      idUsuario: 2,
      nomeUsuario: "luiz374",
      indicadorAdministrador: "N",
      indicadorAtivo: "S",
    },
    {
      idUsuario: 3,
      nomeUsuario: "luiz375",
      indicadorAdministrador: "S",
      indicadorAtivo: "N",
    },
    {
      idUsuario: 4,
      nomeUsuario: "luiz376",
      indicadorAdministrador: "N",
      indicadorAtivo: "N",
    },
  ];

  estadoAlteracao = 400;
  mockRespostaAlteracao = { campo: 1 };

  renderWithProviders(<ParametrizacaoUsuario />);

  await waitFor(() => {
    fireEvent.click(screen.getByRole("button", { name: /catarina349/i }));
  });

  await waitFor(() => {
    fireEvent.change(
      screen.getByPlaceholderText("Informe o nome do colaborador"),
      { target: { value: "maria da silva" } }
    );
    fireEvent.click(screen.getAllByRole("checkbox")[0]);
    fireEvent.click(screen.getAllByRole("checkbox")[1]);

    fireEvent.click(screen.getByRole("button", { name: /Salvar/i }));
  });
});

test("Alterar usuário - salvar processo - erro nome", async () => {
  mockListaUsuario = [
    {
      idUsuario: 1,
      nomeUsuario: "catarina349",
      indicadorAdministrador: "S",
      indicadorAtivo: "S",
    },
    {
      idUsuario: 2,
      nomeUsuario: "luiz374",
      indicadorAdministrador: "N",
      indicadorAtivo: "S",
    },
    {
      idUsuario: 3,
      nomeUsuario: "luiz375",
      indicadorAdministrador: "S",
      indicadorAtivo: "N",
    },
    {
      idUsuario: 4,
      nomeUsuario: "luiz376",
      indicadorAdministrador: "N",
      indicadorAtivo: "N",
    },
  ];

  estadoAlteracao = 400;
  mockRespostaAlteracao = { campo: 2 };

  renderWithProviders(<ParametrizacaoUsuario />);

  await waitFor(() => {
    fireEvent.click(screen.getByRole("button", { name: /catarina349/i }));
  });

  await waitFor(() => {
    fireEvent.change(
      screen.getByPlaceholderText("Informe o nome do colaborador"),
      { target: { value: "maria da silva" } }
    );
    fireEvent.click(screen.getAllByRole("checkbox")[0]);
    fireEvent.click(screen.getAllByRole("checkbox")[1]);

    fireEvent.click(screen.getByRole("button", { name: /Salvar/i }));
  });
});

test("Alterar usuário - salvar processo - erro senha", async () => {
  mockListaUsuario = [
    {
      idUsuario: 1,
      nomeUsuario: "catarina349",
      indicadorAdministrador: "S",
      indicadorAtivo: "S",
    },
    {
      idUsuario: 2,
      nomeUsuario: "luiz374",
      indicadorAdministrador: "N",
      indicadorAtivo: "S",
    },
    {
      idUsuario: 3,
      nomeUsuario: "luiz375",
      indicadorAdministrador: "S",
      indicadorAtivo: "N",
    },
    {
      idUsuario: 4,
      nomeUsuario: "luiz376",
      indicadorAdministrador: "N",
      indicadorAtivo: "N",
    },
  ];

  estadoAlteracao = 400;
  mockRespostaAlteracao = { campo: 3 };

  renderWithProviders(<ParametrizacaoUsuario />);

  await waitFor(() => {
    fireEvent.click(screen.getByRole("button", { name: /catarina349/i }));
  });

  await waitFor(() => {
    fireEvent.change(
      screen.getByPlaceholderText("Informe o nome do colaborador"),
      { target: { value: "maria da silva" } }
    );
    fireEvent.click(screen.getAllByRole("checkbox")[0]);
    fireEvent.click(screen.getAllByRole("checkbox")[1]);

    fireEvent.click(screen.getByRole("button", { name: /Salvar/i }));
  });
});

test("Alterar usuário - resetar senha - cancelar o processo", async () => {
  mockListaUsuario = [
    {
      idUsuario: 2,
      nomeUsuario: "catarina349",
      indicadorAdministrador: "S",
      indicadorAtivo: "S",
    },
    {
      idUsuario: 3,
      nomeUsuario: "luiz374",
      indicadorAdministrador: "N",
      indicadorAtivo: "S",
    },
    {
      idUsuario: 4,
      nomeUsuario: "luiz375",
      indicadorAdministrador: "S",
      indicadorAtivo: "N",
    },
    {
      idUsuario: 5,
      nomeUsuario: "luiz376",
      indicadorAdministrador: "N",
      indicadorAtivo: "N",
    },
  ];

  estadoReset = 400;

  renderWithProviders(<ParametrizacaoUsuario />);

  await waitFor(() => {
    fireEvent.click(screen.getByRole("button", { name: /catarina349/i }));
  });

  await waitFor(() => {
    fireEvent.change(
      screen.getByPlaceholderText("Informe o nome do colaborador"),
      { target: { value: "maria da silva" } }
    );
    fireEvent.click(screen.getAllByRole("checkbox")[0]);
    fireEvent.click(screen.getAllByRole("checkbox")[1]);

    fireEvent.click(screen.getByRole("button", { name: /Resetar Senha/i }));
  });

  await waitFor(() => {
    fireEvent.change(screen.getByPlaceholderText("Informe a senha inicial"), {
      target: { value: "12345678" },
    });
    fireEvent.change(screen.getByPlaceholderText("Repita a senha"), {
      target: { value: "12345678" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Cancelar/i }));
  });
});

test("Alterar usuário - resetar senha - salvar o processo", async () => {
  mockListaUsuario = [
    {
      idUsuario: 2,
      nomeUsuario: "catarina349",
      indicadorAdministrador: "S",
      indicadorAtivo: "S",
    },
    {
      idUsuario: 3,
      nomeUsuario: "luiz374",
      indicadorAdministrador: "N",
      indicadorAtivo: "S",
    },
    {
      idUsuario: 4,
      nomeUsuario: "luiz375",
      indicadorAdministrador: "S",
      indicadorAtivo: "N",
    },
    {
      idUsuario: 5,
      nomeUsuario: "luiz376",
      indicadorAdministrador: "N",
      indicadorAtivo: "N",
    },
  ];

  estadoAlteracao = 400;
  mockRespostaAlteracao = { campo: 3 };

  renderWithProviders(<ParametrizacaoUsuario />);

  await waitFor(() => {
    fireEvent.click(screen.getByRole("button", { name: /catarina349/i }));
  });

  await waitFor(() => {
    fireEvent.change(
      screen.getByPlaceholderText("Informe o nome do colaborador"),
      { target: { value: "maria da silva" } }
    );
    fireEvent.click(screen.getAllByRole("checkbox")[0]);
    fireEvent.click(screen.getAllByRole("checkbox")[1]);

    fireEvent.click(screen.getByRole("button", { name: /Resetar Senha/i }));
  });

  await waitFor(() => {
    fireEvent.change(screen.getByPlaceholderText("Informe a senha inicial"), {
      target: { value: "12345678" },
    });
    fireEvent.change(screen.getByPlaceholderText("Repita a senha"), {
      target: { value: "12345678" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Salvar/i }));
  });
});

test("Alterar usuário - resetar senha - salvar o processo - senha divergente", async () => {
  mockListaUsuario = [
    {
      idUsuario: 2,
      nomeUsuario: "catarina349",
      indicadorAdministrador: "S",
      indicadorAtivo: "S",
    },
    {
      idUsuario: 3,
      nomeUsuario: "luiz374",
      indicadorAdministrador: "N",
      indicadorAtivo: "S",
    },
    {
      idUsuario: 4,
      nomeUsuario: "luiz375",
      indicadorAdministrador: "S",
      indicadorAtivo: "N",
    },
    {
      idUsuario: 5,
      nomeUsuario: "luiz376",
      indicadorAdministrador: "N",
      indicadorAtivo: "N",
    },
  ];

  estadoAlteracao = 400;
  mockRespostaAlteracao = { campo: 3 };

  renderWithProviders(<ParametrizacaoUsuario />);

  await waitFor(() => {
    fireEvent.click(screen.getByRole("button", { name: /catarina349/i }));
  });

  await waitFor(() => {
    fireEvent.change(
      screen.getByPlaceholderText("Informe o nome do colaborador"),
      { target: { value: "maria da silva" } }
    );
    fireEvent.click(screen.getAllByRole("checkbox")[0]);
    fireEvent.click(screen.getAllByRole("checkbox")[1]);

    fireEvent.click(screen.getByRole("button", { name: /Resetar Senha/i }));
  });

  await waitFor(() => {
    fireEvent.change(screen.getByPlaceholderText("Informe a senha inicial"), {
      target: { value: "12345678" },
    });
    fireEvent.change(screen.getByPlaceholderText("Repita a senha"), {
      target: { value: "87654321" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Salvar/i }));
  });
});

test("Alterar usuário - resetar senha - falha", async () => {
  mockListaUsuario = [
    {
      idUsuario: 2,
      nomeUsuario: "catarina349",
      indicadorAdministrador: "S",
      indicadorAtivo: "S",
    },
    {
      idUsuario: 3,
      nomeUsuario: "luiz374",
      indicadorAdministrador: "N",
      indicadorAtivo: "S",
    },
    {
      idUsuario: 4,
      nomeUsuario: "luiz375",
      indicadorAdministrador: "S",
      indicadorAtivo: "N",
    },
    {
      idUsuario: 5,
      nomeUsuario: "luiz376",
      indicadorAdministrador: "N",
      indicadorAtivo: "N",
    },
  ];

  estadoReset = 400;
  mockRespostaAlteracao = { campo: 3 };

  renderWithProviders(<ParametrizacaoUsuario />);

  await waitFor(() => {
    fireEvent.click(screen.getByRole("button", { name: /catarina349/i }));
  });

  await waitFor(() => {
    fireEvent.change(
      screen.getByPlaceholderText("Informe o nome do colaborador"),
      { target: { value: "maria da silva" } }
    );
    fireEvent.click(screen.getAllByRole("checkbox")[0]);
    fireEvent.click(screen.getAllByRole("checkbox")[1]);

    fireEvent.click(screen.getByRole("button", { name: /Resetar Senha/i }));
  });

  await waitFor(() => {
    fireEvent.change(screen.getByPlaceholderText("Informe a senha inicial"), {
      target: { value: "12345678" },
    });
    fireEvent.change(screen.getByPlaceholderText("Repita a senha"), {
      target: { value: "12345678" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Salvar/i }));
  });
});
