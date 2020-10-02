import React, { useState, useEffect, useContext, useCallback } from "react";
import DataInputPopup from "./DataInputPopup";
import DataInputFinalReview from "./DataInputFinalReview";
import DataInputInitial from "./DataInputInitial";
import { DataInputContext } from "./containers/DataInput";


//!FUNCTIONAL COMPONENT STARTS HERE
export default function DataInput(props) {
  const dataInputContext = useContext(DataInputContext);
  const showFinalReview = dataInputContext.showFinalReview;
  const showPopup = dataInputContext.showPopup;

  //ACTUAL JSX RETURNS HERE

  if (showFinalReview) {
    return (
      <DataInputFinalReview/>
    );
  }
  if (showPopup) {
    return (
      <DataInputPopup/>
    );
  } else {
    return (
      <DataInputInitial/>
    );
  }
}
