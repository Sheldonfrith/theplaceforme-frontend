import styled, { css } from 'styled-components';

const centeredFlexBoxTemplate = css`
display: flex;
align-items: center;
justify-content: space-between;
position: relative;
`;
export const VerticalFlexBox = css`
    ${centeredFlexBoxTemplate}
    flex-direction: column;
`;

export const HorizontalFlexBox = css`
${centeredFlexBoxTemplate}
flex-direction: row;
`;
export const PopupInner = css`
${VerticalFlexBox};
background: ${props => props.theme.primaryLightBackground};
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
