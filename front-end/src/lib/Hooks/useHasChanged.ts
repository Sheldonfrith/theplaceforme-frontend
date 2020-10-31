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


export default function useHasChanged (val:any) {
    const prevVal = JSON.stringify(usePrevious(val));
    const hasChanged: boolean = prevVal !== JSON.stringify(val);
    // console.log('has changed:',hasChanged, prevVal, val);
    return hasChanged;
}

const usePrevious = (value: any) => {
  //regular react method for detecting previous value
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  },[value]);
  return ref.current;
}