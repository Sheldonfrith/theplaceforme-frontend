export default function DeepConvertToType (array, type){
    switch(type){
        case 'boolean':
            return array.map(arr=>[arr[0],!!arr[1]]);
        case 'number':
            return array.map(arr=>{
                let thisData = arr[1];
                //remove any non-numeric characters except - and .
                thisData = thisData.replace(/[^0-9.-]/g, "");
                //convert to a float
                thisData = parseFloat(thisData);
                //if its NaN convert to empty string
                if (isNaN(thisData)) thisData = '';
                return [arr[0],thisData];
            })
        default:
            throw new Error('in DeepConvertToType, invalid type given');
    }
}