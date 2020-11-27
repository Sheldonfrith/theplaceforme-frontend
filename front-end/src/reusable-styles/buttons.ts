import {css}from 'styled-components';

export const TransparentButton = css`
    border-radius: 0.5rem;
    background: ${(props: any)=>props.theme.whiteOverlay};
    color: ${(props: any)=>props.theme.black};
    border-color:${(props: any)=>props.theme.black};
    border-style: solid;
    font-size: ${(props: any)=>props.theme.font6};
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