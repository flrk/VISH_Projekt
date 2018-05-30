let cacheData;
let colorScale;

class DataNode{
    
    static async loadJSON(path, forceReload = false){
        return new Promise( resolve => {
                if(cacheData && !forceReload) {
                    resolve(cacheData);
                    //resolve(DataNode.filterAndReCalculateData(data, filter));
                }else{
                    d3.json(path, (data) => {
                        data = data.map((d) => {
                            return {
                                border: 2,
                                ...d
                            }
                        });
                        cacheData = data;
                        resolve();
                });
            }
        });
    }

    static initScale() {
        var max = DataNode.filterData((d) => new Date(d.date).getTime() < timeJanuar2017).length;
        colorScale = d3.scaleOrdinal(d3.schemeCategory20);
        cacheData.forEach(d => d.color = colorScale(d.city));
    }

    static filterData(filter){
        return DataNode.filterAndReCalculateData(cacheData, filter);
    }

    static filterAndReCalculateData(data, filter){
        let filteredData = data.filter(filter)
            .reduce((acc, crr) => {
                if(!acc[crr.city]){
                    acc[crr.city] = JSON.parse(JSON.stringify(crr));
                }else{
                    let keys = Object.keys(crr.min);
                    for(let key of keys){
                        if(acc[crr.city].min[key] > crr.min[key]) acc[crr.city].min[key]  = crr.min[key];
                    }

                    keys = Object.keys(crr.max);
                    for(let key of keys){
                        if(acc[crr.city].max[key] < crr.max[key]) acc[crr.city].max[key]  = crr.max[key];
                    }

                    keys = Object.keys(crr.avg);
                    for(let key of keys){
                        acc[crr.city].avg[key] = (acc[crr.city].avg[key] + crr.avg[key])/2;
                    }

                    keys = Object.keys(crr.amount);
                    for(let key of keys){
                        if(!(crr.amount[key] instanceof Object)) acc[crr.city].amount[key] = acc[crr.city].amount[key] + crr.amount[key];
                    }

                    keys = Object.keys(crr.amount.room_type);
                    for(let key of keys){
                        acc[crr.city].amount.room_type[key] = acc[crr.city].amount.room_type[key] + crr.amount.room_type[key];
                    }
                }
                return acc;
            }, {});

        return Object.keys(filteredData).map((key) => {
            return filteredData[key];
        });
    }

    static generateRandomNode(amount){
        return Array(amount).fill(0).map(() => {
            return { radius: (Math.random()*(51-54) + 50, 'CoolerName') };
        })
    }
}