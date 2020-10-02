export default function DependentCombine(// returns input list after modifications
      inputList,
      parentCountryIndex,
      parentData,
      childName,
      childData,
      method
    ){switch (method) {
        case "delete":
            return inputList.filter(arr=>arr[0]!==childName);
        case "simple-addition":
          inputList[parentCountryIndex][1] = parentData + childData;
          // delete child node
          return inputList.filter(arr=>arr[0]!==childName);
        case "bias-false":
          if (parentData === true && childData === false) {
            inputList[parentCountryIndex][1] = false;
          }
          //delete child node
          return inputList.filter(arr=>arr[0]!==childName);
        case "bias-true":
          if (parentData === false && childData === true) {
            inputList[parentCountryIndex][1] = true;
          }
          //delete child node
          return inputList.filter(arr=>arr[0]!==childName);
        default:
          console.log("error, dependentCombine method not found");
          return null;
      };
    };