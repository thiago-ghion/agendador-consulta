import axios from "axios";
import { URL_API } from "../util/Constantes";

const listarHorarios = async () => {
  const resposta = await axios.get(`${URL_API}/v1/horario/listar`);

  return resposta;
};

const ativarHorario = async (idHorario) => {
  const resposta = await axios.post(
    `${URL_API}/v1/horario/ativar/${idHorario}`
  );

  return resposta;
};

const desativarHorario = async (idHorario) => {
  const resposta = await axios.post(
    `${URL_API}/v1/horario/desativar/${idHorario}`
  );

  return resposta;
};

const registrarHorario = async (idHorario) => {
  const resposta = await axios.post(
    `${URL_API}/v1/horario/registrar/${idHorario}`
  );

  return resposta;
};

export { listarHorarios, ativarHorario, desativarHorario, registrarHorario };
