import styled, { css, keyframes} from 'styled-components';

  export const FilledButtonClickAnimation = (props:any) => keyframes`
    0%{
      background: ${props.theme.primaryAccent};
    }
    100%{
      background: ${props.theme.primaryAccent};
    }
  `;

  export const TransparentButtonClickAnimation = (props:any) => keyframes`
    0% {
      background: white;
      box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.35);
    }
    100%{
      background: white;
      box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.35);
    }
  `;
  
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
    margin: 0.5rem;
    box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.35);
    cursor: pointer;
    :hover{
      box-shadow: inset 0px -4px 4px rgba(0, 0, 0, 0.35);
    }
    :active{
      background: white;
      box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.35);
    }
  `;
  
  export const FilledButton = css`
    border-radius: 0.5rem;
    color: ${props=>props.theme.white};
    background: ${props=>props.theme.primaryGradient};
    font-size: ${props=>props.theme.font6};
    font-family: ${props=>props.theme.fontFamHeader};
    padding: 1rem 2rem;
    margin: 2rem;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.4);
    cursor: pointer;
    border: none;
    :hover {
      background: ${props=>props.theme.primaryDark};
    }
    :active{
      background: ${props=>props.theme.primaryAccent};
    }
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
    font-size: ${props=>props.theme.font5};
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