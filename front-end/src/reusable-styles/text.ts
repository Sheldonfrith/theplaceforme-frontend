import {css}from 'styled-components';


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
  font-size: ${props=>props.theme.font5};
  text-indent: 0;
`;
