export default function DeepRemoveWhitespace (array) {
    array = array.map(arr=>[arr[0].trim(),arr[1].trim()]);
    array = array.map(arr=>[
        arr[0].replace(/\s+/g, " "),
        arr[1].replace(/\s+/g, " "),
      ]);
    return array;
}