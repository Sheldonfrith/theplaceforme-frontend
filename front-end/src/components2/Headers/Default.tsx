import React, {
    FunctionComponent,
    useContext,
    useCallback,
    MouseEvent
} from "react";
import styled from "styled-components";
import { Nav, Navbar, NavDropdown } from 'react-bootstrap';
import {ViewObjectProps}from '../Layout';

const Logo = styled.img`
    cursor: pointer;
    width: 2rem;
    margin: 1rem;
  `;


export interface DefaultHeaderProps {
    menuItems: ViewObjectProps[],
    logo: ViewObjectProps,
    title: ViewObjectProps,
    subtitle: ViewObjectProps,
}

const DefaultHeader: FunctionComponent<DefaultHeaderProps> = ({
    menuItems,
    logo,
    title,
    subtitle,
}) => {

    return (
        <Navbar expand="md" bg="dark">
            <Navbar.Brand onClick={title.onClick} >
                <Logo src={logo.text} onClick={logo.onClick}></Logo>
                {title.text}
            </Navbar.Brand>
            <Navbar.Text>
                <div onClick={subtitle.onClick}>{subtitle.text}</div>
            </Navbar.Text>
            < NavDropdown id="mainMenu" title="Menu" >
                {
                    menuItems.map((item: ViewObjectProps) => {
                        return <NavDropdown.Item key={item.id} eventKey={item.text} onClick={item.onClick} > {item.text} </NavDropdown.Item>;
                    })
                }
            </NavDropdown>
        </Navbar>
    );
};
export default DefaultHeader;
