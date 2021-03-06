import {useRef,useEffect} from 'react';

//Example useage:
// const Component = (props) => {
//   const hasVal1Changed = useHasChanged(val1)

//   useEffect(() => {
//     if (hasVal1Changed ) {
//       console.log("val1 has changed");
//     }
//   });

//   return <div>...</div>;
// };


export default function useHasChanged (val: any) {
    const prevVal = usePrevious(val)
    return JSON.stringify(prevVal) !== JSON.stringify(val);
}

export const usePrevious = (value: any) => {
    const ref = useRef();
    useEffect(() => {
      ref.current = value;
    },[value]);
    return ref.current;
}