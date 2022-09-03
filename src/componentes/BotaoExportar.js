import React from "react";
import { Button } from "react-bootstrap";

const BotaoExportar = (props) => {
  const handleClick = () => {
    props.onExport();
  };
  return (
    <div>
      <Button variant="primary" onClick={handleClick}>
        Exportar para CSV
      </Button>
    </div>
  );
};

export default BotaoExportar;
