import axios from "axios";
import { URL_API } from "../util/Constantes";

const listarUsuarios = async () => {
  const resposta = await axios.get(`${URL_API}/v1/usuario/listar`);

  return resposta;
};

const registrarUsuario = async (
  nomeUsuario,
  nomeColaborador,
  isUsuarioAdministrador,
  senha
) => {
  const requisicao = {
    nomeUsuario,
    nomeColaborador,
    isUsuarioAdministrador,
    senha,
  };
  const resposta = await axios.post(
    `${URL_API}/v1/usuario/registrar`,
    requisicao
  );

  return resposta;
};

const alterarUsuario = async (
  idUsuario,
  nomeColaborador,
  isUsuarioAtivo,
  isUsuarioAdministrador
) => {
  const requisicao = {
    idUsuario,
    nomeColaborador,
    isUsuarioAtivo,
    isUsuarioAdministrador,
  };
  const resposta = await axios.post(
    `${URL_API}/v1/usuario/alterar`,
    requisicao
  );

  return resposta;
};

const resetarSenha = async (idUsuario, senha) => {
  const requisicao = {
    idUsuario,
    senha,
  };
  const resposta = await axios.post(
    `${URL_API}/v1/usuario/resetarSenha`,
    requisicao
  );

  return resposta;
};

export { listarUsuarios, registrarUsuario, alterarUsuario, resetarSenha };
