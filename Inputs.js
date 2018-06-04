// erstellt einen Button unter dem Parent mit dem Attr, text und click-listener
// Values werden mittels attr angegeben also {value: "xyz"}
function createButton(parent, text, attrs, click){
    let btn = d3.select(parent).append('button');

    Object.keys(attrs).forEach((key) => {
        btn.attr(key, attrs[key]);
    });

    btn.text(text);
    btn.on('click', click);
}

// genauso wie bei dem Button
function createSlider(parent, text, attrs, onSlide, width){
    let slider = d3.select(parent)
                    .append('input')
                    .property('type', 'range')
                    .style('width', width);

    Object.keys(attrs).forEach((key) => {
        slider.attr(key, attrs[key]);
    });

    //slider.text(text);
    slider.on('input', onSlide);
}

function createChechbox(parent, text, attrs, listener){
    d3.select(parent)
    .append('label')
    .property('for', 'test')
    .text(text);

    
    let checkBox = d3.select(parent)
    .append('input')
    .property('type', 'checkBox')
    .property("name", 'test')

    checkBox.on('click', listener);
}

function createRadio(parent, menuName, btns, fnc){
    const header = d3.select(parent).append('h3').text(menuName);
    for(let btn of btns){
        const label = d3.select(parent)
            .append('label')
            .text(btn.name)
            .attr('class', 'container')
            
        
        const checkbox = label.append('input')
            .property('type', 'radio')
            .property('name', menuName)
            .on('click', () => {fnc(btn.scale)});

        label.append('span').attr('class', 'checkmark');

        if(btn.checked) checkbox.property("checked", "true");
    }
}