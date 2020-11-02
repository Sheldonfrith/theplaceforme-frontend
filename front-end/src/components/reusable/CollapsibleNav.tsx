import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useRef,
} from "react";
import styled, { ThemeContext } from "styled-components";
import useOnClickOutside from "../../lib/Hooks/useOnClickOutside";
import { FilledButton, VerticalFlexBox, H4} from "../ReusableStyles";


const PositionContainer = styled.div`
  ${VerticalFlexBox};
  position: relative;
`;
const MenuButton = styled.button`
  ${FilledButton};
  background: ${(props) => props.theme.white};
  font-family: ${(props) => props.theme.fontFamHeader};
  color: ${(props) => props.theme.black};
  font-size: ${props=>props.theme.font4};
  :hover{
    color: ${props=>props.theme.red};
    background: ${props=>props.theme.white};
  }
  :active{
    color: ${props=>props.theme.black};
    background: ${props=>props.theme.white};
  }
`;
const MenuContainer = styled.div<{display: string}>`
  ${VerticalFlexBox};
  background: ${(props) => props.theme.white};
  display: ${props=>props.display};
  position: absolute;
  top: 0;
  z-index: 21;
  width: 20rem;
  box-shadow: 2px 7px 19px 1px ${props=>props.theme.black};
  
`;
const MenuItem = styled.div`
  ${H4};
  font-family: ${(props) => props.theme.fontFamHeader};
  color: ${(props) => props.theme.black};
  margin: 1rem;
  cursor: pointer;
  font-size: ${props=> props.theme.font3};
  :hover{
    color: ${props=>props.theme.red};
  }
`;

interface menuItem {
  text: string;
  onClick?: (...args: any) => any;
}
type menuItems = Array<menuItem>;
interface CollapsibleNavProps {
  menuItems: menuItems;
}

const CollapsibleNav: React.FunctionComponent<CollapsibleNavProps> = ({
  menuItems,
}) => {
  const ref = useRef(null);
  useOnClickOutside(ref, () => setIsOpen(false));
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const theme = useContext(ThemeContext);

  return (
    <PositionContainer>
      <MenuButton onClick={() => setIsOpen(true)}>Menu</MenuButton>
      <MenuContainer ref={ref} display={isOpen?'flex':'none'}>
        {menuItems ? (
          menuItems.map((item: menuItem, index: number) => {
            if (!item || !item.onClick) return <></>;
            return (
              <MenuItem
                key={"collapsibleNav" + index}
                onClick={() => {
                  setIsOpen(false);
                  item.onClick!();
                }}
              >
                {item.text.toUpperCase()}
              </MenuItem>
            );
          })
        ) : (
          <></>
        )}
      </MenuContainer>
    </PositionContainer>
  );
};
export default CollapsibleNav;
