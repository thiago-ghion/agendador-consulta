import axios from "axios";
import { URL_API } from "../util/Constantes";

const registrarPaciente = async (requisicao) => {
  const resposta = await axios.post(
    `${URL_API}/v1/paciente/registrar`,
    requisicao
  );

  return resposta;
};

const cadastrarPaciente = async (requisicao) => {
  const resposta = await axios.post(
    `${URL_API}/v1/paciente/cadastrar`,
    requisicao
  );

  return resposta;
};

const alterarPaciente = async (idPaciente, requisicao) => {
  const resposta = await axios.post(
    `${URL_API}/v1/paciente/alterar/${idPaciente}`,
    requisicao
  );

  return resposta;
};

const listarPaciente = async () => {
  const resposta = await axios.get(`${URL_API}/v1/paciente/listar`);

  return resposta;
};

const listarParcialPaciente = async (nomeParcial) => {
  const resposta = await axios.get(
    `${URL_API}/v1/paciente/listarParcial?nomeParcial=${nomeParcial}`
  );

  return resposta;
};

const consultarPaciente = async (idPaciente) => {
  const resposta = await axios.get(
    `${URL_API}/v1/paciente/consultar?idPaciente=${idPaciente}`
  );

  return resposta;
};

export {
  registrarPaciente,
  cadastrarPaciente,
  listarPaciente,
  listarParcialPaciente,
  consultarPaciente,
  alterarPaciente,
};
