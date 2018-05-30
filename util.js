function getAttr(obj, attrs){
    let result = obj;
    if(!attrs) return false;
    for(let attr of attrs){
        result = result[attr];
    }
    return result;
}
