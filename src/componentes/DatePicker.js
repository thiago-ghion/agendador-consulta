import React from "react";
import Datetime from "react-datetime";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";

import "moment/locale/pt";

import "react-datetime/css/react-datetime.css";

const DatePicker = (props) => {
  const renderInput = (propsInput, openCalendar) => {
    let test = {};
    if (props.test !== undefined) {
      test = props.test;
    }
    return (
      <div>
        <InputGroup className="mb-3">
          <Form.Control id="inputDatePicker" {...propsInput} {...test} />
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
      onChange={(event) => {
        if (props.onChange !== undefined) {
          if (typeof event === "string") {
            props.onChange(moment(event, "DD.MM.YYYY"));
          } else {
            props.onChange(event);
          }
        }
      }}
    ></Datetime>
  );
};

export default DatePicker;
