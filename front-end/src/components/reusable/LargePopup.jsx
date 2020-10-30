import React, { useState, useEffect, useContext, useCallback, useRef } from "react";
import styled from "styled-components";
import ClosePopupButton from "./ClosePopupButton";
import useOnClickOutside from '../../lib/Hooks/useOnClickOutside';

let DefaultContainer = styled.div`
  display: ${(props) => props.display};
  background-color: ${(props) => props.backgroundColor};
  z-index: 21;
  position: absolute;
  top: 1.5rem;
  bottom: 1rem;
  left: 1rem;
  right: 1rem;
  padding: 1.5rem;
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
  if (!ClosePopupButton) {
    throw new Error("ClosePopupButton required as prop, in LargePopup");
  }
  accentColor = accentColor ? accentColor : defaultAccentColor;
  lightColor = lightColor ? lightColor : defaultLightColor;
  darkColor = darkColor ? darkColor : defaultDarkColor;

  const ref = useRef(null);
  useOnClickOutside(ref, ()=>closePopup());

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
