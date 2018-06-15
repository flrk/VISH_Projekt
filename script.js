const timeJanuar2014 = 1388534400 * 1000; // November 2012-11-21 //1325376000 * 1000;
const timeJanuar2017 = 1483228800 * 1000;
const timeOneDay = 86400 * 1000;
const timeOneMonth = 2592000 * 1000;
const steps = (timeJanuar2017 - timeJanuar2014)/timeOneDay;

const dataFile = "Dataset.json";
const containerID = "#container";
const chartContainerID = "#chartContainer";
const buttonContainerID = "#buttonContainer";

let sim, d3NodeManager, dataNodes, frame, tooltip; 

initSVGAndFrame();
loadData();

async function loadData(){
    await DataNode.loadJSON(dataFile);
    DataNode.initColorScale();
    //filtering data for the year 2014
    dataNodes = DataNode.filterData((d) =>(new Date(d.date).getTime() < timeJanuar2014));
    //init scale for the absolut scaling option
    initAbsoluteRanges(DataNode.filterData((d) =>(new Date(d.date).getTime() < timeJanuar2017)));
    start();   
}

function start(){
    createTooltip();
    initSimulationWithNodes();
    initAttributesAndListeners();
    initInputFields();
}
//creates an invisible div for showing tooltip
function createTooltip(){
    tooltip = d3.select(chartContainerID)
                .append("div")	
                .attr("class", "tooltip")               
                .style("opacity", 0);
}

function initSimulationWithNodes(){
    // creates d3 forced simulation with size of svg window
    sim = new Simulation(d3, simulationCenter(1), frame);

    // instantiate the Manager of the data nodes
    d3NodeManager = new D3NodeManager(d3, 'svg', 'circle');
    
    d3NodeManager.updateDataSet(dataNodes, sim.getCenter());
    sim.createForceSimulation(d3NodeManager.getData());
}

function initAttributesAndListeners(){
    d3NodeManager.setTransition('r', 100,  d => d.radius);
    d3NodeManager.setAttribute('r', d => d.radius);
    d3NodeManager.setAttribute('cx', d => d.x);
    d3NodeManager.setAttribute('cy', d => d.y);
    d3NodeManager.setAttribute('fill', d => d.color);
    d3NodeManager.setAttribute('fill-opacity', 0.6);
    d3NodeManager.setAttribute('stroke', d => d.color);
    
    // setzt Action listener 
    d3NodeManager.setAction('mouseover', (d) => {
        const attr = d3NodeManager.actualAttr.attr; 
        tooltip.transition()        
                .duration(200)      
                .style("opacity", 1);
        tooltip.html(`<table>
                        <tr><td><b> Stadt: </b></td><td><b>${capitalizeFirstLetter(d.city)}</b></td></tr>
                        <tr><td> Datum: </td><td>${d.date}</td></tr>
                        <tr><td> ${capitalizeFirstLetter(attr[1])}: </td><td>${roundTo(getAttribute(d,attr))}</td></tr></table>`);
    });

    d3NodeManager.setAction('mousemove', (d) => {
        tooltip.style("top", (event.pageY-40)+"px")
                .style("left",(event.pageX)+"px")
    });

    d3NodeManager.setAction('mouseout', (d) => {		
        tooltip.transition()		
                .duration(0)		
                .style("opacity", 0)	
    });

    // sets funktion for updating the data nodes in every step of the simulation
    sim.update(() => {
        d3NodeManager.update();
    });
}

function initInputFields(){
    const sliderConfig = {
        class: "slider",
        max: timeJanuar2017,
        min: timeJanuar2014,
        step: timeOneDay,
        value: timeJanuar2014
    };
    const sliderWidth = frame.width - ((2/10)*frame.width);
    const buttonConfig = {class: "button"};

    createSlider(chartContainerID, "", sliderConfig, function(){       
        const position = (this.value - timeJanuar2014) / this.step; 
        const newCenter = simulationCenter(position);
        sim._setCenterPoint(newCenter.x, newCenter.y);

        const filterDate = new Date(Number.parseInt(this.value)); //.toISOString().split("T")[0];;
        dataNodes = DataNode.filterData((d) => {
            return (new Date(d.date).getTime() < filterDate.getTime());
        });
        d3NodeManager.updateDataSet(dataNodes, sim.getCenter());
        sim.setNodes(d3NodeManager.getData());
    },  sliderWidth);

    createRadio(buttonContainerID, "Attribute", [
        {
            name: "Preis",
            checked: true,
            scale: scales.PRICE
        }, 
        {
            name: "Betten",
            scale: scales.BEDS
        },
        {
            name: "Zufriendenheit",
            scale: scales.STATIFICATION
        },
        {
            name: "Beherbergungen",
            scale: scales.ACCOMMODATES
        }],
        (scale) => {
            d3NodeManager.changeRadiusFactor(scale);
            sim.applyForces();
        }
    );

    
    createRadio(buttonContainerID, "Art", [
        {
            name: "Mittelwert",
            checked: true,
            scale: "avg"
        },
        {
            name: "Maximal",
            scale: "max"
        },
        {
            name: "Minimal",
            scale: "min"
        }],
        (scaleType) => {
            d3NodeManager.actualAttr.attr[0] = scaleType;
            d3NodeManager.changeRadiusFactor();
            sim.applyForces();
        }
    );

    createRadio(buttonContainerID, "Skalierung", [
        {
            name: "Relativ",
            checked: true,
            scale: true
        },
        {
            name: "Absolut",
            scale: false
        }],
        (isRelative) => {
            if(isRelative !== d3NodeManager.isRelative){ 
                d3NodeManager.toggleRadiusType();
                sim.applyForces();
            }
        }
    );
}

function initSVGAndFrame(){
    // creates a wrapper for control buttons
    const buttonDiv = d3.select("body")
                        .select(containerID)
                        .append("div")
                        .attr("id", buttonContainerID.slice(1));
    // creates a wrapper for svg
    const div = d3.select("body")
                        .select(containerID)
                        .append("div")
                        .attr("id",chartContainerID.slice(1));

    frame = {
        width: document.getElementById(chartContainerID.slice(1)).getBoundingClientRect().width,
        height: 500 
    };

    // creates svg in the wrapper with fixed size
    d3.select(chartContainerID)
        .append("svg")
        .style("margin", 0)
        .attr("width", frame.width)
        .attr("height", frame.height);
}

// calculates the center for the forced simulation
function simulationCenter(positionSlider){
    return {
        x: 0.1 * frame.width + positionSlider * ((frame.width - (0.2 * frame.width))/steps),
        y: frame.height/2
    }
}