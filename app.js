function name_this_colour(Hue, Saturation, Lightness) {
    // hue name
    const hues_dict = new Map([
        [0, 'red'],
        [15, 'red-orange'],
        [30, 'orange'],
        [45, 'orange-yellow'],
        [60, 'yellow'],
        [75, 'yellow-chartreuse'],
        [90, 'chartreuse'],
        [105, 'chatreuse-green'],
        [120, 'green'],
        [135, 'green-jade'],
        [150, 'jade'],
        [165, 'jade-cyan'],
        [180, 'cyan'],
        [195, 'cyan-azure'],
        [210, 'azure'],
        [225, 'azure-blue'],
        [240, 'blue'],
        [255, 'blue-violet'],
        [270, 'violet'],
        [285, 'violet-magenta'],
        [300, 'magenta'],
        [315, 'magenta-rose'],
        [330, 'rose'],
        [345, 'rose-red'],
        [360, 'red']
    ]);

    // define a min operation
    const min = (dict, prop) =>  [...Array.from(dict.keys())].sort((a,b) => Math.abs(a-prop) - Math.abs(b-prop));

    const [Hue_for_dict] =  min(hues_dict, Hue);
    const Hue_name = hues_dict.get(Hue_for_dict);

    const Saturation_dict = new Map([[0.10,'grayish'], [0.30,'desaturated'], [0.50,'muted'], [0.70,'saturated'], [0.90, 'vivid']]);
    const [Saturation_for_dict] = min(Saturation_dict, Saturation);
    const Saturation_name = Saturation_dict.get(Saturation_for_dict);

    const Lightness_dict = new Map([[0.10,'and very dark'], [0.30, 'dark'], [0.50, ''], [0.70001, 'light'], [0.90001, 'and very light']]);
    const [Lightness_for_dict] = min(Lightness_dict, Lightness);
    const Lightness_name = Lightness_dict.get(Lightness_for_dict);

    let Colour_name = '';

    if (Saturation == 0) {
        if (Lightness != 0 && Lightness != 1) {
            if (Lightness <= 0.20) {
                Colour_name = 'very dark gray';
            } else if (Lightness > 0.20 && Lightness <= 0.40) {
                Colour_name = 'dark gray';
            } else if (Lightness > 0.60 && Lightness <= 0.80) {
                Colour_name = 'light gray';
            } else if (Lightness > 0.80 && Lightness <= 1.00) { 
                Colour_name = 'very light gray';
            } else {
                Colour_name = 'medium gray';
            }
        } else if  (Lightness == 0) {
            Colour_name = 'black';
        } else if (Lightness == 1) {
            Colour_name = 'white';
        }         
    } else {
        Colour_name = `${Saturation_name} ${Lightness_name} ${Hue_name}`; // "%s %s %s" %(Saturation_name, Lightness_name, Hue_name)
    }
    return Colour_name;
}

//@REMOVE TEST
//console.log(name_this_colour(2557, 1, 100));

function show_color(Red, Green, Blue, fn) {
    document.querySelector(`.${fn.name}_showColor`).style.background = `rgb(${Red},${Green},${Blue})`;
}

const twof = (num) => num.toFixed(2);// (Math.round(num + 'e+2')  + 'e-2');    
    // const twof = (num) => {
    //     var m = Number((Math.abs(num) * 100).toPrecision(15));
    //     return Math.round(m) / 100 * Math.sign(num);
    // };

