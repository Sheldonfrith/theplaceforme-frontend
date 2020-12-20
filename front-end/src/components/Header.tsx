import React, {
  FunctionComponent,
  useContext,
  useCallback,
} from "react";
import styled from "styled-components";
import CollapsibleNav from "./reusable/CollapsibleNav";
import { GlobalContext } from "./containers/GlobalProvider";
import { auth } from "./App";
import { useAuthState } from "react-firebase-hooks/auth";
// import {StyledContext}from'./containers/StyledProvider';
import { ThemeContext } from "styled-components";
import { HorizontalFlexBox } from "../reusable-styles";
import {Navbar, NavDropdown}from 'react-bootstrap';

const Logo = styled.img`
  cursor: pointer;
  width: 2rem;
  margin: 1rem;
`;

interface HeaderProps {
  resetHandler?: any;
  textColor?: string;
}

const Header: FunctionComponent<HeaderProps> = ({
  resetHandler,
  textColor,
}) => {
  const gc = useContext(GlobalContext);
  const theme = useContext(ThemeContext);

  textColor = textColor || theme.black;

  const [user, loading, error] = useAuthState(auth());
  const getMenuItems = useCallback(() => {
    let menuItems = [
      {
        text: "View on GitHub",
        onClick: () =>
          window.open("https://github.com/Sheldonfrith/theplaceforme-frontend"),
      },
      { text: "Donate", onClick: () => window.open('https://www.patreon.com/sheldonfrith_web') },
      {
        text: "Methodology",
        onClick:()=> window.open('https://github.com/Sheldonfrith/theplaceforme-backend/wiki/Methodology'),
      },
    ]; // regardless of user logged in status, or the current page, always have these options in the menu

    //if the page is the Questionaire page...
    const questionDefaults = {
      text: "Set Question Defaults",
      onClick: () => gc.setCurrentPopup("changeDefaults"),
    };
    if (resetHandler && gc.currentPage === "questionaire") {
      const resetForm = {
        text: "Reset Questionaire",
        onClick: () => resetHandler(),
      };
      menuItems.splice(1, 0, resetForm);
    }
    if (gc.currentPage === "questionaire") {
      menuItems.splice(1, 0, questionDefaults);
    }

    //if the user is logged in or not logged in...
    const loginItem = {
      text: "Login",
      onClick: () => gc.setCurrentPopup("login"),
    };
    const accountItem = {
      text: "Account",
      onClick: () => gc.setCurrentPopup("account"),
    };
    if (user && !error && !loading) {
      //user logged in
      menuItems.splice(0, 0, accountItem);
    } else if (!user && !error && loading) {
      //user loading
      //keep default menu items
    } else if (!user && !loading && error) {
      //user error
      alert("error with the authentication: " + error);
      //add login item just in case
      menuItems.splice(0, 0, loginItem);
    } else {
      //no user
      menuItems.splice(0, 0, loginItem);
    }
    return menuItems.map(item=> <NavDropdown.Item eventKey={item.text} onClick={item.onClick}>{item.text}</NavDropdown.Item>);
  }, [user, error, loading, gc, resetHandler, gc.setCurrentPopup]);

  return (
    <Navbar  expand="md" bg="dark">
      <Navbar.Brand href="">
        <Logo src={'/images/logo.svg'} onClick={() => gc.setCurrentPage("welcome")}></Logo>
        ThePlaceFor.Me
      </Navbar.Brand>
      <Navbar.Text>
            <a href={'https://sheldonfrith.com'}>by Sheldon Frith</a>
      </Navbar.Text>
      {getMenuItems() ? <NavDropdown id="mainMenu" menuRole="menu" title="menu">{getMenuItems()}</NavDropdown> : <></>}
    </Navbar>
  );
};
export default Header;
