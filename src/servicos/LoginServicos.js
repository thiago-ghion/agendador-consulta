import axios from "axios";
import { URL_API } from "../util/Constantes";

const loginColaborador = async (usuario, senha) => {
  const requisicao = {
    usuario,
    senha,
  };

  const resposta = await axios.post(
    `${URL_API}/v1/seguranca/loginColaborador`,
    requisicao
  );

  return resposta;
};

const loginPacienteInterno = async (usuario, senha) => {
  const requisicao = {
    usuario,
    senha,
  };

  const resposta = await axios.post(
    `${URL_API}/v1/seguranca/loginPacienteInterno`,
    requisicao
  );

  return resposta;
};

const loginPacienteGoogle = async (credential) => {
  const requisicao = {
    credential,
  };

  const resposta = await axios.post(
    `${URL_API}/v1/seguranca/oauth/google`,
    requisicao
  );

  return resposta;
};

const loginPacienteFacebook = async (credential) => {
  const requisicao = {
    credential,
  };

  const resposta = await axios.post(
    `${URL_API}/v1/seguranca/oauth/facebook`,
    requisicao
  );

  return resposta;
};

const trocarSenhaColaborador = async (usuario, senhaAnterior, senhaNova) => {
  const requisicao = {
    usuario,
    senhaAnterior,
    senhaNova,
  };

  const resposta = await axios.post(
    `${URL_API}/v1/seguranca/trocarSenhaColaborador`,
    requisicao
  );

  return resposta;
};

const trocarSenhaPaciente = async (email, senhaAnterior, senhaNova) => {
  const requisicao = {
    email,
    senhaAnterior,
    senhaNova,
  };

  const resposta = await axios.post(
    `${URL_API}/v1/seguranca/trocarSenhaPaciente`,
    requisicao
  );

  return resposta;
};

const introspectToken = async (token) => {
  const resposta = await axios.post(
    `${URL_API}/v1/seguranca/token/introspect/${token}`
  );

  return resposta;
};

const listarRegistroAcesso = async (dataInicio, dataFim) => {
  const resposta = await axios.get(
    `${URL_API}/v1/seguranca/listaAcesso?dataInicio=${dataInicio}&dataFim=${dataFim}`
  );

  return resposta;
};

export {
  loginColaborador,
  loginPacienteInterno,
  trocarSenhaColaborador,
  trocarSenhaPaciente,
  introspectToken,
  listarRegistroAcesso,
  loginPacienteGoogle,
  loginPacienteFacebook,
};
