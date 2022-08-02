import React from "react";
import { Button } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function ParametrizacaoPacienteHistorico(props) {
  return (
    <div>
      <br></br>
      <Row className="justify-content-md-end">
        <Col md={1}>
          <Button variant="primary" onClick={() => props.setTelaAtiva(1)}>
            Voltar
          </Button>
        </Col>
      </Row>
    </div>
  );
}

export default ParametrizacaoPacienteHistorico;