function from_RGB(Red, Green, Blue) {
    const rgb_255 = [Red,Green,Blue];
    const rgb_percent = rgb_255.map(el => el / 255);
    const diff = Math.max(...rgb_percent)-Math.min(...rgb_percent);
    const red_pc = rgb_percent[0];
    const green_pc = rgb_percent[1];
    const blue_pc = rgb_percent[2];
    let  Hue;

    // calculate chromaticness, whiteness and blackness
    const Chromaticness = Math.max(...rgb_percent) - Math.min(...rgb_percent);
    const Whiteness = Math.max(...rgb_percent) - Chromaticness;
    const Blackness = 1 - Chromaticness - Whiteness;
    
    const rgb_header_1_text = `Chromaticness: ${twof(Chromaticness*100)}%, Whiteness: ${twof(Whiteness*100)}%, Blackness: ${twof(Blackness*100)}%`;
    const rgb_header_1_el = document.querySelector('#from_RGB_title_1');
    console.log(rgb_header_1_el);
    rgb_header_1_el.textContent = rgb_header_1_text;
    console.log(rgb_header_1_text);
    
    // calculate Hue, Saturation and Lightness
    if(Math.max(...rgb_percent) == Math.min(...rgb_percent)) {
        Hue = 0;
    } else if (Math.max(...rgb_percent) == red_pc) {
        Hue = (60 * ((green_pc-blue_pc)/diff) + 360) % 360;
    } else if (Math.max(...rgb_percent) == green_pc) {
        Hue = (60 * ((blue_pc-red_pc)/diff) + 120) % 360;
    } else if (Math.max(...rgb_percent) == blue_pc) {
        Hue = (60 * ((red_pc-green_pc)/diff) + 240) % 360;
    }
        
    const Lightness = Whiteness + Chromaticness/2;
    const Saturation = Chromaticness;
    
    // print("Hue: %.2f, Saturation: %.2f%%, Lightness: %.2f%%" % (Hue, Saturation*100, Lightness*100))
    const rgb_header_2_text = `Hue: ${twof(Hue)}, Saturation: ${twof(Saturation*100)}%, Lightness: ${twof(Lightness*100)}%`;
    const rgb_header_2_el = document.querySelector('#from_RGB_title_2');
    rgb_header_2_el.textContent = rgb_header_2_text;


    show_color(Red, Green, Blue, from_RGB);
    
    // Name the colour
    const rgb_header_3_text = `This colour is named: ${name_this_colour(Hue,Saturation,Lightness)}`;
    const rgb_header_3_el = document.querySelector('#from_RGB_title_3');
    rgb_header_3_el.textContent = rgb_header_3_text;

    return null;
}  

//from_RGB(59, 179, 159);

// this function gives the RGB values for 'pure colours'. it is a helper function that's used in the chsl2rgb function
function pure_hue(hue) {
    hue = hue % 1.0;
    if (hue < 1/6) {
        return hue*6.0;
    }
    if (hue < 0.5){
        return 1;
    }
    if (hue < 2/3) {
        return (2/3-hue)*6.0;
    }
    return 0;
}

console.log(pure_hue(0.20));


// define widgets with constraints for the following interaction
const saturation_widget = createSlider(to_RGB, 'saturation', [0, 1, 0.01]);
const lightness_widget = createSlider(to_RGB, 'lightness', [0, 1, 0.01]);

function update_lightness_range(saturation_widget, lightness_widget, evt) {
    console.log(evt);
    function update() {
        lightness_widget.min = 0.5 * saturation_widget.value;
        lightness_widget.max = 1 - 0.5 * saturation_widget.value;
    }
    window.requestAnimationFrame(update);
}

function to_RGB(Hue,Saturation,Lightness) {
    const  [r,g,b] = [pure_hue(Hue/360+1/3)*255, pure_hue(Hue/360)*255, pure_hue(Hue/360-1/3)*255];   
    
    const Chromaticness = Saturation;
    const Whiteness = Lightness - Saturation/2;
    const Blackness = 1 - Whiteness - Chromaticness;
    // console.log(`Chromaticness: ${twof(Chromaticness*100)}%, Whiteness: ${twof(Whiteness*100)}%, Blackness: ${Blackness*100}%`);
    const rgb_header_1_text = `Chromaticness: ${twof(Chromaticness*100)}%, Whiteness: ${twof(Whiteness*100)}%, Blackness: ${Blackness*100}%`;
    const rgb_header_1_el = document.querySelector('#to_RGB_title_1');
    rgb_header_1_el.textContent = rgb_header_1_text;

    const Red = parseInt(r*Saturation + Whiteness * 255);
    const Green = parseInt(g*Saturation + Whiteness * 255);
    const Blue = parseInt(b*Saturation + Whiteness * 255);
    // console.log(`RGB values: Red: ${Red}, Green: ${Green}, Blue: ${Blue}`);
    const rgb_header_2_text =`RGB values: Red: ${Red}, Green: ${Green}, Blue: ${Blue}`;
    const rgb_header_2_el = document.querySelector('#to_RGB_title_2');
    rgb_header_2_el.textContent = rgb_header_2_text;

    show_color(Red, Green, Blue, to_RGB);

    // console.log(`This colour is named: ${name_this_colour(Hue,Saturation,Lightness)}`);

    // Name the colour
    const rgb_header_3_text = `This colour is named: ${name_this_colour(Hue,Saturation,Lightness)}`;
    const rgb_header_3_el = document.querySelector('#to_RGB_title_3');
    rgb_header_3_el.textContent = rgb_header_3_text;


    return null;
}



