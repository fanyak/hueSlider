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

    const twof = (num) => num.toFixed(2);// (Math.round(num + 'e+2')  + 'e-2');    
    // const twof = (num) => {
    //     var m = Number((Math.abs(num) * 100).toPrecision(15));
    //     return Math.round(m) / 100 * Math.sign(num);
    // };
    console.log(`Chromaticness: ${twof(Chromaticness*100)}%, Whiteness: ${twof(Whiteness*100)}%, Blackness: ${twof(Blackness*100)}%`);
    
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
    console.log(`Hue: ${twof(Hue)}, Saturation: ${twof(Saturation*100)}%, Lightness: ${twof(Lightness*100)}%`);

    //@TODO IN HTML Visualize the colour
    // show_color(Red, Green, Blue);
    
    // Name the colour
    console.log(`This colour is named: ${name_this_colour(Hue,Saturation,Lightness)}`);
    return null;
}

    
from_RGB(59, 179, 159);



