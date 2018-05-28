let scaleAbsolute = false;
const scales = {
    PRICE: {
        attr: ["avg", "price"],
        range: [10,40]
    },
    BEDS: {
        attr: ["avg", "bedrooms"],
        range: [5,30]
    },
    STATIFICATION: {
        attr: ["avg", "satisfaction"],
        range: [5,20]
    },
    ACCOMMODATES: {
        attr: ["avg", "accommodates"],
        range: [5,30]
    }
}

function initAbsoluteRanges(data){
    Object.keys(scales).forEach((key) => {
        scales[key].absolute = data.reduce((acc, crr) => {
            if(acc.min > getAttr(crr, scales[key].attr) && getAttr(crr, scales[key].attr)) acc.min = getAttr(crr, scales[key].attr);
            if(acc.max < getAttr(crr, scales[key].attr)) acc.max = getAttr(crr, scales[key].attr);
            return acc;
        }, {
            min: Number.MAX_VALUE,
            max: Number.MIN_VALUE
        })
    });
    console.log(scales);
}


// initalisiert den Cache
// merkt sich die range und das min, max für einen gegebenen typen
// dass skalieren wird mittels der funktion "scalesqrt durchgeführt"
function initScaleSqrt(scale, data){
    const { attr } = scale;
    let filteredData = data.filter((d) => getAttr(d, attr)).map((d) => getAttr(d, attr));

    const max = d3.max(filteredData);
    const min = d3.min(filteredData);
    
    scale.relative = {max, min};
}

// scaled das attribute nach einem bestimmten type
function scaleSqrt(scale, dataObj){
    if(!scale) console.log(scale, dataObj)
    const value = getAttr( dataObj, scale.attr);
    const { range } = scale;
    const { min, max } = scaleAbsolute ? scale.absolute : scale.relative;

    return d3.scaleSqrt()
                .domain([min, max])
                .range(range)(value);
}
