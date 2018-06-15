
// creates button under the parent with text, attributes and click listener 
function createButton(parent, text, attrs, click){
    let btn = d3.select(parent).append('button');

    Object.keys(attrs).forEach((key) => {
        btn.attr(key, attrs[key]);
    });

    btn.text(text);
    btn.on('click', click);
}

// creates slider under the parent with text, attributes,slide listener and a fixed width
function createSlider(parent, text, attrs, onSlide, width){
    let slider = d3.select(parent)
                    .append('input')
                    .property('type', 'range')
                    .style('width', width);

    Object.keys(attrs).forEach((key) => {
        slider.attr(key, attrs[key]);
    });
     
    slider.on('input', onSlide);
    
    let wrapper = d3.select(parent)
    .append('div')
    .attr('class', 'sliderWrapper')
    .style('width', width);    

    wrapper.append('span')
            .text('2014');

    wrapper.append('span')
            .text('2015');

    wrapper.append('span')
            .text('2016');

    wrapper.append('span')
            .text('2017');
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
    const wrapper = d3.select(parent).append('div').attr('class', 'formfield');
    wrapper.append('h3').text(menuName);

    for(let btn of btns){
        const label = wrapper
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