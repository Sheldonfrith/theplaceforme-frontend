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
    background: ${props=>props.theme.whiteOverlay};
    color: ${props=>props.theme.black};
    border-color:${props=>props.theme.black};
    border-style: solid;
    font-size: ${props=>props.theme.font6};
    padding: 0.5rem 1.8rem;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    text-transform: uppercase;
    cursor: pointer;
    :hover{
      background:white;
    }
  `;
  
  export const FilledButton = css`
    border-radius: 0.5rem;
    color: ${props=>props.theme.white};
    font-size: ${props=>props.theme.font6};
    padding: 0.5rem 1.8rem;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    text-transform: uppercase;
    cursor: pointer;
    border: none;
  `;
  
  export const H1 = css`
    font-size: ${props=>props.theme.font7};
    font-family: ${props=>props.theme.fontFamHeader};
  `;
  export const H2 = css`
    font-size: ${props=>props.theme.font6};
  `;
  export const H3 = css`
    font-size: ${props=>props.theme.font5};
  `;
  export const H4 = css`
    font-size: ${props=>props.theme.font4};
  `;
  
  export const ParagraphText = css`
    font-size: ${props=>props.theme.font2};
    letter-spacing: -0.5px;
    word-spacing: 3px;
    text-indent: 2rem;
  `;
  export const SubheadingText = css`
    ${ParagraphText}
    font-size: ${props=>props.theme.font3};
    text-indent: 0;
  `;
  export const PopupInner = css`
    ${VerticalFlexBox};
    background: ${props=>props.theme.primaryLightBackground};
    height: 100%;
    width: 100%;
    padding: 1.2rem;
    box-sizing: border-box; 
    overflow: auto;
    border-radius: 0.2rem;
`;

export const PageContainer = css`
${VerticalFlexBox};
width: 100%;
height: 100%;
box-sizing: border-box;
`;