function getAttribute(obj, attrs){
    let result = obj;
    if(!attrs) return false;
    for(let attr of attrs){
        result = result[attr];
    }
    return result;
}

function capitalizeFirstLetter(string){
    return string.charAt(0).toUpperCase() + string.slice(1); 
}

function roundTo(number, digits = 2){
    const faktor = Math.pow(10,digits);
    return Math.floor(number*faktor)/faktor;
}
