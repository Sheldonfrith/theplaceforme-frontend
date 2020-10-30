import styled, { css } from 'styled-components';
  
  //reusable styled components
  export const VerticalFlexBox = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  `;
  
  export const HorizontalFlexBox = css`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  `;
  
  export const TransparentButton = css`
    border-radius: 0.5rem;
    background: rgb(0,0,0,0.2);
    color: ${props=>props.theme.white};
    border-color:white;
    border-style: solid;
    font-size: 200%;
    padding: 0.5rem 1.8rem;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    text-transform: uppercase;
    cursor: pointer;
  `;
  
  export const FilledButton = css`
    border-radius: 0.5rem;
    color: ${props=>props.theme.white};
    font-size: 200%;
    padding: 0.5rem 1.8rem;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    text-transform: uppercase;
    cursor: pointer;
    border: none;
  `;
  
  export const H1 = css``;
  export const H2 = css``;
  export const H3 = css``;
  export const H4 = css``;
  
  export const ParagraphText = css``;
  export const SubheadingText = css``;
  export const PopupInner = css`
    ${VerticalFlexBox};
    background-color: ${props=>props.theme.white};
    height: 100%;
    width: 100%;
    padding: 1.2rem;
    box-sizing: border-box; 
    overflow: auto;
`;

export const PageContainer = css`
${VerticalFlexBox};
width: 100%;
height: 100%;
padding: 1.2rem;
box-sizing: border-box;
`;