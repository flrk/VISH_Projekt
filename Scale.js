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
            if(acc.min > getAttribute(crr, scales[key].attr) && getAttribute(crr, scales[key].attr)) acc.min = getAttribute(crr, scales[key].attr);
            if(acc.max < getAttribute(crr, scales[key].attr)) acc.max = getAttribute(crr, scales[key].attr);
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
    let filteredData = data.filter((d) => getAttribute(d, attr)).map((d) => getAttribute(d, attr));

    const max = d3.max(filteredData);
    const min = d3.min(filteredData);
    
    scale.relative = {max, min};
}

// scaled das attribute nach einem bestimmten type
function scaleSqrt(scale, dataObj, scaleRelative){
    if(!scale) console.log(scale, dataObj)
    const value = getAttribute( dataObj, scale.attr);
    const { range } = scale;
    const { min, max } = scaleRelative ? scale.relative : scale.absolute;

    return d3.scaleSqrt()
                .domain([min, max])
                .range(range)(value);
}