//When you pass a function as the first argument to the function interact, along with named arguments, 
// a slider is generated and bound to the function parameter.
function interact(fn, widget_params) { 
    
    const widgetHolder = document.createElement('DIV');

    const getValues = () => {
        const groupSliders = document.querySelectorAll(`input[id^="${fn.name}_widget_"]`);
        return Array.from(groupSliders).map((slider) => slider.value);                
    };

    Object.keys(widget_params).forEach(key => {
        let slider;
        // if we are passing a created slider element
        if(widget_params[key] instanceof HTMLElement) {
            slider = widget_params[key];
        } else if(Array.isArray(widget_params[key])) { // if  we are passing an array
          slider = createSlider(fn, key, widget_params[key]);
        } else {
            // add new type in the future
        }

        //@TODO remove EventListeners when we remove the component
        // add the EventListeners        
        slider.addEventListener('change', (evt) => fn(... getValues()) );

        const label = createLabel(key);
        label.appendChild(slider);
        widgetHolder.appendChild(label);
    });

    const details = createDetails(fn.name);
    widgetHolder.appendChild(details);
    document.body.appendChild(widgetHolder);
    fn(...getValues());
}

function createLabel(key) {
    // create the label
    const label = document.createElement('LABEL');
    const title = document.createTextNode(key.toUpperCase());        
    label.appendChild(title);
    return label;
}

function createSlider(fn, key, [min,max,step]){ 
    // create the slider;
    const slider = document.createElement('INPUT');
    slider.setAttribute('type', 'range');
    slider.setAttribute('min', min);
    slider.setAttribute('max', max);
    slider.setAttribute('value', Math.floor(max/2));
    slider.setAttribute('step', step);
    slider.setAttribute('id', `${fn.name}_widget_${key.toLowerCase()}`);
    return slider;
}

function createDetails(name) {
    const detailsHolder = document.createElement('DIV');
    detailsHolder.setAttribute('id', name);

    const title1 = document.createElement('DIV');
    title1.setAttribute('id', `${name}_title_1`);
    const title2 = document.createElement('DIV');
    title2.setAttribute('id', `${name}_title_2`);
    const showColor = document.createElement('DIV');
    showColor.setAttribute('class', `${name}_showColor`);
    const title3 = document.createElement('DIV');
    title3.setAttribute('id', `${name}_title_3`);

    detailsHolder.appendChild(title1);
    detailsHolder.appendChild(title2);
    detailsHolder.appendChild(showColor);
    detailsHolder.appendChild(title3);
    return detailsHolder;
}


//@TODO replace with when web component is connected
window.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded and parsed');    

    //@TODO remove the listeners when the web component unloads !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    
    const observe = update_lightness_range.bind(null, saturation_widget, lightness_widget);
    saturation_widget.addEventListener('input',  observe);

    // to_RGB((0,360,1), saturation_widget.value, lightness_widget.value);
    interact(from_RGB, {Red:[0,255,1], Green:[0,255,1], Blue:[0,255,1]});
    interact(to_RGB, {Hue:[0,360,1], Saturation:saturation_widget, Lightness:lightness_widget}); 
});
