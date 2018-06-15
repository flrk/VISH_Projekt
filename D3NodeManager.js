class D3NodeManager{
    constructor(d3, containerName, className){
        this.containerName = containerName;
        this.d3 = d3;
        this.className = className;  
        this.dataNodes = [];
        this.actions = [];
        this.attr = [];
        this.transitions = [];
        this.actualAttr = scales.PRICE;
        this.isRelative = true;
        
    }

    // gets called in every step of the force simulation
    // updates the position, size and animation of the nodes
    // attaches listener
    update(){
        let u = this.d3
            .select(this.containerName)
            .selectAll(this.className)
            .data(this.dataNodes);
        
        u.enter()
            .append(this.className)
            .merge(u);

        for(let attribute of this.attr){
            u.attr(attribute.type, attribute.fnc);
        }

        for(let transition of this.transitions){
            u.transition()
                .duration(transition.duration)
                .attr(transition.type, transition.fnc);
        }
       
        for(let actionListener of this.actions){
            u.on(actionListener.event, actionListener.listener);
        }      
        
        u.exit().remove();
    }

    setTransition(type, duration, fnc){
        this.transitions.push({type, duration, fnc});
    }

    setAttribute(type, fnc){
        this.attr.push({type, fnc});
    }

    setAction(event, listener){
        this.actions.push({event, listener});
    }

    toggleRadiusType(){
        this.isRelative  = !this.isRelative;
        this.calcRadius();
    }

    calcRadius(){
        this.dataNodes.forEach((d) => {
            d.radius = scaleSqrt(this.actualAttr, d, this.isRelative)
        });
    }

    changeRadiusFactor(newAttr){
        if(newAttr){
            if(this.actualAttr.attr[0] !== newAttr.attr[0]){
                newAttr.attr[0] = this.actualAttr.attr[0];
            }
            this.actualAttr = newAttr;
        } 
        this.dataNodes = this.dataNodes.filter((d) => {
            const attr = getAttribute(d, this.actualAttr.attr);
            return attr && attr > 0 && attr !== Number.MAX_SAFE_INTEGER;
        });
        initScaleSqrt(this.actualAttr,  this.dataNodes);
        this.calcRadius();
    }

    addData(data, center){
        const maxRadius = this._calcMaxRadius(center);
        data.forEach((obj) => {
            const d = JSON.parse(JSON.stringify(obj));

            // for a random radial startpoint
            const randomAngle = Math.random()*360;
            
            const x = Math.cos(randomAngle)*(maxRadius.radiusX + 50) + center.x;
            const y = Math.sin(randomAngle)*(maxRadius.radiusY  + 50) + center.y;

            // for every node x,y,vx,vy and index has to be defined 
            d.x = x > 0 ? x : 0;
            d.y = y > 0 ? y : 0;
            d.vx = 0;
            d.vy = 0;
            d.index = this.dataNodes.length;

            this.dataNodes.push(d);
        });
    }
    // update the data for diffrent years
    updateDataSet(newDataset, center){
        const toDelete = [];
        this.dataNodes.forEach((data, i) => {
            let index = newDataset.findIndex((d) => d.city === data.city);
            if(index >= 0){
                this.dataNodes[i] = {
                    ...newDataset[index],
                    x: data.x,
                    y: data.y,
                    vx: data.vx,
                    vy: data.vy,
                    index: data.index
                };
                newDataset = newDataset.filter((d) => d.city !== data.city);
            }else{
                toDelete.push(i);
            }
        });

        toDelete.sort((a, b) => b - a).forEach((i) => {
            this.dataNodes.splice(i, 1);
        });
        this.addData(newDataset, center)
        this.changeRadiusFactor();
    }

    getData(){
        return this.dataNodes;
    }

    _calcMaxRadius(center){
        return this.dataNodes.reduce((acc, crr) => {
            const radiusY = Math.abs(center.y - crr.y) + scaleSqrt(this.actualAttr, crr);
            const radiusX = Math.abs(center.x - crr.x) + scaleSqrt(this.actualAttr, crr);
            if(acc.radiusX < radiusX) acc.radiusX = radiusX;
            if(acc.radiusY < radiusY) acc.radiusY = radiusY;
            return acc;
        }, {radiusX: 0, radiusY: 0})
    }
}