import React, { useState, useRef, useEffect } from "react";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import DatePicker from "../componentes/DatePicker";
import {
  limparListaAcesso,
  listarRegistroAcessoAction,
} from "../features/loginSlice";

import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider, {
  Search,
} from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min";
import pagination from "../componentes/Pagination";
import BotaoExportar from "../componentes/BotaoExportar";

function ListarRegistroAcesso() {
  const dispatch = useDispatch();
  const { SearchBar } = Search;

  const { listaAcesso } = useSelector((state) => state.login);

  const [dataInicio, setDataInicio] = useState(null);
  const [dataFim, setDataFim] = useState(null);

  const isTelaCarregada = useRef(false);

  useEffect(() => {
    if (isTelaCarregada.current === false) {
      dispatch(limparListaAcesso());
    }
    isTelaCarregada.current = true;
  });

  const pesquisar = async () => {
    const resposta = await dispatch(
      listarRegistroAcessoAction({ dataInicio, dataFim })
    );
  };

  const colunas = [
    {
      dataField: "timestampAcesso",
      text: "Timestamp Acesso",
      sort: true,
      style: { cursor: "pointer" },
    },
    {
      dataField: "textoTipoAcesso",
      text: "Tipo Acesso",
      style: { cursor: "pointer" },
      sort: true,
    },
    {
      dataField: "credencialAcesso",
      text: "Credencial",
      style: { cursor: "pointer" },
      sort: true,
    },
  ];

  return (
    <div>
      <br></br>
      <Row>
        <Col>
          <DatePicker
            initialValue={null}
            value={dataInicio}
            onChange={(evento) => {
              setDataInicio(evento.format("DD/MM/YYYY"));
            }}
            test={{ "aria-label": "dataInicio" }}
          ></DatePicker>
        </Col>
        <Col>
          <DatePicker
            aria-label="dataFim"
            initialValue={null}
            value={dataFim}
            onChange={(evento) => {
              setDataFim(evento.format("DD/MM/YYYY"));
            }}
            test={{ "aria-label": "dataFim" }}
          ></DatePicker>
        </Col>
        <Col>
          <Button onClick={pesquisar}>Pesquisar</Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <div>
            <ToolkitProvider
              keyField="timestampAcesso"
              data={listaAcesso}
              columns={colunas}
              search
              exportCSV={{
                fileName: "acessos.csv",
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
                    keyField="idHorario"
                    striped={true}
                    hover={true}
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
        </Col>
      </Row>
    </div>
  );
}

export default ListarRegistroAcesso;
