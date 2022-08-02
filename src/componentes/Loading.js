import React from "react";
import { useSelector } from "react-redux";

function Loading(props) {
  const { isLoading } = useSelector((state) => state.loading);

  return (
    <div>
      {isLoading ? (
        <div className="loader-container">
          <div className="spinner"> </div>
        </div>
      ) : null}
      <div> {props.children} </div>
    </div>
  );
}

export default Loading;
