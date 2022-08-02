import React from "react";
import Datetime from "react-datetime";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";

import "moment/locale/pt";

import "react-datetime/css/react-datetime.css";

const DatePicker = (props) => {
  const renderInput = (props, openCalendar) => {
    return (
      <div>
        <InputGroup className="mb-3">
          <Form.Control id="inputDatePicker" {...props} />
          <Button variant="secondary" onClick={openCalendar}>
            <FontAwesomeIcon icon={faCalendar} />
          </Button>
        </InputGroup>
      </div>
    );
  };

  return (
    <Datetime
      timeFormat={false}
      initialValue={new Date()}
      dateFormat="DD/MM/YYYY"
      closeOnSelect={true}
      inputProps={{
        placeholder: "Informe a data",
        readOnly: true,
      }}
      ref={(input) => {
        if (input !== undefined && props.setRef !== undefined) {
          props.setRef(input);
        }
      }}
      renderInput={renderInput}
      {...props}
    ></Datetime>
  );
};

export default DatePicker;
