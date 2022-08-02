import React, { useState, useEffect, useRef } from "react";
import { Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";

import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider, {
  Search,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min";

import pagination from "../componentes/Pagination";
import BotaoExportar from "../componentes/BotaoExportar";
import {
  listarTodosAction,
  ativarProfissionalAction,
  desativarProfissionalAction,
} from "../features/ProfissionalSlice";
import { listarHorarioAction } from "../features/horarioSlice";

import ParametrizacaoProfissionaInclusao from "./ParametrizacaoProfissionalInclusao";
import ListarHorarioProfissional from "./ListarHorarioProfissional";
import ParametrizacaoProfissionaAlteracao from "./ParametrizacaoProfissionalAlteracao";

function ParametrizacaoProfissional() {
  const dispatch = useDispatch();

  const { listaTodos, listaHorario } = useSelector(
    (state) => state.profissional
  );
  const { lista } = useSelector((state) => state.horario);
  const [objetoOriginal, setObjetoOriginal] = useState({});
  const [nomeProfissional, setNomeProfissional] = useState("");

  const [telaAtiva, setTelaAtiva] = useState(1);
  const telaAtivaAnterior = useRef(0);

  const isListaCarregada = useRef(false);
  let listaCopia = useRef([]);

  useEffect(() => {
    if (isListaCarregada.current === false) {
      const acao = async () => {
        await dispatch(listarHorarioAction());
        listaCopia.current = lista
          .filter((item) => item.indicadorAtivo === "S")
          .map((obj) => ({
            ...obj,
            data: "",
            estadoOriginal: false,
            estado: false,
          }));
      };
      acao();
      isListaCarregada.current = true;
    }
  });

  useEffect(() => {
    if (telaAtiva === 1 && telaAtivaAnterior.current !== 1) {
      const prepararListaProfissional = async () => {
        await dispatch(listarTodosAction());
      };
      prepararListaProfissional();
    }
    telaAtivaAnterior.current = telaAtiva;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [telaAtiva]);

  function nomeFormatter(cell, row, rowIndex, formatExtraData) {
    return (
      <Button
        variant="link"
        onClick={() => {
          setObjetoOriginal(row);
          setTelaAtiva(3);
        }}
      >
        {row.nomeProfissional}
      </Button>
    );
  }

  function acaoFormatter(cell, row, rowIndex, formatExtraData) {
    return (
      <div>
        <Button
          variant={row.indicadorAtivo === "S" ? "danger" : "success"}
          onClick={() => {
            if (row.indicadorAtivo === "S") {
              dispatch(
                desativarProfissionalAction({
                  idProfissional: row.idProfissional,
                })
              );
            } else {
              dispatch(
                ativarProfissionalAction({ idProfissional: row.idProfissional })
              );
            }
          }}
        >
          {row.indicadorAtivo === "S"
            ? "Desativar"
            : "\u00a0\u00a0\u00a0Ativar\u00a0\u00a0\u00a0"}
        </Button>
        <span> </span>
        <Button
          variant="primary"
          onClick={() => {
            setObjetoOriginal(row);
            setTelaAtiva(4);
          }}
        >
          Listar Horário
        </Button>
      </div>
    );
  }

  const colunas = [
    {
      dataField: "idProfissional",
      text: "#",
      sort: true,
      style: { cursor: "pointer" },
      headerStyle: () => {
        return { width: "80px" };
      },
    },
    {
      dataField: "nomeProfissional",
      text: "Profissional",
      sort: true,
      style: { cursor: "pointer" },
      formatter: nomeFormatter,
    },
    {
      dataField: "indicadorAtivo",
      text: "Ações",
      sort: false,
      style: { cursor: "pointer" },
      formatter: acaoFormatter,
    },
  ];

  const defaultSorted = [
    {
      dataField: "idProfissional",
      order: "asc",
      style: { cursor: "pointer" },
    },
  ];

  const { SearchBar } = Search;

  const renderTelaPrincipal = () => {
    return (
      <div>
        <br></br>
        <div className={["d-flex", "justify-content-end"].join(" ")}>
          <Button
            variant="success"
            onClick={() => {
              setNomeProfissional("");
              setTelaAtiva(2);
            }}
          >
            Incluir profissional
          </Button>
        </div>
        <br></br>
        <div>
          <ToolkitProvider
            keyField="idProfissional"
            data={listaTodos}
            columns={colunas}
            search
            exportCSV={{
              fileName: "profissionais.csv",
            }}
          >
            {(props) => (
              <div>
                <SearchBar
                  srText="Filtre os resultados"
                  placeholder="Informe o critério"
                  {...props.searchProps}
                />
                <br></br>
                <BootstrapTable
                  classes="react-bootstrap-table"
                  keyField="idProfissional"
                  striped={true}
                  hover={true}
                  defaultSorted={defaultSorted}
                  pagination={pagination}
                  {...props.baseProps}
                />
                <div className={["d-flex", "justify-content-end"].join(" ")}>
                  <BotaoExportar {...props.csvProps}></BotaoExportar>
                </div>
              </div>
            )}
          </ToolkitProvider>
        </div>
      </div>
    );
  };

  const renderTela = () => {
    switch (telaAtiva) {
      case 1:
        return renderTelaPrincipal();
      case 2:
        return (
          <ParametrizacaoProfissionaInclusao
            setTelaAtiva={setTelaAtiva}
            listaHorario={listaCopia.current}
          ></ParametrizacaoProfissionaInclusao>
        );
      case 3:
        return (
          <ParametrizacaoProfissionaAlteracao
            setTelaAtiva={setTelaAtiva}
            idProfissional={objetoOriginal.idProfissional}
            nomeProfissional={objetoOriginal.nomeProfissional}
            listaHorario={listaCopia.current}
          ></ParametrizacaoProfissionaAlteracao>
        );
      case 4:
        return (
          <ListarHorarioProfissional
            setTelaAtiva={setTelaAtiva}
            idProfissional={objetoOriginal.idProfissional}
            nomeProfissional={objetoOriginal.nomeProfissional}
          ></ListarHorarioProfissional>
        );
      default:
        return <div></div>;
    }
  };

  return renderTela();
}

export default ParametrizacaoProfissional;
