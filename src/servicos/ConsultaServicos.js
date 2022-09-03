import axios from "axios";
import { URL_API } from "../util/Constantes";

const agendar = async (idPaciente, idProfissional, dataConsulta, idHorario) => {
  const requisicao = {
    idPaciente,
    idProfissional,
    dataConsulta,
    idHorario,
  };
  const resposta = await axios.post(
    `${URL_API}/v1/consulta/agendar`,
    requisicao
  );

  return resposta;
};

const listarConsultaTodasProfissional = async (
  idProfissional,
  dataInicio,
  dataFim
) => {
  const resposta = await axios.get(
    `${URL_API}/v1/consulta/listarConsultaTodasProfissional?idProfissional=${idProfissional}&dataInicio=${dataInicio}&dataFim=${dataFim}`
  );

  return resposta;
};

const cancelar = async (
  idPaciente,
  idProfissional,
  dataConsulta,
  idHorario
) => {
  const requisicao = {
    idPaciente,
    idProfissional,
    dataConsulta,
    idHorario,
  };
  const resposta = await axios.post(
    `${URL_API}/v1/consulta/cancelar`,
    requisicao
  );

  return resposta;
};

export { agendar, listarConsultaTodasProfissional, cancelar };
