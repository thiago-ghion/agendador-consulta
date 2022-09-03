import paginationFactory from "react-bootstrap-table2-paginator";

export default paginationFactory({
  page: 1,
  sizePerPage: 10,
  lastPageText: ">>",
  firstPageText: "<<",
  nextPageText: ">",
  prePageText: "<",
  showTotal: true,
  paginationTotalRenderer: (from, to, size) => {
    return ` Exibindo registros ${from} até ${to} de ${size}`;
  },
  alwaysShowAllBtns: true,
});
