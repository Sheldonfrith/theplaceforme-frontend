import React, { useState, useEffect, useContext, useCallback, useRef } from "react";
import styled, {ThemeContext} from "styled-components";
import ClosePopupButton from "./ClosePopupButton";
import { useConditionalEffect, useOnClickOutside } from "../../hooks";
let DefaultContainer = styled.div`
  display: ${(props) => props.display};
  background-color: ${(props) => props.backgroundColor};
  z-index: 21;
  position: absolute;
  top: 1.5rem;
  bottom: 1rem;
  left: 1rem;
  right: 1rem;
  padding: 1rem;
  box-shadow: 2px 4px 5px 1px rgb(0,0,0,0.8);
  border-radius: 0.2rem;
`;

const defaultAccentColor = "orange";
const defaultLightColor = "white";
const defaultDarkColor = "black";

export default function LargePopup({
  children,
  containerDisplay,
  closePopup,
  accentColor,
  lightColor,
  darkColor,
  closeButtonBackgroundColor,
  closeButtonColor,
  containerStyle,
}) {
  const ref = useRef(null);
  useOnClickOutside(ref, ()=>closePopup());
  const theme = useContext(ThemeContext);

    if (!ClosePopupButton) {
      throw new Error("ClosePopupButton required as prop, in LargePopup");
    }
    accentColor = accentColor ? accentColor : theme.red;
    lightColor = lightColor ? lightColor : theme.white;
    darkColor = darkColor ? darkColor : theme.black;  
 
  

  return (
    <DefaultContainer
      backgroundColor={darkColor}
      display={containerDisplay}
      style={containerStyle?containerStyle:{}}
      ref={ref}
    >
      {children}
      <ClosePopupButton
        onClick={closePopup}
        backgroundColor={
          closeButtonBackgroundColor ? closeButtonBackgroundColor : accentColor
        }
        color={closeButtonColor ? closeButtonColor : lightColor}
      />
    </DefaultContainer>
  );
}
