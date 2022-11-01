import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "react-bootstrap";
import ToolkitProvider, {
  Search,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min";
import BootstrapTable from "react-bootstrap-table-next";

import ParametrizacaoPacienteManutencao from "./ParametrizacaoPacienteManutencao";
import pagination from "../componentes/Pagination";
import BotaoExportar from "../componentes/BotaoExportar";
import { listarPacienteAction } from "../features/pacienteSlice";
import ParametrizacaoPacienteHistorico from "./ParametrizacaoPacienteHistorico";

function ParametrizacaoPaciente() {
  const dispatch = useDispatch();
  const { listaPaciente } = useSelector((state) => state.paciente);
  const [telaAtiva, setTelaAtiva] = useState(1);
  const [objetoAlteracao, setObjetoAlteracao] = useState({});
  const [objetoHistorico, setObjetoHistorico] = useState({});


  useEffect(() => {
    const acao = async () => {
      await dispatch(listarPacienteAction());
    };
    if (telaAtiva === 1) {
      acao();
    }
  }, [telaAtiva]);

  const { SearchBar } = Search;

  const nomeFormatter = (cell, row, rowIndex, formatExtraData) => {
    return (
      <Button
        variant="link"
        onClick={() => {
          setObjetoAlteracao(row);
          setTelaAtiva(3);
        }}
      >
        {row.nomePaciente}
      </Button>
    );
  };

  const acaoFormatter = (cell, row, rowIndex, formatExtraData) => {
    return (
      <Button
        variant="primary"
        onClick={() => {
          setObjetoHistorico(row);
          setTelaAtiva(4);
        }}
      >
        Histórico Consulta
      </Button>
    );
  };

  const colunas = [
    {
      dataField: "idPaciente",
      text: "#",
      sort: true,
      style: { cursor: "pointer" },
      headerStyle: () => {
        return { width: "80px" };
      },
      csvText: "Código",
    },
    {
      dataField: "nomePaciente",
      text: "Paciente",
      sort: true,
      style: { cursor: "pointer" },
      formatter: nomeFormatter
    },
    {
      dataField: "indicadorAtivo",
      text: "Ações",
      sort: false,
      style: { cursor: "pointer" },
      formatter: acaoFormatter,
      csvExport: false,
    },
  ];

  const defaultSorted = [
    {
      dataField: "idPaciente",
      order: "asc",
      style: { cursor: "pointer" },
    },
  ];

  const telaPrincipal = () => (
    <div>
      <br></br>
      <div className={["d-flex", "justify-content-end"].join(" ")}>
        <Button
          variant="success"
          onClick={() => {
            setTelaAtiva(2);
          }}
        >
          Incluir paciente
        </Button>
      </div>
      <br></br>
      <br></br>
      <div>
        <ToolkitProvider
          keyField="idPaciente"
          data={listaPaciente}
          columns={colunas}
          search
          exportCSV={{
            fileName: "pacientes.csv",
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

  switch (telaAtiva) {
    case 1:
      return telaPrincipal();
    case 2:
      return (
        <ParametrizacaoPacienteManutencao
          setTelaAtiva={setTelaAtiva}
        ></ParametrizacaoPacienteManutencao>
      );
    case 3:
      return (
        <ParametrizacaoPacienteManutencao
          setTelaAtiva={setTelaAtiva}
          modoAlteracao
          idPaciente={objetoAlteracao.idPaciente}
        ></ParametrizacaoPacienteManutencao>
      );
    case 4:
      return (
        <ParametrizacaoPacienteHistorico
          setTelaAtiva={setTelaAtiva}
          idPaciente={objetoHistorico.idPaciente}
        ></ParametrizacaoPacienteHistorico>
      );
    default:
      return <></>;
  }
}

export default ParametrizacaoPaciente;
