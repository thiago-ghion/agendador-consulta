import axios from "axios";
import { URL_API } from "../util/Constantes";

const registrarProfissional = async (requisicao) => {
  const resposta = await axios.post(
    `${URL_API}/v1/profissional/registrar`,
    requisicao
  );

  return resposta;
};

const alterarProfissional = async (idProfissional, requisicao) => {
  const resposta = await axios.post(
    `${URL_API}/v1/profissional/alterar/${idProfissional}`,
    requisicao
  );

  return resposta;
};

const ativarProfissional = async (idProfissional) => {
  const resposta = await axios.post(
    `${URL_API}/v1/profissional/ativar/${idProfissional}`
  );

  return resposta;
};

const desativarProfissional = async (idProfissional) => {
  const resposta = await axios.post(
    `${URL_API}/v1/profissional/desativar/${idProfissional}`
  );

  return resposta;
};

const listarVigente = async () => {
  const resposta = await axios.get(`${URL_API}/v1/profissional/listarVigente`);

  return resposta;
};

const listarTodos = async () => {
  const resposta = await axios.get(`${URL_API}/v1/profissional/listarTodos`);

  return resposta;
};

const listarDataDisponivel = async (idProfissional, dataInicio, dataFim) => {
  const resposta = await axios.get(
    `${URL_API}/v1/profissional/listarDataDisponivel?idProfissional=${idProfissional}&dataInicio=${dataInicio}&dataFim=${dataFim}`
  );

  return resposta;
};

const listarHorarioDisponivel = async (idProfissional, dataPesquisa) => {
  const resposta = await axios.get(
    `${URL_API}/v1/profissional/listarHorarioDisponivel?idProfissional=${idProfissional}&dataPesquisa=${dataPesquisa}`
  );

  return resposta;
};

const consultarVinculo = async (idProfissional, dataPesquisa) => {
  const resposta = await axios.get(
    `${URL_API}/v1/profissional/consultarVinculo?idProfissional=${idProfissional}&dataPesquisa=${dataPesquisa}`
  );

  return resposta;
};

const listarConfiguracaoHorario = async (idProfissional, dataPesquisa) => {
  const resposta = await axios.get(
    `${URL_API}/v1/profissional/listarConfiguracaoHorario?idProfissional=${idProfissional}&dataPesquisa=${dataPesquisa}`
  );

  return resposta;
};

const listarConfiguracaoHorarioPeriodo = async (
  idProfissional,
  dataInicio,
  dataFim
) => {
  const resposta = await axios.get(
    `${URL_API}/v1/profissional/listarConfiguracaoHorarioPeriodo?idProfissional=${idProfissional}&dataInicio=${dataInicio}&dataFim=${dataFim}`
  );

  return resposta;
};
export {
  registrarProfissional,
  alterarProfissional,
  ativarProfissional,
  desativarProfissional,
  listarVigente,
  listarTodos,
  listarDataDisponivel,
  listarHorarioDisponivel,
  consultarVinculo,
  listarConfiguracaoHorario,
  listarConfiguracaoHorarioPeriodo,
};
