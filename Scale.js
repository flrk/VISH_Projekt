const cacheScale = {};

// initalisiert den Cache
// merkt sich die range und das min, max für einen gegebenen typen
// dass skalieren wird mittels der funktion "scalesqrt durchgeführt"
function initScaleSqrt(type, rawData, range){
    let data = rawData.filter((d) => d.radius).map((d) => d.radius);
    if(!data.length){
        cacheScale[type] = {range};
        return;
    }

    const max = d3.max(data);
    const min = d3.min(data);

    if(range){
        cacheScale[type] = {domain: [min, max], range};
    }else if(!range){
        cacheScale[type] = {domain: [min, max], range: cacheScale[type].range};
    }
}

// scaled das attribute nach einem bestimmten type
function scaleSqrt(type, value){
    if(!cacheScale[type]) return;

    const { domain, range } = cacheScale[type];

    return d3.scaleSqrt()
                .domain(domain)
                .range(range)(value);
}
