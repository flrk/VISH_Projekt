class Simulation{
    constructor(d3, center, frame){
        this._chargeStrength = 5;
        this.d3 = d3;
        this.forceSimulation = null;

        this.frame = frame;
        this.center = center;
    }

    createForceSimulation(data){
        this.forceSimulation = this.d3.forceSimulation(data);
        this.applyForces();
    }

    update(fnc){
        this.forceSimulation.on("tick", fnc);
    }

    setNodes(data){
        return this.forceSimulation.nodes(data);
    }

    applyForces(){
        this._forces();
        this.forceSimulation.alphaTarget(0.4).restart();
    }

    setChargeStrength(value){
        this._chargeStrength = value; 
    }

    getNodes(){
        return this.forceSimulation.nodes();
    }

    getCenter(){
        return this.center;
    }

    _setCenterPoint(x, y){
        this.d3.select({})
            .transition()
            .duration(1000)
            .tween("center.move", () => {
                //var i = d3.interpolateArray([this.center.x, this.center.y], [x,y]);

                return (t) => {
                    //var c = i(t);
                    this.center.x = x//c[0];
                    this.center.y = y//c[1];
                    this.applyForces();
                };
        }); 
    }


    _forces(){
            var boxForce = this.boundedBox()
            .bounds([[10, 10], [this.frame.width - 10, this.frame.height - 10]])
            .size(function (d) { return [scaleSqrt("r",d.radius) + d.border, scaleSqrt("r",d.radius) + d.border] })

        this.forceSimulation
            .force('charge', this.d3.forceManyBody().strength(this._chargeStrength))
            .force('center', this.d3.forceCenter(this.center.x, this.center.y))
            .force('box', boxForce)
            .force('collision', this.d3.forceCollide().radius(function(d) {
                return scaleSqrt("r", d.radius)  + d.border;
            }));
            
    }

    boundedBox() {
        var nodes, sizes
        var bounds
        var size = [0, 0]
        function force() {
            var node, size
            var xi, x0, x1, yi, y0, y1
            var i = -1
            while (++i < nodes.length) {
                node = nodes[i]
                size = sizes[i]
                xi = node.x + node.vx
                x0 = bounds[0][0] - xi
                x1 = bounds[1][0] - (xi + size[0])
                yi = node.y + node.vy
                y0 = bounds[0][1] - yi
                y1 = bounds[1][1] - (yi + size[1])
                if (x0 > 0 || x1 < 0) {
                    node.x += node.vx
                    node.vx = -node.vx
                    if (node.vx < x0) { node.x += x0 - node.vx }
                    if (node.vx > x1) { node.x += x1 - node.vx }
                }
                if (y0 > 0 || y1 < 0) {
                    node.y += node.vy
                    node.vy = -node.vy
                    if (node.vy < y0) { node.vy += y0 - node.vy }
                    if (node.vy > y1) { node.vy += y1 - node.vy }
                }
            }
        }
        force.initialize = function (_) {
            sizes = (nodes = _).map(size)
        }
        force.bounds = function (_) {
            return (arguments.length ? (bounds = _, force) : bounds)
        }
        force.size = function (_) {
            return (arguments.length
                 ? (size = typeof _ === 'function' ? _ : constant(_), force)
                 : size)
        }
        return force
    }
}