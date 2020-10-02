export default function RemoveMultipleYears(array,direction){
    return array.filter((arr,index)=>{
        if (direction==='bottom'){
            if (array[index+1] && array[index+1][0]!==arr[0]) return true;
        } else {
            if (array[index-1] && array[index-1][0]!==arr[0]) return true;
        }
        return false;
    });
}