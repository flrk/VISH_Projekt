const timeJanuar2014 = 1388534400 * 1000; // November 2012-11-21 //1325376000 * 1000;
const timeJanuar2017 = 1483228800 * 1000;
const timeOneDay = 86400 * 1000;
const timeOneMonth = 2592000 * 1000;
const steps = (timeJanuar2017 - timeJanuar2014)/timeOneDay;

const dataFile = "Dataset.json";
const containerID = "#container"
const chartContainerID = "#chartContainer";
const buttonContainerID = "#buttonContainer";

let sim, d3NodeManager, dataNodes, frame; 

initSVGAndFrame();
loadData();

async function loadData(){
    await DataNode.loadJSON(dataFile);
    initAbsoluteRanges(DataNode.filterData((d) =>(new Date(d.date).getTime() < timeJanuar2017)))
    dataNodes = DataNode.filterData((d) =>(new Date(d.date).getTime() < timeJanuar2014));
    start();   
}

function start(){
    initSimulationWithNodes();
    initAttrAndListener();
    initInputFields();
}

function initSimulationWithNodes(){
    // erstellt eine Simulation, mit der größe des SVG-Fensters
    sim = new Simulation(d3, simulationCenter(1), frame);

    // d3Nodes enthält die visualiserung der Daten mittels d3 
    // sogesehen die Verknüpfung der DataNodes mit d3
    // Dem Konstruktor muss der Name des eltern-Elementes sowie der KlassenName für die Visualiserung übergeben werden
    d3NodeManager = new D3NodeManager(d3, 'svg', 'circle');
    d3NodeManager.changeRadiusFactor(scales.PRICE);

    d3NodeManager.updateDataSet(dataNodes, sim.getCenter());
    sim.createForceSimulation(d3NodeManager.getData());
}

function initAttrAndListener(){
    d3NodeManager.setTransition('r', 100, d =>  d.radius );//d => scaleSqrt(d3NodeManager.actualAttr, d));
    d3NodeManager.setAttr('r', d => d.radius ); //scaleSqrt(d3NodeManager.actualAttr, d));
    d3NodeManager.setAttr('cx', d => d.x);
    d3NodeManager.setAttr('cy', d => d.y);

    // setzt Action listener wie z.B. click
    d3NodeManager.setAction('click', (d) => {
        sim.applyForces();
    });

    // update = Tick-Funktion der Simulation
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

    createButton(buttonContainerID, "Preis", buttonConfig, () => {
        d3NodeManager.changeRadiusFactor(scales.PRICE);
        sim.applyForces();
    });

    createButton(buttonContainerID, "Betten", buttonConfig, () => {
        d3NodeManager.changeRadiusFactor(scales.BEDS);
        sim.applyForces();
    });

    createButton(buttonContainerID, "Zufriendenheit", buttonConfig, () => {
        d3NodeManager.changeRadiusFactor(scales.STATIFICATION);
        sim.applyForces();
    });

    createButton(buttonContainerID, "Beherbergungen", buttonConfig, () => {
        d3NodeManager.changeRadiusFactor(scales.ACCOMMODATES);
        sim.applyForces();
    });

    createChechbox(buttonContainerID, "Absolute?", {}, () => {
        d3NodeManager.toggleRadiusType();
        sim.applyForces();
    })
}

function initSVGAndFrame(){
    // feste größe des SVG-Fensters
    const buttonDiv = d3.select("body")
                        .select(containerID)
                        .append("div")
                        .attr("id", buttonContainerID.slice(1));

    const div = d3.select("body")
                        .select(containerID)
                        .append("div")
                        .attr("id",chartContainerID.slice(1));

    frame = {
        width: document.getElementById(chartContainerID.slice(1)).getBoundingClientRect().width,
        height: 500 //document.getElementById(chartContainerID.slice(1)).getBoundingClientRect().height
    };

    //fügt ein SVG dem body hinzu -> dadurch kann man die größe steuern
    d3.select(chartContainerID)
                        .append("svg")
                        .style("margin", 0)
                        .attr("width", frame.width)
                        .attr("height", frame.height);
}

function simulationCenter(positionSlider){
    return {
        x: 0.1 * frame.width + positionSlider * ((frame.width - (0.2 * frame.width))/steps),
        y: frame.height/2
    }
}