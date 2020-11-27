import styled, {keyframes, css} from 'styled-components';

  export const FilledButtonClickAnimation = (props: any) => keyframes`
    0%{
      background: ${props.theme.primaryAccent};
    }
    100%{
      background: ${props.theme.primaryAccent};
    }
  `;

  export const TransparentButtonClickAnimation = (props: any) => keyframes`
    0% {
      background: white;
      box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.35);
    }
    100%{
      background: white;
      box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.35);
    }
  `;
  
export const slideOutLeft = (props: any)=> keyframes`
0% {
    left: 0;
    right: 0;
}
100% {
    left: -1000px;
    right: 1000px;
}
`;
export const slideOutRight = (props: any)=>keyframes`
0% {
    left: 0;
    right: 0;
}
100% {
    left: 1000px;
    right: -1000px;
}
`;
export const slideInLeft =(props: any) =>keyframes`
0% {
    left: -1000px;
    right: 1000px;
}
100% {
    left: 0;
    right: 0;
}
`;
export const slideInRight =(props: any) =>keyframes`
0% {
    left: 1000px;
    right: -1000px;
}
100% {
    left: 0;
    right: 0;
}
`;