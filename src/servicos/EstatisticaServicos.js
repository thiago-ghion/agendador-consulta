import axios from "axios";
import { URL_API } from "../util/Constantes";

const listarHorariosMaisUtilizados = async (dataInicio, dataFim) => {
  const resposta = await axios.get(
    `${URL_API}/v1/estatistica/listarHorariosMaisUtilizados?dataInicio=${dataInicio}&dataFim=${dataFim}`
  );

  return resposta;
};

const listarConsultasDiasSemana = async (dataInicio, dataFim) => {
  const resposta = await axios.get(
    `${URL_API}/v1/estatistica/listarConsultasDiasSemana?dataInicio=${dataInicio}&dataFim=${dataFim}`
  );

  return resposta;
};

const listarProfissionaisMaisConsultas = async (dataInicio, dataFim) => {
  const resposta = await axios.get(
    `${URL_API}/v1/estatistica/listarProfissionaisMaisConsultas?dataInicio=${dataInicio}&dataFim=${dataFim}`
  );

  return resposta;
};

const listarConsultasAtivasVersusCanceladas = async (dataInicio, dataFim) => {
  const resposta = await axios.get(
    `${URL_API}/v1/estatistica/listarConsultasAtivasVersusCanceladas?dataInicio=${dataInicio}&dataFim=${dataFim}`
  );

  return resposta;
};

const listarLoginProprioVersusOauth = async (dataInicio, dataFim) => {
  const resposta = await axios.get(
    `${URL_API}/v1/estatistica/listarLoginProprioVersusOauth?dataInicio=${dataInicio}&dataFim=${dataFim}`
  );

  return resposta;
};

export {
  listarHorariosMaisUtilizados,
  listarConsultasDiasSemana,
  listarProfissionaisMaisConsultas,
  listarConsultasAtivasVersusCanceladas,
  listarLoginProprioVersusOauth,
};
